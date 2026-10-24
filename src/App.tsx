import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AddItemPage from "./pages/AddItemPage";
import ClaimsPage from "./pages/ClaimsPage";
import HomePage from "./pages/HomePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import ItemsPage from "./pages/ItemsPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import AiReviewPage from "./pages/AiReviewPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/items" element={<ItemsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/items/add" element={<AddItemPage />} />
        </Route>

        <Route path="/items/:itemId" element={<ItemDetailPage />} />
        <Route path="/claims" element={<ClaimsPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/review" element={<AiReviewPage />} />
          <Route path="/ai-review" element={<Navigate to="/review" replace />} />
        </Route>

        <Route path="/redirect" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
