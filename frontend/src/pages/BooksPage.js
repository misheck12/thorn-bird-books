import React from 'react';
import BookSearch from '../components/BookSearch';

const BooksPage = () => (
  <div className="section">
    <div className="container">
      <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 text-center">
        Bookstore
      </h1>
      <p className="text-center text-gray-600">
        Browse our collection of books with filtering and cart functionality.
      </p>
      <BookSearch />
    </div>
  </div>
);

export default BooksPage;