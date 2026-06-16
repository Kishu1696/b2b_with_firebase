import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { navItems } from "@/routes/navigation";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/utils/cn";

export function Sidebar() {
  const collapsed = useAppStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <motion.aside
      animate={{ width: collapsed ? 86 : 280 }}
      className="glass-panel fixed bottom-0 left-0 top-0 z-30 hidden border-y-0 border-l-0 lg:block"
    >
      <div className="flex h-full flex-col p-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-white shadow-glow">
              <Bot className="h-6 w-6" />
            </div>
            {!collapsed ? (
              <div>
                <p className="text-base font-extrabold text-white">LiquidFlow AI</p>
                <p className="text-xs text-muted">Liquidation OS</p>
              </div>
            ) : null}
          </div>
          {!collapsed ? (
            <Button size="icon" variant="ghost" onClick={toggleSidebar} aria-label="Collapse sidebar">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : null}
        </div>

        <nav className="space-y-1 overflow-y-auto pr-1">
          {navItems.slice(0, 12).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold text-muted transition hover:bg-white/10 hover:text-white",
                  isActive && "bg-secondary/15 text-white ring-1 ring-secondary/25",
                  collapsed && "justify-center"
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-lg border border-secondary/20 bg-secondary/10 p-4">
          {!collapsed ? (
            <>
              <p className="text-sm font-bold text-white">AI Opportunity Pulse</p>
              <p className="mt-2 text-xs leading-5 text-blue-100/80">14 lots can be repriced today for a projected $420K lift.</p>
            </>
          ) : (
            <Bot className="mx-auto h-5 w-5 text-secondary" />
          )}
        </div>
      </div>
    </motion.aside>
  );
}
