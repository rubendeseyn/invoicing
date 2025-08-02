import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'

export function InvoicesPrimaryButtons() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => navigate({ to: '/invoices/create' })}>
        <Plus className="mr-2 h-4 w-4" />
        New Invoice
      </Button>
    </div>
  )
} 