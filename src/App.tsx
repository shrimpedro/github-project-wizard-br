
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import SettingsPage from "./pages/SettingsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import PropertiesPage from "./pages/PropertiesPage";
import MessagesPage from "./pages/MessagesPage";
import MetricsPage from "./pages/MetricsPage";
import UsersPage from "./pages/UsersPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SubmitPropertyPage from "./pages/SubmitPropertyPage";
import AuthGuard from "./components/AuthGuard";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CareersPage from "./pages/CareersPage";
import PageContent from "./pages/PageContent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit-property" element={<SubmitPropertyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/page/:slug" element={<PageContent />} />
          
          {/* Rotas Protegidas do Admin */}
          <Route path="/admin" element={
            <AuthGuard>
              <AdminPage />
            </AuthGuard>
          }>
            <Route index element={<AdminDashboardPage />} />
            <Route path="configuracoes" element={<SettingsPage />} />
            <Route path="imoveis" element={<PropertiesPage />} />
            <Route path="mensagens" element={<MessagesPage />} />
            <Route path="metricas" element={<MetricsPage />} />
            <Route path="usuarios" element={<UsersPage />} />
          </Route>
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
