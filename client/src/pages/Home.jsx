import React, { useState, useCallback } from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import StatsStrip from '../components/StatsStrip.jsx';
import ConfessionFeed from '../components/ConfessionFeed.jsx';
import KarmaCourt from '../components/KarmaCourt.jsx';
import PaapDhulai from '../components/PaapDhulai.jsx';
import BabaQuoteBanner from '../components/BabaQuoteBanner.jsx';
import AboutDialog from '../components/AboutDialog.jsx';
import TermsDialog from '../components/TermsDialog.jsx';
import Footer from '../components/Footer.jsx';
import {
  createConfession,
  getKarmaCourtTop,
  getPaapDhulaiLeaderboard,
  getStats,
  isUserBanned,
} from '../services/confessionService.js';
import { getUserIp } from '../utils/anonymousUser.js';

const TERMS_SEEN_KEY = 'paap_terms_seen';

const Home = ({ user }) => {
  const [feedRefreshKey, setFeedRefreshKey] = useState(0);
  const [stats, setStats] = useState(() => getStats());
  const [karmaTop, setKarmaTop] = useState(() => getKarmaCourtTop());
  const [dhulaiBoard, setDhulaiBoard] = useState(() => getPaapDhulaiLeaderboard());
  const [aboutOpen, setAboutOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [selectedKarmaId, setSelectedKarmaId] = useState(null);
  const [userIp, setUserIp] = useState('127.0.0.1');
  const [isBanned, setIsBanned] = useState(false);

  // Fetch client IP on mount
  React.useEffect(() => {
    getUserIp().then((ip) => {
      if (ip) {
        setUserIp(ip);
        setIsBanned(isUserBanned({ uid: user.uid || user.id, ip }));
      }
    });
  }, [user]);

  const refreshData = useCallback(() => {
    setFeedRefreshKey((k) => k + 1);
    setStats(getStats());
    setKarmaTop(getKarmaCourtTop());
    setDhulaiBoard(getPaapDhulaiLeaderboard());
    setIsBanned(isUserBanned({ uid: user.uid || user.id, ip: userIp }));
  }, [user, userIp]);

  // Auto-show Terms & Rules dialog for first-time visitors once they scroll down (not immediately on landing)
  React.useEffect(() => {
    try {
      const hasSeenTerms = localStorage.getItem(TERMS_SEEN_KEY);
      if (hasSeenTerms) return;

      const handleScroll = () => {
        // Trigger after user scrolls at least 250px down
        if (window.scrollY > 250) {
          setTermsOpen(true);
          window.removeEventListener('scroll', handleScroll);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleCloseTerms = useCallback(() => {
    try {
      localStorage.setItem(TERMS_SEEN_KEY, 'true');
    } catch {}
    setTermsOpen(false);
  }, []);

  // Listen for reaction, reply, or confession updates anywhere in the app
  React.useEffect(() => {
    const handleUpdate = () => {
      setFeedRefreshKey((k) => k + 1);
      setStats(getStats());
      setKarmaTop(getKarmaCourtTop());
      setDhulaiBoard(getPaapDhulaiLeaderboard());
      setIsBanned(isUserBanned({ uid: user.uid || user.id, ip: userIp }));
    };
    window.addEventListener('paap_data_updated', handleUpdate);
    return () => window.removeEventListener('paap_data_updated', handleUpdate);
  }, [user, userIp]);

  const handleConfessSubmit = useCallback(async ({ text, severity }) => {
    const ip = await getUserIp();
    createConfession({
      text,
      severity,
      avatarId: user.avatarId,
      displayName: user.displayName,
      authorUid: user.uid || user.id,
      authorIp: ip,
    });
    refreshData();
  }, [user, refreshData]);

  const scrollToConfess = () => {
    document.getElementById('confession-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-[#F5EEDF]">
      <Navbar
        onConfessClick={scrollToConfess}
        onAboutClick={() => setAboutOpen(true)}
      />

      {isBanned && (
        <div className="bg-[#111] text-[#F43F5E] border-b-4 border-[#F43F5E] px-4 py-3 text-center shadow-lg sticky top-0 z-50 animate-pop">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 font-ui text-sm font-800 tracking-wider uppercase">
            <span>🚫</span>
            <span>AAPKA ACCOUNT AUR IP BAN HO CHUKA HAI</span>
          </div>
          <p className="text-xs text-gray-300 font-ui mt-0.5">
            Repeated guidelines / legal violations ke karan aapka posting aur commenting access suspend kar diya gaya hai.
          </p>
        </div>
      )}

      <Hero user={user} onConfessSubmit={handleConfessSubmit} />

      <StatsStrip stats={stats} />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_420px] gap-8 xl:gap-12">

          {/* ── Feed ── */}
          <main>
            <ConfessionFeed
              user={user}
              refreshKey={feedRefreshKey}
              selectedConfessionId={selectedKarmaId}
              onClearSelected={() => setSelectedKarmaId(null)}
            />
          </main>

          {/* ── Sidebar ── */}
          <aside className="space-y-6">
            <KarmaCourt
              topConfessions={karmaTop}
              onSelectConfession={(id) => setSelectedKarmaId(id)}
            />
            <PaapDhulai leaderboard={dhulaiBoard} />
            <BabaQuoteBanner onConfessClick={scrollToConfess} />
          </aside>
        </div>
      </div>

      <Footer
        onTermsClick={() => setTermsOpen(true)}
        onAboutClick={() => setAboutOpen(true)}
      />

      {/* About Dialog using TornPaperScrap paper effect */}
      <AboutDialog
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        onConfessClick={scrollToConfess}
      />

      {/* Terms & Conditions / Rules Dialog */}
      <TermsDialog
        isOpen={termsOpen}
        onClose={handleCloseTerms}
      />
    </div>
  );
};

export default Home;
