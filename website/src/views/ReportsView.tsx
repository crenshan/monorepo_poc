import { useState } from 'react'
import { Badge, Card, DateRangePicker } from '@mono/ui'
import type { BadgeVariant, DateRange } from '@mono/ui'

import './ReportsView.css'

interface Report {
  id: string
  name: string
  generatedOn: string
  status: 'complete' | 'processing' | 'failed'
}

const statusVariants: Record<Report['status'], BadgeVariant> = {
  complete: 'success',
  processing: 'warning',
  failed: 'danger',
}

const statusLabels: Record<Report['status'], string> = {
  complete: 'Complete',
  processing: 'Processing',
  failed: 'Failed',
}

const reports: Report[] = [
  { id: '1', name: 'Monthly revenue summary', generatedOn: '2026-07-25', status: 'complete' },
  { id: '2', name: 'Weekly active users', generatedOn: '2026-07-24', status: 'complete' },
  { id: '3', name: 'Churn risk cohort', generatedOn: '2026-07-20', status: 'processing' },
  { id: '4', name: 'Quarterly board deck', generatedOn: '2026-06-30', status: 'complete' },
  { id: '5', name: 'Ad spend attribution', generatedOn: '2026-06-15', status: 'failed' },
  { id: '6', name: 'Onboarding funnel', generatedOn: '2026-05-31', status: 'complete' },
]

export function ReportsView() {
  const [range, setRange] = useState<DateRange>({ start: '', end: '' })

  const rangeError =
    range.start && range.end && range.start > range.end ? 'Start date must be before end date' : undefined

  const filteredReports = reports.filter((report) => {
    if (rangeError) return true
    if (range.start && report.generatedOn < range.start) return false
    if (range.end && report.generatedOn > range.end) return false
    return true
  })

  return (
    <div className="reports-view">
      <div className="reports-view__header">
        <h2>Reports</h2>
        <p>Browse generated reports and filter by the date they were produced.</p>
      </div>

      <div className="reports-view__toolbar">
        <DateRangePicker label="Generated between" value={range} onChange={setRange} error={rangeError} />
      </div>

      <Card>
        {filteredReports.length === 0 ? (
          <div className="reports-view__empty">
            <h3>No reports found</h3>
            <p>No reports were generated in the selected date range. Try widening it.</p>
          </div>
        ) : (
          <table className="reports-view__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Generated on</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.name}</td>
                  <td>{report.generatedOn}</td>
                  <td>
                    <Badge variant={statusVariants[report.status]}>{statusLabels[report.status]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
