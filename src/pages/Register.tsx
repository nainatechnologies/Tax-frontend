import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  CreditCard,
  Building,
  MapPin,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { User, TaxCase } from '../types';
import { saveUser, saveCase, addNotification } from '../utils/storage';
import { TAX_SERVICES } from '../data/services';
import { useToast } from '../components/Toast';
import './Register.css';

export const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');

  const [employmentType, setEmploymentType] = useState('Individual');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('Karnataka');
  const [pincode, setPincode] = useState('');

  const [acceptTerms, setAcceptTerms] = useState(true);
  const [acceptPrivacy, setAcceptPrivacy] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const queryParams = new URLSearchParams(location.search);
  const selectedServiceId = queryParams.get('service');

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10));
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAadhaar(e.target.value.replace(/[^0-9]/g, '').slice(0, 12));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!fullName.trim()) {
      toast.error('Please enter your full name as per official records.');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (pan.length !== 10) {
      toast.error('PAN Number must be 10 alphanumeric characters.');
      return;
    }
    if (!aadhaar.trim() || aadhaar.length !== 12) {
      toast.error('Aadhaar Number must be 12 digits.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (!acceptTerms || !acceptPrivacy) {
      toast.error('Please accept both Terms & Conditions and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newUserId = `usr-${Date.now()}`;
      const newUser: User = {
        id: newUserId,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        panNumber: pan,
        maskedPan: `${pan.slice(0, 2)}•••${pan.slice(-2)}`,
        aadhaarNumber: aadhaar,
        maskedAadhaar: `•••• •••• ${aadhaar.slice(-4)}`,
        role: 'USER',
        employmentType: employmentType as any,
        address: address.trim() || 'MG Road, Residency Area',
        city: city.trim() || 'Bengaluru',
        state: stateVal || 'Karnataka',
        pincode: pincode.trim() || '560001',
        createdAt: new Date().toISOString(),
        createdDate: new Date().toISOString(),
      };

      saveUser(newUser);

      // Create initial filing case in pending CA assignment state
      const serviceObj = TAX_SERVICES.find(s => s.id === selectedServiceId) || TAX_SERVICES[0];
      const fee = serviceObj.startingPrice;
      const gst = Math.round(fee * 0.18);
      const totalAmount = fee + gst;

      const newCase: TaxCase = {
        id: `CASE-${Date.now().toString().slice(-6)}`,
        userId: newUserId,
        userName: newUser.fullName,
        userEmail: newUser.email,
        userMobile: newUser.mobile,
        serviceId: serviceObj.id,
        serviceTitle: serviceObj.title,
        financialYear: 'FY 2023-24',
        assessmentYear: 'AY 2024-25',
        folderName: 'ITR_2023_2024',
        status: 'CA_ASSIGNMENT_PENDING',
        fee,
        gst,
        totalAmount,
        paymentStatus: 'Unpaid',
        documentsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveCase(newCase);

      // Notify Admin
      addNotification({
        targetRole: 'ADMIN',
        title: 'New Taxpayer Registration',
        message: 'New user registered and waiting for CA assignment.',
        type: 'info',
        read: false,
        link: '/admin/dashboard',
      });

      setIsLoading(false);
      toast.success('Registration successful. Your account has been created.');
      navigate('/login');
    }, 600);
  };

  return (
    <div className="auth-page register-page">
      <div className="container">
        <div className="register-container-card">
          <div className="register-header text-center">
            <span className="auth-badge">
              <ShieldCheck size={14} /> Official Tax Filing Portal
            </span>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Register to access your ITR folder vault and dedicated Chartered Accountant review.
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="register-form">
            {/* 1. Personal Information */}
            <div className="form-section-block">
              <h4 className="form-section-title">1. Personal Information</h4>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label form-label-required">Full Name</label>
                  <div className="input-with-icon">
                    <UserIcon size={18} className="input-icon" />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Mobile Number</label>
                  <div className="input-with-icon">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="10-digit mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label form-label-required">Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-input"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Confirm Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-input"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="password-toggle-btn" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Identity Verification */}
            <div className="form-section-block">
              <h4 className="form-section-title">2. Identity &amp; Statutory Details</h4>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label form-label-required">PAN Number</label>
                  <div className="input-with-icon">
                    <CreditCard size={18} className="input-icon" />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="ABCDE1234F"
                      value={pan}
                      onChange={handlePanChange}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Aadhaar Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="12-digit Aadhaar number"
                    value={aadhaar}
                    onChange={handleAadhaarChange}
                    maxLength={12}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Employment Type</label>
                <div className="input-with-icon">
                  <Building size={18} className="input-icon" />
                  <select
                    className="form-select"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                  >
                    <option value="Individual">Individual</option>
                    <option value="Private Employee">Private Employee</option>
                    <option value="Government Employee">Government Employee</option>
                    <option value="Business">Business</option>
                    <option value="Freelancer">Freelancer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Address Information */}
            <div className="form-section-block">
              <h4 className="form-section-title">3. Permanent Address</h4>
              <div className="form-group">
                <label className="form-label">Address</label>
                <div className="input-with-icon">
                  <MapPin size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="House / Flat No., Street, Area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Karnataka"
                    value={stateVal}
                    onChange={(e) => setStateVal(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">PIN Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="6-digit PIN"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  />
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="form-group form-checkbox-row" style={{ marginTop: '1rem' }}>
              <label className="form-checkbox-label" style={{ marginBottom: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
                <span>
                  Accept Terms &amp; Conditions
                </span>
              </label>

              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                  required
                />
                <span>
                  Accept Privacy Policy
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={isLoading}
              style={{ marginTop: '1.5rem' }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-footer-link text-center">
            <span>Already registered?</span>{' '}
            <Link to="/login" className="auth-link-bold">
              Sign In to Your Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
