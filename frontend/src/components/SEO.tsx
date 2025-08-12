import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  type?: 'website' | 'article' | 'book' | 'product';
  image?: string;
  url?: string;
  publishDate?: string;
  modifiedDate?: string;
  isbn?: string;
  price?: number;
  currency?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'preorder';
  category?: string;
  schemaData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Thorn Bird Books - Your Premier Literary Destination',
  description = 'Discover exceptional books, attend literary events, and join our vibrant reading community. Publishing excellence meets literary passion at Thorn Bird Books.',
  keywords = ['books', 'publishing', 'literature', 'reading', 'events', 'authors', 'bookstore'],
  author = 'Thorn Bird Books',
  type = 'website',
  image = '/images/thorn-bird-books-og.jpg',
  url,
  publishDate,
  modifiedDate,
  isbn,
  price,
  currency = 'USD',
  availability = 'in_stock',
  category,
  schemaData
}) => {
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://thornbirdbooks.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImageUrl = image?.startsWith('http') ? image : `${siteUrl}${image}`;

  // Generate structured data based on content type
  const generateStructuredData = () => {
    if (schemaData) {
      return schemaData;
    }

    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': type === 'book' ? 'Book' : type === 'product' ? 'Product' : 'WebSite',
      name: title,
      description,
      url: fullUrl,
      image: fullImageUrl,
      author: {
        '@type': 'Organization',
        name: 'Thorn Bird Books',
        url: siteUrl
      }
    };

    if (type === 'book' && isbn) {
      return {
        ...baseSchema,
        '@type': 'Book',
        isbn: isbn,
        bookFormat: 'https://schema.org/Paperback',
        genre: category,
        publisher: {
          '@type': 'Organization',
          name: 'Thorn Bird Books',
          url: siteUrl
        },
        offers: price ? {
          '@type': 'Offer',
          price: price,
          priceCurrency: currency,
          availability: `https://schema.org/${availability === 'in_stock' ? 'InStock' : 'OutOfStock'}`,
          seller: {
            '@type': 'Organization',
            name: 'Thorn Bird Books'
          }
        } : undefined
      };
    }

    if (type === 'product' && price) {
      return {
        ...baseSchema,
        '@type': 'Product',
        category: category,
        offers: {
          '@type': 'Offer',
          price: price,
          priceCurrency: currency,
          availability: `https://schema.org/${availability === 'in_stock' ? 'InStock' : 'OutOfStock'}`,
          seller: {
            '@type': 'Organization',
            name: 'Thorn Bird Books'
          }
        }
      };
    }

    if (type === 'article') {
      return {
        ...baseSchema,
        '@type': 'Article',
        headline: title,
        datePublished: publishDate,
        dateModified: modifiedDate || publishDate,
        publisher: {
          '@type': 'Organization',
          name: 'Thorn Bird Books',
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}/images/logo.png`
          }
        }
      };
    }

    return {
      ...baseSchema,
      '@type': 'WebSite',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Thorn Bird Books" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@ThornBirdBooks" />
      <meta name="twitter:creator" content="@ThornBirdBooks" />

      {/* Book-specific meta tags */}
      {type === 'book' && isbn && (
        <>
          <meta property="book:isbn" content={isbn} />
          {category && <meta property="book:genre" content={category} />}
          {author && <meta property="book:author" content={author} />}
        </>
      )}

      {/* Article-specific meta tags */}
      {type === 'article' && (
        <>
          {publishDate && <meta property="article:published_time" content={publishDate} />}
          {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
          {category && <meta property="article:section" content={category} />}
        </>
      )}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#eab308" />
      <meta name="msapplication-TileColor" content="#eab308" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Additional meta tags for better crawling */}
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    </Helmet>
  );
};

export default SEO;