import { useMemo, useState } from 'react';
import {
  Card,
  DateRangePicker,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@mono/ui';
import type { DateRangeValue } from '@mono/ui';

import './ReportsView.css';

interface Report {
  id: string;
  name: string;
  category: string;
  date: string;
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${month}/${day}/${year}`;
}

const today = daysAgo(0);
const thirtyDaysAgo = daysAgo(30);

// Spans a wide date range on purpose (some inside the default 30-day window,
// some well outside it) so the date-range filter has something to filter.
const mockReports: Report[] = [
  { id: '1', name: 'Weekly usage summary', category: 'Usage', date: daysAgo(1) },
  { id: '2', name: 'Billing reconciliation', category: 'Billing', date: daysAgo(4) },
  { id: '3', name: 'Team activity digest', category: 'Activity', date: daysAgo(9) },
  { id: '4', name: 'Security audit log', category: 'Security', date: daysAgo(18) },
  { id: '5', name: 'Monthly usage summary', category: 'Usage', date: daysAgo(29) },
  { id: '6', name: 'Quarterly billing summary', category: 'Billing', date: daysAgo(45) },
  { id: '7', name: 'Onboarding cohort report', category: 'Activity', date: daysAgo(70) },
  { id: '8', name: 'Annual security review', category: 'Security', date: daysAgo(120) },
];

export function ReportsView() {
  const [range, setRange] = useState<DateRangeValue>({ start: thirtyDaysAgo, end: today });

  const error =
    range.start && range.end && range.start > range.end
      ? 'End date must be on or after the start date'
      : undefined;

  const filteredReports = useMemo(
    () =>
      mockReports.filter((report) => {
        if (range.start && report.date < range.start) return false;
        if (range.end && report.date > range.end) return false;
        return true;
      }),
    [range],
  );

  return (
    <div className="reports-view">
      <h2>Reports</h2>
      <DateRangePicker
        label="Date range"
        value={range}
        onChange={setRange}
        max={today}
        error={error}
      />

      <Card className="reports-view__summary">
        <p>
          Showing data from <strong>{range.start || '—'}</strong> to{' '}
          <strong>{range.end || '—'}</strong>.
        </p>
      </Card>

      {filteredReports.length === 0 ? (
        <Card className="reports-view__empty">
          <p>No reports in the selected date range.</p>
        </Card>
      ) : (
        <Table aria-label="Reports">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.category}</TableCell>
                <TableCell>{formatDate(report.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
