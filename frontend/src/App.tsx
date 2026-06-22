import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage"; // Тот самый Лендинг
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Admin/Dashboard";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import GeneratePage from "./pages/Admin/GeneratePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Главная страница самого сервиса (Лендинг) */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Страница входа для админов */}
        <Route path="/login" element={<LoginPage />} />

        {/* 3. Панель управления (Админка) */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/generate" element={<GeneratePage />} />

        {/* 4. Страница поиска для клиентов (например, по адресу /search или /view) */}
        {/* В будущем здесь будет /view/:id */}
        <Route path="/search" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
