import React, { createContext, useContext, useState } from 'react'
import type { Invoice } from '../data/schema'
import { mockInvoices } from '../data/invoices'

interface InvoicesContextType {
  invoices: Invoice[]
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  getInvoice: (id: string) => Invoice | undefined
}

const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined)

export function InvoicesProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev])
  }

  const updateInvoice = (id: string, updatedInvoice: Partial<Invoice>) => {
    setInvoices(prev =>
      prev.map(invoice =>
        invoice.id === id
          ? { ...invoice, ...updatedInvoice, updatedAt: new Date() }
          : invoice
      )
    )
  }

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id))
  }

  const getInvoice = (id: string) => {
    return invoices.find(invoice => invoice.id === id)
  }

  return (
    <InvoicesContext.Provider value={{
      invoices,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      getInvoice,
    }}>
      {children}
    </InvoicesContext.Provider>
  )
}

export function useInvoices() {
  const context = useContext(InvoicesContext)
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoicesProvider')
  }
  return context
} 