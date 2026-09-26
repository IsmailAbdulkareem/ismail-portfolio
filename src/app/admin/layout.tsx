import type { Metadata } from "next";

// Wraps both the login page and the dashboard. Never indexed.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin — Ismail Abdul Kareem" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
