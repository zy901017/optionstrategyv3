// types & engine with dynamic weights
export type Trend = "Up" | "Sideways" | "Down";

export type Inputs = {
  trend: Trend;
  earningsDays?: number;      // 距财报天数（可空）
  nearAtmIV: number;          // 近月 ATM IV（%）
  farAtmIV: number;           // 远月 ATM IV（%）
  buyDelta: number;           // 远月腿 Δ（含符号）
  sellDelta: number;          // 近月腿 Δ（含符号）
  buyTheta: number;           // 远月腿 Θ（含符号）
  sellTheta: number;          // 近月腿 Θ（含符号）
  sellDTE?: number;           // 近月到期天数
};

export type Settings = {
  wTrend: number;             // 趋势权重
  wDelta: number;             // 净Δ权重
  wTheta: number;             // 净Θ权重
  wIV: number;                // IV结构权重
  wEarningsPenalty: number;   // 财报惩罚上限（负分）
  thrOpen: number;            // 开仓阈值
  thrSmall: number;           // 小仓阈值
};

export const defaultSettings: Settings = {
  wTrend: 30, wDelta: 25, wTheta: 25, wIV: 20, wEarningsPenalty: 15,
  thrOpen: 80, thrSmall: 60
};

export type StrikeGuide = {
  longDeltaRange?: [number, number];
  shortDeltaRange?: [number, number];
  note?: string;
};

export type StrategyKey =
  | "PMCC_CallDiagonal"
  | "PutDiagonal"
  | "BearCallSpread"
  | "BullPutSpread"
  | "LongPut"
  | "LongCall"
  | "Wait";

export type StrategyDoc = {
  title: string;
  summary: string;         // 🎯 策略简介
  market: string;          // 📊 市场环境
  management: string;      // 🔁 调整/移仓
  exit: string;            // 🧠 风险与退出
  extra?: string;          // 其它补充
};

export type Result = {
  recommended: StrategyKey;
  side: "Call" | "Put" | "Neutral";
  score: number;
  advice: "open" | "small" | "wait";
  netDelta: number;
  netTheta: number;
  ivStructure: number;       // 近月ATM IV - 远月ATM IV
  warnings: string[];
  adjustments: string[];
  strikeGuide?: StrikeGuide;
  explanation: string;
  docs: Record<StrategyKey, StrategyDoc>;
};

export function toNum(n: any, d=0) {
  const v = typeof n === "number" ? n : parseFloat(n);
  return Number.isFinite(v) ? v : d;
}

// —— 策略注释库 ——
export const STRATEGY_DOCS: Record<StrategyKey, StrategyDoc> = {
  PMCC_CallDiagonal: {
    title: "PMCC / Call Diagonal（穷人版备兑 Call）",
    summary: "看涨 + 收租：买远月深 ITM Call（Δ≈0.75–0.85），卖近月 OTM Call（Δ≈0.20–0.35）。涨能赚、横盘也赚；下跌亏。Θ>0，方向暴露为正。",
    market: "趋势 Up；近月 ATM IV ≥ 远月 ATM IV（卖近买远更划算）；整体 IVR 30~70 区间较友好。",
    management: "短腿 Δ>0.45 → Roll Up 或 Roll Forward；短腿 DTE≤10 且 Δ<0.15 → 提前回补再卖下一期；财报前 3–5 天回补短腿。",
    exit: "净Θ转负、净Δ转负或关键均线失守 → 平/减；爆拉逼近短腿 → 上移短腿；黑天鹅 → 先收短腿、保留长腿。"
  },
  PutDiagonal: {
    title: "Put Diagonal（看跌/横盘收租）",
    summary: "买远月 Put + 卖近月 Put。远月 ITM → 偏空（净Δ<0，Θ>0）；远月靠近 ATM 且控短腿 Δ → 横盘收租（净Δ≈0，Θ>0）。",
    market: "趋势 Down 或 Sideways 偏弱；近月 ATM IV ≥ 远月 ATM IV；下跌/震荡市、IV 走高有利（净 Vega 通常为正）。",
    management: "短腿 |Δ|>0.45 → 上移或展期；DTE≤10 且 |Δ|<0.15 → 提前回补；想更中性 → 降低远月 |Δ| 或上移短腿。",
    exit: "趋势转强、净Δ长期转正且长腿亏扩 → 平或转 PMCC；财报前回补短腿；接近短腿行权价提前处理。"
  },
  BearCallSpread: {
    title: "Bear Call Spread（信用看跌 Call 垂直价差）",
    summary: "卖较低行权 Call，买更高行权 Call 保护。Θ>0、Δ<0，适合温和下跌/横盘下移，风险有限。",
    market: "趋势 Down；整体 IVR 中高（>50）更优；阻力位上方卖短腿（Δ≈0.20–0.35）。",
    management: "短腿 Δ>0.45 → 上移保护腿或整体上移/展期；利润≥50–70% 可提前了结；到期前 Δ<0.15 可提前回补。",
    exit: "价格强势突破短腿上方 → 调整/止损；财报前规避短期暴露。"
  },
  BullPutSpread: {
    title: "Bull Put Spread（信用看涨 Put 垂直价差）",
    summary: "卖较高行权 Put，买更低行权 Put 保护。Θ>0、Δ>0，适合温和上行/横盘上移，风险有限。",
    market: "趋势 Up 或 Sideways 偏强；整体 IVR 中高（>50）更友好；支撑位下方买保护腿。",
    management: "短腿 Δ>0.45 → 下移保护腿或整体下移/展期；利润≥50–70% 可提前了结；DTE 收窄且 Δ<0.15 可提前回补。",
    exit: "价格强势跌破短腿行权、净Δ转负 → 调整/止损；财报前注意收敛暴露。"
  },
  LongPut: {
    title: "Long Put（买方看跌）",
    summary: "Δ<0、Θ<0、Vega>0。下跌+IV 上升带来杠杆收益；不适合久持。",
    market: "趋势明显转弱或事件驱动下跌；IVR 不宜过高（避免买贵）。",
    management: "利润达标分批止盈；IV 大幅上升或事件前减仓；时间损耗过快时改为 Put Spread。",
    exit: "方向失效或 Θ 损耗过快 → 及时止损；持有期宜短。"
  },
  LongCall: {
    title: "Long Call（买方看涨）",
    summary: "Δ>0、Θ<0、Vega>0。上升+IV 上升可放大利润；不适合久持。",
    market: "趋势扭转向上或突破；IVR 不宜过高。",
    management: "利润达标分批止盈；可转为 PMCC 的长腿；若久盘，改为 Call Diagonal。",
    exit: "方向失效或时间损耗过快 → 止损；事件落地前减少裸买暴露。"
  },
  Wait: {
    title: "等待 / 结构不理想",
    summary: "净Θ≤0、或 IV 结构≤0、或趋势与净Δ冲突、或财报临近导致风险不对称时，等待结构修复或切换策略。",
    market: "不确定、方向冲突、或 IV 环境不利。",
    management: "调整 DTE/行权/远月 Δ，或换策略。",
    exit: "—"
  }
};

function baseScore(t: Trend, netDelta: number, netTheta: number, ivStructure: number, earn: number, nearIV: number, farIV: number, s: Settings): number {
  let score = 0;
  // 趋势基分
  if (t === "Up") score += s.wTrend;
  else if (t === "Sideways") score += Math.round(s.wTrend * (2/3));
  else score += Math.round(s.wTrend * (1/3));

  if (netDelta > 0) score += s.wDelta;
  if (netTheta > 0) score += s.wTheta;
  if (ivStructure > 0) score += s.wIV;

  if (earn <= 5 and nearIV > farIV and nearIV >= 60) {
    score -= s.wEarningsPenalty;
  }
  return Math.max(0, Math.min(100, score));
}

export type EngineResult = Result;

export function compute(inputs: Inputs, settings?: Partial<Settings>): EngineResult {
  const s: Settings = { ...defaultSettings, ...(settings || {}) };

  const t = inputs.trend;
  const netDelta = toNum(inputs.buyDelta) + toNum(inputs.sellDelta);
  const netTheta = toNum(inputs.buyTheta) + toNum(inputs.sellTheta);
  const ivStructure = toNum(inputs.nearAtmIV) - toNum(inputs.farAtmIV);
  const earn = toNum(inputs.earningsDays, 999);
  const sellDTE = toNum(inputs.sellDTE, 999);
  const sellDeltaAbs = Math.abs(toNum(inputs.sellDelta));

  // 推荐策略判定（与 v2.3 相同，保留逻辑）
  let recommended: StrategyKey = "Wait";
  let side: Result["side"] = "Neutral";

  if (t === "Up" && netDelta > 0 && netTheta > 0 && ivStructure > 0) {
    recommended = "PMCC_CallDiagonal"; side = "Call";
  } else if (t === "Sideways" && netTheta > 0 && ivStructure > 0 && Math.abs(netDelta) <= 0.2) {
    recommended = "PutDiagonal"; side = "Put";
  } else if (t === "Down" && netTheta > 0) {
    recommended = "BearCallSpread"; side = "Call";
    if (netDelta < 0 && ivStructure > 0) {
      recommended = "PutDiagonal"; side = "Put";
    }
  } else if (t === "Up" && netTheta <= 0 && netDelta > 0) {
    recommended = "LongCall"; side = "Call";
  } else if (t === "Down" && netTheta <= 0 && netDelta < 0) {
    recommended = "LongPut"; side = "Put";
  }

  // 评分（动态权重）
  const score = baseScore(t, netDelta, netTheta, ivStructure, earn, inputs.nearAtmIV, inputs.farAtmIV, s);

  // 建议强度（动态阈值）
  let advice: Result["advice"] = "wait";
  if (score >= s.thrOpen) advice = "open";
  else if (score >= s.thrSmall) advice = "small";

  // 提示 & 调整
  const warnings: string[] = [];
  if (ivStructure <= 0) warnings.push("IV 结构差 ≤ 0：近月不比远月贵，买贵卖便宜，不利于 Diagonal/PMCC。");
  if (netTheta <= 0) warnings.push("净Θ ≤ 0：时间在耗损，不利于“收租”类策略。");
  if (earn <= 5 && inputs.nearAtmIV >= 60) warnings.push("财报前 5 天内且近月 IV 很高：优先回补短腿或缩小仓位，等待 IV Crush 后再建。");

  const adjustments: string[] = [];
  if ((recommended === "PMCC_CallDiagonal" || recommended === "PutDiagonal") && sellDeltaAbs > 0.45) {
    adjustments.push("短腿 Δ > 0.45：考虑 Roll Up（提高行权价）或 Roll Out（展期），降低被指派概率。");
  }
  if (sellDTE <= 10 && sellDeltaAbs < 0.15) {
    adjustments.push("短腿 DTE ≤ 10 且 Δ < 0.15：可提前买回锁定剩余 Θ，再卖下一期。");
  }
  if (recommended === "PMCC_CallDiagonal") {
    if (netDelta < 0.35) adjustments.push("净Δ低于 0.35：买腿更 ITM 或短腿更 OTM，以增强看涨暴露。");
    if (netDelta > 0.65) adjustments.push("净Δ高于 0.65：短腿略向 ATM 移动或买腿略远，以降低过度方向暴露。");
  }
  if (recommended === "PutDiagonal") {
    if (netDelta < -0.15) adjustments.push("净Δ < -0.15：上移短腿（绝对Δ变小）或把长腿靠近 ATM，使净Δ回到 -0.15~+0.15。");
    if (netDelta > 0.15) adjustments.push("净Δ > +0.15：下移短腿（绝对Δ变大）或把长腿更远 OTM。");
  }
  if (netTheta <= 0.01) {
    adjustments.push("净Θ较弱：缩短短腿 DTE（15–30 天）、把短腿靠近 ATM（Δ≈0.25–0.35），或等待较高 IV 再开。");
  }

  // 行权Δ建议
  const strikeGuide: StrikeGuide = {};
  if (recommended === "PMCC_CallDiagonal") {
    strikeGuide.longDeltaRange = [0.75, 0.85];
    strikeGuide.shortDeltaRange = [0.20, 0.35];
    strikeGuide.note = "目标净Δ≈0.35–0.65；涨能赚、横盘也赚。";
  } else if (recommended === "PutDiagonal") {
    strikeGuide.longDeltaRange = [-0.45, -0.25];
    strikeGuide.shortDeltaRange = [-0.35, -0.20];
    strikeGuide.note = "横盘/轻微下移也能收租；尽量把净Δ收敛到 -0.15~+0.15。";
  } else if (recommended === "BearCallSpread") {
    strikeGuide.shortDeltaRange = [0.20, 0.35];
    strikeGuide.note = "选择上方阻力附近卖 Call；7–20 天到期 Θ 收益较快。";
  }

  const explanation = `趋势=${t}；净Δ=${netDelta.toFixed(2)}；净Θ=${netTheta.toFixed(2)}；IV结构差(近-远)=${ivStructure.toFixed(2)}；`+
    `评分=${score.toFixed(0)}；权重=[趋势${s.wTrend} / Δ${s.wDelta} / Θ${s.wTheta} / IV${s.wIV} / 财报惩罚${s.wEarningsPenalty}]；`+
    `阈值=[开仓≥${s.thrOpen}，小仓≥${s.thrSmall}]。`;

  return {
    recommended, side, score, advice,
    netDelta, netTheta, ivStructure,
    warnings, adjustments, strikeGuide,
    explanation,
    docs: STRATEGY_DOCS
  };
}
