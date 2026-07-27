import { useState } from 'react'
import { Card, DateRangePicker } from '@mono/ui'
import type { DateRangeValue } from '@mono/ui'

import './ReportsView.css'

const today = new Date().toISOString().slice(0, 10)
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

export function ReportsView() {
  const [range, setRange] = useState<DateRangeValue>({ start: thirtyDaysAgo, end: today })

  const error =
    range.start && range.end && range.start > range.end
      ? 'End date must be on or after the start date'
      : undefined

  return (
    <div className="reports-view">
      <h2>Reports</h2>
      <DateRangePicker label="Date range" value={range} onChange={setRange} max={today} error={error} />

      <Card className="reports-view__summary">
        <p>
          Showing data from <strong>{range.start || '—'}</strong> to <strong>{range.end || '—'}</strong>.
        </p>
      </Card>
    </div>
  )
}
