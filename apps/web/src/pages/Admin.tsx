import React, { Suspense } from 'react';
import PageHeader from '@/components/PageHeader';
import { Card, CardBody } from '@/components/Card';
import { stats, actions, attendanceData } from '@/data/adminMockData'; // Adjusted import path

// Lazy load the DonutChart component
const DonutChart = React.lazy(() => import('@/components/DonutChart'));

export default function Admin() {
  // ... (exportCsv function remains the same)

  return (
    <div className="space-y-6">
      <PageHeader>Admin Panel</PageHeader>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardBody>
              <div className="muted text-sm">{s.label}</div>
              <div className="text-2xl font-semibold">{s.value}</div>
            </CardBody>
          </Card>
        ))}
      </div>
      
      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {actions.map((a) => (
          <Card key={a.title}>
            <CardBody>
              <div className="font-semibold mb-1">{a.title}</div>
              <div className="muted text-sm mb-3">{a.desc}</div>
              <button className="btn-primary">Open</button>
            </CardBody>
          </Card>
        ))}
      </div>
      
      {/* Reports Section */}
      <Card>
        <CardBody>
          <div className="font-semibold mb-3">Reports</div>
          <div className="grid md:grid-cols-3 gap-3">
            <Card>
              <CardBody>
                <div className="font-medium mb-2">Attendance Breakdown</div>
                <Suspense fallback={<div>Loading Chart...</div>}>
                  <div aria-label="Attendance Donut Chart" role="img">
                    <DonutChart data={attendanceData} />
                  </div>
                </Suspense>
                <div className="mt-3">
                  <button onClick={()=>{/* exportCsv */}} className="px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50 text-sm" aria-label="Export CSV">Export CSV</button>
                </div>
              </CardBody>
            </Card>
            <Card><CardBody>Grade Distribution (Coming soon)</CardBody></Card>
            <Card><CardBody>Overdue Payments (Coming soon)</CardBody></Card>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}