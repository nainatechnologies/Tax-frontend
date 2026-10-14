import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Lock,
  Award,
} from 'lucide-react';
import { HERO_SLIDES } from '../data/mockData';
import './Hero.css';

export const Hero: React.FC = () => {
  const slide = HERO_SLIDES[0];

  return (
    <section className="hero-section">
      <div className="container hero-container">
        <div className="hero-grid">
          {/* Left Column: Content */}
          <div className="hero-content">
            <div className="hero-badge animate-fade-in">
              <ShieldCheck size={16} />
              <span>{slide.badge}</span>
            </div>

            <h1 className="hero-title animate-fade-in">
              {slide.title}
            </h1>

            <p className="hero-subtitle">
              {slide.subtitle}
            </p>

            <p className="hero-description">
              {slide.description}
            </p>

            <div className="hero-buttons">
              <Link to={slide.primaryCtaLink} className="btn btn-accent btn-lg">
                {slide.primaryCtaText} <ArrowRight size={18} />
              </Link>
              <Link to={slide.secondaryCtaLink} className="btn btn-outline btn-lg">
                {slide.secondaryCtaText}
              </Link>
            </div>

          </div>

          {/* Right Column: Visual Dashboard Mockup */}
          <div className="hero-visual">
            <div className="hero-image-card">
              <img
                src={slide.image}
                alt={slide.title}
                className="hero-slide-img animate-fade-in"
              />
              <div className="hero-floating-badge">
                <Lock size={16} className="text-success" />
                <div>
                  <strong>256-Bit SSL Encrypted Vault</strong>
                  <small>Zero Knowledge Access</small>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
