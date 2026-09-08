import React from 'react';

export interface TableColumn<T> {
  key: string;
  header: string;
  numeric?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface TableProps<T extends Record<string, any> = Record<string, any>>
  extends React.TableHTMLAttributes<HTMLTableElement> {
  columns?: TableColumn<T>[];
  data?: T[];
  children?: React.ReactNode;
  wrapperClassName?: string;
  keyExtractor?: (row: T, index: number) => string | number;
}

export function Table<T extends Record<string, any> = Record<string, any>>({
  columns,
  data,
  children,
  className = '',
  wrapperClassName = '',
  keyExtractor,
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
              {data.map((row, i) => {
                const rowKey = keyExtractor ? keyExtractor(row, i) : row.id ?? row.key ?? i;
                return (
                  <tr key={rowKey}>
                    {columns.map((col) => (
                      <td key={col.key} className={col.numeric ? 'num' : undefined}>
                        {col.render ? col.render(row, i) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </>
        ) : (
          children
        )}
      </table>
    </div>
  );
}
