import React from 'react';

const AboutPage = () => {
  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 text-center">
              About Thorn Bird Books
            </h1>
            
            <div className="prose prose-lg mx-auto">
              <p>
                Founded with a passion for literature and a commitment to excellence, 
                Thorn Bird Books has been serving the literary community for over a decade. 
                We believe that every story deserves to be told and every author deserves 
                professional support to bring their vision to life.
              </p>
              
              <h2>Our Mission</h2>
              <p>
                To empower authors through comprehensive publishing services while fostering 
                a love of reading in our community through quality books and engaging literary events.
              </p>

              <h2>Our Values</h2>
              <ul>
                <li><strong>Excellence:</strong> We maintain the highest standards in all our services</li>
                <li><strong>Integrity:</strong> We build trust through honest and transparent practices</li>
                <li><strong>Community:</strong> We believe in the power of literature to bring people together</li>
                <li><strong>Innovation:</strong> We embrace new technologies and methods to serve our authors better</li>
              </ul>

              <h2>Our Team</h2>
              <p>
                Our experienced team of editors, designers, and publishing professionals 
                is dedicated to helping authors succeed. With backgrounds in traditional 
                publishing, digital marketing, and literary arts, we bring decades of 
                combined experience to every project.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;