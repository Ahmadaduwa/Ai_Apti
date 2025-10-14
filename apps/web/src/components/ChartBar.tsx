type Item = { label: string; value: number }

export default function ChartBar({ data, max = 100 }: { data: Item[], max?: number }) {
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="text-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="muted">{d.label}</span>
            <span className="font-medium">{d.value}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}


