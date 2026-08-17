import React from 'react';
import ConfessionForm from './ConfessionForm.jsx';

const Hero = ({ user, onConfessSubmit }) => {
  return (
    <section
      id="hero"
      className="relative bg-[#F5EEDF] overflow-hidden"
      style={{ minHeight: '88vh' }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Lightning bolts */}
        <span className="absolute top-8 left-[38%] text-3xl opacity-40 font-bold" style={{ transform: 'rotate(-15deg)' }}>⚡</span>
        <span className="absolute top-16 left-[42%] text-2xl opacity-30 font-bold" style={{ transform: 'rotate(10deg)' }}>⚡</span>
        <span className="absolute top-32 right-[5%] text-4xl opacity-20" style={{ transform: 'rotate(-20deg)' }}>⚡</span>
        {/* Stars / sparkles */}
        <span className="absolute top-24 right-[42%] text-yellow-400 text-xl opacity-50">✦</span>
        <span className="absolute bottom-32 left-[5%] text-yellow-400 text-2xl opacity-40">✦</span>
        <span className="absolute top-12 right-[30%] text-xl opacity-30">✦</span>
        {/* Small dashes */}
        <span className="absolute top-20 left-[32%] opacity-20 text-2xl font-bold text-gray-600">—</span>
        <span className="absolute bottom-40 right-[35%] opacity-20 text-2xl font-bold text-gray-600">—</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* ── LEFT: Hero Text ── */}
        <div className="relative z-10">

          {/* "No name. No shame. Only paap" badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1.5 bg-black text-white px-3 py-1.5 text-xs font-ui tracking-widest uppercase" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>
              <span>💀</span> 100% ANONYMOUS
            </div>
            <div className="hidden sm:flex items-center gap-1.5 border-2 border-black px-3 py-1.5 text-xs font-ui tracking-widest uppercase bg-[#FFFDF7]" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>
              NO NAME. NO SHAME.
            </div>
          </div>

          {/* Headline with yellow brush */}
          <div className="mb-6">
            <div
              className="font-ui font-900 text-5xl sm:text-6xl xl:text-7xl leading-none tracking-tight text-black uppercase"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
            >
              AA GAYE
            </div>

            {/* Yellow brush stroke background behind Hindi text */}
            <div className="relative inline-block mt-2">
              <div
                className="absolute inset-0 bg-[#F5C400]"
                style={{ transform: 'rotate(-1.5deg) skewX(-2deg)', zIndex: 0, top: '10%', bottom: '5%', left: '-8px', right: '-8px' }}
              />
              <div
                className="relative z-10 font-hindi text-5xl sm:text-7xl xl:text-8xl text-black leading-tight"
                style={{ fontFamily: 'Rozha One', lineHeight: 1.05 }}
              >
                पाप करके
              </div>
            </div>
          </div>

          {/* Pink ribbon subtitle */}
          <div className="relative inline-block mb-8">
            <div
              className="bg-[#F43F5E] text-white px-4 py-2"
              style={{ transform: 'rotate(-1deg)' }}
            >
              <div className="font-hindi text-lg sm:text-xl leading-snug" style={{ fontFamily: 'Rozha One' }}>
                जो किया, यहाँ लिख दो.
              </div>
              <div className="font-hindi text-base sm:text-lg leading-snug text-pink-100" style={{ fontFamily: 'Rozha One' }}>
                नाम नहीं पूछेंगे.
              </div>
            </div>
          </div>

          {/* Feature badges row */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { emoji: '👻', title: '100% Anonymous', sub: 'No login. No name.' },
              { emoji: '😂', title: 'Confess Anything', sub: 'Jo kiya, yahan likh do.' },
              { emoji: '🧼', title: 'Feel Lighter', sub: 'Confess. Get judged. Feel better.' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-2 bg-[#FFFDF7] border-2 border-black px-3 py-2 shadow-[2px_2px_0_#111]">
                <span className="text-base mt-0.5">{f.emoji}</span>
                <div>
                  <div className="font-ui text-xs font-700 text-black" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}>{f.title}</div>
                  <div className="font-ui text-[10px] text-gray-500" style={{ fontFamily: 'Plus Jakarta Sans' }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Black CTA pill */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="bg-black text-[#F5C400] px-5 py-3 font-ui font-900 text-sm tracking-widest uppercase border-2 border-black shadow-[3px_3px_0_#F5C400]"
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
            >
              CONFESS. GET JUDGED. FEEL BETTER.
            </div>
          </div>
        </div>

        {/* ── RIGHT: Confession Slip ── */}
        <div className="relative z-10 lg:pl-2 lg:pr-14 xl:pr-18 w-full max-w-lg lg:max-w-none mx-auto mt-6 lg:mt-0">

          {/* Handwritten pointer pointing directly towards the confession form */}
          <div
            className="absolute -top-7 left-4 sm:-top-8 sm:left-6 z-20 flex items-center gap-1.5 pointer-events-none select-none"
            style={{ transform: 'rotate(-3deg)' }}
          >
            <span
              style={{
                fontFamily: 'Caveat, cursive',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#222',
                letterSpacing: '0.02em',
              }}
            >
              Paap यहाँ डालें
            </span>
            <span
              style={{
                fontSize: '1.4rem',
                color: '#111',
                display: 'inline-block',
                transform: 'rotate(15deg) translateY(2px)',
              }}
            >
              ⤵
            </span>
          </div>

          {/* Person illustration standing at the bottom-right outside the slip */}
          <div
            className="absolute hidden lg:block pointer-events-none z-20"
            style={{
              right: '-1.5rem',
              bottom: '-0.75rem',
              width: 'clamp(6.5rem, 8.5vw, 9rem)',
            }}
          >
            <img
              src="/Person.webp"
              alt="Praying person"
              className="w-full object-contain opacity-95"
            />
          </div>

          {/* Trident decorative */}
          <div className="absolute -left-8 top-10 hidden lg:block pointer-events-none opacity-30 z-0">
            <img src="/Trident_1.webp" alt="" className="w-10 object-contain" />
          </div>

          <ConfessionForm user={user} onSubmit={onConfessSubmit} />
        </div>
      </div>

      {/* Stats strip below hero */}
    </section>
  );
};

export default Hero;
