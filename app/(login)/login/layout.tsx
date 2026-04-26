import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Login | Roshal Organic",
  description: "Sign in to the Roshal Organic storefront and admin dashboard.",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
