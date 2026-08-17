import React, { useEffect, useMemo } from 'react';
import {
  buildScrapEdgePath,
  SCRAP_SHADOW,
  SCRAP_EDGE_TINT,
  PAPER_GRAIN_URI,
} from '../utils/TornPaperScrap.js';

const TermsDialog = ({ isOpen, onClose }) => {
  // Stable torn edge path with seed 23 for a distinct terms & rules profile
  const scrapPath = useMemo(
    () => buildScrapEdgePath(23, { top: 52, right: 60, bottom: 50, left: 54 }),
    []
  );

  // Close on Escape key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      style={{
        backgroundColor: 'rgba(17, 17, 17, 0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      {/* SVG Clip Path Definition */}
      <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
        <defs>
          <clipPath id="terms-scrap-clip" clipPathUnits="objectBoundingBox">
            <path d={scrapPath} />
          </clipPath>
        </defs>
      </svg>

      {/* Modal Container */}
      <div
        className="w-full max-w-2xl relative animate-scale-in my-auto max-h-[92vh] flex flex-col"
        style={{
          filter: SCRAP_SHADOW,
          transform: 'rotate(-0.3deg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Paper Scrap Body */}
        <div
          className="overflow-y-auto max-h-[90vh] custom-scrollbar"
          style={{
            clipPath: 'url(#terms-scrap-clip)',
            backgroundColor: '#FFFDF4',
            backgroundImage: `
              ${SCRAP_EDGE_TINT},
              radial-gradient(ellipse at center, transparent 60%, rgba(90,70,40,0.08) 100%),
              url("${PAPER_GRAIN_URI}"),
              repeating-linear-gradient(
                transparent,
                transparent 27px,
                rgba(180,155,90,0.12) 27px,
                rgba(180,155,90,0.12) 28px
              )
            `,
            backgroundRepeat: 'no-repeat, no-repeat, no-repeat, repeat, repeat',
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 180px 180px, auto',
            padding: '32px 24px 36px 28px',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              borderBottom: '2px dashed #c8b88a',
              paddingBottom: '14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            {/* Logo & Header info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src="/Paap_Dholo_logo_black.webp"
                alt="Paap Dholo"
                style={{ height: '32px', objectFit: 'contain' }}
              />
              <div>
                <div
                  id="terms-dialog-title"
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontWeight: 900,
                    fontSize: '13px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#111',
                  }}
                >
                  PAAP DHOLO
                </div>
                <div
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '8px',
                    color: '#888',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  TERMS OF CONDUCT & COMMUNITY RULES (कायदे और कानून)
                </div>
              </div>
            </div>

            {/* Stamp + Close Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                className="stamp hidden sm:inline-block"
                style={{
                  borderColor: '#DC2626',
                  color: '#DC2626',
                  fontSize: '8px',
                  padding: '2px 6px',
                  opacity: 0.9,
                }}
              >
                ZERO TOLERANCE
              </div>

              {/* Close Button (X) */}
              <button
                onClick={onClose}
                aria-label="Close terms dialog"
                className="reaction-btn"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFFDF7',
                  border: '2px solid #111',
                  boxShadow: '2px 2px 0px #111',
                  cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 900,
                  fontSize: '14px',
                  color: '#111',
                  lineHeight: 1,
                  padding: 0,
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F43F5E';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFDF7';
                  e.currentTarget.style.color = '#111';
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-4 text-[#222]">
            {/* Title & Warning Notice */}
            <div>
              <div
                style={{
                  fontFamily: 'Rozha One, serif',
                  fontSize: '1.35rem',
                  lineHeight: 1.25,
                  color: '#111',
                  marginBottom: '4px',
                }}
              >
                गुमनाम हो, पर कानून से ऊपर नहीं.
              </div>
              <p
                style={{
                  fontFamily: "'Kalam', cursive, sans-serif",
                  fontSize: '0.98rem',
                  color: '#444',
                  lineHeight: 1.4,
                }}
              >
                Paap Dholo is an anonymous space to share harmless guilt, awkward bloopers, and humorous life sins. 
                Cruelty, illegal activities, personal doxxing, and malicious hate have <strong>zero place</strong> here.
              </p>
            </div>

            {/* Critical Alert Notice Box */}
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1.5px solid #FCA5A5',
                borderLeft: '4px solid #DC2626',
                padding: '10px 14px',
              }}
            >
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 800,
                  fontSize: '11px',
                  color: '#991B1B',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '2px',
                }}
              >
                ⚠️ IMPORTANT WARNING / CHEETAVANI
              </div>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '11px',
                  color: '#7F1D1D',
                  lineHeight: 1.45,
                }}
              >
                Anonymous mode does not protect against Indian Cyber Laws (IT Act 2000 & IPC / BNS). 
                Any illegal, sexually abusive, or terroristic content will be permanently purged and reported to legal enforcement.
              </div>
            </div>

            {/* Section 1: STRICTLY FORBIDDEN RULES */}
            <div>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 800,
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#DC2626',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                🚫 STRICTLY FORBIDDEN (Karyawahi Hogi / Zero Tolerance)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Rule 1 */}
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid #e0cd9f',
                    padding: '9px 11px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: 800,
                      fontSize: '11px',
                      color: '#991B1B',
                      marginBottom: '2px',
                    }}
                  >
                    1. No CSAM / Child Exploitation
                  </div>
                  <div
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: '10.5px',
                      color: '#555',
                      lineHeight: 1.4,
                    }}
                  >
                    Zero tolerance. Any content involving harm or exploitation of minors results in an instant IP blacklist and immediate cybercrime escalation.
                  </div>
                </div>

                {/* Rule 2 */}
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid #e0cd9f',
                    padding: '9px 11px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: 800,
                      fontSize: '11px',
                      color: '#991B1B',
                      marginBottom: '2px',
                    }}
                  >
                    2. No Doxxing & Real Personal Info
                  </div>
                  <div
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: '10.5px',
                      color: '#555',
                      lineHeight: 1.4,
                    }}
                  >
                    Never write real full names, phone numbers, WhatsApp numbers, Instagram / social handles, college/roll numbers, home addresses, or identifying personal info of real individuals.
                  </div>
                </div>

                {/* Rule 3 */}
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid #e0cd9f',
                    padding: '9px 11px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: 800,
                      fontSize: '11px',
                      color: '#991B1B',
                      marginBottom: '2px',
                    }}
                  >
                    3. No Sexual Assault, Harassment & Blackmail
                  </div>
                  <div
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: '10.5px',
                      color: '#555',
                      lineHeight: 1.4,
                    }}
                  >
                    Sexual harassment, rape threats, predatory stalking, blackmailing, and explicit non-consensual sexual admissions are strictly prohibited.
                  </div>
                </div>

                {/* Rule 4 */}
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid #e0cd9f',
                    padding: '9px 11px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: 800,
                      fontSize: '11px',
                      color: '#991B1B',
                      marginBottom: '2px',
                    }}
                  >
                    4. No Communal Hate & Slurs
                  </div>
                  <div
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: '10.5px',
                      color: '#555',
                      lineHeight: 1.4,
                    }}
                  >
                    No slurs or targeted hate speech against religion, caste, gender, ethnicity, or sexual orientation. Don't incite violence or riots.
                  </div>
                </div>

                {/* Rule 5 */}
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid #e0cd9f',
                    padding: '9px 11px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: 800,
                      fontSize: '11px',
                      color: '#991B1B',
                      marginBottom: '2px',
                    }}
                  >
                    5. No Self-Harm Promotion
                  </div>
                  <div
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: '10.5px',
                      color: '#555',
                      lineHeight: 1.4,
                    }}
                  >
                    Do not glorify suicide or encourage self-harm. If you are struggling, please reach out to trusted national helplines: <strong>Tele-MANAS (14416)</strong> or <strong>KIRAN (1800-599-0019)</strong>.
                  </div>
                </div>

                {/* Rule 6 */}
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid #e0cd9f',
                    padding: '9px 11px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: 800,
                      fontSize: '11px',
                      color: '#991B1B',
                      marginBottom: '2px',
                    }}
                  >
                    6. No Frauds, Scamming & Illegal Goods
                  </div>
                  <div
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: '10.5px',
                      color: '#555',
                      lineHeight: 1.4,
                    }}
                  >
                    Do not sell contraband, drugs, stolen carding details, OTP scams, phishing links, or promote dangerous physical vandalism.
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: WHAT IS ALLOWED & ENCOURAGED */}
            <div>
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 800,
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#166534',
                  marginBottom: '8px',
                }}
              >
                🟢 YAHAN KYA CONFESS KARNA HAI (Safe & Allowed Sins)
              </div>

              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  padding: '10px 12px',
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '10.5px',
                  color: '#166534',
                  lineHeight: 1.5,
                }}
              >
                ✔️ <strong>Petty & Funny Sins:</strong> Food chori from fridge, skipping gym, pretending to study while bingeing shows.<br />
                ✔️ <strong>Corporate & College Jugad:</strong> Mouse jiggler hacks, fake "on the way" excuses, hilarious viva & group project dramas.<br />
                ✔️ <strong>Harmless Personal Guilt:</strong> Breaking ex's expensive gift, white lies to parents, awkward dating failures.
              </div>
            </div>

            {/* Section 3: Legal Disclaimer */}
            <div
              style={{
                backgroundColor: 'rgba(255, 253, 244, 0.9)',
                border: '1px dashed #d4c090',
                padding: '8px 12px',
              }}
            >
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '9.5px',
                  color: '#777',
                  lineHeight: 1.4,
                }}
              >
                <strong>Legal Disclaimer:</strong> Paap Dholo is an entertainment and community confession platform. 
                Users are solely responsible for the content they generate. Content violating safety standards or applicable laws is subject to unannounced deletion.
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '2px dashed #c8b88a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '9px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#888',
                  fontWeight: 600,
                }}
              >
                CONFESS SAFELY • LAUGH TOGETHER • STAY HUMAN 🙏
              </div>

              <button
                onClick={onClose}
                style={{
                  backgroundColor: '#111',
                  color: '#fff',
                  border: '2px solid #111',
                  padding: '7px 18px',
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 800,
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F43F5E';
                  e.currentTarget.style.borderColor = '#F43F5E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#111';
                  e.currentTarget.style.borderColor = '#111';
                }}
              >
                SAMAJH GAYA (I AGREE)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsDialog;
