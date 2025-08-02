import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, User, Building, ShoppingCart, MessageSquare, Plus, Trash2, Download, Eye } from 'lucide-react'
import { useState } from 'react'
import { useInvoices } from '@/features/invoices/context/invoices-context'
import { InvoicesProvider } from '@/features/invoices/context/invoices-context'
import type { Invoice } from '@/features/invoices/data/schema'


function CreateInvoicePage() {
  const navigate = useNavigate()
  const { addInvoice } = useInvoices()
  const [currentTab, setCurrentTab] = useState('client')
  const [brandColor, setBrandColor] = useState('#000000')
  const [logoUrl, setLogoUrl] = useState('https://kotmaster.be/assets/logo/logo.png')
  const [documentType, setDocumentType] = useState<'factuur' | 'offerte'>('offerte')
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientPhone: '',
    clientVat: '',
    companyCommercialName: 'Kotmaster',
    companyName: 'Redus BV',
    companyContactName: 'Ruben De Seyn',
    companyPhone: '+32 483 630 611',
    companyBankAccount: 'BE28 7380 4703 5120',
    companyBic: 'KRED BE BB',
    companyEmail: 'ruben@kotmaster.be',
    companyVat: 'BE1023.891.517',
    companyAddress: 'Abdis Agnesstraat 14\n8510 Marke (Kortrijk)',
    notes: 'Standaard licentie Kotmaster omvat volgende modules: module huurcontracten, module plaatsbeschrijving, module communicatie, module betalingsopvolging, module technisch beheer\n\n Algemene voorwaarden: <a class="underline" href="https://www.kotmaster.be/algemene-voorwaarden">www.kotmaster.be/algemene-voorwaarden</a> \n\n De jaarlijkse prijs van de licentie wordt op elke verjaardag van het contract automatisch geïndexeerd volgens de evolutie van de Belgische consumentenprijsindex, met als basisindex de index van maand en jaar van de eerste factuur.',
  })

  const [products, setProducts] = useState([
    {
      id: '1',
      description: 'Standaard licentie Kotmaster\n\nPeriode: 1/09/2025 - 31/08/2026\n\nPrijs per unit/jaar',
      quantity: 1,
      price: 60,
      vatRate: 21,
    }
  ])

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      price: 0,
      vatRate: 21,
    }
    setProducts(prev => [...prev, newProduct])
  }

  const updateProduct = (id: string, field: string, value: string | number) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ))
  }

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(prev => prev.filter(product => product.id !== id))
    }
  }

  const calculateTotals = () => {
    const subtotal = products.reduce((sum, product) => sum + (product.quantity * product.price), 0)
    const vat = products.reduce((sum, product) => sum + (product.quantity * product.price * product.vatRate / 100), 0)
    const total = subtotal + vat
    return { subtotal, vat, total }
  }

  const handleNext = () => {
    const tabs = ['client', 'company', 'products', 'review', 'preview']
    const currentIndex = tabs.indexOf(currentTab)
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const tabs = ['client', 'company', 'products', 'review', 'preview']
    const currentIndex = tabs.indexOf(currentTab)
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1])
    }
  }

  const generatePreviewInvoice = (): Invoice => {
    const totals = calculateTotals()
    
    return {
      id: `INV-${Date.now()}`,
      invoiceNumber: formData.invoiceNumber || '202501',
      clientName: formData.clientName || 'Client Name',
      clientEmail: formData.clientEmail || 'client@example.com',
      clientAddress: formData.clientAddress || 'Client Address',
      clientPhone: formData.clientPhone,
      clientVat: formData.clientVat,
      companyName: formData.companyName,
      companyCommercialName: formData.companyCommercialName,
      companyContactName: formData.companyContactName,
      companyEmail: formData.companyEmail,
      companyAddress: formData.companyAddress,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'draft',
      items: products.map((product, index) => ({
        id: `item-${index}`,
        description: product.description || 'Product description',
        quantity: product.quantity,
        unitPrice: product.price,
        amount: product.quantity * product.price,
      })),
      subtotal: totals.subtotal,
      vat: totals.vat,
      total: totals.total,
      notes: formData.notes,
      terms: 'Payment due within 30 days.',
      createdAt: new Date(),
      updatedAt: new Date(),
      additionalCosts: [
        {
          id: '0',
          unit: 'handtekening', 
          description: 'Digitale handtekening: handgeschreven handtekening',
          amount: 0.8,
        },
        {
        id: '1',
        unit: 'handtekening', 
        description: 'Digitale handtekening: SMS/E-mail/eID',
        amount: 1.50,
      }, {
        id: '2',
        unit: 'handtekening', 
        description: 'Digitale handtekening: Itsme',
        amount: 2.30,
      }],

    } as Invoice
  }

  const generateInvoiceContentForExport = () => {
    const invoice = generatePreviewInvoice()
    const totals = calculateTotals()
    
    // Calculate VAT rate from first product (or default to 21%)
    const vatRate = products.length > 0 ? products[0].vatRate : 21

    return `
      <header>
        <div class="logo">
          ${logoUrl ? `<img src="${logoUrl}" alt="Logo" />` : ''}
        </div>
        <div class="company-info">
          <strong>${invoice.companyCommercialName} ${invoice.companyName ? `(${invoice.companyName})` : ''}</strong><br>
          ${invoice.companyAddress.replace(/\n/g, '<br>')}<br>
          ${formData.companyVat ? `BTW ${formData.companyVat}` : ''}
        </div>
      </header>
      
      <div class="contact-info-section">
        <div class="contact-info">
   
          <strong>Uw ${formData.companyCommercialName} contact</strong>
          ${formData.companyContactName}<br>
          ${formData.companyEmail}
          ${formData.companyPhone ? `<br>${formData.companyPhone}` : ''}
        </div>

        <div class="client-info">
          <strong>${invoice.clientName}</strong>
          ${invoice.clientAddress} <br>
          ${invoice.clientEmail} <br>
          ${formData.clientPhone ? `${formData.clientPhone} <br>` : ''}
          ${formData.clientVat ? `BTW ${formData.clientVat}` : ''}
        </div>
      </div>

      <h1 style="font-size:24px;margin-bottom:10px;">${documentType.charAt(0).toUpperCase() + documentType.slice(1)} ${invoice.invoiceNumber} voor ${invoice.clientName}</h1>
      <div class="meta-grid">
        <div class="label">${documentType === 'offerte' ? 'Offerte' : 'Factuur'}datum:</div>
        <div>${invoice.issueDate.toLocaleDateString('nl-NL')}</div>
        <div class="label">Vervaldatum:</div>
        <div>${invoice.dueDate.toLocaleDateString('nl-NL')}</div>
        <div class="label">${documentType === 'offerte' ? 'Offerte' : 'Factuur'}nummer:</div>
        <div>${invoice.invoiceNumber}</div>
        <div class="label">Valuta:</div>
        <div>EUR</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Beschrijving</th>
            <th>Aantal</th>
            <th>Prijs</th>
            <th>Totaal</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(item => `
          <tr>
            <td>${item.description.replace(/\n/g, '<br>')}</td>
            <td class="num">${item.quantity}</td>
            <td class="num">€ ${formatEuroAmount(item.unitPrice)}</td>
            <td class="num">€ ${formatEuroAmount(item.amount)}</td>
          </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="num">Totaal excl. btw</td>
            <td class="num">€ ${formatEuroAmount(totals.subtotal)}</td>
          </tr>
          <tr>
            <td colspan="3" class="num">Btw ${vatRate}%</td>
            <td class="num">€ ${formatEuroAmount(totals.vat)}</td>
          </tr>
          <tr>
            <td colspan="3" class="num">TOTAAL</td>
            <td class="num">€ ${formatEuroAmount(totals.total)}</td>
          </tr>
        </tfoot>
      </table>

      <!-- Additional costs table -->
      ${invoice.additionalCosts.length > 0 ? `
      <h2 class="additional-costs-title">Pay-per-use</h2>
      <p class="additional-costs-description">Deze kosten worden per gebruik berekend en maandelijks gefactureerd.</p>
      <table class="additional-costs-table">
        <thead>
          <tr>
            <th>Beschrijving</th>
            <th>Eenheidsprijs</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.additionalCosts.map(cost => `
            <tr>
              <td>${cost.description}</td>
              <td class="num">€ ${formatEuroAmount(cost.amount)} ${cost.unit ? `/stuk` : ''}</td> 
            </tr>
          `).join('')}
        </tbody>
      </table>
      ` : ''}
      <!-- End additional costs table -->

             ${invoice.notes ? `
       <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
         <h4 style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 8px 0;">Opmerkingen</h4>
         <p style="font-size: 13px; line-height: 1.5; margin: 0; white-space: pre-wrap;">${invoice.notes.split('\n').map(line => line.trim()).join('\n')}</p>
       </div>
       ` : ''}

      <footer>
        <div class="bank-info">
          <strong>${invoice.companyName}</strong>
          IBAN ${formData.companyBankAccount} · BIC ${formData.companyBic}<br>
          BTW ${formData.companyVat}
        </div>
        <div class="qr">
          <!-- QR code placeholder -->
        </div>
      </footer>`
  }

  const generateInvoiceContent = () => {
    const invoice = generatePreviewInvoice()
    const totals = calculateTotals()
    
    // Calculate VAT rate from first product (or default to 21%)
    const vatRate = products.length > 0 ? products[0].vatRate : 21
    
    return `
    <style>
    .underline {
      text-decoration: underline;
    }
      .invoice-preview {
        font-family: 'Inter', Arial, sans-serif;
        font-size: 13px;
        color: #111827;
        line-height: 1.45;
        background: white;
        max-width: 780px;
        margin: 0 auto;
        padding: 32px 40px 48px;
        border-radius: 10px;
        box-shadow: 0 14px 28px rgba(0, 0, 0, .06);
      }
      
      .invoice-preview h1,
      .invoice-preview h2,
      .invoice-preview h3 {
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
      }
      
      .invoice-preview header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 22px;
        border-bottom: 4px solid ${brandColor};
        margin-bottom: 26px;
      }
      
      .invoice-preview .logo img {
        max-height: 60px;
      }
      
      .invoice-preview .company-info {
        text-align: right;
        font-size: 12.5px;
        line-height: 1.55;
      }
      
      .invoice-preview .company-info strong {
        color: ${brandColor};
      }
      
      .invoice-preview .client-info {
        background: color-mix(in srgb, ${brandColor} 15%, white);
        padding: 14px 16px;
        border-radius: 10px;
        font-size: 13.5px;
        width: 48%;
        margin-left: auto;
      }
      
      .invoice-preview .meta-grid {
        display: grid;
        grid-template-columns: 150px 1fr 150px 1fr;
        row-gap: 8px;
        font-size: 13px;
        margin-bottom: 26px;
      }
      
      .invoice-preview .label {
        font-weight: 500;
        color: #6B7280;
      }
      
      .invoice-preview table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        margin-bottom: 32px;
      }
      
      .invoice-preview th,
      .invoice-preview td {
        padding: 6px 8px;
        border: 1px solid #E5E7EB;
      }
      
      .invoice-preview th {
        background: color-mix(in srgb, ${brandColor} 15%, white);
        font-weight: 600;
        text-align: left;
      }
      
      .invoice-preview td.num {
        text-align: right;
        white-space: nowrap;
      }
      
      .invoice-preview tbody tr:hover {
        background: #f5f6fa;
      }
      
      .invoice-preview tfoot td {
        font-weight: 600;
        background: #f3f4f6;
      }
      
      .invoice-preview tfoot tr:last-child td {
        background: ${brandColor};
        color: #fff;
      }
      
      .invoice-preview footer {
        border-top: 1px solid #E5E7EB;
        padding-top: 24px;
        margin-top: 42px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        font-size: 12px;
        flex-wrap: wrap;
        gap: 24px;
      }
      
      .invoice-preview .bank-info strong {
        display: block;
        color: ${brandColor};
        margin-bottom: 4px;
      }
      
      .invoice-preview .badge {
        background: ${brandColor};
        color: #fff;
        font-size: 11.5px;
        padding: 2px 8px;
        border-radius: 9999px;
        vertical-align: middle;
      }
        .additional-costs-title {
          font-size: 14px;
          font-weight: 600;
          margin: 20px 0 8px 0;
          color: var(--text);
        }
        .additional-costs-description {
          font-size: 11px;
          font-weight: 400;
          margin-bottom: 12px;
          color: var(--grey);
        }
        .additional-costs-table {
          font-size: 11px;
          margin-bottom: 20px;
        }
        .additional-costs-table th,
        .additional-costs-table td {
          padding: 6px 8px;
          border: 1px solid #E5E7EB;
          text-indent: 0;
          word-wrap: break-word;
          vertical-align: top;
        }
        .additional-costs-table th {
          background: var(--brand-light);
          font-weight: 600;
          text-align: left;
        }
        .contact-info-section {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          margin: 20px 0 18px;
          gap: 20px;
          flex-shrink: 0;
        }
        .contact-info {
          background: transparent;
          padding: 12px 14px;
          border-radius: var(--radius);
          font-size: 13px;
          width: 45%;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .contact-info strong {
          color: var(--brand-dark);
        }
        .client-info {
          background: var(--brand-light);
          padding: 12px 14px;
          border-radius: var(--radius);
          font-size: 13px;
          width: 45%;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
    </style>
    
    <div class="invoice-preview">
      <header>
        <div class="logo">
          ${logoUrl ? `<img src="${logoUrl}" alt="Logo" />` : ''}
        </div>
        <div class="company-info">
          <strong>${invoice.companyCommercialName} ${invoice.companyName ? `(${invoice.companyName})` : ''}</strong><br>
          ${invoice.companyAddress.replace(/\n/g, '<br>')}<br>
          ${formData.companyVat ? `BTW ${formData.companyVat}` : ''}
        </div>
      </header>
      
      <div class="contact-info-section">
        <div class="contact-info">
   
          <strong>Uw ${formData.companyCommercialName} contact</strong>
          ${formData.companyContactName}<br>
          ${formData.companyEmail}
          ${formData.companyPhone ? `<br>${formData.companyPhone}` : ''}
        </div>

        <div class="client-info">
          <strong>${invoice.clientName}</strong>
          ${invoice.clientAddress} <br>
          ${invoice.clientEmail} <br>
          ${formData.clientPhone ? `${formData.clientPhone} <br>` : ''}
          ${formData.clientVat ? `BTW ${formData.clientVat}` : ''}
        </div>
      </div>

      <h1 style="font-size:24px;margin-bottom:10px;">${documentType.charAt(0).toUpperCase() + documentType.slice(1)} ${invoice.invoiceNumber} voor ${invoice.clientName}</h1>
      <div class="meta-grid">
        <div class="label">${documentType === 'offerte' ? 'Offerte' : 'Factuur'}datum:</div>
        <div>${invoice.issueDate.toLocaleDateString('nl-NL')}</div>
        <div class="label">Vervaldatum:</div>
        <div>${invoice.dueDate.toLocaleDateString('nl-NL')}</div>
        <div class="label">${documentType === 'offerte' ? 'Offerte' : 'Factuur'}nummer:</div>
        ${invoice.invoiceNumber}
        <div class="label">Valuta:</div>
        <div>EUR</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Beschrijving</th>
            <th>Aantal</th>
            <th>Prijs</th>
            <th>Totaal</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(item => `
          <tr>
            <td>${item.description.replace(/\n/g, '<br>')}</td>
            <td class="num">${item.quantity}</td>
            <td class="num">€ ${formatEuroAmount(item.unitPrice)}</td>
            <td class="num">€ ${formatEuroAmount(item.amount)}</td>
          </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="num">Totaal excl. btw</td>
            <td class="num">€ ${formatEuroAmount(totals.subtotal)}</td>
          </tr>
          <tr>
            <td colspan="3" class="num">Btw ${vatRate}%</td>
            <td class="num">€ ${formatEuroAmount(totals.vat)}</td>
          </tr>
          <tr>
            <td colspan="3" class="num">TOTAAL</td>
            <td class="num">€ ${formatEuroAmount(totals.total)}</td>
          </tr>
        </tfoot>
      </table>

      <!-- Additional costs table -->
      ${invoice.additionalCosts.length > 0 ? `
      <h2 class="additional-costs-title">Pay-per-use</h2>
      <p class="additional-costs-description">Deze kosten worden per gebruik berekend en maandelijks gefactureerd.</p>
      <table class="additional-costs-table">
        <thead>
          <tr>
            <th>Beschrijving</th>
            <th>Eenheidsprijs</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.additionalCosts.map(cost => `
            <tr>
              <td>${cost.description}</td>
              <td class="num">€ ${formatEuroAmount(cost.amount)} ${cost.unit ? `/stuk` : ''}</td> 
            </tr>
          `).join('')}
        </tbody>
      </table>
      ` : ''}
      <!-- End additional costs table -->

             ${invoice.notes ? `
       <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
         <h4 style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 8px 0;">Opmerkingen</h4>
         <p style="font-size: 13px; line-height: 1.5; margin: 0; white-space: pre-wrap;">${invoice.notes.split('\n').map(line => line.trim()).join('\n')}</p>
       </div>
       ` : ''}

      <footer>
        <div class="bank-info">
          <strong>${invoice.companyName}</strong>
          IBAN ${formData.companyBankAccount} · BIC ${formData.companyBic}<br>
          BTW ${formData.companyVat}
        </div>
        <div class="qr">
          <!-- QR code placeholder -->
        </div>
      </footer>
    </div>`
  }


  const formatEuroAmount = (amount: number): string => {
    return amount.toLocaleString('nl-BE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const generateInvoiceHtml = () => {
    const invoice = generatePreviewInvoice()
    const content = generateInvoiceContentForExport()

    return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <title>${documentType.charAt(0).toUpperCase() + documentType.slice(1)} ${invoice.invoiceNumber} • ${invoice.clientName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600&display=swap" rel="stylesheet">
  <style>
    :root {
      --brand: ${brandColor};
      --text: #111827;
      --grey: #6B7280;
      --radius: 8px;
      --brand-light: #EEF2FF;
      --brand-dark: #4338CA;
    }

    @supports (color:color-mix(in srgb, white 50%, black 50%)) {
      :root {
        --brand-light: color-mix(in srgb, var(--brand) 15%, white);
        --brand-dark: color-mix(in srgb, var(--brand) 70%, black);
      }
    }

    @page {
      size: A4 portrait;
      margin: 15mm 12mm 15mm 12mm;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .underline {
      text-decoration: underline;
    }

    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }

      html {
        font-size: 12px;
      }

      body {
        width: 210mm;
        min-height: 297mm;
        background: white !important;
        margin: 0;
        padding: 0;
        font-size: 12px;
        line-height: 1.4;
      }

      .invoice {
        box-shadow: none !important;
        background: white !important;
        max-width: none !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border-radius: 0 !important;
        page-break-inside: avoid;
      }

      .print-button {
        display: none !important;
      }

      /* Improved page breaks */
      header {
        page-break-inside: avoid;
        page-break-after: avoid;
      }

      .contact-info-section {
        page-break-inside: avoid;
        page-break-after: avoid;
      }

      .meta-grid {
        page-break-inside: avoid;
        page-break-after: avoid;
      }

      table {
        page-break-inside: auto;
        page-break-before: avoid;
      }

      thead {
        display: table-header-group;
        page-break-inside: avoid;
      }

      tbody tr {
        page-break-inside: avoid;
      }

      tfoot {
        display: table-footer-group;
        page-break-inside: avoid;
      }

      .notes-section {
        page-break-inside: avoid;
      }

      footer {
        page-break-inside: avoid;
        position: relative;
        margin-top: auto;
      }

      /* Force better text rendering */
      p, td, th, div, span {
        orphans: 3;
        widows: 3;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', Arial, sans-serif;
      font-size: 13px;
      color: var(--text);
      line-height: 1.45;
      background: white;
    }

    h1,
    h2,
    h3 {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
    }

    a {
      color: var(--brand-dark);
      text-decoration: none;
    }

    .invoice {
      background: white;
      max-width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 20mm 15mm 20mm 15mm;
      border-radius: var(--radius);
      box-shadow: 0 4px 20px rgba(0, 0, 0, .08);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 18px;
      margin-bottom: 20px;
      border-bottom: 3px solid var(--brand);
      flex-shrink: 0;
    }

    .logo img {
      max-height: 60px;
    }

    .company-info {
      text-align: right;
      font-size: 12.5px;
      line-height: 1.55;
    }

    .company-info strong {
      color: var(--brand-dark);
    }

    .contact-info-section {
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      margin: 10px 0 10px;
      gap: 20px;
      flex-shrink: 0;
    }

    .contact-info {
      background: transparent;
      padding: 12px 14px;
      border-radius: var(--radius);
      font-size: 13px;
      width: 45%;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .contact-info strong {
      color: var(--brand-dark);
    }

    .client-info {
      background: var(--brand-light);
      padding: 12px 14px;
      border-radius: var(--radius);
      font-size: 13px;
      width: 45%;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: 140px 1fr 140px 1fr;
      row-gap: 6px;
      column-gap: 12px;
      font-size: 12px;
      margin-bottom: 20px;
      flex-shrink: 0;
    }

    .label {
      font-weight: 500;
      color: var(--grey);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-bottom: 20px;
      flex-shrink: 0;
    }

         th,
     td {
       padding: 8px 10px;
       border: 1px solid #E5E7EB;
       text-indent: 0;
       word-wrap: break-word;
       vertical-align: top;
     }

    th {
      background: var(--brand-light);
      font-weight: 600;
      text-align: left;
    }

    td.num {
      text-align: right;
      white-space: nowrap;
    }

    tbody tr:hover {
      background: #f5f6fa;
    }

    br {
      line-height: 1.45;
      margin: 0;
      padding: 0;
    }

    tfoot td {
      font-weight: 600;
      background: #f3f4f6;
    }

    tfoot tr:last-child td {
      background: var(--brand);
      color: #fff;
    }

    footer {
      border-top: 1px solid #E5E7EB;
      padding-top: 20px;
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 11px;
      flex-wrap: wrap;
      gap: 20px;
      flex-shrink: 0;
    }

    .bank-info strong {
      display: block;
      color: var(--brand-dark);
      margin-bottom: 4px;
    }

    .qr img {
      width: 90px;
      height: 90px;
      border-radius: var(--radius);
    }

    .badge {
      background: var(--brand-dark);
      color: #fff;
      font-size: 11.5px;
      padding: 2px 8px;
      border-radius: 9999px;
      vertical-align: middle;
    }

    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999;
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      background: var(--brand-dark);
      color: white;
      font-size: 13px;
      cursor: pointer;
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
    }

    .notes-section {
      margin: 16px 0;
      flex-shrink: 0;
    }

    .invoice-title {
      font-size: 20px;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .additional-costs-title {
      font-size: 14px;
      font-weight: 600;
      margin: 20px 0 8px 0;
      color: var(--text);
    }

    .additional-costs-description {
      font-size: 11px;
      font-weight: 400;
      margin-bottom: 12px;
      color: var(--grey);
    }

    .additional-costs-table {
      font-size: 11px;
      margin-bottom: 20px;
    }

    .additional-costs-table th,
    .additional-costs-table td {
      padding: 6px 8px;
      border: 1px solid #E5E7EB;
      text-indent: 0;
      word-wrap: break-word;
      vertical-align: top;
    }

    .additional-costs-table th {
      background: var(--brand-light);
      font-weight: 600;
      text-align: left;
    }
  </style>
</head>
  <body>
    <button onclick="window.print()" class="print-button">Print / Download PDF</button>
    <div class="invoice">
      <div class="content">
        <div class="main-content">
          ${content}
        </div>
      </div>
    </div>
  </body>
</html>`
  }

  const downloadHtml = () => {
    const invoice = generatePreviewInvoice()
    const htmlContent = generateInvoiceHtml()

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${documentType}-${invoice.invoiceNumber}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSubmit = () => {
    const totals = calculateTotals()
    
    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: formData.invoiceNumber || '202501',
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientAddress: formData.clientAddress,
      clientPhone: formData.clientPhone,
      clientVat: formData.clientVat,
      companyName: formData.companyName,
      companyCommercialName: formData.companyCommercialName,
      companyContactName: formData.companyContactName,
      companyEmail: formData.companyEmail,
      companyPhone: formData.companyPhone,
      companyAddress: formData.companyAddress,
      companyBankAccount: formData.companyBankAccount,
      companyBic: formData.companyBic,
      companyVat: formData.companyVat,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'draft',
      items: products.map((product, index) => ({
        id: `item-${index}`,
        description: product.description,
        quantity: product.quantity,
        unitPrice: product.price,
        amount: product.quantity * product.price,
      })),
      subtotal: totals.subtotal,
      vat: totals.vat,
      total: totals.total,
      notes: formData.notes,
      terms: 'Payment due within 30 days.',
      createdAt: new Date(),
      updatedAt: new Date(),
      additionalCosts: [],
     
    }

    addInvoice(newInvoice)
    navigate({ to: '/invoices' })
  }

  const canProceed = (tab: string) => {
    switch (tab) {
      case 'client':
        return formData.clientName && formData.clientEmail && formData.clientAddress
      case 'company':
        return formData.companyName && formData.companyEmail && formData.companyAddress
      case 'products':
        return products.every(product => product.description && product.quantity > 0 && product.price >= 0)
      default:
        return true
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 md:px-6 py-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate({ to: '/invoices' })}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoices
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Create New Invoice</h1>
            <p className="text-sm text-muted-foreground hidden md:block">
              Fill out the form to create a new invoice.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-5 h-auto p-1">
              <TabsTrigger value="client" className="flex items-center gap-2 py-3 text-xs md:text-sm">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Klantinformatie</span>
                <span className="sm:hidden">Client</span>
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2 py-3 text-xs md:text-sm">
                <Building className="w-4 h-4" />
                <span className="hidden sm:inline">Basisinformatie</span>
                <span className="sm:hidden">Company</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2 py-3 text-xs md:text-sm">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Verkooppartikelen</span>
                <span className="sm:hidden">Products</span>
              </TabsTrigger>
              <TabsTrigger value="review" className="flex items-center gap-2 py-3 text-xs md:text-sm">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Mededeling</span>
                <span className="sm:hidden">Review</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2 py-3 text-xs md:text-sm">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
                <span className="sm:hidden">Preview</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="client" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Client Information</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="clientName">Client Name *</Label>
                          <Input
                            id="clientName"
                            value={formData.clientName}
                            onChange={(e) => updateFormData('clientName', e.target.value)}
                            placeholder="Enter client name"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="clientEmail">Email Address *</Label>
                          <Input
                            id="clientEmail"
                            type="email"
                            value={formData.clientEmail}
                            onChange={(e) => updateFormData('clientEmail', e.target.value)}
                            placeholder="client@example.com"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="clientAddress">Address *</Label>
                          <Textarea
                            id="clientAddress"
                            value={formData.clientAddress}
                            onChange={(e) => updateFormData('clientAddress', e.target.value)}
                            placeholder="Enter client address"
                            rows={3}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="clientPhone">Phone Number</Label>
                          <Input
                            id="clientPhone"
                            value={formData.clientPhone}
                            onChange={(e) => updateFormData('clientPhone', e.target.value)}
                            placeholder="+32 123 456 789"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="clientVat">VAT Number</Label>
                          <Input
                            id="clientVat"
                            value={formData.clientVat}
                            onChange={(e) => updateFormData('clientVat', e.target.value)}
                            placeholder="BE0123456789"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button 
                        onClick={handleNext} 
                        disabled={!canProceed('client')}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Company Information</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            value={formData.companyName}
                            onChange={(e) => updateFormData('companyName', e.target.value)}
                            placeholder="Your company name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyCommercialName">Company Commercial Name *</Label>
                          <Input
                            id="companyCommercialName"
                            value={formData.companyCommercialName}
                            onChange={(e) => updateFormData('companyCommercialName', e.target.value)}
                            placeholder="Your company commercial name"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="companyEmail">Company Email *</Label>
                          <Input
                            id="companyEmail"
                            type="email"
                            value={formData.companyEmail}
                            onChange={(e) => updateFormData('companyEmail', e.target.value)}
                            placeholder="hello@yourcompany.com"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyPhone">Company Phone *</Label>
                          <Input
                            id="companyPhone"
                            value={formData.companyPhone}
                            onChange={(e) => updateFormData('companyPhone', e.target.value)}
                            placeholder="0123456789"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyVat">Company VAT *</Label>
                          <Input
                            id="companyVat"
                            value={formData.companyVat}
                            onChange={(e) => updateFormData('companyVat', e.target.value)}
                            placeholder="BE0123456789"
                            className="mt-1"  
                          />
                        </div>

                        <div>
                          <Label htmlFor="companyAddress">Company Address *</Label>
                          <Textarea
                            id="companyAddress"
                            value={formData.companyAddress}
                            onChange={(e) => updateFormData('companyAddress', e.target.value)}
                            placeholder="Your company address"
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyBankAccount">Company Bank Account *</Label>
                          <Input
                            id="companyBankAccount"
                            value={formData.companyBankAccount}
                            onChange={(e) => updateFormData('companyBankAccount', e.target.value)}
                            placeholder="BE28 7380 4703 5120"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyBic">Company BIC *</Label>
                          <Input
                            id="companyBic"
                            value={formData.companyBic}
                            onChange={(e) => updateFormData('companyBic', e.target.value)}
                            placeholder="KRED BE BB"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={handlePrevious}>
                        Previous
                      </Button>
                      <Button 
                        onClick={handleNext} 
                        disabled={!canProceed('company')}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

                         <TabsContent value="products" className="space-y-6">
               <Card>
                 <CardContent className="p-6">
                   <div className="space-y-6">
                     <div className="flex justify-between items-center">
                       <h3 className="text-lg font-semibold">Products & Services</h3>
                       <Button onClick={addProduct} variant="outline" size="sm" className="flex items-center gap-2">
                         <Plus className="w-4 h-4" />
                         Add Product
                       </Button>
                     </div>

                     <div className="space-y-4">
                       {/* Table Headers */}
                       <div className="grid grid-cols-12 gap-2 md:gap-4 py-2 text-sm font-medium text-muted-foreground border-b">
                         <div className="col-span-4">Description</div>
                         <div className="col-span-2">Quantity</div>
                         <div className="col-span-2">Price</div>
                         <div className="col-span-2">VAT %</div>
                         <div className="col-span-1">Total</div>
                         <div className="col-span-1">Actions</div>
                       </div>

                       {/* Product Rows */}
                       {products.map((product) => (
                         <div key={product.id} className="grid grid-cols-12 gap-2 md:gap-4 py-2 items-center">
                           <div className="col-span-4">
                             <Input
                               value={product.description}
                               onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                               placeholder="Enter description"
                               className="h-8"
                             />
                           </div>
                           <div className="col-span-2">
                             <Input
                               type="number"
                               value={product.quantity}
                               onChange={(e) => updateProduct(product.id, 'quantity', parseInt(e.target.value) || 1)}
                               min="1"
                               className="h-8"
                             />
                           </div>
                           <div className="col-span-2">
                             <Input
                               type="number"
                               value={product.price}
                               onChange={(e) => updateProduct(product.id, 'price', parseFloat(e.target.value) || 0)}
                               min="0"
                               step="0.01"
                               className="h-8"
                               placeholder="€0.00"
                             />
                           </div>
                           <div className="col-span-2">
                             <Input
                               type="number"
                               value={product.vatRate}
                               onChange={(e) => updateProduct(product.id, 'vatRate', parseFloat(e.target.value) || 21)}
                               min="0"
                               max="100"
                               step="0.01"
                               className="h-8"
                             />
                           </div>
                           <div className="col-span-1 text-sm font-medium">
                             € {formatEuroAmount(product.quantity * product.price)}
                           </div>
                           <div className="col-span-1 flex gap-1">
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => removeProduct(product.id)}
                               disabled={products.length <= 1}
                               className="h-8 w-8 p-0"
                             >
                               <Trash2 className="w-4 h-4" />
                             </Button>
                           </div>
                         </div>
                       ))}

                       {/* Invoice Number */}
                       <div className="pt-4 border-t">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                             <Label htmlFor="invoiceNumber">Invoice Number</Label>
                             <Input
                               id="invoiceNumber"
                               value={formData.invoiceNumber}
                               onChange={(e) => updateFormData('invoiceNumber', e.target.value)}
                               placeholder="202501"
                               className="mt-1"
                             />
                           </div>
                         </div>
                       </div>

                       {/* Totals */}
                       <div className="flex justify-end pt-4">
                         <div className="w-80 space-y-2 bg-muted/30 p-4 rounded-lg">
                           <div className="flex justify-between text-sm">
                             <span>Subtotal:</span>
                             <span className="font-medium">€ {formatEuroAmount(calculateTotals().subtotal)}</span>
                           </div>
                           <div className="flex justify-between text-sm">
                             <span>VAT:</span>
                             <span className="font-medium">€ {formatEuroAmount(calculateTotals().vat)}</span>
                           </div>
                           <div className="flex justify-between text-lg font-bold border-t pt-2">
                             <span>Total:</span>
                             <span>€ {formatEuroAmount(calculateTotals().total)}</span>
                           </div>
                         </div>
                       </div>
                     </div>
                     
                     <div className="flex justify-between pt-4">
                       <Button variant="outline" onClick={handlePrevious}>
                         Previous
                       </Button>
                       <Button 
                         onClick={handleNext} 
                         disabled={!canProceed('products')}
                       >
                         Next
                       </Button>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             </TabsContent>

            <TabsContent value="review" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Review & Additional Notes</h3>
                      
                      {/* Summary */}
                      <div className="bg-muted/50 rounded-lg p-4 mb-6">
                        <h4 className="font-medium mb-2">Invoice Summary</h4>
                                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                           <div>
                             <span className="text-muted-foreground">Client:</span> {formData.clientName || 'Not set'}
                           </div>
                           <div>
                             <span className="text-muted-foreground">Products:</span> {products.length} item{products.length !== 1 ? 's' : ''}
                           </div>
                           <div>
                             <span className="text-muted-foreground">Invoice #:</span> {formData.invoiceNumber || 'Auto-generated'}
                           </div>
                           <div>
                             <span className="text-muted-foreground">Total (incl. VAT):</span> € {formatEuroAmount(calculateTotals().total)}
                           </div>
                         </div>
                      </div>

                      {/* Document Type Selector */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <Label htmlFor="documentType">Document Type</Label>
                        <select
                          id="documentType"
                          value={documentType}
                          onChange={(e) => setDocumentType(e.target.value as 'factuur' | 'offerte')}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="factuur">Factuur</option>
                          <option value="offerte">Offerte</option>
                        </select>
                      </div>

                      {/* Logo and Brand Color   */}
                       <div className="grid grid-cols-2 gap-4">
                         <Label htmlFor="brandColor">Brand Color</Label>
                         <Input
                           id="brandColor"
                           value={brandColor}
                           onChange={(e) => setBrandColor(e.target.value)}
                         />
                       </div>
 
                       <div className="grid grid-cols-2 gap-4  mt-4 mb-4">
                         <Label htmlFor="logoUrl">Logo URL</Label>
                         <Input
                           id="logoUrl"
                           value={logoUrl}
                           onChange={(e) => setLogoUrl(e.target.value)}
                         />
                       </div>

                      <div>
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => updateFormData('notes', e.target.value)}
                          placeholder="Add any additional notes or terms..."
                          rows={4}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={handlePrevious}>
                        Previous
                      </Button>
                 
                      <Button 
                        onClick={handleNext} 
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Invoice Preview</h3>
                      <Button 
                        onClick={downloadHtml} 
                        variant="outline" 
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download HTML
                      </Button>
                    </div>
                    
                    {/* Preview Container */}
                    <div className="border rounded-lg p-4 bg-gray-50 max-h-[600px] overflow-auto">
                      <div dangerouslySetInnerHTML={{ __html: generateInvoiceContent() }} />
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={handlePrevious}>
                        Previous
                      </Button>
                      <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                        Create Invoice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/invoices/create')({
  component: () => (
    <InvoicesProvider>
      <CreateInvoicePage />
    </InvoicesProvider>
  ),
}) 