import { Card, CardBody } from './Card'

export default function AIInsights() {
  const items = [
    { title: 'STEM Potential', desc: 'High math and science performance; consider engineering track.' },
    { title: 'Attendance Trend', desc: 'Consistent on-time record; strong reliability.' },
    { title: 'Recommended Actions', desc: 'Join robotics, take advanced algebra next term.' },
  ]
  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">AI Insights (Optional)</div>
          <span className="text-xs text-slate-500">Demo</span>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {items.map(i => (
            <div key={i.title} className="p-4 rounded-xl bg-primary-light/60 border border-primary/20">
              <div className="font-medium text-primary-dark">{i.title}</div>
              <div className="text-sm text-slate-700">{i.desc}</div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}


