import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { logoImg } from '../assets/images';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      {/* Trust & Guarantee Banner */}
      <div className="footer-trust-banner">
        <div className="container">
          <div className="trust-banner-grid">
            <div className="trust-banner-item">
              <ShieldCheck className="trust-icon text-success" size={24} />
              <div>
                <h4>ICAI Registered CAs</h4>
                <p>Returns prepared and certified by verified Chartered Accountants.</p>
              </div>
            </div>
            <div className="trust-banner-item">
              <Lock className="trust-icon text-accent" size={24} />
              <div>
                <h4>256-Bit Bank-Grade Encryption</h4>
                <p>End-to-end data privacy with masked Aadhaar and PAN vault.</p>
              </div>
            </div>
            <div className="trust-banner-item">
              <CheckCircle className="trust-icon text-warning" size={24} />
              <div>
                <h4>100% Zero-Defect Guarantee</h4>
                <p>Dual-layer validation prevents notices and calculation errors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1: Brand Info */}
            <div className="footer-col brand-col">
              <img src={logoImg} alt="TaxVantage Logo" className="footer-logo" />
              <p className="footer-tagline">
                India's premier digital tax consultancy and ITR filing platform connecting individual taxpayers, freelancers, and businesses with experienced Chartered Accountants.
              </p>
              <div className="footer-security-pill">
                <Lock size={14} /> ISO 27001 Certified Security Practices
              </div>
            </div>

            {/* Column 2: Tax Services */}
            <div className="footer-col">
              <h4 className="footer-heading">Tax Services</h4>
              <ul className="footer-links">
                <li><Link to="/services">Individual Salaried ITR Filing</Link></li>
                <li><Link to="/services">Capital Gains &amp; Stocks Tax</Link></li>
                <li><Link to="/services">Section 44ADA Freelancers Tax</Link></li>
                <li><Link to="/services">GST Registration &amp; Returns</Link></li>
                <li><Link to="/services">Corporate Tax &amp; 44AB Audits</Link></li>
                <li><Link to="/services">Strategic Tax Planning</Link></li>
              </ul>
            </div>

            {/* Column 3: Platform & Workflow */}
            <div className="footer-col">
              <h4 className="footer-heading">Company &amp; Workflow</h4>
              <ul className="footer-links">
                <li><Link to="/about">About TaxVantage</Link></li>
                <li><Link to="/how-it-works">How It Works (10-Stage Process)</Link></li>
                <li><Link to="/login">Client Portal Login</Link></li>
                <li><Link to="/login">Chartered Accountant Login</Link></li>
                <li><Link to="/contact">Book Consultation</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact & Support */}
            <div className="footer-col">
              <h4 className="footer-heading">Support &amp; Offices</h4>
              <ul className="footer-contact-list">
                <li>
                  <Phone size={16} />
                  <span>9866037733</span>
                </li>
                <li>
                  <Mail size={16} />
                  <span>srihas.kammala@nainatechnologies.in</span>
                </li>
                <li>
                  <MapPin size={16} />
                  <span>PVKR Elite gachhibowli</span>
                </li>
              </ul>
              <div className="office-hours">
                <small>Hours: Mon - Sat, 9:00 AM - 8:00 PM IST</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer & Copyright */}
      <div className="footer-bottom">
        <div className="container">
          <div className="disclaimer-box">
            <p className="disclaimer-text">
              <strong>Statutory &amp; Demo Disclaimer:</strong> TaxVantage provides technology-assisted tax filing through licensed Chartered Accountants adhering to the Institute of Chartered Accountants of India (ICAI) guidelines. Your documents and personal information should be handled through secure, authorized systems. This demo stores application state locally and is not suitable for production document storage.
            </p>
          </div>
          <div className="bottom-bar flex-between">
            <p className="copyright-text">
              &copy; {new Date().getFullYear()} TaxVantage Technologies Private Limited. All rights reserved.
            </p>
            <div className="legal-links">
              <Link to="/privacy">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms">Terms of Service</Link>
              <span>•</span>
              <Link to="/security">Data Protection &amp; NDA</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
