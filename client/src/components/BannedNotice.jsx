import React from 'react';

const BannedNotice = ({ banInfo, user }) => {
  return (
    <div className="min-h-screen bg-[#111] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1A1A1A] border-2 border-[#F43F5E] p-6 shadow-[4px_4px_0_#F43F5E] text-center">
        <div className="text-5xl mb-3">🚫</div>
        <h1
          className="font-ui font-900 text-xl sm:text-2xl text-[#F43F5E] uppercase tracking-wider mb-2"
          style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900 }}
        >
          ACCESS SUSPENDED
        </h1>
        <p className="font-ui text-sm text-gray-300 mb-4 leading-relaxed">
          Your account / device has been restricted from posting or participating on Paap Dholo due to violation of community safety guidelines and Indian Cyber Laws (IT Act 2000).
        </p>

        <div className="bg-black/60 p-3 border border-gray-800 text-left text-xs font-mono space-y-1 mb-4">
          <div><span className="text-gray-500">UID:</span> <span className="text-blue-400">{user?.uid || 'N/A'}</span></div>
          <div><span className="text-gray-500">Reason:</span> <span className="text-red-400">{banInfo.reason || 'General Cyber Law Violation'}</span></div>
        </div>

        <div className="font-ui text-xs text-gray-500">
          If you believe this is an error, contact our Grievance Officer: <br />
          <a href="mailto:grievance@paapdholo.com" className="text-yellow-400 underline">
            grievance@paapdholo.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default BannedNotice;
