import { useInvoices } from './context/invoices-context'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { InvoicesPrimaryButtons } from './components/invoices-primary-buttons'

export default function InvoicesPage() {
  const { invoices } = useInvoices()

  return (
    <div className="flex h-full flex-1 flex-col space-y-2 p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground">
            Manage your invoices and track payments.
          </p>
        </div>
        <InvoicesPrimaryButtons />
      </div>
      <div className="flex-1">
        <DataTable columns={columns} data={invoices} />
      </div>
    </div>
  )
} 