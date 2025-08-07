import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL('https://thornbirdbooks.com'),
  title: {
    default: 'Thorn Bird Books - Your Premier Online Bookstore',
    template: '%s | Thorn Bird Books'
  },
  description: "Discover thousands of books across all genres. Join our literary community with events, book clubs, and author readings. Fast delivery and excellent customer service.",
  keywords: ["books", "bookstore", "literature", "reading", "novels", "fiction", "non-fiction", "online bookstore", "book events", "author readings"],
  authors: [{ name: "Thorn Bird Books Team" }],
  creator: "Thorn Bird Books",
  publisher: "Thorn Bird Books",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://thornbirdbooks.com',
    siteName: 'Thorn Bird Books',
    title: 'Thorn Bird Books - Your Premier Online Bookstore',
    description: "Discover thousands of books across all genres. Join our literary community with events, book clubs, and author readings.",
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Thorn Bird Books - Online Bookstore',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thornbirdbooks',
    creator: '@thornbirdbooks',
    title: 'Thorn Bird Books - Your Premier Online Bookstore',
    description: "Discover thousands of books across all genres. Join our literary community with events, book clubs, and author readings.",
    images: ['/images/twitter-card.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://thornbirdbooks.com',
  },
  category: 'books',
};

// Structured data for the organization
const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Thorn Bird Books",
  "url": "https://thornbirdbooks.com",
  "logo": "https://thornbirdbooks.com/images/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-BOOKS",
    "contactType": "customer service",
    "areaServed": "US",
    "availableLanguage": "en"
  },
  "sameAs": [
    "https://facebook.com/thornbirdbooks",
    "https://twitter.com/thornbirdbooks",
    "https://instagram.com/thornbirdbooks"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <link rel="canonical" href="https://thornbirdbooks.com" />
        <meta name="theme-color" content="#1e40af" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased font-sans min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
