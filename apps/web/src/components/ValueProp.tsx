import { Card, CardBody } from './Card'

export default function ValueProp() {
  const rows = [
    ['Integrated student data management', 'Reduce teacher paperwork'],
    ['Mobile attendance & line-up', 'Real-time updates for parents'],
    ['Auto class schedule & announcements', 'Better communication across school'],
    ['AI career guidance (add-on)', 'Enhances traditional MIS systems'],
  ]
  return (
    <Card>
      <CardBody>
        <div className="font-semibold mb-3">Value Proposition</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Strength</th>
                <th className="py-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([a,b], idx) => (
                <tr key={idx} className="border-t border-slate-200">
                  <td className="py-2">{a}</td>
                  <td className="py-2">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-xs text-slate-500 mt-3">Even without the full AI system, this prototype can immediately improve school workflow and communication.</div>
      </CardBody>
    </Card>
  )
}


