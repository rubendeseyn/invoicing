import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'

import type { Invoice } from '../data/schema'
import { format } from 'date-fns'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'invoiceNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Invoice #" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue('invoiceNumber')}
        </div>
      )
    },
  },
  {
    accessorKey: 'clientName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px] truncate">
          {row.getValue('clientName')}
        </div>
      )
    },
  },
  {
    accessorKey: 'issueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Issue Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('issueDate') as Date
      return (
        <div className="text-muted-foreground">
          {format(date, 'dd/MM/yyyy')}
        </div>
      )
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('dueDate') as Date
      return (
        <div className="text-muted-foreground">
          {format(date, 'dd/MM/yyyy')}
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'paid':
            return 'bg-green-100 text-green-800 hover:bg-green-100'
          case 'sent':
            return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
          case 'overdue':
            return 'bg-red-100 text-red-800 hover:bg-red-100'
          case 'draft':
            return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
          case 'cancelled':
            return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
          default:
            return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
        }
      }

      return (
        <Badge className={getStatusColor(status)}>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      const total = row.getValue('total') as number
      const formatEuroAmount = (amount: number): string => {
        return amount.toLocaleString('nl-NL', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).replace('.', ',').replace(/\s/g, ' ')
      }
      return (
        <div className="font-medium">
          € {formatEuroAmount(total)}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
] 