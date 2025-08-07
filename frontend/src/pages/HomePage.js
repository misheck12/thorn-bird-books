import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="section bg-gradient-primary">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Welcome to Thorn Bird Books
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Where stories take flight and literary dreams come true. 
              Your partner in publishing excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/books" className="btn btn-secondary">
                Browse Books
              </Link>
              <Link to="/services" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Featured Books
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated selection of outstanding titles
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sample book cards */}
            {[1, 2, 3].map((book) => (
              <div key={book} className="card">
                <div className="h-64 bg-gray-200 rounded-t-xl flex items-center justify-center">
                  <span className="text-gray-500">Book Cover {book}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Sample Book Title {book}</h3>
                  <p className="text-gray-600 mb-2">by Sample Author</p>
                  <p className="text-gray-700 mb-4">A compelling description of this amazing book...</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">$24.99</span>
                    <Link to={`/books/${book}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive publishing solutions for authors and readers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Publishing</h3>
              <p className="text-gray-600">
                Professional book publishing services from manuscript to market
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Editing</h3>
              <p className="text-gray-600">
                Expert editing services to polish your manuscript to perfection
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Events</h3>
              <p className="text-gray-600">
                Literacy events, book launches, and community reading programs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join us for exciting literary events and community gatherings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((event) => (
              <div key={event} className="card">
                <div className="h-48 bg-gray-200 rounded-t-xl flex items-center justify-center">
                  <span className="text-gray-500">Event Image {event}</span>
                </div>
                <div className="p-6">
                  <div className="text-sm text-primary-600 font-medium mb-2">March 15, 2024</div>
                  <h3 className="text-xl font-semibold mb-2">Sample Event {event}</h3>
                  <p className="text-gray-600 mb-4">Join us for an exciting literary event...</p>
                  <Link to={`/events/${event}`} className="btn btn-outline">
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              What Our Authors Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-8">
              <p className="text-gray-700 mb-6">
                "Thorn Bird Books helped me turn my manuscript into a published novel. 
                Their team was professional, supportive, and truly cared about my success."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-gray-600 text-sm">Published Author</div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <p className="text-gray-700 mb-6">
                "The editing services exceeded my expectations. They helped me refine my voice 
                while maintaining the integrity of my story."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold">Michael Brown</div>
                  <div className="text-gray-600 text-sm">Mystery Writer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section bg-primary-600">
        <div className="container text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Ready to Start Your Publishing Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're an aspiring author or a seasoned writer, 
            we're here to help bring your story to life.
          </p>
          <Link to="/contact" className="btn bg-white text-primary-600 hover:bg-gray-100">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;