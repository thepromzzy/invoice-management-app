import { Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { theme, toggle } = useTheme();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "z-30 flex bg-sidebar text-sidebar-foreground",
        // Mobile: top bar
        "h-[72px] w-full flex-row items-center justify-between md:h-20",
        // Desktop: vertical sidebar
        "lg:fixed lg:inset-y-0 lg:left-0 lg:h-screen lg:w-[103px] lg:flex-col lg:rounded-r-2xl",
      )}
    >
      <Link
        to="/"
        aria-label="Invoicely home"
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-primary",
          "h-[72px] w-[72px] rounded-r-2xl md:h-20 md:w-20",
          "lg:h-[103px] lg:w-[103px] lg:rounded-r-2xl",
        )}
      >
        <span className="absolute inset-x-0 bottom-0 h-1/2 rounded-tl-2xl bg-primary-hover" aria-hidden />
        <svg viewBox="0 0 40 40" className="relative h-8 w-8 text-primary-foreground" fill="currentColor" aria-hidden>
          <path d="M20 4 L36 12 V28 L20 36 L4 28 V12 Z" opacity="0.2" />
          <path d="M14 14h12v3h-9v3h7v3h-7v6h-3z" />
        </svg>
      </Link>

      <div className="flex items-center gap-5 pr-6 lg:mt-auto lg:flex-col lg:gap-6 lg:pr-0 lg:pb-6">
        <button
          type="button"
          onClick={toggle}
          aria-label={`Activate ${theme === "dark" ? "light" : "dark"} mode`}
          className="text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring rounded-full p-1"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <div className="hidden h-full w-full border-t border-sidebar-border lg:block" />
        <div
          aria-label="User avatar"
          className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold text-sidebar lg:h-10 lg:w-10"
        >
          IN
        </div>
      </div>

      <span className="sr-only">Current path: {location.pathname}</span>
    </aside>
  );
}
