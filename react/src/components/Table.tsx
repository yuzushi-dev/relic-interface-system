import React from 'react';

export interface TableColumn<T> {
  key: string;
  header: string;
  numeric?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface TableProps<T = any> extends React.TableHTMLAttributes<HTMLTableElement> {
  columns?: TableColumn<T>[];
  data?: T[];
  children?: React.ReactNode;
  wrapperClassName?: string;
}

export function Table<T = any>({
  columns,
  data,
  children,
  className = '',
  wrapperClassName = '',
  ...props
}: TableProps<T>) {
  return (
    <div className={`ris-table-wrap ${wrapperClassName}`}>
      <table className={`ris-table ${className}`} {...props}>
        {columns && data ? (
          <>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={col.numeric ? 'num' : undefined}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className={col.numeric ? 'num' : undefined}>
                      {col.render ? col.render(row, i) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </>
        ) : (
          children
        )}
      </table>
    </div>
  );
}
