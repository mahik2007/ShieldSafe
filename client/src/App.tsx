import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { SafetyModeProvider } from './hooks/useSafetyMode';
import { Layout } from './layouts/Layout';

import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
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

// Protected Route wrapper requiring active session
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <SafetyModeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication Flow: Register -> Login -> Onboarding */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />

            {/* Standalone Shared Journey View (No full app sidebar) */}
            <Route path="/journey/share/:token" element={<SharedJourneyView />} />

            {/* Core Protected App Shell */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
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
    </AuthProvider>
  );
};
