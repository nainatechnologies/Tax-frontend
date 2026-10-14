import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Lock,
  Building,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { aboutImg, securityImg } from '../assets/images';
import './About.css';

export const About: React.FC = () => {
  return (
    <div className="about-page">
      {/* Page Hero */}
      <section className="page-header-section">
        <div className="container text-center">
          <span className="section-tag">Institutional Profile</span>
          <h1 className="page-title">Pioneering Digital Tax Precision Across India</h1>
          <p className="page-subtitle">
            TaxVantage unites decades of senior Chartered Accountancy practice with secure cloud technology to deliver zero-defect tax compliance for modern professionals and enterprises.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="section about-narrative-section">
        <div className="container">
          <div className="narrative-grid">
            <div className="narrative-visual">
              <img src={aboutImg} alt="TaxVantage Senior CAs" className="narrative-img" />
            </div>
            <div className="narrative-text">
              <span className="section-tag">Our Founding Purpose</span>
              <h2>Tax Filing Backed by Real Legal &amp; Financial Counsel</h2>
              <p>
                Founded by Fellow Chartered Accountants (FCAs), TaxVantage was born out of a realization: standard DIY tax software often causes taxpayers to miss critical Chapter VI-A deductions, misinterpret capital gains indexation, and risk non-compliance notices under Section 143(1).
              </p>
              <p>
                We replaced automated guesses with human expertise. Every taxpayer on TaxVantage is paired with a licensed, empaneled Chartered Accountant who personally prepares, verifies, and signs off on computations.
              </p>

              <div className="about-metrics-row">
                <div className="about-metric-card">
                  <span className="about-metric-num">12+</span>
                  <span className="about-metric-lbl">Years Experience</span>
                </div>
                <div className="about-metric-card">
                  <span className="about-metric-num">120K+</span>
                  <span className="about-metric-lbl">Returns Certified</span>
                </div>
                <div className="about-metric-card">
                  <span className="about-metric-num">99.9%</span>
                  <span className="about-metric-lbl">Zero-Defect Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual-Layer Quality Framework */}
      <section className="section section-alt quality-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Rigorous Quality Framework</span>
            <h2 className="section-title">The Dual-Layer CA Review Protocol</h2>
            <p className="section-description">
              How we guarantee absolute accuracy, maximize allowable exemptions, and eliminate statutory notice risks.
            </p>
          </div>

          <div className="quality-cards-grid">
            <div className="quality-card">
              <div className="quality-icon-box">
                <ShieldCheck size={28} className="text-accent" />
              </div>
              <h3>1. Primary CA Assessment</h3>
              <p>
                Your dedicated Chartered Accountant extracts data from Form 16, Form 26AS, AIS/TIS reports, and broker statements to draft your computation.
              </p>
            </div>

            <div className="quality-card">
              <div className="quality-icon-box">
                <Award size={28} className="text-warning" />
              </div>
              <h3>2. Senior Peer Review</h3>
              <p>
                A secondary senior partner conducts an independent audit to check deductions, verify foreign asset disclosures, and ensure tax regime optimization.
              </p>
            </div>

            <div className="quality-card">
              <div className="quality-icon-box">
                <CheckCircle2 size={28} className="text-success" />
              </div>
              <h3>3. Portal E-Filing &amp; Archive</h3>
              <p>
                Returns are officially submitted to the Income Tax Department e-filing portal with generated ITR-V acknowledgements stored in your vault.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box">
            <span className="cta-eyebrow">Start Your Consultation</span>
            <h2 className="cta-title">File Your Taxes with Certified Chartered Accountants</h2>
            <p className="cta-description">
              Join thousands of professionals across Bengaluru, Mumbai, Delhi, and Hyderabad who rely on TaxVantage.
            </p>
            <div className="cta-buttons-row">
              <Link to="/register" className="btn btn-accent btn-lg">
                Create Account &amp; File <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg cta-outline">
                Speak with CA Desk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
