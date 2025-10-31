# Option Strategy Dashboard v2.3.1（动态权重）

在 v2.3 基础上加入 **可视化权重/阈值调节**：
- 权重：趋势 / 净Δ / 净Θ / IV 结构 / 财报惩罚上限
- 阈值：开仓 ≥thrOpen；小仓 ≥thrSmall
- 默认：30 / 25 / 25 / 20，惩罚 15；阈值 80 / 60

其余逻辑（推荐规则、警告、调整提示、行权Δ区间、策略注释）与 v2.3 一致。

## 运行
```bash
npm i
npm run dev  # http://localhost:3000
```

## 部署
推到 GitHub → Vercel 导入（Next.js App Router + Tailwind）。
