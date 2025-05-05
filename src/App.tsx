
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import SettingsPage from "./pages/SettingsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import PropertiesPage from "./pages/PropertiesPage";
import MessagesPage from "./pages/MessagesPage";
import MetricsPage from "./pages/MetricsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Rotas do Admin */}
          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="configuracoes" element={<SettingsPage />} />
            <Route path="imoveis" element={<PropertiesPage />} />
            <Route path="mensagens" element={<MessagesPage />} />
            <Route path="metricas" element={<MetricsPage />} />
            {/* Adicione outras rotas do admin aqui */}
          </Route>
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
