import React from 'react';

export interface TableColumn<T> {
  key: string;
  header: string;
  numeric?: boolean;
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface TableProps<T extends Record<string, any> = Record<string, any>>
  extends React.TableHTMLAttributes<HTMLTableElement> {
  columns?: TableColumn<T>[];
  data?: T[];
  caption?: string;
  children?: React.ReactNode;
  wrapperClassName?: string;
  keyExtractor?: (row: T, index: number) => string | number;
  sortKey?: string;
  sortDirection?: 'ascending' | 'descending' | 'none';
  onSort?: (key: string) => void;
  selectedKeys?: Set<string | number> | Array<string | number>;
}

export function Table<T extends Record<string, any> = Record<string, any>>({
  columns,
  data,
  caption,
  children,
  className = '',
  wrapperClassName = '',
  keyExtractor,
  sortKey,
  sortDirection,
  onSort,
  selectedKeys,
  ...props
}: TableProps<T>) {
  const isSelected = (key: string | number) => {
    if (!selectedKeys) return false;
    if (selectedKeys instanceof Set) return selectedKeys.has(key);
    return selectedKeys.includes(key);
  };

  return (
    <div className={`ris-table-wrap ${wrapperClassName}`}>
      <table className={`ris-table ${className}`} {...props}>
        {caption && <caption className="ris-table-caption sr-only">{caption}</caption>}
        {columns && data ? (
          <>
            <thead>
              <tr>
                {columns.map((col) => {
                  const isSorted = col.key === sortKey;
                  const ariaSortValue = isSorted ? sortDirection : undefined;
                  const isSortable = col.sortable || Boolean(onSort);

                  return (
                    <th
                      key={col.key}
                      scope="col"
                      className={col.numeric ? 'num' : undefined}
                      aria-sort={ariaSortValue}
                      onClick={isSortable && onSort ? () => onSort(col.key) : undefined}
                      onKeyDown={
                        isSortable && onSort
                          ? (e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSort(col.key);
                              }
                            }
                          : undefined
                      }
                      tabIndex={isSortable && onSort ? 0 : undefined}
                      role={isSortable && onSort ? 'columnheader' : undefined}
                    >
                      {col.header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const rowKey = keyExtractor ? keyExtractor(row, i) : row.id ?? row.key ?? i;
                const rowSelected = isSelected(rowKey);

                return (
                  <tr key={rowKey} data-selected={rowSelected ? 'true' : undefined}>
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
