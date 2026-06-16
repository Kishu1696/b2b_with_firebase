import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Skeleton } from "@/components/ui/Skeleton";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";

const Login = lazy(() => import("@/pages/Auth/Login"));
const Register = lazy(() => import("@/pages/Auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/Auth/ForgotPassword"));
const OtpVerification = lazy(() => import("@/pages/Auth/OtpVerification"));
const ResetPassword = lazy(() => import("@/pages/Auth/ResetPassword"));
const Dashboard = lazy(() => import("@/pages/Dashboard/ExecutiveDashboard"));
const Inventory = lazy(() => import("@/pages/Inventory/InventoryPage"));
const Pricing = lazy(() => import("@/pages/Pricing/PricingPage"));
const Buyers = lazy(() => import("@/pages/BuyerCRM/BuyerCRMPage"));
const Negotiation = lazy(() => import("@/pages/Negotiation/NegotiationPage"));
const Auctions = lazy(() => import("@/pages/Auctions/AuctionsPage"));
const Logistics = lazy(() => import("@/pages/Logistics/LogisticsPage"));
const Analytics = lazy(() => import("@/pages/Analytics/AnalyticsPage"));
const Contracts = lazy(() => import("@/pages/Contracts/ContractsPage"));
const Reports = lazy(() => import("@/pages/Reports/ReportsPage"));
const Notifications = lazy(() => import("@/pages/Notifications/NotificationsPage"));
const Settings = lazy(() => import("@/pages/Settings/SettingsPage"));

const queryClient = new QueryClient();

function RouteLoader() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* AuthProvider is INSIDE BrowserRouter (which lives in main.tsx) */}
      <AuthProvider>
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            {/* Public auth routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route index element={<Navigate to="/auth/login" replace />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="otp" element={<OtpVerification />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>

            {/* Protected application routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/buyers" element={<Buyers />} />
                <Route path="/negotiation" element={<Negotiation />} />
                <Route path="/auctions" element={<Auctions />} />
                <Route path="/logistics" element={<Logistics />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/contracts" element={<Contracts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}
