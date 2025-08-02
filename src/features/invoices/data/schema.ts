import { z } from 'zod'

export const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  amount: z.number(),
})

export const additionalCostsSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
  unit: z.string(),
})

export const invoiceSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  clientName: z.string(),
  clientEmail: z.string(),
  clientAddress: z.string(),
  clientPhone: z.string(),
  clientVat: z.string(),
  companyName: z.string(),
  companyCommercialName: z.string(),
  companyContactName: z.string(),
  companyEmail: z.string(),
  companyPhone: z.string(),
  companyAddress: z.string(),
  companyVat: z.string(),
  companyBankAccount: z.string(),
  companyBic: z.string(),
  issueDate: z.date(),
  dueDate: z.date(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
  items: z.array(invoiceItemSchema),
  subtotal: z.number(),
  vat: z.number(),
  total: z.number(),
  notes: z.string(),
  terms: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  additionalCosts: z.array(additionalCostsSchema),
})




export type Invoice = z.infer<typeof invoiceSchema>
export type InvoiceItem = z.infer<typeof invoiceItemSchema> 
export type AdditionalCosts = z.infer<typeof additionalCostsSchema>