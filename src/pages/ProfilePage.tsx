import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  ShieldCheck,
  CreditCard,
  Building,
  Save,
  Lock,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { getCurrentUser, saveUser, setCurrentUser } from '../utils/storage';
import { User } from '../types';
import { useToast } from '../components/Toast';
import './ProfilePage.css';

export const ProfilePage: React.FC = () => {
  const [currentUser, setUser] = useState<User | null>(getCurrentUser());
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [mobile, setMobile] = useState(currentUser?.mobile || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [state, setState] = useState(currentUser?.state || 'Karnataka');
  const [pincode, setPincode] = useState(currentUser?.pincode || '');
  const [bankName, setBankName] = useState(currentUser?.bankAccounts?.[0]?.bankName || 'HDFC Bank');
  const [accountNumber, setAccountNumber] = useState(currentUser?.bankAccounts?.[0]?.accountNumber || '••••••••8819');
  const [ifsc, setIfsc] = useState(currentUser?.bankAccounts?.[0]?.ifsc || 'HDFC0001234');

  const navigate = useNavigate();
  const toast = useToast();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...currentUser,
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      bankAccounts: [
        {
          accountNumber,
          bankName,
          ifsc,
          isPrimary: true,
        },
      ],
    };

    saveUser(updatedUser);
    setCurrentUser(updatedUser);
    setUser(updatedUser);
    toast.success('Taxpayer profile updated successfully.');
  };

  return (
    <div className="profile-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-welcome-banner flex-between">
          <div className="welcome-left">
            <div className="user-avatar-badge">
              <UserIcon size={24} />
            </div>
            <div>
              <div className="welcome-title-row">
                <h2>Taxpayer Profile &amp; KYC Vault</h2>
                <span className="role-pill role-user">{currentUser.role}</span>
              </div>
              <p className="welcome-meta">
                Verified Statutory Identity for Income Tax Department Returns
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="profile-grid-form">
          {/* Column 1: Personal & Statutory Info */}
          <div className="dash-card">
            <div className="card-header-row flex-between">
              <h4 className="dash-card-title">1. Statutory Identity (Masked)</h4>
              <span className="ca-verified-tag">
                <ShieldCheck size={14} /> 256-Bit Vault
              </span>
            </div>

            <div className="profile-fields-list">
              <div className="form-group">
                <label className="form-label">Permanent Account Number (PAN)</label>
                <div className="masked-credential-box">
                  <CreditCard size={18} className="text-accent" />
                  <code>{currentUser.maskedPan || currentUser.panNumber}</code>
                  <span className="vault-lock-tag"><Lock size={12} /> Masked</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Aadhaar Number (UIDAI)</label>
                <div className="masked-credential-box">
                  <CreditCard size={18} className="text-accent" />
                  <code>{currentUser.maskedAadhaar || currentUser.aadhaarNumber}</code>
                  <span className="vault-lock-tag"><Lock size={12} /> Masked</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Full Legal Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label form-label-required">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label form-label-required">Mobile</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Bank Account & Address */}
          <div className="dash-card">
            <div className="card-header-row flex-between">
              <h4 className="dash-card-title">2. Refund Bank Account &amp; Address</h4>
              <span className="ca-verified-tag">
                <Building size={14} /> Validated
              </span>
            </div>

            <div className="profile-fields-list">
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. HDFC Bank"
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Bank Account Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">IFSC Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-input"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg btn-block">
                <Save size={16} /> Save Profile Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
