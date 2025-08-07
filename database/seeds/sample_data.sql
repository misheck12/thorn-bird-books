-- Sample Data for Thorn Bird Books
-- This file contains example data to populate the database

-- Insert sample users
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
('admin@thornbirdbooks.com', '$2b$10$example_hash_for_admin', 'Admin', 'User', '+1234567890', 'admin'),
('john.doe@email.com', '$2b$10$example_hash_for_customer', 'John', 'Doe', '+1234567891', 'customer'),
('jane.smith@email.com', '$2b$10$example_hash_for_customer', 'Jane', 'Smith', '+1234567892', 'customer'),
('author1@email.com', '$2b$10$example_hash_for_author', 'Sarah', 'Johnson', '+1234567893', 'author'),
('author2@email.com', '$2b$10$example_hash_for_author', 'Michael', 'Brown', '+1234567894', 'author');

-- Insert sample authors
INSERT INTO authors (user_id, name, bio, website, social_media, image_url, is_featured) VALUES
(4, 'Sarah Johnson', 'Award-winning novelist specializing in contemporary fiction. Author of three bestselling novels with over 1 million copies sold worldwide.', 'https://sarahjohnsonbooks.com', '{"twitter": "@sarahjwriter", "instagram": "@sarahjohnsonbooks"}', '/images/authors/sarah-johnson.jpg', true),
(5, 'Michael Brown', 'Former journalist turned mystery writer. His detective series has been praised by critics and readers alike.', 'https://michaelbrownmystery.com', '{"twitter": "@mbrown_mystery", "facebook": "michaelbrownbooks"}', '/images/authors/michael-brown.jpg', true),
(NULL, 'Elena Rodriguez', 'Emerging voice in young adult fiction. Her debut novel won the Young Writers Award 2023.', NULL, '{"instagram": "@elena_writes", "tiktok": "@elenabooks"}', '/images/authors/elena-rodriguez.jpg', false),
(NULL, 'James Wilson', 'Non-fiction author focusing on business and personal development. Former Fortune 500 executive.', 'https://jameswilsonbooks.com', '{"linkedin": "jameswilsonwriter", "twitter": "@jwilson_biz"}', '/images/authors/james-wilson.jpg', false);

-- Insert sample books
INSERT INTO books (title, subtitle, isbn, author_id, description, price, discount_price, cover_image_url, category, genre, pages, publication_date, stock_quantity, is_featured, is_published, status) VALUES
('The Last Summer', 'A Novel', '978-0123456789', 1, 'A poignant tale of friendship, love, and loss set against the backdrop of a small coastal town. When four childhood friends reunite for one last summer before going their separate ways, they discover that some bonds can never be broken.', 24.99, 19.99, '/images/books/the-last-summer.jpg', 'Fiction', 'Contemporary Fiction', 342, '2023-06-15', 150, true, true, 'published'),
('Shadows in the Fog', 'A Detective Story', '978-0123456790', 2, 'Detective Ray Morrison investigates a series of mysterious disappearances in Victorian London. As the fog thickens, so does the mystery in this atmospheric thriller.', 22.50, NULL, '/images/books/shadows-in-fog.jpg', 'Fiction', 'Mystery', 289, '2023-08-22', 200, true, true, 'published'),
('Stellar Dreams', 'Young Adult Science Fiction', '978-0123456791', 3, 'Sixteen-year-old Maya discovers she has the power to manipulate time just as an alien invasion threatens Earth. A thrilling YA adventure about courage, friendship, and saving the world.', 18.99, 15.99, '/images/books/stellar-dreams.jpg', 'Fiction', 'Young Adult', 256, '2023-09-10', 175, false, true, 'published'),
('Leadership in the Digital Age', 'Strategies for Modern Business', '978-0123456792', 4, 'Essential strategies for leading teams and organizations in an increasingly digital world. Drawing from real-world case studies and cutting-edge research.', 29.99, NULL, '/images/books/leadership-digital.jpg', 'Business', 'Leadership', 412, '2023-05-01', 100, false, true, 'published'),
('The Garden of Memories', 'A Love Story Across Time', '978-0123456793', 1, 'When landscape architect Emma inherits her grandmother\'s house, she discovers a mysterious garden that seems to hold memories from the past. A beautiful story about love, loss, and the power of remembering.', 23.99, 20.99, '/images/books/garden-memories.jpg', 'Fiction', 'Romance', 378, '2024-01-15', 125, true, true, 'published'),
('The Code Breaker', 'A Historical Thriller', '978-0123456794', 2, 'Based on true events, this gripping thriller follows a team of codebreakers during World War II as they race against time to crack an enemy cipher that could change the course of the war.', 26.99, NULL, '/images/books/code-breaker.jpg', 'Fiction', 'Historical Fiction', 445, '2024-02-20', 80, false, true, 'published');

-- Insert sample events
INSERT INTO events (title, description, event_type, start_date, end_date, location, max_attendees, price, is_free, is_featured, image_url) VALUES
('Author Reading: Sarah Johnson', 'Join bestselling author Sarah Johnson for an intimate reading from her latest novel "The Garden of Memories" followed by a Q&A session.', 'reading', '2024-03-15 19:00:00', '2024-03-15 21:00:00', 'Thorn Bird Books Main Store', 50, 0, true, true, '/images/events/sarah-johnson-reading.jpg'),
('Creative Writing Workshop', 'A hands-on workshop for aspiring writers. Learn the fundamentals of storytelling, character development, and plot structure from published authors.', 'workshop', '2024-03-22 10:00:00', '2024-03-22 16:00:00', 'Community Center Meeting Room', 25, 45.00, false, true, '/images/events/writing-workshop.jpg'),
('Book Launch: The Code Breaker', 'Celebrate the launch of Michael Brown\'s latest historical thriller with wine, appetizers, and a special presentation by the author.', 'book_launch', '2024-04-05 18:30:00', '2024-04-05 21:00:00', 'Downtown Library Auditorium', 100, 0, true, true, '/images/events/code-breaker-launch.jpg'),
('Children\'s Literacy Program', 'Monthly reading program for children ages 5-12. Stories, activities, and book giveaways to promote early literacy.', 'literacy_program', '2024-03-30 14:00:00', '2024-03-30 16:00:00', 'Thorn Bird Books Kids Corner', 30, 0, true, false, '/images/events/kids-literacy.jpg'),
('Meet the Author: Elena Rodriguez', 'Young adult author Elena Rodriguez discusses her writing process and the inspiration behind her award-winning debut novel.', 'author_meet', '2024-04-12 17:00:00', '2024-04-12 19:00:00', 'High School Library', 40, 0, true, false, '/images/events/elena-rodriguez-meet.jpg');

-- Insert sample event registrations
INSERT INTO event_registrations (event_id, user_id, notes) VALUES
(1, 2, 'Looking forward to meeting Sarah Johnson!'),
(1, 3, NULL),
(2, 2, 'Excited to improve my writing skills'),
(3, 3, 'Love mystery novels'),
(4, 2, 'Bringing my 8-year-old daughter');

-- Insert sample articles
INSERT INTO articles (title, slug, content, excerpt, author_id, category, tags, featured_image_url, is_published, is_featured, published_at) VALUES
('The Art of Storytelling in Contemporary Fiction', 'art-of-storytelling-contemporary-fiction', 'Storytelling has evolved significantly in contemporary fiction, with authors exploring new narrative techniques and perspectives... [Full article content would go here]', 'Exploring how modern authors are revolutionizing narrative techniques in contemporary fiction.', 1, 'Writing Tips', ARRAY['writing', 'fiction', 'storytelling'], '/images/articles/storytelling-art.jpg', true, true, '2024-01-15 10:00:00'),
('Building a Reading Habit: Tips for Busy Adults', 'building-reading-habit-busy-adults', 'In our fast-paced world, finding time to read can be challenging. Here are practical strategies to help busy adults develop and maintain a consistent reading habit... [Full article content would go here]', 'Practical strategies to help busy adults develop and maintain a consistent reading habit.', 1, 'Reading Tips', ARRAY['reading', 'productivity', 'habits'], '/images/articles/reading-habit.jpg', true, false, '2024-02-01 09:30:00'),
('The Publishing Process: From Manuscript to Bookstore', 'publishing-process-manuscript-to-bookstore', 'Ever wondered how a manuscript becomes a published book? This comprehensive guide walks you through every step of the traditional publishing process... [Full article content would go here]', 'A comprehensive guide to understanding the traditional publishing process from start to finish.', 1, 'Publishing', ARRAY['publishing', 'writing', 'books'], '/images/articles/publishing-process.jpg', true, true, '2024-02-10 14:00:00');

-- Insert sample testimonials
INSERT INTO testimonials (name, email, content, rating, service_type, is_approved, is_featured) VALUES
('Jennifer Martinez', 'j.martinez@email.com', 'Thorn Bird Books helped me publish my first novel. Their team was incredibly supportive throughout the entire process, from editing to marketing. I couldn\'t be happier with the results!', 5, 'publishing', true, true),
('Robert Chen', 'r.chen@email.com', 'The editing services at Thorn Bird Books are top-notch. They helped polish my manuscript while preserving my unique voice. Highly recommended for any author serious about their craft.', 5, 'editing', true, true),
('Lisa Thompson', 'l.thompson@email.com', 'I attended the creative writing workshop and it completely transformed my approach to storytelling. The instructors are knowledgeable and genuinely care about helping writers improve.', 4, 'events', true, false),
('David Park', 'd.park@email.com', 'Great selection of books and knowledgeable staff. I love attending the author events here. Thorn Bird Books has become my go-to bookstore.', 5, 'general', true, false);

-- Insert sample book submissions
INSERT INTO book_submissions (user_id, title, author_name, genre, description, word_count, submission_type, status) VALUES
(2, 'The Midnight Café', 'John Doe', 'Literary Fiction', 'A story about a 24-hour café that serves as a sanctuary for night owls and insomniacs, exploring themes of loneliness, connection, and finding home in unexpected places.', 75000, 'full_manuscript', 'under_review'),
(3, 'Digital Detox', 'Jane Smith', 'Self-Help', 'A practical guide to reducing screen time and reconnecting with the physical world, based on the author\'s personal journey and research in digital wellness.', 50000, 'proposal', 'submitted'),
(NULL, 'The Time Collector', 'Anonymous Writer', 'Fantasy', 'A young woman discovers she can collect and preserve moments in time, but each collection comes with an unexpected cost.', 65000, 'query', 'requested_changes');

-- Insert sample orders
INSERT INTO orders (user_id, order_number, total_amount, tax_amount, shipping_amount, status, payment_status, payment_method, shipping_address, billing_address) VALUES
(2, 'ORD-2024-001', 44.98, 3.60, 5.99, 'delivered', 'paid', 'credit_card', 
 '{"name": "John Doe", "address": "123 Main St", "city": "Anytown", "state": "CA", "zip": "12345", "country": "USA"}',
 '{"name": "John Doe", "address": "123 Main St", "city": "Anytown", "state": "CA", "zip": "12345", "country": "USA"}'),
(3, 'ORD-2024-002', 29.98, 2.40, 5.99, 'shipped', 'paid', 'paypal',
 '{"name": "Jane Smith", "address": "456 Oak Ave", "city": "Another City", "state": "NY", "zip": "67890", "country": "USA"}',
 '{"name": "Jane Smith", "address": "456 Oak Ave", "city": "Another City", "state": "NY", "zip": "67890", "country": "USA"}');

-- Insert sample order items
INSERT INTO order_items (order_id, book_id, quantity, unit_price, total_price) VALUES
(1, 1, 1, 19.99, 19.99),
(1, 3, 1, 15.99, 15.99),
(1, 2, 1, 22.50, 22.50),
(2, 5, 1, 20.99, 20.99);