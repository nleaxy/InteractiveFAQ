import { useState } from "react";
import { Mail, Lock, User, Loader2 } from "lucide-react"; // Добавили иконку User
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import Logo from "@/assets/logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Состояния для полей
  const [name, setName] = useState(""); // Добавили поле для имени
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // --- ЛОГИКА ВХОДА ---
        const response = await api.post("/api/v1/login", {
          email: email,
          password: password,
        });

        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user_name", user.name);
        navigate("/projects");
      } else {
        // --- ЛОГИКА РЕГИСТРАЦИИ (Исправлено) ---
        const response = await api.post("/api/v1/register", {
          name: name, // Передаем введенное имя
          email: email,
          password: password,
        });

        // После регистрации бэк сразу отдает токен
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user_name", user.name);

        alert("Регистрация успешна!");
        navigate("/projects");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      // Выводим ошибку от бэкенда (например, "Пользователь уже существует")
      setError(
        err.response?.data?.detail || "Произошла ошибка. Проверьте данные.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[540px] bg-white rounded-[32px] shadow-sm p-12 flex flex-col items-center border border-[#EBF2FF]">
        <div className="w-[80px] h-[80px] bg-white rounded-full shadow-sm flex items-center justify-center border border-[#EBF2FF] overflow-hidden mb-6">
          <img
            src={Logo}
            alt="Logo"
            className="w-full h-full object-contain p-2"
          />
        </div>

        <h1 className="text-[32px] font-semibold text-[#1A2B4B] mb-2">
          SynFAQ
        </h1>
        <h2 className="text-[24px] font-medium text-[#0D1B4C] mb-2 text-center leading-tight">
          {isLogin ? "Добро пожаловать" : "Создать аккаунт"}
        </h2>

        {/* ПЕРЕКЛЮЧАТЕЛЬ */}
        <div className="w-full max-w-[280px] h-[48px] bg-[#EBF0F7] rounded-full p-1 flex mt-6 mb-8">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`flex-1 rounded-full text-[16px] font-medium transition-all ${
              isLogin ? "bg-white text-[#1A2B4B] shadow-sm" : "text-[#64748B]"
            }`}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`flex-1 rounded-full text-[16px] font-medium transition-all ${
              !isLogin ? "bg-white text-[#1A2B4B] shadow-sm" : "text-[#64748B]"
            }`}
          >
            Регистрация
          </button>
        </div>

        {error && (
          <div className="w-full mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          {/* Поле ИМЯ (Показывается только при регистрации) */}
          {!isLogin && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[16px] font-medium text-[#1A2B4B] ml-1">
                Как вас зовут?
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <Input
                  required
                  type="text"
                  placeholder="Александр"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[56px] bg-[#F8FAFC] border-[#E2E8F0] rounded-[16px] pl-12 text-[16px] focus-visible:border-[#2051FF]"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[16px] font-medium text-[#1A2B4B] ml-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
              <Input
                required
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[56px] bg-[#F8FAFC] border-[#E2E8F0] rounded-[16px] pl-12 text-[16px] focus-visible:border-[#2051FF]"
              />
            </div>
          </div>

          {/* Пароль */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[16px] font-medium text-[#1A2B4B]">
                Пароль
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
              <Input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[56px] bg-[#F8FAFC] border-[#E2E8F0] rounded-[16px] pl-12 text-[16px] focus-visible:border-[#2051FF]"
              />
            </div>
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full h-[60px] bg-[#2051FF] hover:bg-blue-700 rounded-[16px] text-[18px] font-medium text-white shadow-lg transition-all active:scale-[0.98] mt-4"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isLogin ? (
              "Войти в систему"
            ) : (
              "Зарегистрироваться"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
