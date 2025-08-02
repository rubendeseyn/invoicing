import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Invoice } from '../data/schema'
import { useInvoices } from '../context/invoices-context'



interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const invoice = row.original as Invoice
  const { deleteInvoice, updateInvoice } = useInvoices()

  const formatEuroAmount = (amount: number): string => {
    return amount.toLocaleString('nl-NL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).replace('.', ',').replace(/\s/g, ' ')
  }

  const generateInvoiceHtml = (invoice: Invoice, brandColor = '#000000', logoUrl = '') => {
    // Calculate VAT rate from first item (or default to 21%)
    const vatRate = invoice.items.length > 0 ? 21 : 21 // Default VAT rate
    
    return `<!DOCTYPE html>
<html lang="nl">

<head>
  <meta charset="utf-8" />
  <title>Factuur ${invoice.invoiceNumber} • ${invoice.companyName}</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600&display=swap"
    rel="stylesheet">

  <style>
    :root {
      --brand: ${brandColor};
      --text: #111827;
      --grey: #6B7280;
      --radius: 10px;
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

      .client-info {
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
      padding-bottom: 22px;
      border-bottom: 4px solid var(--brand);
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

    .client-info {
      background: var(--brand-light);
      padding: 14px 16px;
      border-radius: var(--radius);
      font-size: 13.5px;
      margin: 26px 0 22px;
      width: 48%;
      margin-left: auto;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: 150px 1fr 150px 1fr;
      row-gap: 8px;
      font-size: 13px;
      margin-bottom: 26px;
    }

    .label {
      font-weight: 500;
      color: var(--grey);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-bottom: 32px;
    }

    th,
    td {
      padding: 12px 10px;
      border: 1px solid #E5E7EB;
      text-indent: 0;
      word-wrap: break-word;
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
      padding-top: 24px;
      margin-top: 42px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 12px;
      flex-wrap: wrap;
      gap: 24px;
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

    <header>
      <div class="logo">
        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" />` : ''}
      </div>
      <div class="company-info">
        <strong>${invoice.companyName}</strong><br>
        ${invoice.companyAddress.replace(/\n/g, '<br>')}<br>
        ${invoice.companyEmail}<br>
      </div>
    </header>

    <div class="client-info">
      <strong>${invoice.clientName}</strong><br>
      ${invoice.clientAddress.replace(/\n/g, '<br>')}<br>
      ${invoice.clientEmail}
    </div>

    <h1 style="font-size:24px;margin-bottom:10px;">Factuur ${invoice.invoiceNumber} <span
        class="badge">${invoice.status}</span></h1>
    <div class="meta-grid">
      <div class="label">Factuurdatum:</div>
      <div>${invoice.issueDate.toLocaleDateString('nl-NL')}</div>
      <div class="label">Vervaldatum:</div>
      <div>${invoice.dueDate.toLocaleDateString('nl-NL')}</div>
      <div class="label">Gestructureerde mededeling:</div>
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
          <td>${item.description}</td>
          <td class="num">${item.quantity}</td>
          <td class="num">€ ${formatEuroAmount(item.unitPrice)}</td>
          <td class="num">€ ${formatEuroAmount(item.amount)}</td>
        </tr>
        `).join('')}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="num">Totaal excl. btw</td>
          <td class="num">€ ${formatEuroAmount(invoice.subtotal)}</td>
        </tr>
        <tr>
          <td colspan="3" class="num">Btw ${vatRate}%</td>
          <td class="num">€ ${formatEuroAmount(invoice.vat)}</td>
        </tr>
        <tr>
          <td colspan="3" class="num">TOTAAL</td>
          <td class="num">€ ${formatEuroAmount(invoice.total)}</td>
        </tr>
      </tfoot>
    </table>

         ${invoice.notes ? `
     <div style="background: #F9FAFB; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
       <h4 style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 8px 0;">Notities</h4>
       <p style="font-size: 13px; line-height: 1.5; margin: 0; white-space: pre-wrap;">${invoice.notes.split('\n').map(line => line.trim()).join('\n')}</p>
     </div>
     ` : ''}

    <footer>
      <div class="bank-info">
        <strong>${invoice.companyName}</strong>
        IBAN NL00 BANK 0000 0000 00 · BIC BANKBIC<br>
        BTW NL000000000B00 · KvK 12345678
      </div>
      <div class="qr">
        <!-- QR code placeholder -->
      </div>
    </footer>

  </div>

</body>

</html>`
  }

  const exportInvoiceAsHtml = (invoice: Invoice) => {
    const htmlContent = generateInvoiceHtml(invoice)

    // Create and download the HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${invoice.invoiceNumber}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const printInvoice = (invoice: Invoice) => {
    // Open the invoice in a new window for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const htmlContent = generateInvoiceHtml(invoice)
    printWindow.document.write(htmlContent)
    
    printWindow.document.close()
    printWindow.focus()
    
    // Wait for the content to load, then print
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={() => updateInvoice(invoice.id, { status: 'sent' })}>
          Mark as sent
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateInvoice(invoice.id, { status: 'paid' })}>
          Mark as paid
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => deleteInvoice(invoice.id)}
          className="text-red-600"
        >
          Delete invoice
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportInvoiceAsHtml(invoice)}>
          Export as HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => printInvoice(invoice)}>
          Print invoice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 