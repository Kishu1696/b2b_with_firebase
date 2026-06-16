import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, Menu, Moon, Plus, Search, UserRound, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppStore } from "@/store/appStore";

export function Navbar() {
  const notifications = useAppStore((state) => state.notifications);
  const clearNotifications = useAppStore((state) => state.clearNotifications);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/75 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <Button size="icon" variant="ghost" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input className="max-w-2xl pl-9" placeholder="Search buyers, SKUs, auctions, contracts..." />
        </div>
        <Button variant="subtle" className="ml-auto hidden sm:inline-flex">
          <Plus className="h-4 w-4" />
          Quick Action
        </Button>
        <Button size="icon" variant="ghost" aria-label="AI command">
          <Zap className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost" aria-label="Theme switcher">
          <Moon className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost" onClick={clearNotifications} aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5" />
          {notifications ? (
            <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
              {notifications}
            </span>
          ) : null}
        </Button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button size="icon" variant="subtle" aria-label="User menu">
              <UserRound className="h-5 w-5" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" className="glass-panel z-50 min-w-48 rounded-lg p-2">
            {["Profile", "Team", "Billing", "Sign out"].map((item) => (
              <DropdownMenu.Item key={item} className="cursor-pointer rounded-md px-3 py-2 text-sm text-slate-200 outline-none hover:bg-white/10">
                {item}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
