import SEO from './SEO';

// SEO presets for different page types
export const HomepageSEO = () => (
  <SEO
    title="Thorn Bird Books - Your Premier Literary Destination"
    description="Discover exceptional books, attend literary events, and join our vibrant reading community. Publishing excellence meets literary passion at Thorn Bird Books."
    keywords={['bookstore', 'literary events', 'publishing', 'books', 'reading community', 'authors', 'literature']}
    type="website"
    url="/"
    schemaData={{
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Thorn Bird Books',
      url: 'https://thornbirdbooks.com',
      logo: 'https://thornbirdbooks.com/images/logo.png',
      description: 'A premier publishing company specializing in quality books and literary events.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Literary Lane',
        addressLocality: 'Booktown',
        addressRegion: 'BT',
        postalCode: '12345',
        addressCountry: 'US'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-123-4567',
        contactType: 'customer service',
        email: 'info@thornbirdbooks.com'
      },
      sameAs: [
        'https://www.facebook.com/thornbirdbooks',
        'https://www.twitter.com/thornbirdbooks',
        'https://www.instagram.com/thornbirdbooks'
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Book Catalog',
        itemListElement: [
          {
            '@type': 'OfferCategory',
            name: 'Fiction Books'
          },
          {
            '@type': 'OfferCategory',
            name: 'Non-Fiction Books'
          },
          {
            '@type': 'OfferCategory',
            name: 'Literary Events'
          }
        ]
      }
    }}
  />
);

export const BooksSEO = () => (
  <SEO
    title="Books - Thorn Bird Books | Fiction, Non-Fiction & More"
    description="Browse our extensive collection of fiction, non-fiction, and specialty books. Find your next great read at Thorn Bird Books."
    keywords={['books', 'fiction', 'non-fiction', 'novel', 'literature', 'bookstore', 'buy books']}
    type="website"
    url="/books"
    schemaData={{
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Book Collection',
      description: 'Browse our extensive collection of books across all genres.',
      mainEntity: {
        '@type': 'ItemList',
        name: 'Books',
        description: 'Collection of books available at Thorn Bird Books'
      }
    }}
  />
);

export const EventsSEO = () => (
  <SEO
    title="Literary Events - Thorn Bird Books | Author Readings & Workshops"
    description="Join our exciting literary events including author readings, book launches, writing workshops, and community discussions."
    keywords={['literary events', 'author readings', 'book launches', 'writing workshops', 'literary community']}
    type="website"
    url="/events"
    schemaData={{
      '@context': 'https://schema.org',
      '@type': 'EventSeries',
      name: 'Literary Events',
      description: 'Regular literary events hosted by Thorn Bird Books',
      organizer: {
        '@type': 'Organization',
        name: 'Thorn Bird Books',
        url: 'https://thornbirdbooks.com'
      }
    }}
  />
);

export const AboutSEO = () => (
  <SEO
    title="About Us - Thorn Bird Books | Our Story & Mission"
    description="Learn about Thorn Bird Books' mission to promote literacy, support authors, and build a vibrant literary community through quality publishing and events."
    keywords={['about thorn bird books', 'publishing company', 'literary mission', 'book publishing', 'author support']}
    type="website"
    url="/about"
  />
);

export const ContactSEO = () => (
  <SEO
    title="Contact Us - Thorn Bird Books | Get in Touch"
    description="Contact Thorn Bird Books for publishing inquiries, event information, or general questions. We're here to help with all your literary needs."
    keywords={['contact', 'publishing inquiries', 'customer service', 'get in touch']}
    type="website"
    url="/contact"
    schemaData={{
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Thorn Bird Books',
      description: 'Get in touch with Thorn Bird Books for all your literary needs.'
    }}
  />
);

export const ServicesSEO = () => (
  <SEO
    title="Publishing Services - Thorn Bird Books | Professional Book Publishing"
    description="Professional publishing services including editing, design, printing, and marketing. Turn your manuscript into a published book with Thorn Bird Books."
    keywords={['publishing services', 'book editing', 'book design', 'manuscript publishing', 'author services']}
    type="website"
    url="/services"
    schemaData={{
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Book Publishing Services',
      description: 'Comprehensive publishing services for authors and manuscripts.',
      provider: {
        '@type': 'Organization',
        name: 'Thorn Bird Books'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Publishing Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Manuscript Editing'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Book Design & Layout'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Publishing & Distribution'
            }
          }
        ]
      }
    }}
  />
);

interface BookPageSEOProps {
  book: {
    _id: string;
    title: string;
    author: string;
    description: string;
    price: number;
    isbn?: string;
    category: string;
    imageUrl?: string;
    rating?: number;
    stock: number;
  };
}

export const BookPageSEO: React.FC<BookPageSEOProps> = ({ book }) => (
  <SEO
    title={`${book.title} by ${book.author} - Thorn Bird Books`}
    description={book.description || `Discover "${book.title}" by ${book.author}. Available now at Thorn Bird Books with fast shipping and excellent customer service.`}
    keywords={[book.title, book.author, book.category, 'book', 'buy book', 'literature']}
    type="book"
    url={`/books/${book._id}`}
    image={book.imageUrl}
    isbn={book.isbn}
    price={book.price}
    category={book.category}
    availability={book.stock > 0 ? 'in_stock' : 'out_of_stock'}
    author={book.author}
    schemaData={{
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      author: {
        '@type': 'Person',
        name: book.author
      },
      description: book.description,
      isbn: book.isbn,
      genre: book.category,
      image: book.imageUrl,
      aggregateRating: book.rating ? {
        '@type': 'AggregateRating',
        ratingValue: book.rating,
        bestRating: 5,
        worstRating: 1
      } : undefined,
      offers: {
        '@type': 'Offer',
        price: book.price,
        priceCurrency: 'USD',
        availability: book.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'Thorn Bird Books'
        }
      },
      publisher: {
        '@type': 'Organization',
        name: 'Thorn Bird Books',
        url: 'https://thornbirdbooks.com'
      }
    }}
  />
);

interface EventPageSEOProps {
  event: {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    price?: number;
    isFree: boolean;
    imageUrl?: string;
  };
}

export const EventPageSEO: React.FC<EventPageSEOProps> = ({ event }) => (
  <SEO
    title={`${event.title} - Literary Event | Thorn Bird Books`}
    description={event.description || `Join us for "${event.title}" at Thorn Bird Books. A special literary event you won't want to miss.`}
    keywords={[event.title, 'literary event', 'author event', 'book event', 'reading', 'thorn bird books']}
    type="article"
    url={`/events/${event._id}`}
    image={event.imageUrl}
    publishDate={new Date(event.date).toISOString()}
    schemaData={{
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.title,
      description: event.description,
      startDate: event.date,
      location: {
        '@type': 'Place',
        name: event.location,
        address: event.location
      },
      organizer: {
        '@type': 'Organization',
        name: 'Thorn Bird Books',
        url: 'https://thornbirdbooks.com'
      },
      offers: event.isFree ? {
        '@type': 'Offer',
        price: 0,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      } : event.price ? {
        '@type': 'Offer',
        price: event.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      } : undefined,
      image: event.imageUrl
    }}
  />
);

export default {
  HomepageSEO,
  BooksSEO,
  EventsSEO,
  AboutSEO,
  ContactSEO,
  ServicesSEO,
  BookPageSEO,
  EventPageSEO
};