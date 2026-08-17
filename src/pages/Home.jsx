import React, { useState, useCallback } from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import StatsStrip from '../components/StatsStrip.jsx';
import ConfessionFeed from '../components/ConfessionFeed.jsx';
import KarmaCourt from '../components/KarmaCourt.jsx';
import PaapDhulai from '../components/PaapDhulai.jsx';
import BabaQuoteBanner from '../components/BabaQuoteBanner.jsx';
import AboutDialog from '../components/AboutDialog.jsx';
import Footer from '../components/Footer.jsx';
import {
  createConfession,
  getKarmaCourtTop,
  getPaapDhulaiLeaderboard,
  getStats,
} from '../services/confessionService.js';

const Home = ({ user }) => {
  const [feedRefreshKey, setFeedRefreshKey] = useState(0);
  const [stats, setStats] = useState(() => getStats());
  const [karmaTop, setKarmaTop] = useState(() => getKarmaCourtTop());
  const [dhulaiBoard, setDhulaiBoard] = useState(() => getPaapDhulaiLeaderboard());
  const [aboutOpen, setAboutOpen] = useState(false);

  const refreshData = useCallback(() => {
    setFeedRefreshKey((k) => k + 1);
    setStats(getStats());
    setKarmaTop(getKarmaCourtTop());
    setDhulaiBoard(getPaapDhulaiLeaderboard());
  }, []);

  // Listen for reaction, reply, or confession updates anywhere in the app
  React.useEffect(() => {
    const handleUpdate = () => {
      setStats(getStats());
      setKarmaTop(getKarmaCourtTop());
      setDhulaiBoard(getPaapDhulaiLeaderboard());
    };
    window.addEventListener('paap_data_updated', handleUpdate);
    return () => window.removeEventListener('paap_data_updated', handleUpdate);
  }, []);

  const handleConfessSubmit = useCallback(({ text, severity }) => {
    createConfession({
      text,
      severity,
      avatarId: user.avatarId,
      displayName: user.displayName,
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

      <Hero user={user} onConfessSubmit={handleConfessSubmit} />

      <StatsStrip stats={stats} />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_420px] gap-8 xl:gap-12">

          {/* ── Feed ── */}
          <main>
            <ConfessionFeed user={user} refreshKey={feedRefreshKey} />
          </main>

          {/* ── Sidebar ── */}
          <aside className="space-y-6">
            <KarmaCourt topConfessions={karmaTop} />
            <PaapDhulai leaderboard={dhulaiBoard} />
            <BabaQuoteBanner onConfessClick={scrollToConfess} />
          </aside>
        </div>
      </div>

      <Footer />

      {/* About Dialog using TornPaperScrap paper effect */}
      <AboutDialog
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        onConfessClick={scrollToConfess}
      />
    </div>
  );
};

export default Home;
