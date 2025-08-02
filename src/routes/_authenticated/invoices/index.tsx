import { createFileRoute } from '@tanstack/react-router'
import { InvoicesProvider } from '@/features/invoices/context/invoices-context'
import InvoicesPage from '@/features/invoices'

export const Route = createFileRoute('/_authenticated/invoices/')({
  component: () => (
    <InvoicesProvider>
      <InvoicesPage />
    </InvoicesProvider>
  ),
}) 