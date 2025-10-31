export const metadata = {
  title: "Option Strategy Dashboard v2.3.1",
  description: "Dynamic weights/thresholds for Diagonal/PMCC/Spreads with IV structure & Greeks"
};
export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="zh-CN">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-900 text-slate-100 font-sans">{children}</body>
    </html>
  );
}
