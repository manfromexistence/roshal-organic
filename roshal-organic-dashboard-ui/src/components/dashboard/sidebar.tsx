"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ClipboardList,
  CreditCard,
  Users,
  Sparkles,
  Settings,
  Leaf
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  { title: "Products", icon: ShoppingBag, url: "/products" },
  { title: "Categories", icon: Layers, url: "/categories" },
  { title: "Orders", icon: ClipboardList, url: "/orders" },
  { title: "Payments", icon: CreditCard, url: "/payments" },
  { title: "Users", icon: Users, url: "/users" },
  { title: "AI Marketing", icon: Sparkles, url: "/marketing" },
  { title: "Delivery Charge", icon: Settings, url: "/settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-6">
        <Link href="/" className="flex items-center gap-2 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Leaf className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight group-data-[collapsible=icon]:hidden font-headline">
            Roshal Admin
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
                className="py-6 px-4"
              >
                <Link href={item.url}>
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:hidden bg-sidebar-accent/50 rounded-lg p-3">
          <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xs">RA</div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">Roshal Admin</span>
            <span className="text-xs text-sidebar-foreground/70 truncate">admin@roshal.com</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
