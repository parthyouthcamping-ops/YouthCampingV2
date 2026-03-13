import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
    weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: {
        default: "YouthCamping | Premium Luxury Travel Quotations",
        template: "%s | YouthCamping"
    },
    description: "Experience ultra-luxury travel with YouthCamping. Get personalized, curated travel proposals for your next adventure.",
    metadataBase: new URL("https://quote.youthcamping.in"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "YouthCamping | Ultra Luxury Travel Curators",
        description: "Bespoke travel experiences curated just for you. View your exclusive proposal today.",
        url: "https://quote.youthcamping.in",
        siteName: "YouthCamping",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "YouthCamping Luxury Travel",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "YouthCamping | Ultra Luxury Travel",
        description: "Experience bespoke luxury travel. One trip at a time.",
        images: ["/og-image.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon-16x16.png",
        apple: "/apple-touch-icon.png",
    },
};

import { Toaster } from "sonner";
import { Navbar } from "@/components/ui/Navbar";
import { WhatsAppFAB } from "@/components/ui/WhatsAppFAB";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${montserrat.variable} font-montserrat antialiased`}>
                <Navbar />
                {children}
                <WhatsAppFAB />
                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}
