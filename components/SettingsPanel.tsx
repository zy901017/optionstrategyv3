"use client";
import React from "react";
import { Settings } from "../utils/calculations";

type Props = { value: Settings; onChange: (s: Settings) => void; onReset: ()=>void };

export default function SettingsPanel({ value, onChange, onReset }: Props){
  const set = (k: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    onChange({ ...value, [k]: v });
  };
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-3">③ 权重/阈值设置</h2>
      <div className="grid3">
        <Field label="趋势权重" v={value.wTrend} min={0} max={50} step={1} onChange={set("wTrend")} />
        <Field label="净Δ权重" v={value.wDelta} min={0} max={50} step={1} onChange={set("wDelta")} />
        <Field label="净Θ权重" v={value.wTheta} min={0} max={50} step={1} onChange={set("wTheta")} />
      </div>
      <div className="grid3 mt-2">
        <Field label="IV结构权重" v={value.wIV} min={0} max={50} step={1} onChange={set("wIV")} />
        <Field label="财报惩罚上限(负分)" v={value.wEarningsPenalty} min={0} max={50} step={1} onChange={set("wEarningsPenalty")} />
        <div>
          <label className="label">总分提示</label>
          <div className="muted">总分≈趋势+Δ+Θ+IV−惩罚（自动截断 0~100）</div>
        </div>
      </div>
      <div className="grid3 mt-2">
        <Field label="开仓阈值 (≥)" v={value.thrOpen} min={0} max={100} step={1} onChange={set("thrOpen")} />
        <Field label="小仓阈值 (≥)" v={value.thrSmall} min={0} max={100} step={1} onChange={set("thrSmall")} />
        <div className="flex items-end">
          <button className="btn" onClick={onReset}>重置为默认</button>
        </div>
      </div>
      <div className="mt-2 muted">
        建议：默认权重为 30/25/25/20，惩罚 15；阈值 80/60。根据你的风格（更重方向/更重时间）自由调整。
      </div>
    </div>
  );
}

function Field({label, v, min, max, step, onChange}:{label:string; v:number; min:number; max:number; step:number; onChange:(e:any)=>void}){
  return (
    <div>
      <label className="label">{label}：<b>{v}</b></label>
      <input className="range" type="range" min={min} max={max} step={step} value={v} onChange={onChange} />
      <input className="input mt-1" type="number" min={min} max={max} step={step} value={v} onChange={onChange} />
    </div>
  );
}
