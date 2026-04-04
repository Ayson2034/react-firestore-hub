import { NavLink, Outlet } from "react-router-dom";
import { Home, CalendarDays, PlayCircle, User } from "lucide-react";

const tabs = [
  { to: "/", icon: Home, label: "홈" },
  { to: "/records", icon: CalendarDays, label: "기록" },
  { to: "/videos", icon: PlayCircle, label: "사용법" },
  { to: "/mypage", icon: User, label: "마이" },
];

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col max-w-[480px] mx-auto bg-background">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border/50 safe-bottom z-50">
        <div className="max-w-[480px] mx-auto flex">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 pt-3 text-xs transition-colors ${
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                }`
              }
            >
              <Icon className="w-5 h-5 mb-1" strokeWidth={1.5} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
