/**
 * HireNova Document Engine — 100% paperless, auto-generated PDFs
 *
 * Generates professional PDF documents on demand:
 * - Invoice (facture) — triggered automatically on payment
 * - Quote (devis) — generated from Enterprise inquiries
 * - Agreement (accord/contrat) — generated when quote is accepted
 * - Receipt (reçu) — generated for each payment
 * - Credit note (avoir) — generated on refund
 *
 * Uses pdf-lib for server-side PDF generation.
 * No external services, no templates, no manual work — pure code.
 */

import {
  PDFDocument,
  StandardFonts,
  rgb,
  degrees,
  PDFFont,
  PDFPage,
  TextAlignment,
} from 'pdf-lib'
import { db } from '@/lib/db'

// ============= Types =============

export type DocumentType = 'invoice' | 'quote' | 'agreement' | 'receipt' | 'credit_note'

export interface DocumentItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface DocumentData {
  type: DocumentType
  number: string
  // Recipient
  recipientName: string
  recipientEmail: string
  recipientCompany?: string
  recipientAddress?: string
  recipientCountry?: string
  // Issuer (defaults to HireNova)
  issuerName?: string
  issuerLegal?: string
  issuerAddress?: string
  issuerEmail?: string
  issuerVAT?: string
  // Content
  subject: string
  items: DocumentItem[]
  currency: string
  taxRate?: number
  // Dates
  issueDate?: Date
  dueDate?: Date
  paidAt?: Date
  // Meta
  notes?: string
  // For agreements
  agreementTerms?: string
  inquiryId?: string
  userId?: string
}

export interface GeneratedDocument {
  id: string
  number: string
  type: DocumentType
  pdfBase64: string
  total: number
}

// ============= Numbering =============

const TYPE_PREFIXES: Record<DocumentType, string> = {
  invoice: 'FAC',
  quote: 'DEV',
  agreement: 'CTR',
  receipt: 'REC',
  credit_note: 'AVO',
}

/**
 * Generate the next sequential document number: FAC-2026-001
 */
export async function nextDocumentNumber(type: DocumentType, date = new Date()): Promise<string> {
  const year = date.getFullYear()
  const prefix = TYPE_PREFIXES[type]

  // Find the highest number for this type+year
  const existing = await db.document.findMany({
    where: {
      type,
      number: { startsWith: `${prefix}-${year}-` },
    },
    orderBy: { number: 'desc' },
    take: 1,
  })

  let next = 1
  if (existing.length > 0) {
    const match = existing[0].number.match(/-(\d+)$/)
    if (match) next = parseInt(match[1], 10) + 1
  }

  return `${prefix}-${year}-${String(next).padStart(4, '0')}`
}

// ============= Currency formatting =============

/**
 * Sanitize text for WinAnsi encoding (pdf-lib default Helvetica).
 * Replaces Unicode characters that WinAnsi cannot encode with ASCII equivalents.
 */
function sanitizeText(text: string | undefined | null): string {
  if (!text) return ''
  return String(text)
    // Narrow no-break space (U+202F) — used by fr-FR toLocaleString as thousands separator
    .replace(/\u202F/g, ' ')
    // No-break space (U+00A0)
    .replace(/\u00A0/g, ' ')
    // Thin space, hair space, etc.
    .replace(/[\u2009\u200A\u200B\u200C\u200D\u2060]/g, '')
    // Curly quotes → straight quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Em/en dash → hyphen
    .replace(/[\u2013\u2014]/g, '-')
    // Ellipsis → ...
    .replace(/\u2026/g, '...')
    // Bullet → *
    .replace(/[\u2022\u25CF]/g, '*')
    // Copyright, trademark
    .replace(/\u00A9/g, '(c)')
    .replace(/\u00AE/g, '(R)')
    .replace(/\u2122/g, '(TM)')
    // Euro sign is OK in WinAnsi (0x80), keep it
    // Strip any remaining non-WinAnsi characters
    .replace(/[^\x20-\x7E\x80-\xFF]/g, '?')
}

/** Safe drawText wrapper that sanitizes text for WinAnsi encoding. */
function drawTextSafe(
  page: PDFPage,
  text: string,
  options: {
    x: number
    y: number
    size: number
    font: PDFFont
    color?: ReturnType<typeof rgb>
    opacity?: number
    rotate?: ReturnType<typeof degrees>
    align?: typeof TextAlignment
  }
): void {
  const sanitized = sanitizeText(text)
  // pdf-lib doesn't support align in drawText, we handle alignment manually for totals
  if (options.align === TextAlignment.Right) {
    const textWidth = options.font.widthOfTextAtSize(sanitized, options.size)
    page.drawText(sanitized, {
      ...options,
      x: options.x - textWidth,
    })
  } else {
    page.drawText(sanitized, options)
  }
}

function formatMoney(amount: number, currency: string): string {
  const symbols: Record<string, string> = { EUR: 'EUR', USD: 'USD', GBP: 'GBP', MAD: 'MAD', AED: 'AED', SAR: 'SAR' }
  const symbol = symbols[currency] || currency
  // Use 'en-US' formatting then replace comma with dot for FR style, avoids Unicode narrow no-break space (U+202F)
  const formatted = Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const result = currency === 'EUR' ? `${formatted} ${symbol}` : currency === 'USD' || currency === 'GBP' ? `${symbol} ${formatted}` : `${formatted} ${symbol}`
  return result
}

function formatDate(date: Date | undefined | null): string {
  if (!date) return '-'
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

// ============= Color palette =============

const COLORS = {
  primary: rgb(0.055, 0.725, 0.506),    // emerald-600 #10b981
  primaryDark: rgb(0.024, 0.588, 0.412), // emerald-700 #059669
  primaryLight: rgb(0.941, 0.992, 0.957), // emerald-50
  dark: rgb(0.059, 0.094, 0.165),        // slate-900 #0f172a
  gray: rgb(0.4, 0.447, 0.529),          // slate-500
  lightGray: rgb(0.635, 0.671, 0.737),   // slate-400
  border: rgb(0.902, 0.914, 0.933),      // slate-200
  veryLight: rgb(0.972, 0.976, 0.984),   // slate-50
  white: rgb(1, 1, 1),
  amber: rgb(0.949, 0.722, 0.149),       // amber-500
  purple: rgb(0.588, 0.345, 0.937),      // purple-600
  sky: rgb(0.027, 0.588, 0.902),         // sky-600
  rose: rgb(0.843, 0.211, 0.392),        // rose-600
}

// ============= PDF helpers =============

function drawHeader(page: PDFPage, fontBold: PDFFont, fontRegular: PDFFont, data: DocumentData, typeLabel: string, typeColor: ReturnType<typeof rgb>) {
  const { width } = page.getSize()

  // Top color band
  page.drawRectangle({
    x: 0,
    y: page.getHeight() - 110,
    width,
    height: 110,
    color: typeColor,
  })

  // Logo brand name
  page.drawText('HireNova', {
    x: 50,
    y: page.getHeight() - 50,
    size: 26,
    font: fontBold,
    color: COLORS.white,
  })

  page.drawText('by E-Society 2050', {
    x: 50,
    y: page.getHeight() - 70,
    size: 10,
    font: fontRegular,
    color: COLORS.white,
  })

  // Document type label (big)
  page.drawText(typeLabel.toUpperCase(), {
    x: width - 180,
    y: page.getHeight() - 50,
    size: 22,
    font: fontBold,
    color: COLORS.white,
  })

  // Document number
  page.drawText(data.number, {
    x: width - 180,
    y: page.getHeight() - 72,
    size: 11,
    font: fontRegular,
    color: COLORS.white,
  })

  // Issuer info (left side, below band)
  let yPos = page.getHeight() - 140
  const issuerName = data.issuerName || 'HireNova'
  const issuerLegal = data.issuerLegal || 'E-Society 2050'
  const issuerAddress = data.issuerAddress || 'Casablanca, Maroc'
  const issuerEmail = data.issuerEmail || 'hello@hirenova.com'

  page.drawText(issuerName, { x: 50, y: yPos, size: 11, font: fontBold, color: COLORS.dark })
  yPos -= 14
  page.drawText(issuerLegal, { x: 50, y: yPos, size: 9, font: fontRegular, color: COLORS.gray })
  yPos -= 12
  page.drawText(issuerAddress, { x: 50, y: yPos, size: 9, font: fontRegular, color: COLORS.gray })
  yPos -= 12
  page.drawText(issuerEmail, { x: 50, y: yPos, size: 9, font: fontRegular, color: COLORS.gray })

  // Recipient info (right side)
  yPos = page.getHeight() - 140
  page.drawText('ADRESSÉ À', { x: width - 250, y: yPos, size: 8, font: fontBold, color: COLORS.lightGray })
  yPos -= 16
  page.drawText(data.recipientName, { x: width - 250, y: yPos, size: 11, font: fontBold, color: COLORS.dark })
  yPos -= 14
  if (data.recipientCompany) {
    page.drawText(data.recipientCompany, { x: width - 250, y: yPos, size: 10, font: fontRegular, color: COLORS.gray })
    yPos -= 12
  }
  if (data.recipientAddress) {
    const addrLines = data.recipientAddress.split('\n').slice(0, 2)
    for (const line of addrLines) {
      page.drawText(line, { x: width - 250, y: yPos, size: 9, font: fontRegular, color: COLORS.gray })
      yPos -= 11
    }
  }
  if (data.recipientCountry) {
    page.drawText(data.recipientCountry, { x: width - 250, y: yPos, size: 9, font: fontRegular, color: COLORS.gray })
    yPos -= 11
  }
  page.drawText(data.recipientEmail, { x: width - 250, y: yPos, size: 9, font: fontRegular, color: COLORS.gray })

  return yPos
}

function drawMetaBox(page: PDFPage, fontBold: PDFFont, fontRegular: PDFFont, data: DocumentData, startY: number) {
  const { width } = page.getSize()
  const boxY = startY - 10
  const boxHeight = 60

  // Light gray box for meta info
  page.drawRectangle({
    x: 50,
    y: boxY - boxHeight,
    width: width - 100,
    height: boxHeight,
    color: COLORS.veryLight,
    borderColor: COLORS.border,
    borderWidth: 1,
  })

  // Subject
  page.drawText('Objet :', { x: 64, y: boxY - 16, size: 9, font: fontBold, color: COLORS.gray })
  page.drawText(data.subject, { x: 110, y: boxY - 16, size: 10, font: fontBold, color: COLORS.dark })

  // Issue date
  page.drawText('Date émission :', { x: 64, y: boxY - 32, size: 9, font: fontBold, color: COLORS.gray })
  page.drawText(formatDate(data.issueDate || new Date()), { x: 160, y: boxY - 32, size: 9, font: fontRegular, color: COLORS.dark })

  // Due date / validity
  const dueLabel = data.type === 'quote' ? 'Valable jusqu\'au :' : data.type === 'invoice' ? 'Échéance :' : 'Date :'
  const dueValue = data.type === 'quote'
    ? formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
    : formatDate(data.dueDate)
  page.drawText(dueLabel, { x: 320, y: boxY - 32, size: 9, font: fontBold, color: COLORS.gray })
  page.drawText(dueValue, { x: 410, y: boxY - 32, size: 9, font: fontRegular, color: COLORS.dark })

  // Status
  const statusLabel = data.type === 'receipt' ? 'Payé le :' : 'Statut :'
  const statusValue = data.type === 'receipt'
    ? formatDate(data.paidAt || new Date())
    : data.type === 'invoice' && data.paidAt
      ? `Payé le ${formatDate(data.paidAt)}`
      : 'En attente'
  page.drawText(statusLabel, { x: 64, y: boxY - 48, size: 9, font: fontBold, color: COLORS.gray })
  page.drawText(statusValue, { x: 160, y: boxY - 48, size: 9, font: fontBold, color: data.paidAt ? COLORS.primary : COLORS.amber })

  return boxY - boxHeight - 20
}

function drawItemsTable(page: PDFPage, fontBold: PDFFont, fontRegular: PDFFont, data: DocumentData, startY: number): number {
  const { width } = page.getSize()
  const tableX = 50
  const tableWidth = width - 100
  let yPos = startY

  // Table header
  page.drawRectangle({
    x: tableX,
    y: yPos - 22,
    width: tableWidth,
    height: 22,
    color: COLORS.primary,
  })

  page.drawText('Description', { x: tableX + 12, y: yPos - 15, size: 9, font: fontBold, color: COLORS.white })
  page.drawText('Qté', { x: tableX + tableWidth - 230, y: yPos - 15, size: 9, font: fontBold, color: COLORS.white })
  page.drawText('Prix unitaire', { x: tableX + tableWidth - 170, y: yPos - 15, size: 9, font: fontBold, color: COLORS.white })
  page.drawText('Total', { x: tableX + tableWidth - 70, y: yPos - 15, size: 9, font: fontBold, color: COLORS.white })

  yPos -= 22

  // Items rows
  let altRow = false
  let subtotal = 0
  for (const item of data.items) {
    const rowHeight = 28
    if (altRow) {
      page.drawRectangle({
        x: tableX,
        y: yPos - rowHeight,
        width: tableWidth,
        height: rowHeight,
        color: COLORS.veryLight,
      })
    }
    altRow = !altRow

    // Description (truncated if too long)
    const desc = item.description.length > 65 ? item.description.slice(0, 62) + '...' : item.description
    page.drawText(desc, { x: tableX + 12, y: yPos - 18, size: 9, font: fontRegular, color: COLORS.dark })

    page.drawText(String(item.quantity), { x: tableX + tableWidth - 230, y: yPos - 18, size: 9, font: fontRegular, color: COLORS.dark })
    page.drawText(formatMoney(item.unitPrice, data.currency), { x: tableX + tableWidth - 170, y: yPos - 18, size: 9, font: fontRegular, color: COLORS.dark })
    page.drawText(formatMoney(item.total, data.currency), { x: tableX + tableWidth - 70, y: yPos - 18, size: 9, font: fontBold, color: COLORS.dark })

    subtotal += item.total
    yPos -= rowHeight
  }

  // Border around table
  page.drawRectangle({
    x: tableX,
    y: yPos,
    width: tableWidth,
    height: startY - yPos,
    borderColor: COLORS.border,
    borderWidth: 1,
  })

  // Totals
  const taxRate = data.taxRate || 0
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount

  yPos -= 20
  const totalsX = tableX + tableWidth - 240

  // Subtotal
  page.drawText('Sous-total :', { x: totalsX, y: yPos, size: 10, font: fontRegular, color: COLORS.gray })
  page.drawText(formatMoney(subtotal, data.currency), { x: tableX + tableWidth - 12 - 90, y: yPos, size: 10, font: fontRegular, color: COLORS.dark, align: TextAlignment.Right })

  yPos -= 18
  if (taxRate > 0) {
    page.drawText(`TVA (${taxRate}%) :`, { x: totalsX, y: yPos, size: 10, font: fontRegular, color: COLORS.gray })
    page.drawText(formatMoney(taxAmount, data.currency), { x: tableX + tableWidth - 12 - 90, y: yPos, size: 10, font: fontRegular, color: COLORS.dark, align: TextAlignment.Right })
    yPos -= 18
  }

  // Total (highlighted)
  page.drawRectangle({
    x: totalsX - 12,
    y: yPos - 6,
    width: tableX + tableWidth - totalsX,
    height: 26,
    color: COLORS.primaryLight,
  })
  page.drawText('TOTAL :', { x: totalsX, y: yPos, size: 12, font: fontBold, color: COLORS.primaryDark })
  page.drawText(formatMoney(total, data.currency), { x: tableX + tableWidth - 12 - 90, y: yPos, size: 12, font: fontBold, color: COLORS.primaryDark, align: TextAlignment.Right })

  return yPos - 40
}

function drawFooter(page: PDFPage, fontBold: PDFFont, fontRegular: PDFFont, data: DocumentData) {
  const { width, height } = page.getSize()

  // Footer separator
  page.drawLine({
    start: { x: 50, y: 80 },
    end: { x: width - 50, y: 80 },
    thickness: 1,
    color: COLORS.border,
  })

  // Notes (if any)
  if (data.notes) {
    page.drawText('Notes :', { x: 50, y: 65, size: 8, font: fontBold, color: COLORS.gray })
    const noteText = data.notes.slice(0, 200)
    page.drawText(noteText, { x: 90, y: 65, size: 8, font: fontRegular, color: COLORS.gray })
  }

  // Legal info
  page.drawText('HireNova - E-Society 2050 | Casablanca, Maroc | hello@hirenova.com | https://hirenova.com', {
    x: 50,
    y: 45,
    size: 8,
    font: fontRegular,
    color: COLORS.lightGray,
  })

  page.drawText(`Document genere automatiquement par HireNova le ${formatDate(new Date())} - No ${data.number}`, {
    x: 50,
    y: 32,
    size: 7,
    font: fontRegular,
    color: COLORS.lightGray,
  })

  // Watermark diagonal (for non-final docs)
  if (data.type === 'quote') {
    page.drawText('DEVIS', {
      x: width / 2 - 80,
      y: height / 2,
      size: 80,
      font: fontBold,
      color: rgb(0.941, 0.969, 0.929),
      opacity: 0.4,
      rotate: degrees(45),
    })
  }
}

// ============= Main PDF generator =============

const TYPE_META: Record<DocumentType, { label: string; color: ReturnType<typeof rgb>; title: string }> = {
  invoice:     { label: 'Facture',       color: COLORS.primary,  title: 'FACTURE' },
  quote:       { label: 'Devis',         color: COLORS.sky,      title: 'DEVIS' },
  agreement:   { label: 'Contrat',       color: COLORS.purple,   title: 'CONTRAT' },
  receipt:     { label: 'Reçu',          color: COLORS.amber,    title: 'REÇU' },
  credit_note: { label: 'Avoir',         color: COLORS.rose,     title: 'AVOIR' },
}

async function buildPdf(rawData: DocumentData): Promise<Uint8Array> {
  // Sanitize user-provided data for PDF metadata (setTitle, setSubject, etc.)
  const data: DocumentData = {
    ...rawData,
    recipientName: sanitizeText(rawData.recipientName),
    recipientEmail: sanitizeText(rawData.recipientEmail),
    recipientCompany: sanitizeText(rawData.recipientCompany),
    recipientAddress: sanitizeText(rawData.recipientAddress),
    recipientCountry: sanitizeText(rawData.recipientCountry),
    subject: sanitizeText(rawData.subject),
    notes: sanitizeText(rawData.notes),
    agreementTerms: sanitizeText(rawData.agreementTerms),
    items: rawData.items.map((item) => ({
      ...item,
      description: sanitizeText(item.description),
    })),
  }

  const pdfDoc = await PDFDocument.create()
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

  pdfDoc.setTitle(sanitizeText(`${TYPE_META[data.type].label} ${data.number} - HireNova`))
  pdfDoc.setAuthor(sanitizeText('HireNova - E-Society 2050'))
  pdfDoc.setSubject(data.subject)
  pdfDoc.setCreator('HireNova Document Engine')
  pdfDoc.setProducer('HireNova Auto-Generator')
  pdfDoc.setCreationDate(new Date())

  const page = pdfDoc.addPage([595.28, 841.89]) // A4

  // CRITICAL: Override drawText to auto-sanitize ALL text for WinAnsi encoding.
  // This prevents "WinAnsi cannot encode" errors with Unicode chars (em dash, narrow no-break space, accented chars, etc.)
  // Also handles right-alignment manually since pdf-lib's drawText doesn't support align natively.
  const originalDrawText = page.drawText.bind(page)
  ;(page as any).drawText = (text: string, options: any) => {
    const sanitized = sanitizeText(text)
    if (options.align === TextAlignment.Right) {
      const textWidth = options.font.widthOfTextAtSize(sanitized, options.size)
      const { align, ...rest } = options
      return originalDrawText(sanitized, { ...rest, x: options.x - textWidth })
    }
    const { align, ...rest } = options
    return originalDrawText(sanitized, rest)
  }

  const meta = TYPE_META[data.type]
  let yPos = drawHeader(page, fontBold, fontRegular, data, meta.label, meta.color)
  yPos = drawMetaBox(page, fontBold, fontRegular, data, yPos)

  // For agreement type, draw contract clauses instead of items table
  if (data.type === 'agreement' && data.agreementTerms) {
    yPos = drawAgreementClauses(page, fontBold, fontRegular, fontItalic, data, yPos)
  } else {
    yPos = drawItemsTable(page, fontBold, fontRegular, data, yPos)
  }

  // Payment terms / acceptance block
  if (data.type === 'quote') {
    yPos = drawAcceptanceBlock(page, fontBold, fontRegular, yPos)
  } else if (data.type === 'invoice') {
    yPos = drawPaymentTerms(page, fontBold, fontRegular, data, yPos)
  }

  drawFooter(page, fontBold, fontRegular, data)

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

function drawAgreementClauses(
  page: PDFPage,
  fontBold: PDFFont,
  fontRegular: PDFFont,
  fontItalic: PDFFont,
  data: DocumentData,
  startY: number
): number {
  let yPos = startY

  page.drawText('CLAUSES DU CONTRAT', { x: 50, y: yPos, size: 11, font: fontBold, color: COLORS.primaryDark })
  yPos -= 20

  const terms = data.agreementTerms || ''
  const clauses = terms.split('\n\n').filter(Boolean)

  for (let i = 0; i < clauses.length; i++) {
    const clause = clauses[i]
    const title = `Article ${i + 1}`
    page.drawText(title, { x: 50, y: yPos, size: 10, font: fontBold, color: COLORS.dark })
    yPos -= 14

    // Wrap text
    const maxWidth = 495
    const words = clause.split(' ')
    let line = ''
    const lines: string[] = []
    for (const word of words) {
      const testLine = line ? line + ' ' + word : word
      try {
        const testWidth = fontRegular.widthOfTextAtSize(testLine, 9)
        if (testWidth > maxWidth) {
          if (line) lines.push(line)
          line = word
        } else {
          line = testLine
        }
      } catch {
        line = line ? line + ' ' + word : word
      }
    }
    if (line) lines.push(line)

    for (const ln of lines.slice(0, 6)) {
      page.drawText(ln.slice(0, 100), { x: 60, y: yPos, size: 9, font: fontRegular, color: COLORS.gray })
      yPos -= 12
    }
    yPos -= 8
    if (yPos < 180) break
  }

  // Signatures
  yPos = Math.max(yPos, 200)
  page.drawText('Signatures', { x: 50, y: yPos, size: 11, font: fontBold, color: COLORS.dark })
  yPos -= 20

  page.drawLine({ start: { x: 50, y: yPos }, end: { x: 230, y: yPos }, thickness: 1, color: COLORS.gray })
  page.drawLine({ start: { x: 320, y: yPos }, end: { x: 500, y: yPos }, thickness: 1, color: COLORS.gray })

  page.drawText('Pour HireNova', { x: 50, y: yPos - 14, size: 9, font: fontBold, color: COLORS.dark })
  page.drawText(data.recipientName, { x: 320, y: yPos - 14, size: 9, font: fontBold, color: COLORS.dark })

  page.drawText('Date : _______________', { x: 50, y: yPos - 30, size: 9, font: fontRegular, color: COLORS.gray })
  page.drawText('Date : _______________', { x: 320, y: yPos - 30, size: 9, font: fontRegular, color: COLORS.gray })

  return yPos - 50
}

function drawAcceptanceBlock(page: PDFPage, fontBold: PDFFont, fontRegular: PDFFont, startY: number): number {
  let yPos = startY
  const { width } = page.getSize()

  page.drawRectangle({
    x: 50,
    y: yPos - 80,
    width: width - 100,
    height: 80,
    color: COLORS.veryLight,
    borderColor: COLORS.border,
    borderWidth: 1,
  })

  page.drawText('BON POUR ACCORD', { x: 64, y: yPos - 16, size: 10, font: fontBold, color: COLORS.primaryDark })
  page.drawText('Ce devis est valable 30 jours. Pour accepter, signez et renvoyez-le à hello@hirenova.com', {
    x: 64, y: yPos - 32, size: 9, font: fontRegular, color: COLORS.gray,
  })

  page.drawLine({ start: { x: 64, y: yPos - 56 }, end: { x: 250, y: yPos - 56 }, thickness: 1, color: COLORS.gray })
  page.drawLine({ start: { x: 320, y: yPos - 56 }, end: { x: width - 64, y: yPos - 56 }, thickness: 1, color: COLORS.gray })
  page.drawText('Signature du client', { x: 64, y: yPos - 68, size: 8, font: fontRegular, color: COLORS.gray })
  page.drawText('Date', { x: 320, y: yPos - 68, size: 8, font: fontRegular, color: COLORS.gray })

  return yPos - 100
}

function drawPaymentTerms(page: PDFPage, fontBold: PDFFont, fontRegular: PDFFont, data: DocumentData, startY: number): number {
  let yPos = startY
  page.drawText('Modalités de paiement', { x: 50, y: yPos, size: 10, font: fontBold, color: COLORS.dark })
  yPos -= 14
  page.drawText('Paiement à réception. CB, virement ou prélèvement SEPA via la plateforme HireNova.', {
    x: 50, y: yPos, size: 9, font: fontRegular, color: COLORS.gray,
  })
  yPos -= 12
  page.drawText('Passé l\'échéance, des pénalités de retard s\'appliquent (taux légal en vigueur).', {
    x: 50, y: yPos, size: 9, font: fontRegular, color: COLORS.gray,
  })
  return yPos - 20
}

// ============= Public API =============

/**
 * Generate a document PDF and persist it in the database.
 * Returns the generated document with PDF base64.
 */
export async function generateDocument(data: DocumentData): Promise<GeneratedDocument> {
  const pdfBytes = await buildPdf(data)
  const pdfBase64 = Buffer.from(pdfBytes).toString('base64')

  // Calculate totals
  const subtotal = data.items.reduce((sum, item) => sum + item.total, 0)
  const taxRate = data.taxRate || 0
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount

  // Persist to DB
  const doc = await db.document.create({
    data: {
      type: data.type,
      number: data.number,
      recipientName: data.recipientName,
      recipientEmail: data.recipientEmail,
      recipientCompany: data.recipientCompany || null,
      recipientAddress: data.recipientAddress || null,
      recipientCountry: data.recipientCountry || null,
      issuerName: data.issuerName || 'HireNova',
      issuerLegal: data.issuerLegal || 'E-Society 2050',
      issuerAddress: data.issuerAddress || 'Casablanca, Maroc',
      issuerEmail: data.issuerEmail || 'hello@hirenova.com',
      issuerVAT: data.issuerVAT,
      subject: data.subject,
      items: JSON.stringify(data.items),
      currency: data.currency,
      subtotal,
      taxRate,
      taxAmount,
      total,
      status: 'draft',
      issueDate: data.issueDate || new Date(),
      dueDate: data.dueDate || null,
      paidAt: data.paidAt || null,
      userId: data.userId || null,
      inquiryId: data.inquiryId || null,
      pdfBase64,
      notes: data.notes || null,
    },
  })

  return {
    id: doc.id,
    number: doc.number,
    type: doc.type as DocumentType,
    pdfBase64,
    total,
  }
}

/**
 * Generate an invoice automatically when a payment succeeds.
 */
export async function generateInvoiceForPayment(params: {
  userEmail: string
  userName: string
  plan: string
  amount: number
  currency: string
  userId?: string
  paidAt?: Date
}): Promise<GeneratedDocument> {
  const number = await nextDocumentNumber('invoice')
  const planLabels: Record<string, string> = {
    starter: 'HireNova Starter',
    pro: 'HireNova Pro',
    career_plus: 'HireNova Career+',
    employer: 'HireNova Employeur',
    annual: 'HireNova Annuel',
    enterprise: 'HireNova Enterprise',
    api: 'HireNova API',
  }

  return generateDocument({
    type: 'invoice',
    number,
    recipientName: params.userName,
    recipientEmail: params.userEmail,
    subject: `Abonnement ${planLabels[params.plan] || params.plan} — 1 mois`,
    items: [{
      description: `Abonnement ${planLabels[params.plan] || params.plan} — paiement mensuel`,
      quantity: 1,
      unitPrice: params.amount,
      total: params.amount,
    }],
    currency: params.currency,
    taxRate: 0,
    paidAt: params.paidAt || new Date(),
    userId: params.userId,
    notes: 'Paiement reçu via la plateforme HireNova. Merci de votre confiance.',
  })
}

/**
 * Generate a quote (devis) from an Enterprise inquiry.
 */
export async function generateQuoteForInquiry(params: {
  inquiryId: string
  contactName: string
  workEmail: string
  companyName: string
  country?: string
  usersCount?: string
  useCase?: string
  items: DocumentItem[]
  currency?: string
  notes?: string
}): Promise<GeneratedDocument> {
  const number = await nextDocumentNumber('quote')

  return generateDocument({
    type: 'quote',
    number,
    recipientName: params.contactName,
    recipientEmail: params.workEmail,
    recipientCompany: params.companyName,
    recipientCountry: params.country,
    subject: `Proposition commerciale Enterprise — ${params.companyName}`,
    items: params.items,
    currency: params.currency || 'EUR',
    taxRate: 0,
    inquiryId: params.inquiryId,
    notes: params.notes || `Devis valable 30 jours. Basé sur : ${params.usersCount || 'N/A'} utilisateurs, cas d'usage : ${params.useCase || 'N/A'}.`,
  })
}

/**
 * Generate a receipt for a payment.
 */
export async function generateReceiptForPayment(params: {
  userEmail: string
  userName: string
  amount: number
  currency: string
  description: string
  userId?: string
  paidAt?: Date
}): Promise<GeneratedDocument> {
  const number = await nextDocumentNumber('receipt')

  return generateDocument({
    type: 'receipt',
    number,
    recipientName: params.userName,
    recipientEmail: params.userEmail,
    subject: `Reçu de paiement — ${params.description}`,
    items: [{
      description: params.description,
      quantity: 1,
      unitPrice: params.amount,
      total: params.amount,
    }],
    currency: params.currency,
    taxRate: 0,
    paidAt: params.paidAt || new Date(),
    userId: params.userId,
    notes: 'Ce reçu atteste du paiement effectué sur la plateforme HireNova.',
  })
}

/**
 * Generate an agreement (contrat) when a quote is accepted.
 */
export async function generateAgreementForInquiry(params: {
  inquiryId: string
  contactName: string
  workEmail: string
  companyName: string
  country?: string
  totalAmount: number
  currency?: string
  terms?: string
}): Promise<GeneratedDocument> {
  const number = await nextDocumentNumber('agreement')
  const currency = params.currency || 'EUR'

  const defaultTerms = `OBJET DU CONTRAT
Le présent contrat a pour objet la fourniture par HireNova (E-Society 2050) à ${params.companyName} des services de la plateforme Enterprise, incluant notamment l'accès à la génération de CV IA, l'analyse ATS, le portail de recrutement, l'intégration API, et le support dédié.

DURÉE
Le contrat est conclu pour une durée de 12 mois renouvelable par tacite reconduction. Chaque partie peut le résilier avec un préavis de 30 jours avant l'échéance.

TARIF
Le montant annuel est de ${params.totalAmount} ${currency}, payable d'avance. Facturation mensuelle possible sur demande.

ENGAGEMENTS DE HIRENOVA
HireNova s'engage à fournir un service disponible à 99,9% (SLA), un support dédié 24/7, la formation des équipes, et la sécurité des données conformément au RGPD.

ENGAGEMENTS DU CLIENT
Le client s'engage à utiliser le service conformément aux CGU, à désigner un administrateur, et à assurer le paiement aux échéances.

CONFIDENTIALITÉ ET DONNÉES
Chaque partie s'engage à préserver la confidentialité des informations échangées. Les données personnelles sont traitées conformément au RGPD et à la politique de confidentialité HireNova.

RÉSILIATION
En cas de manquement, une mise en demeure préalable de 30 jours est requise. Les sommes versées restent acquises.

LITIGES
Le présent contrat est soumis au droit marocain. Tout litige sera porté devant les tribunaux de Casablanca.`

  return generateDocument({
    type: 'agreement',
    number,
    recipientName: params.contactName,
    recipientEmail: params.workEmail,
    recipientCompany: params.companyName,
    recipientCountry: params.country,
    subject: `Contrat de services Enterprise — ${params.companyName}`,
    items: [{
      description: `Abonnement Enterprise annuel — ${params.companyName}`,
      quantity: 1,
      unitPrice: params.totalAmount,
      total: params.totalAmount,
    }],
    currency,
    taxRate: 0,
    inquiryId: params.inquiryId,
    agreementTerms: params.terms || defaultTerms,
    notes: 'Contrat généré automatiquement après acceptation du devis. À signer et retourner à hello@hirenova.com',
  })
}
