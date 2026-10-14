import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { useToast } from '../components/Toast';
import './Contact.css';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [serviceType, setServiceType] = useState('Salaried Individual ITR');
  const [message, setMessage] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('Morning (10:00 AM - 1:00 PM)');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !mobile.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitted(true);
    toast.success('Consultation request booked! Our CA desk will call you during your selected slot.');
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <section className="page-header-section">
        <div className="container text-center">
          <span className="section-tag">Chartered Accountant Advisory Desk</span>
          <h1 className="page-title">Connect with Our Tax Professionals</h1>
          <p className="page-subtitle">
            Have questions about complex capital gains, foreign remittances, GST notices, or high-volume business audits? Schedule a one-on-one consultation with a senior partner.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Left: Contact Info & Offices */}
            <div className="contact-info-col">
              <div className="info-card">
                <span className="info-eyebrow">Priority Tax Helpline</span>
                <h3 className="info-title">Speak Directly to Our Tax Desk</h3>
                <p className="info-desc">
                  Our licensed Chartered Accountants are available Monday through Saturday to review your tax notices, Form 16, or corporate compliance queries.
                </p>

                <div className="contact-channels-list">
                  <div className="contact-channel-item">
                    <div className="channel-icon-box">
                      <Phone size={20} />
                    </div>
                    <div>
                      <strong>Telephone Support</strong>
                      <p>9866037733</p>
                    </div>
                  </div>

                  <div className="contact-channel-item">
                    <div className="channel-icon-box">
                      <Mail size={20} />
                    </div>
                    <div>
                      <strong>Email Inquiries</strong>
                      <p>srihas.kammala@nainatechnologies.in</p>
                    </div>
                  </div>

                  <div className="contact-channel-item">
                    <div className="channel-icon-box">
                      <Clock size={20} />
                    </div>
                    <div>
                      <strong>Consultation Hours</strong>
                      <p>Mon - Sat: 9:00 AM - 8:00 PM IST</p>
                    </div>
                  </div>
                </div>

                <div className="offices-block">
                  <h4 className="offices-title">Corporate Regional Offices</h4>
                  <div className="offices-grid">
                    <div className="office-item">
                      <div className="office-city">
                        <MapPin size={14} className="text-accent" /> Gachhibowli
                      </div>
                      <p>PVKR Elite gachhibowli</p>
                    </div>
                    <div className="office-item">
                      <div className="office-city">
                        <MapPin size={14} className="text-accent" /> Mumbai
                      </div>
                      <p>Bandra Kurla Complex (BKC), One International Center, 400051</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Booking Form */}
            <div className="contact-form-col">
              <div className="booking-card">
                <span className="booking-badge">
                  <ShieldCheck size={14} /> Confidential CA Consultation
                </span>
                <h3 className="booking-title">Book a 1-on-1 CA Session</h3>
                <p className="booking-subtitle">
                  Fill in your details below and a senior tax counsel will connect with you.
                </p>

                {isSubmitted ? (
                  <div className="submission-success-box text-center">
                    <CheckCircle2 size={48} className="text-success" />
                    <h4>Consultation Request Confirmed</h4>
                    <p>
                      Thank you, <strong>{name}</strong>. A dedicated Chartered Accountant has been assigned to review your query. We will contact you at <strong>{mobile}</strong> during your requested slot: <em>{preferredSlot}</em>.
                    </p>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Book Another Session
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="booking-form">
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label form-label-required">Your Full Legal Name</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Vikram Mehta"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label form-label-required">Email Address</label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="e.g. vikram@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label form-label-required">Mobile Number</label>
                        <input
                          type="tel"
                          className="form-input"
                          placeholder="10-digit mobile"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Tax Consultation Domain</label>
                        <select
                          className="form-select"
                          value={serviceType}
                          onChange={(e) => setServiceType(e.target.value)}
                        >
                          <option value="Salaried Individual ITR">Salaried Individual ITR (Form 16)</option>
                          <option value="Capital Gains & Stocks">Capital Gains &amp; Crypto / Stocks</option>
                          <option value="Freelancer / 44ADA">Freelancer / Professional (44ADA)</option>
                          <option value="GST Registration & Filing">GST Registration &amp; Returns</option>
                          <option value="Corporate Tax & Audit">Corporate Tax &amp; Audit (44AB)</option>
                          <option value="Income Tax Notice Response">Income Tax Notice Response</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Preferred Time Slot for Callback</label>
                      <select
                        className="form-select"
                        value={preferredSlot}
                        onChange={(e) => setPreferredSlot(e.target.value)}
                      >
                        <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                        <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                        <option value="Evening (4:00 PM - 7:30 PM)">Evening (4:00 PM - 7:30 PM)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Brief Description of Your Tax Query</label>
                      <textarea
                        className="form-textarea"
                        rows={3}
                        placeholder="Mention any specific details like foreign stocks, multiple Form 16s, house property loss, etc..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg btn-block">
                      <Send size={16} /> Request Consultation Callback
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
