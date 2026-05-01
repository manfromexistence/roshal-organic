"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavOrganization({
  organization,
}: {
  organization: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
  const { isMobile } = useSidebar();
  const fallback = organization.name.slice(0, 2).toUpperCase();
  const organizationImage = organization.avatar || "/logo.png";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="text-sidebar-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg border border-sidebar-border/70 bg-sidebar-primary/10">
                <AvatarImage
                  src={organizationImage}
                  alt={organization.name}
                  className="object-contain p-1"
                />
                <AvatarFallback className="themed-avatar-fallback rounded-lg border border-border/60 bg-primary/10 font-medium text-primary dark:border-border/70 dark:bg-[color:color-mix(in_oklch,var(--card)_58%,var(--primary)_42%)] dark:text-foreground">
                  {fallback}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="font-wordmark truncate text-[0.92rem]">
                  {organization.name}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {organization.email}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-2 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg border border-border/70 bg-primary/10">
                  <AvatarImage
                    src={organizationImage}
                    alt={organization.name}
                    className="object-contain p-1"
                  />
                  <AvatarFallback className="themed-avatar-fallback rounded-lg border border-border/60 bg-primary/10 font-medium text-primary dark:border-border/70 dark:bg-[color:color-mix(in_oklch,var(--card)_58%,var(--primary)_42%)] dark:text-foreground">
                    {fallback}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <Link href="/admin/organizations">
                    <span className="font-wordmark truncate text-[0.92rem] hover:text-primary">
                      {organization.name}
                    </span>
                  </Link>
                  <span className="truncate text-xs text-muted-foreground">
                    {organization.email}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Admin's organization
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
