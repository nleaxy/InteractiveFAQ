import {
  LayoutDashboard,
  MessageSquare,
  Tags,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: LayoutDashboard, label: "Дашборд", active: false },
  { icon: MessageSquare, label: "Вопросы и ответы", active: true },
  { icon: Tags, label: "Категории", active: false },
  { icon: Search, label: "Настройка поиска", active: false },
  { icon: Settings, label: "Настройки", active: false },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F8F9FB]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">
              FAQ
            </div>
            Constructor
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                item.active
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-50"
                  : "text-slate-500",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white">
            <Sparkles className="w-5 h-5 mb-2" />
            <p className="text-sm font-medium">Генерация ИИ</p>
            <p className="text-[10px] opacity-80 mb-3">
              Создавайте FAQ в 10 раз быстрее
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="w-full text-blue-600 text-xs h-8"
            >
              Попробовать
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div className="text-sm text-slate-400">
            Проекты /{" "}
            <span className="text-slate-900 font-medium">Мой FAQ</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </main>
    </div>
  );
}
