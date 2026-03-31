import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Sobre from "./pages/Sobre";
import Manual from "./pages/Manual";
import Inscricao from "./pages/Inscricao";
import Membros from "./pages/Membros";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import Metas from "./pages/Metas";
import Dashboard from "./pages/Dashboard";
import Crimes from "./pages/Crimes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/manual" element={<Manual />} />
          <Route path="/inscricao" element={<Inscricao />} />
          <Route path="/membros" element={<Membros />} />
          <Route path="/login" element={<Login />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/metas" element={<Metas />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crimes" element={<Crimes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
