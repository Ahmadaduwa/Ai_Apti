import { Link } from 'react-router-dom'
import AIInsights from '../components/AIInsights'
import ValueProp from '../components/ValueProp'

export default function Dashboard() {
  const cards = [
    { title: 'Recent Attendance', desc: 'Today: 96% present across all classes.' },
    { title: 'Announcements', desc: 'New terms start next Monday. Welcome back!' },
    { title: 'AI Insights', desc: '3 students have new STEM recommendations.' },
  ]
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {cards.map(c => (
          <div key={c.title} className="rounded-xl bg-white/5 border border-white/10 p-5">
            <div className="font-semibold mb-1">{c.title}</div>
            <div className="text-slate-300 text-sm">{c.desc}</div>
          </div>
        ))}
      </div>
      <Link to="/student/1" className="inline-block px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm">Go to Student 1</Link>
      <AIInsights />
      <ValueProp />
    </div>
  )
}


