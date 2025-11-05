import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PostComplaint from "./pages/PostComplaint";
import PublicFeed from "./pages/PublicFeed";
import ComplaintDetail from "./pages/ComplaintDetail";
import ComplaintsViewDashboard from "./pages/ComplaintsViewDashboard";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import AuthorityComplaintDetail from "./pages/AuthorityComplaintDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ✅ Protected Route Component
const ProtectedRoute = ({
  children,
  requireRole,
}: {
  children: React.ReactNode;
  requireRole?: string;
}) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ Not logged in
  if (!token) {
    console.warn("⚠️ No token found. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  // ✅ Role check if required
  if (requireRole && user.role !== requireRole) {
    console.warn(
      `⚠️ User role '${user.role}' doesn't match required role '${requireRole}'`
    );
    return <Navigate to="/feed" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />

              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Citizen Routes - Protected */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-complaint"
                element={
                  <ProtectedRoute>
                    <PostComplaint />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feed"
                element={
                  <ProtectedRoute>
                    <PublicFeed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/complaints-dashboard"
                element={
                  <ProtectedRoute>
                    <ComplaintsViewDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/complaint/:id"
                element={
                  <ProtectedRoute>
                    <ComplaintDetail />
                  </ProtectedRoute>
                }
              />

              {/* Authority Routes - Protected with role check */}
              <Route
                path="/authority"
                element={
                  <ProtectedRoute requireRole="authority">
                    <AuthorityDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/authority/complaint/:id"
                element={
                  <ProtectedRoute requireRole="authority">
                    <AuthorityComplaintDetail />
                  </ProtectedRoute>
                }
              />

              {/* 404 - Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
