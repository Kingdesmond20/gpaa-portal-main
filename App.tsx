import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Footer from './components/Footer';
import VersionChecker from './components/VersionChecker';
import PageSkeleton from './components/PageSkeleton';
import ToastContainer from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

// Eager load critical pages
import Home from './pages/Home';

// Lazy load other pages for better performance
const About = lazy(() => import('./pages/About'));
const History = lazy(() => import('./pages/History'));
const Programs = lazy(() => import('./pages/Programs'));
const Membership = lazy(() => import('./pages/Membership'));
const MembershipJoin = lazy(() => import('./pages/MembershipJoin'));
const Events = lazy(() => import('./pages/Events'));
const ConferenceArchive = lazy(() => import('./pages/ConferenceArchive'));
const Conference21st = lazy(() => import('./pages/Conference21st'));
const Conference22nd = lazy(() => import('./pages/Conference22nd'));
const Advocacy = lazy(() => import('./pages/Advocacy'));
const News = lazy(() => import('./pages/News'));
const NewsResources = lazy(() => import('./pages/NewsResources'));
const Resources = lazy(() => import('./pages/Resources'));
const Contact = lazy(() => import('./pages/Contact'));
const Donate = lazy(() => import('./pages/Donate'));
const GetInvolved = lazy(() => import('./pages/GetInvolved'));
const Volunteer = lazy(() => import('./pages/Volunteer'));
const Careers = lazy(() => import('./pages/Careers'));
const Partnerships = lazy(() => import('./pages/Partnerships'));
const Welfare = lazy(() => import('./pages/Welfare'));
const Documents = lazy(() => import('./pages/Documents'));
const MembersDirectory = lazy(() => import('./pages/MembersDirectory'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const SetPassword = lazy(() => import('./pages/SetPassword'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ApplicationsQueue = lazy(() => import('./pages/admin/ApplicationsQueue'));
const DocumentsManager = lazy(() => import('./pages/admin/DocumentsManager'));
const AwardsManager = lazy(() => import('./pages/admin/AwardsManager'));
const AwardsCampaignAdmin = lazy(() => import('./pages/admin/AwardsCampaignAdmin'));
const MemberDashboard = lazy(() => import('./pages/portal/MemberDashboard'));
// GPAA Prestigious Awards voting — embedded from gpaa-voting-platform's
// public API (a separate deployment; see lib/votingApi.ts).
const Awards = lazy(() => import('./pages/Awards'));
const AwardsCampaign = lazy(() => import('./pages/AwardsCampaign'));
const AwardsCategory = lazy(() => import('./pages/AwardsCategory'));
const AwardsContestant = lazy(() => import('./pages/AwardsContestant'));
const AwardsPaymentReturn = lazy(() => import('./pages/AwardsPaymentReturn'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 10_000,
    },
  },
});

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <Suspense fallback={<PageSkeleton />}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/about/history" element={<History />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/membership/join" element={<MembershipJoin />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/conference-archive" element={<ConferenceArchive />} />
            <Route path="/events/conference-archive/21st" element={<Conference21st />} />
            <Route path="/events/conference-archive/22nd" element={<Conference22nd />} />
            <Route path="/advocacy" element={<Advocacy />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/get-involved/volunteer" element={<Volunteer />} />
            <Route path="/get-involved/careers" element={<Careers />} />
            <Route path="/get-involved/partnerships" element={<Partnerships />} />
            <Route path="/news" element={<News />} />
            <Route path="/news-resources" element={<NewsResources />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/welfare" element={<Welfare />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/members-directory" element={<MembersDirectory />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/accept-invite" element={<SetPassword />} />
            <Route path="/reset-password" element={<SetPassword />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute role="admin">
                  <ApplicationsQueue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/documents"
              element={
                <ProtectedRoute role="admin">
                  <DocumentsManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/awards"
              element={
                <ProtectedRoute role="admin">
                  <AwardsManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/awards/:campaignId"
              element={
                <ProtectedRoute role="admin">
                  <AwardsCampaignAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/membership/dashboard"
              element={
                <ProtectedRoute>
                  <MemberDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/awards/payment/return" element={<AwardsPaymentReturn />} />
            <Route path="/awards/:campaignSlug" element={<AwardsCampaign />} />
            <Route path="/awards/:campaignSlug/categories/:categorySlug" element={<AwardsCategory />} />
            <Route path="/awards/:campaignSlug/contestants/:contestantSlug" element={<AwardsContestant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <VersionChecker />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main id="main-content" className="grow">
              <AnimatedRoutes />
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
