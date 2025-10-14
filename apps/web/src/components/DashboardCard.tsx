import { ReactNode } from 'react'
import { Card, CardBody } from './Card'

export default function DashboardCard({ icon, title, value, action }: { icon?: ReactNode; title: string; value: string; action?: ReactNode }) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon ? <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center text-primary">{icon}</div> : null}
            <div>
              <div className="muted text-xs">{title}</div>
              <div className="text-xl font-semibold">{value}</div>
            </div>
          </div>
          {action}
        </div>
      </CardBody>
    </Card>
  )
}


