/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

import styles from './Table.module.css';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {}

export function Table({ className, children, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  const classes = [styles['ds-table'], className].filter(Boolean).join(' ');

  return (
    <div className={styles['ds-table__wrapper']}>
      <table className={classes} {...props}>
        {children}
      </table>
    </div>
  );
}

export interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {}

export function TableHead({ className, children, ...props }: TableHeadProps) {
  const classes = [styles['ds-table__head'], className].filter(Boolean).join(' ');

  return (
    <thead className={classes} {...props}>
      {children}
    </thead>
  );
}

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

export function TableBody({ children, ...props }: TableBodyProps) {
  return <tbody {...props}>{children}</tbody>;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

export function TableRow({ className, children, ...props }: TableRowProps) {
  const classes = [styles['ds-table__row'], className].filter(Boolean).join(' ');

  return (
    <tr className={classes} {...props}>
      {children}
    </tr>
  );
}

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {}

export function TableHeaderCell({
  className,
  scope = 'col',
  children,
  ...props
}: TableHeaderCellProps) {
  const classes = [styles['ds-table__headerCell'], className].filter(Boolean).join(' ');

  return (
    <th className={classes} scope={scope} {...props}>
      {children}
    </th>
  );
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}

export function TableCell({ className, children, ...props }: TableCellProps) {
  const classes = [styles['ds-table__cell'], className].filter(Boolean).join(' ');

  return (
    <td className={classes} {...props}>
      {children}
    </td>
  );
}
