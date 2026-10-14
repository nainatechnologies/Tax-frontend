import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { TaxCase, TaxInvoice } from '../types';
import { createInvoice, formatCurrency } from '../utils/storage';
import { useToast } from './Toast';
import { Modal } from './Modal';
import { useNavigate } from 'react-router-dom';
import './PaymentModal.css';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxCase: TaxCase;
  onPaymentSuccess: (invoiceId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  taxCase,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8891');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSimulatePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
      const newInvoice: TaxInvoice = {
        id: invoiceId,
        caseId: taxCase.id,
        invoiceNumber: `TAX-INV-${new Date().getFullYear()}-${invoiceId.replace('INV-', '')}`,
        invoiceDate: new Date().toISOString().split('T')[0],
        userId: taxCase.userId,
        userName: taxCase.userName,
        userEmail: taxCase.userEmail,
        userMobile: taxCase.userMobile,
        userPan: 'ABCPS1234F',
        serviceTitle: taxCase.serviceTitle,
        financialYear: taxCase.financialYear,
        assessmentYear: taxCase.assessmentYear,
        caName: taxCase.caName || 'CA Rajesh Verma (FCA)',
        caRegNumber: taxCase.caRegNumber || 'FCA-48201',
        fee: taxCase.fee,
        gstRate: 18,
        gstAmount: taxCase.gst,
        totalAmount: taxCase.totalAmount,
        paymentStatus: 'PAID',
        transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        paymentDate: new Date().toISOString(),
        paymentMethod: paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod === 'card' ? 'Credit Card' : 'NetBanking',
      };

      createInvoice(newInvoice);
      setIsProcessing(false);
      toast.success('Payment completed successfully.');
      onPaymentSuccess(invoiceId);
      onClose();
      navigate(`/invoice/${invoiceId}`);
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete CA Professional Fee Payment"
      subtitle={`Case #${taxCase.id} • ${taxCase.serviceTitle} (${taxCase.financialYear})`}
      size="md"
    >
      <div className="payment-modal-body">
        {/* Breakdown Card */}
        <div className="fee-breakdown-card">
          <div className="breakdown-row">
            <span>CA Filing &amp; Verification Fee</span>
            <span>{formatCurrency(taxCase.fee)}</span>
          </div>
          <div className="breakdown-row">
            <span>GST (18% Statutory CGST + SGST)</span>
            <span>{formatCurrency(taxCase.gst)}</span>
          </div>
          <div className="breakdown-divider"></div>
          <div className="breakdown-total flex-between">
            <strong>Total Payable Amount</strong>
            <strong className="total-value">{formatCurrency(taxCase.totalAmount)}</strong>
          </div>
        </div>

        {/* Method selector */}
        <div className="payment-method-selector">
          <label className="form-label">Select Payment Channel (Simulated Demo)</label>
          <div className="method-pills">
            <button
              type="button"
              className={`method-pill ${paymentMethod === 'upi' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('upi')}
            >
              UPI / QR
            </button>
            <button
              type="button"
              className={`method-pill ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              Debit / Credit Card
            </button>
            <button
              type="button"
              className={`method-pill ${paymentMethod === 'netbanking' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('netbanking')}
            >
              Net Banking
            </button>
          </div>
        </div>

        {paymentMethod === 'upi' && (
          <div className="form-group">
            <label className="form-label">Virtual Payment Address (VPA / UPI ID)</label>
            <input
              type="text"
              className="form-input"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input
              type="text"
              className="form-input"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
        )}

        <div className="payment-guarantee-note">
          <Lock size={16} className="text-success" />
          <span>256-Bit SSL Encrypted Sandbox Gateway. Instant official GST invoice generated upon confirmation.</span>
        </div>

        <div className="modal-actions-bar">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isProcessing}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-success btn-lg"
            onClick={handleSimulatePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing Transaction...' : `Pay ${formatCurrency(taxCase.totalAmount)} Now`}
          </button>
        </div>
      </div>
    </Modal>
  );
};
