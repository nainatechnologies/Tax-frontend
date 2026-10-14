import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  FileText,
  UserCheck,
  TrendingUp,
  Building2,
  Briefcase,
  Lock,
  Star,
  Check,
  Zap,
  HelpCircle,
  Award,
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { TAX_SERVICES } from '../data/services';
import { TESTIMONIALS } from '../data/mockData';
import { Modal } from '../components/Modal';
import { TaxService } from '../types';
import { securityImg, aboutImg } from '../assets/images';
import { formatCurrency, getCurrentUser } from '../utils/storage';
import './Home.css';

export const Home: React.FC = () => {
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<TaxService | null>(null);
  const navigate = useNavigate();

  const handleStartFiling = (serviceId: string) => {
    const user = getCurrentUser();
    if (user) {
      navigate(`/dashboard?openNewCase=${serviceId}`);
    } else {
      navigate(`/register?service=${serviceId}`);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <Hero />



      {/* Core Tax Services Showcase */}
      <section className="section services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Chartered Accountant Services</span>
            <h2 className="section-title">Comprehensive Tax &amp; ITR Solutions</h2>
            <p className="section-description">
              Choose from specialized tax filing and advisory packages tailored to salaried professionals, freelancers, investors, and corporate businesses.
            </p>
          </div>

          <div className="services-cards-grid">
            {TAX_SERVICES.map((srv) => (
              <div key={srv.id} className="tax-service-card">
                {srv.badge && <span className="service-badge">{srv.badge}</span>}
                <div className="service-card-top">
                  <div className="service-icon-box">
                    <FileText size={24} />
                  </div>
                  <span className="service-category">{srv.category}</span>
                </div>

                <h3 className="service-title">{srv.title}</h3>
                <p className="service-desc">{srv.shortDesc}</p>

                <div className="service-pricing-row">
                  <div>
                    <span className="price-label">Starting From</span>
                    <span className="price-val">{formatCurrency(srv.startingPrice)}</span>
                  </div>
                  <span className="turnaround-tag">{srv.turnaroundTime}</span>
                </div>

                <div className="service-features-list">
                  {srv.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="service-feat-item">
                      <Check size={14} className="text-success" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="service-card-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setSelectedServiceForModal(srv)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleStartFiling(srv.id)}
                  >
                    Get Started <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works 10-Stage Process Breakdown */}
      <section className="section section-alt how-it-works-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Seamless 10-Stage Journey</span>
            <h2 className="section-title">How Your Tax Return Gets Filed</h2>
            <p className="section-description">
              Our streamlined end-to-end Chartered Accountant workflow ensures 100% filing accuracy with zero hassles.
            </p>
          </div>

          <div className="process-steps-grid">
            {[
              { num: '01', title: 'Create Account', desc: 'Register in seconds with basic KYC info.' },
              { num: '02', title: 'Select Service', desc: 'Choose your ITR type or advisory package.' },
              { num: '03', title: 'Upload Docs', desc: 'Drop Form 16, Bank statements, PAN into vault.' },
              { num: '04', title: 'Admin Assigns CA', desc: 'A dedicated specialized CA is allocated.' },
              { num: '05', title: 'CA Reviews', desc: 'Your CA computes taxes & maximizes deductions.' },
              { num: '06', title: 'Addl Docs (If Needed)', desc: 'Upload extra proofs if CA requires verification.' },
              { num: '07', title: 'Work Completed', desc: 'CA finalizes draft computations and ITR summary.' },
              { num: '08', title: 'Payment', desc: 'Review transparent quote and pay professional fee.' },
              { num: '09', title: 'Invoice', desc: 'Download official tax invoice with GST breakdown.' },
              { num: '10', title: 'Filing Completed', desc: 'ITR e-filed on IT Dept portal with Ack number.' },
            ].map((step, idx) => (
              <div key={idx} className="process-step-box">
                <span className="step-num">{step.num}</span>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Confidentiality Architecture */}
      <section className="section security-section">
        <div className="container">
          <div className="security-content-grid">
            <div className="security-text-col">
              <span className="section-tag">Enterprise Security</span>
              <h2 className="section-title">Your Financial Data is In Safe Hands</h2>
              <p className="section-description">
                We implement bank-level encryption, masked identity tokens, and strict Non-Disclosure Agreements with every empaneled Chartered Accountant.
              </p>

              <div className="security-pillars-list">
                <div className="pillar-item">
                  <div className="pillar-icon-box">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4>256-Bit SSL End-to-End Encryption</h4>
                    <p>All documents and uploaded statements are encrypted in transit and at rest.</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-icon-box">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4>Masked Identity Storage</h4>
                    <p>Sensitive PAN and Aadhaar records are masked and accessible only to authorized CAs.</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-icon-box">
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h4>ICAI Code of Ethics &amp; Strict NDA</h4>
                    <p>All empaneled professionals are legally bound by statutory confidentiality norms.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="security-visual-col">
              <img src={securityImg} alt="Security Architecture" className="security-visual-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Verified Client Testimonials */}
      <section className="section section-alt testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Client Experiences</span>
            <h2 className="section-title">Trusted by Taxpayers Across India</h2>
            <p className="section-description">
              See how our dedicated Chartered Accountants helped individuals and businesses maximize refunds and stay compliant.
            </p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((test) => (
              <div key={test.id} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>

                <p className="testimonial-body">"{test.content}"</p>

                {test.refundAmount && (
                  <div className="testimonial-metric-box">
                    <span className="metric-tag">{test.metric}</span>
                    <strong className="metric-amount">{test.refundAmount}</strong>
                  </div>
                )}

                <div className="testimonial-author">
                  <div>
                    <h5 className="author-name">{test.name}</h5>
                    <span className="author-role">{test.role} • {test.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Impact CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-content">
              <span className="cta-eyebrow">Assessment Year 2024-25</span>
              <h2 className="cta-title">Ready to File Your Income Tax Return?</h2>
              <p className="cta-description">
                Join 120,000+ taxpayers who trust TaxVantage for accurate, CA-verified tax filing with maximum eligible refunds.
              </p>
              <div className="cta-buttons-row">
                <Link to="/register" className="btn btn-accent btn-lg">
                  Start Your Tax Filing <ArrowRight size={18} />
                </Link>
                <Link to="/services" className="btn btn-outline btn-lg cta-outline">
                  Browse All Tax Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details Modal */}
      {selectedServiceForModal && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedServiceForModal(null)}
          title={selectedServiceForModal.title}
          subtitle={`Category: ${selectedServiceForModal.category} • Turnaround: ${selectedServiceForModal.turnaroundTime}`}
          size="lg"
          footer={
            <>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedServiceForModal(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const id = selectedServiceForModal.id;
                  setSelectedServiceForModal(null);
                  handleStartFiling(id);
                }}
              >
                Start Filing This Plan ({formatCurrency(selectedServiceForModal.startingPrice)})
              </button>
            </>
          }
        >
          <div className="service-modal-content">
            <p className="service-modal-fulldesc">{selectedServiceForModal.fullDesc}</p>

            <div className="modal-two-col">
              <div className="modal-subcard">
                <h4>What's Included:</h4>
                <ul className="modal-checklist">
                  {selectedServiceForModal.features.map((feat, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={16} className="text-success" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-subcard">
                <h4>Documents Required:</h4>
                <ul className="modal-checklist">
                  {selectedServiceForModal.requiredDocuments.map((doc, idx) => (
                    <li key={idx}>
                      <FileText size={16} className="text-accent" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
