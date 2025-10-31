"use client";
import React from "react";
import clsx from "clsx";
import { Result } from "../utils/calculations";

export default function ResultPanel({ result }:{ result: Result }) {
  const badge = clsx("pill", {
    "pill-ok": result.advice === "open",
    "pill-warn": result.advice === "small",
    "pill-bad": result.advice === "wait"
  });

  const stratName = {
    PMCC_CallDiagonal: "PMCC / Call Diagonal",
    PutDiagonal: "Put Diagonal",
    BearCallSpread: "Bear Call Spread",
    BullPutSpread: "Bull Put Spread",
    LongPut: "Long Put",
    LongCall: "Long Call",
    Wait: "等待 / 结构不理想"
  }[result.recommended];

  const doc = result.docs[result.recommended];

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-3">② 输出</h2>
      <div className="space-y-2">
        <div>推荐端别：<strong>{result.side}</strong></div>
        <div>推荐策略：<span className={badge}>{stratName}</span></div>
        <div>开仓建议：<span className={badge}>
          {result.advice === "open" ? "✅ 强势开仓" : result.advice === "small" ? "⚙️ 小仓观察" : "⚠️ 等待结构修复"}
        </span></div>
        <div>评分：<strong>{result.score.toFixed(0)}</strong> / 100</div>
        <div>净 Delta：<strong>{result.netDelta.toFixed(2)}</strong></div>
        <div>净 Theta：<strong>{result.netTheta.toFixed(2)}</strong></div>
        <div>IV 结构差（近-远）：<strong>{result.ivStructure.toFixed(2)}%</strong></div>
      </div>

      {result.warnings.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-1">⚠️ 风险提示</h3>
          <ul className="list-disc pl-5">
            {result.warnings.map((w,i)=>(<li key={i} className="muted">{w}</li>))}
          </ul>
        </div>
      )}

      {result.adjustments.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-1">🔧 调整/移仓提示</h3>
          <ul className="list-disc pl-5">
            {result.adjustments.map((a,i)=>(<li key={i} className="muted">{a}</li>))}
          </ul>
        </div>
      )}

      {/* 注释说明 */}
      <div className="mt-6 space-y-3">
        <h3 className="text-base font-semibold">📚 策略注释（{doc.title}）</h3>
        <Section title="🎯 策略简介" text={doc.summary} />
        <Section title="📊 市场环境" text={doc.market} />
        <Section title="🔁 仓位管理与调整" text={doc.management} />
        <Section title="🧠 风险与退出" text={doc.exit} />
        {result.recommended === "PMCC_CallDiagonal" && (
          <div className="muted">注：适合轻微看涨或温和上行的市场；涨能赚、横盘也赚，跌则亏。</div>
        )}
      </div>

      <div className="mt-4">
        <label className="label">解释</label>
        <textarea readOnly value={result.explanation} />
      </div>
    </div>
  );
}
function Section({title, text}:{title:string, text:string}){
  return (
    <div>
      <div className="font-semibold">{title}</div>
      <div className="muted">{text}</div>
    </div>
  );
}
