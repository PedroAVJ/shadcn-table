import * as React from "react"
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types"
import {
  flexRender,
  type ColumnDef,
  type Table as TanstackTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTableAdvancedToolbar } from "./advanced/data-table-advanced-toolbar"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

interface DataTableProps<TData, TValue> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>

  /**
   * The columns of the table.
   * @default []
   * @type ColumnDef<TData, TValue>[]
   */
  columns: ColumnDef<TData, TValue>[]

  /**
   * The searchable columns of the table.
   * @default []
   * @type {id: keyof TData, title: string}[]
   * @example searchableColumns={[{ id: "title", title: "titles" }]}
   */
  searchableColumns?: DataTableSearchableColumn<TData>[]

  /**
   * The filterable columns of the table. When provided, renders dynamic faceted filters, and the advancedFilter prop is ignored.
   * @default []
   * @type {id: keyof TData, title: string, options: { label: string, value: string, icon?: React.ComponentType<{ className?: string }> }[]}[]
   * @example filterableColumns={[{ id: "status", title: "Status", options: ["todo", "in-progress", "done", "canceled"]}]}
   */
  filterableColumns?: DataTableFilterableColumn<TData>[]

  /**
   * Enables notion like filters when enabled.
   * @default false
   * @type boolean
   */
  enableAdvancedFilter?: boolean

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar table={table} />}
   */
  floatingBar?: React.ReactNode | null

  /**
   * The link to create a new row. When provided, renders a button to create a new row.
   * @default undefined
   * @type string
   * @example newRowLink="/tasks/new"
   */
  newRowLink?: string

  /**
   * The action to delete rows. When provided, renders a button to delete selected rows.
   * @default undefined
   * @type React.MouseEventHandler<HTMLButtonElement> | undefined
   * @example deleteRowsAction={() => deleteSelectedRows({ rows: table.getFilteredSelectedRowModel().rows })}
   */
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>
}

export function DataTable<TData, TValue>({
  table,
  columns,
  searchableColumns = [],
  filterableColumns = [],
  enableAdvancedFilter = false,
  floatingBar,
  newRowLink,
  deleteRowsAction,
}: DataTableProps<TData, TValue>) {
  return (
    <div className="w-full space-y-2.5 overflow-auto">
      {enableAdvancedFilter ? (
        <DataTableAdvancedToolbar
          table={table}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
        />
      ) : (
        <DataTableToolbar
          table={table}
          filterableColumns={filterableColumns}
          searchableColumns={searchableColumns}
          newRowLink={newRowLink}
          deleteRowsAction={deleteRowsAction}
        />
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {floatingBar && table.getFilteredSelectedRowModel().rows.length > 0
          ? floatingBar
          : null}
      </div>
    </div>
  )
}
