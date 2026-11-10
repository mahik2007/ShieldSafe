import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SafetyModeProvider } from './hooks/useSafetyMode';
import { ThemeProvider } from './hooks/useTheme';
import { Layout } from './layouts/Layout';

import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { SafetyMapPage } from './pages/SafetyMapPage';
import { ReportHazardPage } from './pages/ReportHazardPage';
import { MessageAnalyzerPage } from './pages/MessageAnalyzerPage';
import { IncidentsListPage } from './pages/IncidentsListPage';
import { IncidentDetailPage } from './pages/IncidentDetailPage';
import { NewIncidentPage } from './pages/NewIncidentPage';
import { JourneyGuardianPage } from './pages/JourneyGuardianPage';
import { SharedJourneyView } from './pages/SharedJourneyView';
import { SafetyPlanPage } from './pages/SafetyPlanPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SafetyModeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Onboarding */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Standalone Shared Journey View (No full app sidebar) */}
            <Route path="/journey/share/:token" element={<SharedJourneyView />} />

            {/* Core App Shell */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/map" element={<SafetyMapPage />} />
              <Route path="/report-hazard" element={<ReportHazardPage />} />
              <Route path="/analyze" element={<MessageAnalyzerPage />} />
              <Route path="/incidents" element={<IncidentsListPage />} />
              <Route path="/incidents/new" element={<NewIncidentPage />} />
              <Route path="/incidents/:id" element={<IncidentDetailPage />} />
              <Route path="/journey" element={<JourneyGuardianPage />} />
              <Route path="/safety-plan" element={<SafetyPlanPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SafetyModeProvider>
    </ThemeProvider>
  );
};
