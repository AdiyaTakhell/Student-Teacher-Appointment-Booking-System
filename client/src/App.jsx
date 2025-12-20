import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer"; 
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { StudentDashboard } from "./pages/dashboard/StudentDashboard";
import { TeacherDashboard } from "./pages/dashboard/TeacherDashboard";
import { AdminDashboard } from "./pages/dashboard/AdminDashboard";

const queryClient = new QueryClient();

// 
const DashboardLayout = ({ children }) => (
  <div className="min-h-screen bg-neo-bg flex flex-col">
    <Navbar />
    <main className="flex-1 pb-10 pt-6 px-4">{children}</main>
    <Footer /> 
  </div>
);

// Protected Route Logic
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-xl">INITIALIZING SYSTEM...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" replace />;

  return children;
};

// Public Route Logic
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    if (user.role === 'student') return <Navigate to="/student" replace />;
    if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
  }
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ className: "border-2 border-black shadow-neo font-bold rounded-none" }} />
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            
            {/* Student */}
            <Route path="/student" element={
              <ProtectedRoute allowedRole="student">
                <DashboardLayout>
                  <StudentDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Teacher */}
            <Route path="/teacher" element={
              <ProtectedRoute allowedRole="teacher">
                <DashboardLayout>
                  <TeacherDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />

            
            <Route path="/admin" element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;