import React, { useState } from 'react';

const Navbar = ({ onConfessClick, onAboutClick }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('PAAP REGISTER');

  const navLinks = [
    { label: 'PAAP REGISTER', href: '#paap-register' },
    { label: 'KARMA COURT',   href: '#karma-court' },
    { label: 'PAAP DHULAI',   href: '#paap-dhulai' },
    { label: 'ABOUT',         href: '#about' },
  ];

  const handleLinkClick = (e, link) => {
    setActiveLink(link.label);
    if (link.label === 'ABOUT') {
      e.preventDefault();
      if (onAboutClick) onAboutClick();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FFFDF7] border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-4">

          {/* ── Logo ── */}
          <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src="/Paap_Dholo_logo_black.webp"
              alt="Paap Dholo"
              className="h-9 w-auto object-contain"
            />
            <div className="flex flex-col justify-center leading-none gap-0.5">
              <span
                className="text-black uppercase text-xs sm:text-[13px]"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  lineHeight: 1,
                }}
              >
                PAAP DHOLO
              </span>
              <span
                className="text-[#F43F5E] border border-[#F43F5E] px-1 py-px self-start text-[6.5px] sm:text-[7.5px]"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  lineHeight: 1.3,
                }}
              >
                CONFESSION DEPARTMENT
              </span>
            </div>
          </a>

          {/* ── Desktop Nav — centred ── */}
          <div className="hidden md:flex items-center gap-5 lg:gap-8 mx-auto">
            {navLinks.map((link) => {
              const isActive = activeLink === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: isActive ? '#F43F5E' : '#111',
                    borderBottom: isActive ? '2px solid #F43F5E' : '2px solid transparent',
                    paddingBottom: '2px',
                    textDecoration: 'none',
                    transition: 'color 0.15s, border-color 0.15s',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.color = '#F43F5E';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.color = '#111';
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={onConfessClick}
              id="navbar-confess-btn"
              className="flex items-center gap-2 bg-black text-white font-ui font-800 uppercase tracking-widest cursor-pointer border-2 border-black hover:bg-[#F43F5E] hover:border-[#F43F5E] transition-colors"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 800,
                fontSize: '12px',
                letterSpacing: '0.15em',
                padding: '8px 16px',
                borderRadius: '6px',
              }}
            >
              CONFESS
              <img src="/Soap_bar.webp" alt="soap" className="w-5 h-5 object-contain" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 border-2 border-black"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <div className="space-y-1">
                <span className={`block w-5 h-0.5 bg-black transition-all ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block w-5 h-0.5 bg-black transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-black transition-all ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="md:hidden border-t-2 border-black bg-[#FFFDF7] py-3 animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  handleLinkClick(e, link);
                  setMobileOpen(false);
                }}
                style={{
                  display: 'block',
                  padding: '10px 16px',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: activeLink === link.label ? '#F43F5E' : '#111',
                  borderBottom: '1px solid #e5d9bf',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
