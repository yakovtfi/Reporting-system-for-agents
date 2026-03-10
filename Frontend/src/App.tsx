import { BrowserRouter,Route, Routes } from "react-router-dom";
import "./App.css"
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from './pages/LoginPage';
import AgentDashboard from "./pages/AgentDashboard";
import NewReportPage from "./pages/NewReportPage";
import CsvUploadPage from "./pages/CSVUploadPage";
import MyReportsPage from "./pages/MyReportsPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReportsPage from "./pages/AdminReportsPage";
import AdminUsersPage from "./pages/AdminUsersPage";

const App = () => {
  return(
  <AuthProvider>
    <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/" element={<LoginPage/>}/>
        <Route
        path="/agent"
        element={
          <ProtectedRoute roles={["agent"]}>
            <AgentDashboard/>
          </ProtectedRoute>
        }
        />
        <Route
        path="/reports/new"
        element={
          <ProtectedRoute roles={["agent"]}>
            <NewReportPage/>
          </ProtectedRoute>
        }/>
        <Route
        path="/reports/upload"
        element={
          <ProtectedRoute roles={["agent"]}>
            <CsvUploadPage></CsvUploadPage>
          </ProtectedRoute>
        }/>
        <Route
              path="/reports/mine"
              element={
                <ProtectedRoute roles={["agent"]}>
                  <MyReportsPage />
                </ProtectedRoute>
              }
            />
             <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminReportsPage />
                </ProtectedRoute>
              }
            />
      </Routes>
    </Layout>
    </BrowserRouter>
  </AuthProvider>
  )
}

export default App