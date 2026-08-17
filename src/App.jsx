import React, { useEffect, useState } from 'react';
import Home from './pages/Home.jsx';
import { seedIfEmpty } from './services/confessionService.js';
import { getOrCreateUser } from './utils/anonymousUser.js';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Seed mock data if localStorage is empty
    seedIfEmpty();
    // Get or create anonymous user
    const currentUser = getOrCreateUser();
    setUser(currentUser);
  }, []);

  if (!user) {
    // Brief loading state while setting up identity
    return (
      <div className="min-h-screen bg-[#F5EEDF] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">🧼</div>
          <div
            className="font-ui text-sm tracking-widest uppercase text-gray-600"
            style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700 }}
          >
            Consulting karma database...
          </div>
        </div>
      </div>
    );
  }

  return <Home user={user} />;
};

export default App;