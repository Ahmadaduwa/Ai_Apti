export default function Parent() {
  const children = [
    { id: '1', name: 'John Doe', grade: 'M3', className: 'A', attendance: '96%', gpa: '3.72' },
    { id: '2', name: 'Jane Doe', grade: 'P6', className: 'B', attendance: '98%', gpa: '3.90' },
  ]
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Parent Portal</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {children.map((c) => (
          <div key={c.id} className="rounded-xl bg-white/5 border border-white/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-slate-300">{c.grade}{c.className}</div>
              </div>
              <button className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-sm">View Profile</button>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
              <div className="p-3 rounded-lg bg-black/20 border border-white/10"><div className="text-slate-400">Attendance</div><div className="font-semibold">{c.attendance}</div></div>
              <div className="p-3 rounded-lg bg-black/20 border border-white/10"><div className="text-slate-400">GPA</div><div className="font-semibold">{c.gpa}</div></div>
              <div className="p-3 rounded-lg bg-black/20 border border-white/10"><div className="text-slate-400">Alerts</div><div className="font-semibold">None</div></div>
            </div>
            <div className="mt-4 text-sm text-slate-300">Latest announcement: Field trip next month. Consent forms due Friday.</div>
          </div>
        ))}
      </div>
    </div>
  )
}


