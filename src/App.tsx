import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminRules from "@/pages/admin/AdminRules";
import RuleBuilder from "@/pages/admin/RuleBuilder";
import AdminExpenses from "@/pages/admin/AdminExpenses";
import EmployeeExpenses from "@/pages/employee/EmployeeExpenses";
import NewExpense from "@/pages/employee/NewExpense";
import ExpenseDetail from "@/pages/employee/ExpenseDetail";
import ManagerApprovals from "@/pages/manager/ManagerApprovals";
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(222 40% 10%)',
              color: 'hsl(210 40% 96%)',
              border: '1px solid hsl(222 20% 18%)',
              borderRadius: '12px',
            },
          }}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']}><AppLayout /></ProtectedRoute>}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/rules" element={<AdminRules />} />
              <Route path="/admin/rules/new" element={<RuleBuilder />} />
              <Route path="/admin/rules/:id/edit" element={<RuleBuilder />} />
              <Route path="/admin/expenses" element={<AdminExpenses />} />
            </Route>

            {/* Employee routes */}
            <Route element={<ProtectedRoute allowedRoles={['employee']}><AppLayout /></ProtectedRoute>}>
              <Route path="/employee/expenses" element={<EmployeeExpenses />} />
              <Route path="/employee/expenses/new" element={<NewExpense />} />
              <Route path="/employee/expenses/:id" element={<ExpenseDetail />} />
              <Route path="/employee/expenses/edit/:id" element={<NewExpense />} />
            </Route>

            {/* Manager routes */}
            <Route element={<ProtectedRoute allowedRoles={['manager']}><AppLayout /></ProtectedRoute>}>
              <Route path="/manager/approvals" element={<ManagerApprovals />} />
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
