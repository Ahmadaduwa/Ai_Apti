import { useState } from 'react'
import { Card, CardBody } from '../components/Card'
import ChartBar from '../components/ChartBar'
import { schedule as mockSchedule, students as mockStudents } from '../data/mock'

export default function Teacher() {
  const [selectedClass, setSelectedClass] = useState('M3-A')
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10))
  const [schedule, setSchedule] = useState(mockSchedule)
  const [students, setStudents] = useState(mockStudents)
  // sample fetch from public assets
  // eslint-disable-next-line
  useState(() => {
    fetch('/assets/mock/schedule.json').then(r=>r.json()).then(setSchedule).catch(()=>{})
    fetch('/assets/mock/students.json').then(r=>r.json()).then(setStudents).catch(()=>{})
    return undefined
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Teacher Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Teaching Schedule</div>
            <select className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm" value={selectedClass} onChange={e=>setSelectedClass(e.target.value)}>
              <option value="M3-A">M3-A</option>
              <option value="M3-B">M3-B</option>
            </select>
          </div>
          <ul className="space-y-2">
            {schedule.filter(s=>s.className===selectedClass).map((s, idx)=> (
              <li key={idx} className="p-3 rounded-lg bg-black/20 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-300">{s.time} • Room {s.room}</div>
                  <div className="font-medium">{s.subject}</div>
                </div>
                <button className="px-3 py-1 text-sm rounded-md bg-primary hover:opacity-90">Open</button>
              </li>
            ))}
          </ul>
          </CardBody>
        </Card>
        <Card className="md:col-span-2">
          <CardBody>
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium">Attendance</div>
            <input type="date" className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
          <div className="mb-3 flex gap-2">
            <button className="btn-primary" aria-label="Check Line-up">เช็คชื่อเข้าแถว</button>
            <button className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50" aria-label="Clock In/Out">ลงเวลาเข้า/ออก</button>
            <span className="px-2 py-1 text-xs rounded bg-primary-light text-primary-dark">Run AI</span>
          </div>
          <div className="overflow-x-auto" aria-live="polite">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-300">
                  <th className="py-2">Name</th>
                  <th className="py-2">Present</th>
                  <th className="py-2">Score</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s=> (
                  <tr key={s.id} className="border-t border-white/10">
                    <td className="py-2">{s.name}</td>
                    <td className="py-2"><input type="checkbox" defaultChecked className="accent-indigo-500" /></td>
                    <td className="py-2"><input type="number" min={0} max={100} placeholder="e.g. 85" className="bg-transparent border border-white/20 rounded px-2 py-1 w-24" /></td>
                    <td className="py-2"><button className="px-3 py-1 rounded-md bg-white/10 hover:bg-white/20">Save</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </CardBody>
        </Card>
      </div>
      <Card>
        <CardBody>
          <div className="font-medium mb-3">Class Attendance Overview</div>
          <ChartBar data={[{ label: 'M3-A', value: 96 }, { label: 'M3-B', value: 92 }, { label: 'M2-A', value: 94 }]} />
        </CardBody>
      </Card>
    </div>
  )
}


