"use client";

import { useMemo, useState } from "react";
import "./globals.css";
import InputPanel from "../components/InputPanel";
import ResultPanel from "../components/ResultPanel";
import SettingsPanel from "../components/SettingsPanel";
import { Inputs, compute, defaultSettings, Settings } from "../utils/calculations";

const example: Inputs = {
  trend: "Up",
  earningsDays: 10,
  nearAtmIV: 42,
  farAtmIV: 30,
  buyDelta: 0.8,
  sellDelta: 0.28,
  buyTheta: -0.03,
  sellTheta: 0.09,
  sellDTE: 21
};

export default function Page(){
  const [state, setState] = useState<Inputs>(example);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const result = useMemo(()=>compute(state, settings), [state, settings]);

  return (
    <div className="max-w-6xl mx-auto p-5 space-y-4">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold">🧠 Option Strategy Dashboard v2.3.1</h1>
        <div className="flex items-center gap-2">
          <a className="btn" href="https://vercel.com" target="_blank" rel="noreferrer">一键部署 Vercel</a>
          <button className="btn" onClick={()=>{ setState(example); setSettings(defaultSettings); }}>重置示例+权重</button>
        </div>
      </header>

      <p className="muted">把券商期权链里的 Δ / Θ（含正负号）与近月/远月的 <strong>ATM IV</strong> 原样填入即可。IV 结构差 = 近月 ATM IV − 远月 ATM IV。权重/阈值可在下方动态调整。</p>

      <div className="grid2">
        <InputPanel value={state} onChange={setState} />
        <ResultPanel result={result} />
      </div>

      <SettingsPanel value={settings} onChange={setSettings} onReset={()=>setSettings(defaultSettings)} />

      <footer className="muted text-center pt-4">
        v2.3.1 • 动态权重：趋势/Δ/Θ/IV/财报惩罚 + 开仓/小仓阈值可调。逻辑同 v2.3，Down 场景自动识别偏空 Put Diagonal。
      </footer>
    </div>
  );
}
