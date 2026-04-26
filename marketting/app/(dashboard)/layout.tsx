import {
  ChevronLeft,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const metadata: Metadata = {
  title: "Dashboard - Roshal Organic",
  description: "Manage your account, orders, and wishlist",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <header className="border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        U
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">User</p>
                      <p className="text-xs text-muted-foreground">
                        user@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/watchlist" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      Watchlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      Back to Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Navigation Tabs */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-6 overflow-x-auto py-2">
            <Link
              href="/account"
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              <LayoutDashboard className="h-4 w-4" />
              Account
            </Link>
            <Link
              href="/orders"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              <ShoppingBag className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="/watchlist"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              <Heart className="h-4 w-4" />
              Watchlist
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
