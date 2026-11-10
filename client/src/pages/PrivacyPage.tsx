import React from 'react';
import { Lock, EyeOff, Server, HardDrive, ShieldCheck, AlertCircle } from 'lucide-react';
import { Card, Alert } from '../components/UI';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-[#0e1422] p-6 rounded-2xl border border-stone-800 shadow-sm">
        <h1 className="text-2xl font-bold text-white dark:text-white flex items-center gap-2">
          <Lock className="w-6 h-6 text-teal-700" /> Privacy & Data Transparency
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
          Complete disclosure of how ShieldSafe handles your information, storage boundaries, and security architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white dark:text-white text-base mb-2">Zero External AI Transmission</h3>
          <p className="text-xs text-stone-200 dark:text-stone-300 leading-relaxed">
            The Digital Harassment Defender is a deterministic rules engine hosted directly on your server instance.
            Your private text messages, emails, and screenshots are NEVER transmitted to external language model APIs
            (OpenAI, Anthropic, Google, etc.).
          </p>
        </Card>

        <Card>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
            <HardDrive className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white dark:text-white text-base mb-2">Local SQLite Persistence</h3>
          <p className="text-xs text-stone-200 dark:text-stone-300 leading-relaxed">
            All incident records, follow-up notes, and hazard reports reside in a self-contained SQLite database
            file on your local machine. No external cloud databases (Firebase, Supabase, AWS RDS) have access to your data.
          </p>
        </Card>

        <Card>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white dark:text-white text-base mb-2">No Secret Location Tracking</h3>
          <p className="text-xs text-stone-200 dark:text-stone-300 leading-relaxed">
            GPS coordinates are requested strictly on-demand when you explicitly click "Locate Me" or initiate a
            Journey Guardian session. ShieldSafe does not run background geofencing or track you after closing the browser.
          </p>
        </Card>

        <Card>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white dark:text-white text-base mb-2">Cryptographic Share Links</h3>
          <p className="text-xs text-stone-200 dark:text-stone-300 leading-relaxed">
            Journey sharing links use 256-bit cryptographically random tokens stored as SHA-256 hashes in the database.
            Links automatically expire after 24 hours and can be revoked instantly at any moment with one click.
          </p>
        </Card>
      </div>

      <Alert type="warning" title="Important Technical Notice Regarding Local Encryption">
        While ShieldSafe stores data locally, standard SQLite databases are stored in plain filesystem format
        unless the host operating system disk encryption (e.g. BitLocker or FileVault) is active. Treat your local
        computer storage as you would any sensitive personal file.
      </Alert>
    </div>
  );
};



