import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Printer,
  Download,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
} from 'lucide-react';
import { getInvoices, formatCurrency, formatDate } from '../utils/storage';
import { TaxInvoice } from '../types';
import { logoImg } from '../assets/images';
import { useToast } from '../components/Toast';
import './InvoicePage.css';

export const InvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<TaxInvoice | null>(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const allInvoices = getInvoices();
    if (id) {
      const found = allInvoices.find((inv) => inv.id === id || inv.invoiceNumber === id);
      if (found) {
        setInvoice(found);
      } else if (allInvoices.length > 0) {
        setInvoice(allInvoices[0]);
      }
    } else if (allInvoices.length > 0) {
      setInvoice(allInvoices[0]);
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    toast.success('Official GST Tax Invoice PDF downloaded.');
  };

  if (!invoice) {
    return (
      <div className="container invoice-error-container">
        <h3>Invoice Not Found</h3>
        <p>The requested invoice could not be located in your billing history.</p>
        <Link to="/dashboard" className="btn btn-primary">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const cgst = Math.round(invoice.gstAmount / 2);
  const sgst = Math.round(invoice.gstAmount / 2);

  return (
    <div className="invoice-page">
      <div className="container">
        {/* Navigation & Action Bar */}
        <div className="invoice-action-bar flex-between no-print">
          <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="action-btns">
            <button onClick={handleDownloadPDF} className="btn btn-outline btn-sm">
              <Download size={16} /> Download PDF
            </button>
            <button onClick={handlePrint} className="btn btn-primary btn-sm">
              <Printer size={16} /> Print Official Invoice
            </button>
          </div>
        </div>

        {/* Invoice Printable Card */}
        <div className="invoice-document" id="printable-invoice">
          {/* Header */}
          <div className="invoice-header flex-between">
            <div className="invoice-brand-col">
              <img src={logoImg} alt="TaxVantage" className="invoice-logo" />
              <p className="company-legal-name">TaxVantage Technologies Private Limited</p>
              <p className="company-address">
                Level 8, Prestige Towers, Residency Road, Bengaluru, Karnataka 560025
              </p>
              <p className="company-gstin">
                <strong>GSTIN:</strong> 29AABCT1234F1Z8 • <strong>PAN:</strong> AABCT1234F
              </p>
            </div>

            <div className="invoice-meta-col text-right">
              <span className="tax-invoice-badge">TAX INVOICE</span>
              <h3 className="invoice-number">{invoice.invoiceNumber}</h3>
              <p className="invoice-date">
                <strong>Invoice Date:</strong> {formatDate(invoice.invoiceDate)}
              </p>
              <p className="invoice-case-ref">
                <strong>Case Ref:</strong> #{invoice.caseId}
              </p>
              <div className="paid-stamp">
                <CheckCircle2 size={16} /> PAID
              </div>
            </div>
          </div>

          <div className="invoice-divider"></div>

          {/* Client & CA Information Grid */}
          <div className="invoice-parties-grid">
            <div className="bill-to-box">
              <span className="party-title">Billed To (Taxpayer):</span>
              <h4 className="party-name">{invoice.userName}</h4>
              <p>Email: {invoice.userEmail}</p>
              <p>Mobile: {invoice.userMobile}</p>
              <p>Permanent Account Number: <strong>{invoice.userPan}</strong></p>
            </div>

            <div className="ca-certified-box">
              <span className="party-title">Certifying Chartered Accountant:</span>
              <h4 className="party-name">{invoice.caName}</h4>
              <p>ICAI Membership No: <strong>{invoice.caRegNumber}</strong></p>
              <p>Service: {invoice.serviceTitle}</p>
              <p>Financial Year: <strong>{invoice.financialYear} ({invoice.assessmentYear})</strong></p>
            </div>
          </div>

          {/* Itemized Fee Breakdown Table */}
          <div className="invoice-table-wrapper">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service Description</th>
                  <th>SAC Code</th>
                  <th>Assessment Year</th>
                  <th style={{ textAlign: 'right' }}>Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    <strong>{invoice.serviceTitle}</strong>
                    <div className="item-subdesc">
                      Preparation, CA computation, deduction audit, and e-filing of Income Tax Return under Section 139(1) / 139(8A).
                    </div>
                  </td>
                  <td>998311 (Accounting/Auditing)</td>
                  <td>{invoice.assessmentYear}</td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(invoice.fee)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Calculations & Totals */}
          <div className="invoice-summary-grid">
            <div className="invoice-payment-info">
              <span className="party-title">Payment Information:</span>
              <p>Transaction ID: <strong>{invoice.transactionId}</strong></p>
              <p>Payment Channel: <strong>{invoice.paymentMethod}</strong></p>
              <p>Payment Status: <strong className="text-success">{invoice.paymentStatus}</strong></p>
              <p>Date: {formatDate(invoice.paymentDate)}</p>
              <div className="ssl-seal-note">
                <Lock size={12} /> Digimarc Authenticated Electronic Invoice
              </div>
            </div>

            <div className="invoice-totals-box">
              <div className="total-row">
                <span>Taxable Amount</span>
                <span>{formatCurrency(invoice.fee)}</span>
              </div>
              <div className="total-row">
                <span>Central GST (CGST @ 9%)</span>
                <span>{formatCurrency(cgst)}</span>
              </div>
              <div className="total-row">
                <span>State GST (SGST @ 9%)</span>
                <span>{formatCurrency(sgst)}</span>
              </div>
              <div className="total-divider"></div>
              <div className="total-row grand-total flex-between">
                <strong>Total Amount Paid</strong>
                <strong className="grand-total-val">{formatCurrency(invoice.totalAmount)}</strong>
              </div>
            </div>
          </div>

          {/* Signatory & Notes */}
          <div className="invoice-footer-signatures flex-between">
            <div className="terms-column">
              <p className="terms-heading">Statutory Terms &amp; Conditions:</p>
              <ol className="terms-list">
                <li>This is an electronically generated Tax Invoice under Section 31 of the CGST Act, 2017.</li>
                <li>Professional services rendered by empaneled Chartered Accountants adhering to ICAI Code of Ethics.</li>
                <li>For any billing clarification, reach out to billing@taxvantage.in within 7 days.</li>
              </ol>
            </div>

            <div className="signatory-column text-right">
              <div className="sign-seal-box">
                <ShieldCheck size={32} className="text-success" />
                <span className="authorized-tag">TaxVantage Digitally Signed</span>
              </div>
              <p className="signatory-title">Authorized Signatory</p>
              <small>TaxVantage Technologies Pvt Ltd</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
