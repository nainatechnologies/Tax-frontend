import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Check,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Search,
} from 'lucide-react';
import { TAX_SERVICES } from '../data/services';
import { TaxService } from '../types';
import { formatCurrency, getCurrentUser } from '../utils/storage';
import { Modal } from '../components/Modal';
import './Services.css';

export const Services: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<TaxService | null>(null);

  const navigate = useNavigate();

  const categories = [
    'All',
    'Salaried Individuals',
    'Active Investors & Traders',
    'Freelancers & Professionals',
    'Corporate & Businesses',
    'Tax Advisory & Compliance',
  ];

  const filteredServices = TAX_SERVICES.filter((srv) => {
    const matchesCat = selectedCategory === 'All' || srv.category === selectedCategory;
    const matchesSearch =
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStartFiling = (serviceId: string) => {
    const user = getCurrentUser();
    if (user) {
      navigate(`/dashboard?openNewCase=${serviceId}`);
    } else {
      navigate(`/register?service=${serviceId}`);
    }
  };

  return (
    <div className="services-page">
      {/* Page Header */}
      <section className="page-header-section">
        <div className="container text-center">
          <span className="section-tag">Chartered Accountant Solutions</span>
          <h1 className="page-title">Specialized Tax Filing &amp; Advisory Plans</h1>
          <p className="page-subtitle">
            Tailored tax computations, capital gains audits, GST filings, and strategic wealth advisory certified by empaneled Chartered Accountants.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="section services-catalogue-section">
        <div className="container">
          <div className="services-filter-bar flex-between">
            <div className="category-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="input-with-icon search-services-input">
              <Search size={16} className="input-icon" />
              <input
                type="text"
                className="form-input form-input-sm"
                placeholder="Search tax plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Services Grid */}
          <div className="services-catalogue-grid">
            {filteredServices.map((srv) => (
              <div key={srv.id} className="service-catalogue-card">
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
                    <span className="price-label">Transparent Professional Fee</span>
                    <span className="price-val">{formatCurrency(srv.startingPrice)}</span>
                  </div>
                  <span className="turnaround-tag">{srv.turnaroundTime}</span>
                </div>

                <div className="service-features-list">
                  {srv.features.map((feat, idx) => (
                    <div key={idx} className="service-feat-item">
                      <Check size={14} className="text-success" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="service-card-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setSelectedService(srv)}
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

      {/* Service Details Modal */}
      {selectedService && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedService(null)}
          title={selectedService.title}
          subtitle={`Plan Code: ${selectedService.id} • Turnaround: ${selectedService.turnaroundTime}`}
          size="lg"
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setSelectedService(null)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const id = selectedService.id;
                  setSelectedService(null);
                  handleStartFiling(id);
                }}
              >
                Start Filing This Plan ({formatCurrency(selectedService.startingPrice)})
              </button>
            </>
          }
        >
          <div className="service-modal-content">
            <p className="service-modal-fulldesc">{selectedService.fullDesc}</p>

            <div className="modal-two-col">
              <div className="modal-subcard">
                <h4>What's Included in This Plan:</h4>
                <ul className="modal-checklist">
                  {selectedService.features.map((feat, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={16} className="text-success" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-subcard">
                <h4>Required Documents for Vault:</h4>
                <ul className="modal-checklist">
                  {selectedService.requiredDocuments.map((doc, idx) => (
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
