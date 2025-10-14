export default function AnnouncementCard({ title, body, audience = 'all' }: { title: string; body: string; audience?: 'all'|'grade'|'class'|'custom' }) {
  const badgeMap: Record<string, string> = { all: 'bg-slate-100 text-slate-700', grade: 'bg-blue-100 text-blue-700', class: 'bg-emerald-100 text-emerald-700', custom: 'bg-amber-100 text-amber-700' }
  return (
    <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-soft">
      <div className="flex items-center justify-between mb-1">
        <div className="font-semibold">{title}</div>
        <span className={`text-xs px-2 py-1 rounded ${badgeMap[audience]}`}>{audience}</span>
      </div>
      <div className="text-sm text-slate-600">{body}</div>
      <div className="mt-3">
        <button aria-label="Mark as read" className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm">ทำเครื่องหมายว่าอ่านแล้ว</button>
      </div>
    </div>
  )
}


