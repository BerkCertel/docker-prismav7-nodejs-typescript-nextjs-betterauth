"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  QrCode,
  MapPin,
  Grid3x3,
  Layers,
  Users,
  ShoppingCart,
  LogOut,
  Hotel,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LocaleSelector } from "../general/locale-selector";
import { ThemeToggle } from "../general/theme-toggle";

const navigationItems = [
  {
    title: "nav.qrCodes",
    href: "/admin/qr-codes",
    icon: QrCode,
  },
  {
    title: "nav.locations",
    href: "/admin/locations",
    icon: MapPin,
  },
  {
    title: "nav.categories",
    href: "/admin/categories",
    icon: Grid3x3,
  },
  {
    title: "nav.subcategories",
    href: "/admin/subcategories",
    icon: Layers,
  },
  {
    title: "nav.users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "nav.orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations();

  const handleLogout = () => {
    // Logout logic will be handled by Better Auth
    console.log("[v0] Logout triggered");
  };

  return (
    <Sidebar collapsible="icon" className="">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
            <Hotel className="h-4 w-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">Hotel Order</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={t(item.title)}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.title)}</span>
                        {isActive && (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 p-2">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
            <LocaleSelector />
            <ThemeToggle />
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("nav.logout")}
            </Button>
          </div>
          <div className="hidden group-data-[collapsible=icon]:flex flex-col gap-2">
            <LocaleSelector />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-9 w-9"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
