"use client";
import React from "react";
import { Inputs } from "../utils/calculations";

export default function InputPanel({ value, onChange }:{ value: Inputs, onChange:(v:Inputs)=>void }) {
  const set = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const raw = e.target.value;
    const v:any = (k === "trend") ? raw : (raw === "" ? "" : Number(raw));
    onChange({ ...value, [k]: v } as Inputs);
  };

  return (
    <div className="card relative flex flex-col gap-4 h-full">
      <h2 className="text-lg font-semibold mb-3">① 输入（所见即所得）</h2>

      <div className="grid2">
        <div>
          <label className="label">趋势方向</label>
          <select className="input" value={value.trend} onChange={set("trend")}>
            <option value="Up">Up（上涨）</option>
            <option value="Sideways">Sideways（横盘）</option>
            <option value="Down">Down（下跌）</option>
          </select>
        </div>
        <div>
          <label className="label">财报天数（可留空）</label>
          <input className="input" type="number" value={value.earningsDays ?? ""} onChange={set("earningsDays")} />
        </div>
      </div>

      <div className="grid2 mt-2">
        <div>
          <label className="label">近月 ATM IV（%）</label>
          <input className="input" type="number" step="0.01" value={value.nearAtmIV} onChange={set("nearAtmIV")} />
          <div className="muted mt-1">最近到期<strong>ATM</strong>行权的 IV</div>
        </div>
        <div>
          <label className="label">远月 ATM IV（%）</label>
          <input className="input" type="number" step="0.01" value={value.farAtmIV} onChange={set("farAtmIV")} />
          <div className="muted mt-1">目标远期到期<strong>ATM</strong>行权的 IV</div>
        </div>
      </div>

      <div className="grid2 mt-2">
        <div>
          <label className="label">买腿 Δ（远月，含符号）</label>
          <input className="input" type="number" step="0.01" value={value.buyDelta} onChange={set("buyDelta")} />
        </div>
        <div>
          <label className="label">卖腿 Δ（近月，含符号）</label>
          <input className="input" type="number" step="0.01" value={value.sellDelta} onChange={set("sellDelta")} />
        </div>
      </div>

      <div className="grid2 mt-2">
        <div>
          <label className="label">买腿 Θ（远月，含符号）</label>
          <input className="input" type="number" step="0.01" value={value.buyTheta} onChange={set("buyTheta")} />
        </div>
        <div>
          <label className="label">卖腿 Θ（近月，含符号）</label>
          <input className="input" type="number" step="0.01" value={value.sellTheta} onChange={set("sellTheta")} />
        </div>
      </div>

      <div className="grid2 mt-2">
        <div>
          <label className="label">近月卖腿剩余天数 DTE（建议填）</label>
          <input className="input" type="number" value={value.sellDTE ?? ""} onChange={set("sellDTE")} />
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col sm:flex-row gap-3 z-10 w-[90%] sm:w-auto items-center justify-center">
          <button className="btn" onClick={() => onChange({
            trend: "Up", earningsDays: 10,
            nearAtmIV: 42, farAtmIV: 30,
            buyDelta: 0.8, sellDelta: 0.28,
            buyTheta: -0.03, sellTheta: 0.09, sellDTE: 21
          })}>填充示例（Up/PMCC）</button>
          <button className="btn" onClick={() => onChange({
            trend: "Sideways", earningsDays: 8,
            nearAtmIV: 48, farAtmIV: 36,
            buyDelta: -0.32, sellDelta: -0.26,
            buyTheta: -0.03, sellTheta: 0.08, sellDTE: 16
          })}>填充示例（Sideways/PutDiag）</button>
          <button className="btn" onClick={() => onChange({
            trend: "Down", earningsDays: 6,
            nearAtmIV: 58, farAtmIV: 52,
            buyDelta: 0, sellDelta: 0.28,
            buyTheta: 0, sellTheta: 0.1, sellDTE: 9
          })}>填充示例（Down/BearCall）</button>
        </div>
      </div>
    </div>
  );
}
