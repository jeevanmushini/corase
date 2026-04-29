"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/cart/CartDrawer";
import Footer from "@/components/layout/Footer";
import { FloatingToolbar } from "@/components/layout/FloatingToolbar";

// Routes that should NOT show the site navbar/footer (have their own chrome)
const NO_SHELL_ROUTES = ["/admin", "/login", "/register"];

export default function SiteShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isNoShellRoute = NO_SHELL_ROUTES.some((r) => pathname.startsWith(r));
    const showFloatingToolbar = !pathname.startsWith("/admin");

    return (
        <>
            {!isNoShellRoute && <Navbar />}
            {!isNoShellRoute && <CartDrawer />}
            <main className="relative min-h-screen">{children}</main>
            {!isNoShellRoute && <Footer />}
            {showFloatingToolbar && <FloatingToolbar />}
        </>
    );
}
