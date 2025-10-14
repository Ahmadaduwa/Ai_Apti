type Row = { id: number; name: string; present?: boolean; score?: string }

export default function AttendanceTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto" role="region" aria-label="Attendance Table">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            <th className="py-2">ชื่อ</th>
            <th className="py-2">เช็คชื่อเข้าแถว</th>
            <th className="py-2">บันทึกคะแนน</th>
            <th className="py-2">การทำงาน</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} className="border-t border-slate-200">
              <td className="py-2">{s.name}</td>
              <td className="py-2"><input aria-label={`Present ${s.name}`} type="checkbox" defaultChecked className="accent-primary" /></td>
              <td className="py-2"><input aria-label={`Score ${s.name}`} type="number" min={0} max={100} placeholder="เช่น 85" className="px-2 py-1 rounded-lg border border-slate-200 w-24" /></td>
              <td className="py-2"><button className="px-3 py-1 rounded-lg bg-primary text-white">บันทึก</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3">
        <button className="btn-primary" aria-label="Bulk Line-up">เช็คชื่อเข้าแถวทั้งหมด</button>
      </div>
    </div>
  )
}


