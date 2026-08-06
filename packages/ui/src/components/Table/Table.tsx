/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

import styles from './Table.module.css';

/** Props for {@link Table}. All standard `<table>` attributes are supported and forwarded. */
export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {}

/**
 * Renders tabular data with a horizontally-scrollable wrapper for narrow viewports.
 * Compose it with {@link TableHead}, {@link TableBody}, {@link TableRow},
 * {@link TableHeaderCell}, and {@link TableCell} to build the table structure explicitly,
 * the same way you would with plain HTML table elements.
 *
 * @category Data Display
 *
 * @example
 * ```tsx
 * <Table>
 *   <TableHead>
 *     <TableRow>
 *       <TableHeaderCell>Name</TableHeaderCell>
 *       <TableHeaderCell>Email</TableHeaderCell>
 *     </TableRow>
 *   </TableHead>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>Ada Lovelace</TableCell>
 *       <TableCell>ada@example.com</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */
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

/** Props for {@link TableHead}. All standard `<thead>` attributes are supported and forwarded. */
export interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {}

/**
 * Semantic wrapper for a table's header row group (`<thead>`). Use it to group the
 * {@link TableRow}/{@link TableHeaderCell} elements that make up the column headings.
 *
 * @category Data Display
 *
 * @example
 * ```tsx
 * <TableHead>
 *   <TableRow>
 *     <TableHeaderCell>Name</TableHeaderCell>
 *   </TableRow>
 * </TableHead>
 * ```
 */
export function TableHead({ className, children, ...props }: TableHeadProps) {
  const classes = [styles['ds-table__head'], className].filter(Boolean).join(' ');

  return (
    <thead className={classes} {...props}>
      {children}
    </thead>
  );
}

/** Props for {@link TableBody}. All standard `<tbody>` attributes are supported and forwarded. */
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

/**
 * Semantic wrapper for a table's body row group (`<tbody>`). Use it to group the
 * data {@link TableRow}/{@link TableCell} elements.
 *
 * @category Data Display
 *
 * @example
 * ```tsx
 * <TableBody>
 *   <TableRow>
 *     <TableCell>Ada Lovelace</TableCell>
 *   </TableRow>
 * </TableBody>
 * ```
 */
export function TableBody({ children, ...props }: TableBodyProps) {
  return <tbody {...props}>{children}</tbody>;
}

/** Props for {@link TableRow}. All standard `<tr>` attributes are supported and forwarded. */
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

/**
 * A single row (`<tr>`) within a {@link TableHead} or {@link TableBody}.
 *
 * @category Data Display
 *
 * @example
 * ```tsx
 * <TableRow>
 *   <TableCell>Ada Lovelace</TableCell>
 * </TableRow>
 * ```
 */
export function TableRow({ className, children, ...props }: TableRowProps) {
  const classes = [styles['ds-table__row'], className].filter(Boolean).join(' ');

  return (
    <tr className={classes} {...props}>
      {children}
    </tr>
  );
}

/** Props for {@link TableHeaderCell}. All standard `<th>` attributes are supported and forwarded. */
export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {}

/**
 * A header cell (`<th>`) identifying a column (or row) within a {@link TableRow}.
 *
 * @category Data Display
 *
 * @example
 * ```tsx
 * <TableHeaderCell>Name</TableHeaderCell>
 * ```
 *
 * @remarks
 * Defaults the native `scope` attribute to `'col'` if not provided; pass
 * `scope="row"` for row headers.
 */
export function TableHeaderCell({
  className,
  // `scope` identifies whether the header applies to a column or row. Defaults to `'col'`.
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

/** Props for {@link TableCell}. All standard `<td>` attributes are supported and forwarded. */
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {}

/**
 * A standard data cell (`<td>`) within a {@link TableRow}.
 *
 * @category Data Display
 *
 * @example
 * ```tsx
 * <TableCell>ada@example.com</TableCell>
 * ```
 */
export function TableCell({ className, children, ...props }: TableCellProps) {
  const classes = [styles['ds-table__cell'], className].filter(Boolean).join(' ');

  return (
    <td className={classes} {...props}>
      {children}
    </td>
  );
}
