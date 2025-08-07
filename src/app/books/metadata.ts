import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Books - Premium Collection',
  description: 'Explore our vast collection of books across all genres. Fiction, non-fiction, mystery, romance, science fiction, fantasy, and more. Find your next great read with advanced filtering and search.',
  keywords: ['browse books', 'book catalog', 'fiction books', 'non-fiction books', 'mystery novels', 'romance books', 'science fiction', 'fantasy books'],
  openGraph: {
    title: 'Browse Books - Premium Collection | Thorn Bird Books',
    description: 'Explore our vast collection of books across all genres. Fiction, non-fiction, mystery, romance, science fiction, fantasy, and more.',
    url: '/books',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Books - Premium Collection | Thorn Bird Books',
    description: 'Explore our vast collection of books across all genres. Fiction, non-fiction, mystery, romance, science fiction, fantasy, and more.',
  },
  alternates: {
    canonical: '/books',
  },
};