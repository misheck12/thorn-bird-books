import React from 'react';
import { useParams } from 'react-router-dom';

const BookDetailPage = () => {
  const { id } = useParams();
  
  return (
    <div className="section">
      <div className="container">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 text-center">
          Book Details
        </h1>
        <p className="text-center text-gray-600">
          Detailed view for book ID: {id}
        </p>
      </div>
    </div>
  );
};

export default BookDetailPage;