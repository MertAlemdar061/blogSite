import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/public/HomePage';
import PostDetailPage from './pages/public/PostDetailPage';
import CategoryPage from './pages/public/CategoryPage';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import PostListPage from './pages/admin/PostListPage';
import PostEditorPage from './pages/admin/PostEditorPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import NotFoundPage from './pages/public/NotFoundPage';

export default function App() {
  return (
    <Routes>
      {/* Ziyaretçi arayüzü */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/yazi/:slug" element={<PostDetailPage />} />
        <Route path="/kategori/:slug" element={<CategoryPage />} />
        <Route path="/etiket/:slug" element={<CategoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Giriş */}
      <Route path="/login" element={<LoginPage />} />

      {/* Yönetim paneli */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="posts" element={<PostListPage />} />
        <Route path="posts/new" element={<PostEditorPage />} />
        <Route path="posts/:id/edit" element={<PostEditorPage />} />
        <Route path="categories" element={<CategoriesPage />} />
      </Route>
    </Routes>
  );
}
