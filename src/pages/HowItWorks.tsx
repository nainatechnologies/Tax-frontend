import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  UploadCloud,
  UserCheck,
  Search,
  AlertCircle,
  CheckCircle,
  CreditCard,
  FileText,
  Award,
  ShieldCheck,
  ArrowRight,
  Lock,
} from 'lucide-react';
import './HowItWorks.css';

export const HowItWorks: React.FC = () => {
  const STAGES = [
    {
      num: '01',
      icon: FileCheck,
      title: 'Choose Your Service Plan',
      desc: 'Select from specialized ITR filing options tailored for salaried employees, capital gains traders, freelancers (44ADA), or private limited entities.',
      detail: 'Clear upfront pricing with no hidden charges or upsells.',
    },
    {
      num: '02',
      icon: UploadCloud,
      title: 'Encrypted Vault Upload',
      desc: 'Drop your Form 16, bank statements, trading P&L reports, and deduction proofs into your private 256-bit encrypted document vault.',
      detail: 'Bank-grade security with masked PAN/Aadhaar identity storage.',
    },
    {
      num: '03',
      icon: UserCheck,
      title: 'Dedicated CA Allocation',
      desc: 'Our admin desk reviews your taxpayer profile and assigns an empaneled Chartered Accountant with matching domain expertise.',
      detail: 'Empaneled FCAs with 8+ years average experience.',
    },
    {
      num: '04',
      icon: Search,
      title: 'CA Review & Computation',
      desc: 'Your CA cross-references your Form 26AS, AIS/TIS data, optimizes deductions under Chapter VI-A, and tests Old vs New tax regimes.',
      detail: 'Dual-layer review ensures 100% calculation accuracy.',
    },
    {
      num: '05',
      icon: AlertCircle,
      title: 'Additional Proofs (If Required)',
      desc: 'If any discrepancy, mismatch, or extra deduction proof is needed, your CA sends an instant notification through the portal.',
      detail: 'Direct one-click upload for requested audit proofs.',
    },
    {
      num: '06',
      icon: CheckCircle,
      title: 'Draft Finalization',
      desc: 'Your CA prepares the final income computation sheet detailing gross income, deductions, TDS credits, and net tax refund due.',
      detail: 'Transparent tax computation statement delivered to your dashboard.',
    },
    {
      num: '07',
      icon: CreditCard,
      title: 'Professional Fee Payment',
      desc: 'Review your completed draft and settle the transparent CA fee via UPI, Credit/Debit Card, or Net Banking.',
      detail: 'Encrypted gateway with immediate payment confirmation.',
    },
    {
      num: '08',
      icon: FileText,
      title: 'Official GST Tax Invoice',
      desc: 'Instantly download your compliant GST tax invoice with SAC code 998311 for your business or personal records.',
      detail: 'Digitally signed and verifiable tax receipt.',
    },
    {
      num: '09',
      icon: Award,
      title: 'Official E-Filing on IT Portal',
      desc: 'Your CA logs into the official Income Tax Department e-filing system, submits the XML/JSON return schema, and verifies upload.',
      detail: 'Statutory compliance under Section 139 of Income Tax Act.',
    },
    {
      num: '10',
      icon: ShieldCheck,
      title: 'Return Filed & Ack Archived',
      desc: 'The official 15-digit ITR-V acknowledgement number is stored permanently in your TaxVantage dashboard for future reference.',
      detail: 'Instant SMS & email confirmation with ITR-V download link.',
    },
  ];

  return (
    <div className="how-it-works-page">
      {/* Header */}
      <section className="page-header-section">
        <div className="container text-center">
          <span className="section-tag">Chartered Accountant Workflow</span>
          <h1 className="page-title">The 10-Stage CA Precision Workflow</h1>
          <p className="page-subtitle">
            From initial document upload to final ITR-V acknowledgement, discover how our structured process ensures maximum refunds and zero statutory notices.
          </p>
        </div>
      </section>

      {/* 10-Stage Grid */}
      <section className="section stages-section">
        <div className="container">
          <div className="stages-timeline">
            {STAGES.map((stg, idx) => {
              const Icon = stg.icon;
              return (
                <div key={idx} className="stage-timeline-card">
                  <div className="stage-num-badge">{stg.num}</div>
                  <div className="stage-icon-wrap">
                    <Icon size={24} />
                  </div>
                  <div className="stage-body">
                    <h3>{stg.title}</h3>
                    <p className="stage-desc">{stg.desc}</p>
                    <div className="stage-highlight">
                      <ShieldCheck size={14} className="text-success" />
                      <span>{stg.detail}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box">
            <span className="cta-eyebrow">Ready for Seamless Tax Compliance?</span>
            <h2 className="cta-title">Start Your Assessment Year 2024-25 Return</h2>
            <p className="cta-description">
              Upload your Form 16 in our encrypted vault and get paired with a licensed CA in under 5 minutes.
            </p>
            <div className="cta-buttons-row">
              <Link to="/register" className="btn btn-accent btn-lg">
                Start Tax Filing <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="btn btn-outline btn-lg cta-outline">
                Explore All Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
