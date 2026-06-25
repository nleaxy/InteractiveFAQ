import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage"; // Тот самый Лендинг
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Admin/Dashboard";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import GeneratePage from "./pages/Admin/GeneratePage";
import CatalogPage from "./pages/CatalogPage";
import DocsPage from "./pages/DocsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Главная страница самого сервиса (Лендинг) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/catalog" element={<CatalogPage />} />

        {/* 2. Страница входа для админов */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/docs" element={<DocsPage />} />

        {/* Страница для владельца (Админка) */}
        <Route path="/admin/:projectSlug" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/generate" element={<GeneratePage />} />

        {/* Страница для клиентов (Поиск) */}
        <Route path="/faq/:projectSlug" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
