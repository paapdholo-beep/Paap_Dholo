import React, { useState, useRef, useEffect } from 'react';
import { buildTornEdgePath, PAPER_GRAIN_URI, PAPER_SHADOW } from "../utils/TornPaper.js";

const PLACEHOLDERS = [
  'Maine mummy se bola library jaa raha hu... aur main Netflix dekh raha tha.',
  'Main 5 minute ke liye phone chalane gaya tha. 3 ghante baad wapas aaya.',
  'Maine dost ka fries bina pooche kha liya. Usse pata nahi.',
  'Main meeting mein camera off karke so raha tha.',
  '"On the way" bolke abhi ghar pe hi hun. Kapde bhi nahi pahe.',
  'Gym membership li sirf t-shirt ke liye. Kabhi nahi gaaya.',
  'Delivery bhai ne bell bajayi. Main paas tha. 5 minute baad darwaza khola.',
];

// Fixed seed (11) so the slip's tear is stable but shaped differently
// than the other torn-paper cards on the page.
const TORN_PATH = buildTornEdgePath(11, { topSteps: 44, sideSteps: 56 });

const TornPaperDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
    <defs>
      <clipPath id="torn-paper-clip" clipPathUnits="objectBoundingBox">
        <path d={TORN_PATH} />
      </clipPath>
    </defs>
  </svg>
);

const MAX_CHARS = 300;

const ConfessionForm = ({ user, onSubmit }) => {
  const [text, setText] = useState('');
  const [severity, setSeverity] = useState('minor');
  const [submitted, setSubmitted] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const textareaRef = useRef(null);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit({ text, severity });
    setText('');
    setSeverity('minor');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const remaining = MAX_CHARS - text.length;
  const barcodeLines = Array.from({ length: 30 }, (_, i) => i);

  return (
    <>
      <TornPaperDefs />
      <div
        id="confession-form"
        style={{
          transform: 'rotate(-0.6deg)',
          // Soft, diffused, two-layer shadow instead of a single hard
          // offset — reads as paper resting/lifted rather than a sticker.
          filter: PAPER_SHADOW,
          position: 'relative',
        }}
      >
        <div
          style={{
            clipPath: 'url(#torn-paper-clip)',
            backgroundColor: '#FFFDF4',
            padding: '30px 24px 40px 24px',
            position: 'relative',
            // Layered: subtle vignette (paper edges catch shadow) +
            // fibrous grain + faint receipt ruling, back to front.
            backgroundImage: `
              radial-gradient(ellipse at center, transparent 55%, rgba(90,70,40,0.07) 100%),
              url("${PAPER_GRAIN_URI}"),
              repeating-linear-gradient(
                transparent,
                transparent 27px,
                rgba(180,155,90,0.13) 27px,
                rgba(180,155,90,0.13) 28px
              )
            `,
            backgroundRepeat: 'no-repeat, repeat, repeat',
            backgroundSize: '100% 100%, 180px 180px, auto',
          }}
        >
          <div style={{ borderBottom: '2px dashed #c8b88a', paddingBottom: '12px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              {/* Logo + title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <img src="/Paap_Dholo_logo_black.webp" alt="logo" style={{ height: '28px', objectFit: 'contain' }} />
                <div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#111' }}>
                    PAAP DHOLO
                  </div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '8px', color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Confession Department
                  </div>
                </div>
              </div>

              {/* Stamp — centred between logo and barcode */}
              <div className="stamp" style={{ borderColor: '#F43F5E', color: '#F43F5E', fontSize: '8px', padding: '2px 6px', opacity: 0.7, flexShrink: 0 }}>
                CONFESSION<br />SLIP
              </div>

              {/* Barcode */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                <div className="barcode-visual">
                  {barcodeLines.map((i) => (
                    <span key={i} style={{ height: i % 4 === 0 ? '28px' : '20px', marginTop: i % 4 === 0 ? 0 : '4px' }} />
                  ))}
                </div>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '7px', color: '#bbb', letterSpacing: '0.12em' }}>
                  CONFESSION SLIP
                </span>
              </div>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', marginBottom: '6px' }}>
              YOUR PAAP:
            </div>
            {submitted ? (
              <div className="animate-scale-in" style={{ textAlign: 'center', padding: '24px 0', border: '2px dashed #F5C400', background: '#FFF9E0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🧼</div>
                <div className="animate-soap" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#111', marginBottom: '4px' }}>
                  PAAP REGISTERED.
                </div>
                <div style={{ fontFamily: 'Caveat', fontSize: '1rem', color: '#666' }}>
                  Bhagwan ko bata diya hai.<br />Ab jao, comments padho. 🙏
                </div>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
                placeholder={PLACEHOLDERS[placeholderIdx]}
                rows={4}
                style={{
                  width: '100%',
                  background: 'rgba(245, 235, 200, 0.45)',
                  border: '1px solid #d4c090',
                  padding: '12px',
                  fontFamily: 'Caveat',
                  fontSize: '1.05rem',
                  resize: 'none',
                  color: '#333',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            )}
            {!submitted && (
              <div style={{
                textAlign: 'right',
                marginTop: '4px',
                fontFamily: 'Plus Jakarta Sans',
                fontSize: '11px',
                color: remaining < 30 ? '#F43F5E' : '#bbb',
              }}>
                {remaining} characters left
              </div>
            )}
          </div>
          {!submitted && (
            <>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>
                  HOW BAD WAS IT?
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {[
                    { value: 'minor',  emoji: '😇', label: 'Minor Paap' },
                    { value: 'medium', emoji: '🙂', label: 'Medium Paap' },
                    { value: 'bada',   emoji: '😬', label: 'Bada Paap' },
                    { value: 'maha',   emoji: '💀', label: 'Mahapaap' },
                  ].map(({ value, emoji, label }) => {
                    const isSelected = severity === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSeverity(value)}
                        className="reaction-btn"
                        style={{
                          padding: '6px 4px 5px 4px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px',
                          border: `2px solid ${isSelected ? '#111' : '#d4c090'}`,
                          background: isSelected ? '#F5C400' : 'rgba(255,253,244,0.85)',
                          boxShadow: isSelected ? '2px 2px 0 #111' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ fontSize: '20px', lineHeight: 1 }}>{emoji}</span>
                        <span
                          style={{
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            fontSize: '8px',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            color: isSelected ? '#111' : '#666',
                            lineHeight: 1.1,
                            marginTop: '2px',
                          }}
                        >
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!text.trim()}
                id="dhula-do-btn"
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: '#111',
                  color: '#fff',
                  fontFamily: 'Plus Jakarta Sans',
                  fontWeight: 800,
                  fontSize: '13px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  border: '2px solid #111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: !text.trim() ? 'not-allowed' : 'pointer',
                  opacity: !text.trim() ? 0.4 : 1,
                  transition: 'background 0.15s ease',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={e => { if (text.trim()) e.currentTarget.style.background = '#F43F5E'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#111'; }}
              >
                DHULA DO
                <img src="/Soap_bar.webp" alt="soap" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
              </button>
              <p style={{
                textAlign: 'center',
                fontFamily: 'Plus Jakarta Sans',
                fontSize: '8.5px',
                fontWeight: 600,
                color: '#666',
                marginTop: '8px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                YOUR PAAP WILL BE PUBLIC. YOUR NAME WILL NOT.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ConfessionForm;