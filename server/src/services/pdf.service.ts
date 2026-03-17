import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { createLogger } from '../utils/logger';

const logger = createLogger('PdfService');

const INVOICES_DIR = path.join(process.cwd(), 'storage', 'invoices');

// Créer le dossier si nécessaire
if (!fs.existsSync(INVOICES_DIR)) {
  fs.mkdirSync(INVOICES_DIR, { recursive: true });
}

interface InvoiceData {
  invoiceNumber: string;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerAddress?: string | null;
  customerPhone?: string | null;
  description: string;
  plan: string;
  amountHT: number | string;
  tvaRate: number | string;
  tvaAmount: number | string;
  amountTTC: number | string;
  currency: string;
  periodStart?: Date | null;
  periodEnd?: Date | null;
  paidAt?: Date | null;
  status: string;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}

function formatAmount(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/**
 * Génère un PDF de facture et retourne le chemin du fichier
 */
export async function generateInvoicePdf(invoice: InvoiceData): Promise<string> {
  const fileName = `${invoice.invoiceNumber}.pdf`;
  const filePath = path.join(INVOICES_DIR, fileName);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const gold = '#D4A843';
    const dark = '#1A3A5C';
    const gray = '#6b7280';

    // --- En-tête ---
    doc.rect(0, 0, 595.28, 80).fill(dark);
    doc.fontSize(22).fillColor(gold).text('CGI 242', 50, 25, { width: 495, align: 'left' });
    doc.fontSize(9).fillColor('#e8e6e1').text('Code Général des Impôts du Congo — NORMX AI', 50, 52, { width: 495 });
    doc.fontSize(9).fillColor('#e8e6e1').text('FACTURE', 50, 25, { width: 495, align: 'right' });

    // --- Infos facture ---
    let y = 100;
    doc.fillColor(dark).fontSize(11).font('Helvetica-Bold');
    doc.text(`Facture N° ${invoice.invoiceNumber}`, 50, y);
    doc.font('Helvetica').fontSize(9).fillColor(gray);
    y += 20;
    doc.text(`Date d'émission : ${formatDate(invoice.createdAt)}`, 50, y);
    if (invoice.paidAt) {
      y += 14;
      doc.text(`Date de paiement : ${formatDate(invoice.paidAt)}`, 50, y);
    }
    if (invoice.periodStart && invoice.periodEnd) {
      y += 14;
      doc.text(`Période : du ${formatDate(invoice.periodStart)} au ${formatDate(invoice.periodEnd)}`, 50, y);
    }

    // --- Émetteur / Client ---
    y += 35;
    const colLeft = 50;
    const colRight = 310;

    doc.fontSize(9).font('Helvetica-Bold').fillColor(gold).text('ÉMETTEUR', colLeft, y);
    doc.font('Helvetica').fillColor(dark).fontSize(9);
    y += 16;
    doc.text('NORMX AI', colLeft, y);
    doc.text('Brazzaville, République du Congo', colLeft, y + 13);
    doc.text('info-contact@normx-ai.com', colLeft, y + 26);

    doc.fontSize(9).font('Helvetica-Bold').fillColor(gold).text('CLIENT', colRight, y - 16);
    doc.font('Helvetica').fillColor(dark).fontSize(9);
    doc.text(invoice.customerName, colRight, y);
    doc.text(invoice.customerEmail, colRight, y + 13);
    if (invoice.customerAddress) doc.text(invoice.customerAddress, colRight, y + 26);
    if (invoice.customerPhone) doc.text(invoice.customerPhone, colRight, y + 39);

    // --- Tableau ---
    y += 70;
    // En-tête tableau
    doc.rect(50, y, 495, 25).fill(dark);
    doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold');
    doc.text('Description', 60, y + 7, { width: 250 });
    doc.text('Montant HT', 350, y + 7, { width: 100, align: 'right' });
    doc.text('Total', 450, y + 7, { width: 85, align: 'right' });

    // Ligne
    y += 25;
    doc.fillColor(dark).font('Helvetica').fontSize(9);
    doc.rect(50, y, 495, 30).fill('#f9fafb');
    doc.fillColor(dark);
    doc.text(invoice.description, 60, y + 8, { width: 280 });
    doc.text(`${formatAmount(invoice.amountHT)} ${invoice.currency}`, 350, y + 8, { width: 100, align: 'right' });
    doc.text(`${formatAmount(invoice.amountHT)} ${invoice.currency}`, 450, y + 8, { width: 85, align: 'right' });

    // Sous-total / TVA / Total
    y += 45;
    doc.fontSize(9).fillColor(gray);
    doc.text('Sous-total HT', 350, y, { width: 100, align: 'right' });
    doc.text(`${formatAmount(invoice.amountHT)} ${invoice.currency}`, 450, y, { width: 85, align: 'right' });

    y += 16;
    doc.text(`TVA (${invoice.tvaRate}%)`, 350, y, { width: 100, align: 'right' });
    doc.text(`${formatAmount(invoice.tvaAmount)} ${invoice.currency}`, 450, y, { width: 85, align: 'right' });

    y += 20;
    doc.rect(340, y - 3, 205, 22).fill(gold);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10);
    doc.text('Total TTC', 350, y, { width: 100, align: 'right' });
    doc.text(`${formatAmount(invoice.amountTTC)} ${invoice.currency}`, 450, y, { width: 85, align: 'right' });

    // --- Statut ---
    y += 40;
    const statusLabel = invoice.status === 'PAID' ? 'PAYÉE' :
      invoice.status === 'SENT' ? 'ENVOYÉE' :
      invoice.status === 'CANCELLED' ? 'ANNULÉE' :
      invoice.status === 'DRAFT' ? 'BROUILLON' : 'GÉNÉRÉE';
    const statusColor = invoice.status === 'PAID' ? '#16a34a' :
      invoice.status === 'CANCELLED' ? '#dc2626' : gold;
    doc.fontSize(11).fillColor(statusColor).font('Helvetica-Bold');
    doc.text(`Statut : ${statusLabel}`, 50, y);

    // --- Pied de page ---
    const footerY = 750;
    doc.fontSize(8).font('Helvetica').fillColor(gray);
    doc.text('NORMX AI — Brazzaville, République du Congo', 50, footerY, { width: 495, align: 'center' });
    doc.text('info-contact@normx-ai.com | facturation@normx-ai.com', 50, footerY + 12, { width: 495, align: 'center' });

    doc.end();

    stream.on('finish', () => {
      logger.info(`PDF généré : ${filePath}`);
      resolve(filePath);
    });
    stream.on('error', reject);
  });
}
