import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/store/cartStore";
import CartDrawer from "@/components/cart/CartDrawer";
import { AuthProvider } from "@/store/authStore";
import AuthModal from "@/components/auth/AuthModal";
import { PrescriptionProvider } from "@/store/prescriptionStore";
import { WishlistProvider } from "@/store/wishlistStore";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "MediCart — Your Trusted Online Pharmacy",
  description: "Get genuine medicines, vitamins & health products delivered in 2 hours. Trusted by 2M+ customers. FDA approved, 50K+ products.",
  keywords: "online pharmacy, buy medicines online, health products, vitamins, supplements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ToastProvider>
          <WishlistProvider>
            <PrescriptionProvider>
              <AuthProvider>
                <CartProvider>
                  {children}
                  <CartDrawer />
                  <AuthModal />
                </CartProvider>
              </AuthProvider>
            </PrescriptionProvider>
          </WishlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
