import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from './Table';

function renderSample() {
  return render(
    <Table aria-label="Members">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Role</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Ada Lovelace</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
}

test('Table renders as a native table with an accessible name', () => {
  renderSample();

  expect(screen.getByRole('table', { name: 'Members' })).toBeInTheDocument();
});

test('Table renders header cells as column headers', () => {
  renderSample();

  const columnHeaders = screen.getAllByRole('columnheader');
  expect(columnHeaders).toHaveLength(2);
  expect(columnHeaders[0]).toHaveTextContent('Name');
  expect(columnHeaders[0]).toHaveAttribute('scope', 'col');
});

test('Table renders body rows and cells', () => {
  renderSample();

  expect(screen.getByRole('row', { name: 'Ada Lovelace Admin' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: 'Ada Lovelace' })).toBeInTheDocument();
});

test('TableHeaderCell allows overriding scope', () => {
  render(
    <Table>
      <TableBody>
        <TableRow>
          <TableHeaderCell scope="row">Total</TableHeaderCell>
          <TableCell>42</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );

  expect(screen.getByRole('rowheader')).toHaveAttribute('scope', 'row');
});
