import React from 'react';
import { useParams } from 'react-router-dom';

const ArticlePage = () => {
  const { slug } = useParams();
  
  return (
    <div className="section">
      <div className="container">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 text-center">
          Article
        </h1>
        <p className="text-center text-gray-600">
          Article view for slug: {slug}
        </p>
      </div>
    </div>
  );
};

export default ArticlePage;