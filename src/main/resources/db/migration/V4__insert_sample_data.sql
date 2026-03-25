-- V4__insert_sample_data.sql
-- Insert sample categories
INSERT INTO equipment_categories (name, description) VALUES
('Computers', 'Desktop computers and laptops'),
('Projectors', 'Video projectors and screens'),
('Laboratory Equipment', 'Scientific and laboratory devices'),
('Audio Equipment', 'Microphones, speakers, and audio systems');

-- Insert sample equipment
INSERT INTO equipment (name, description, category_id, serial_number, status, location, capacity) VALUES
('Dell OptiPlex 7090', 'Desktop computer with i7 processor', 1, 'DELL-001', 'AVAILABLE', 'Room 101', 1),
('HP ProBook 450', 'Laptop for student use', 1, 'HP-001', 'AVAILABLE', 'Library', 1),
('Epson EB-X41', 'LCD Projector 3600 lumens', 2, 'EPS-001', 'AVAILABLE', 'Room 201', 1),
('Microscope Olympus CX23', 'Binocular microscope for biology lab', 3, 'OLY-001', 'AVAILABLE', 'Lab 301', 1),
('Shure SM58', 'Professional vocal microphone', 4, 'SHU-001', 'AVAILABLE', 'Audio Room', 1);

-- Insert sample users (password is 'password' encoded with BCrypt)
-- Hash generated using BCrypt: $2a$10$9LVLPYAgnlURAw8mkRlOneUdcAchar1L6b7Qz1S9s8AftHZCl7v2K
INSERT INTO users (username, email, password, role, department) VALUES
('student1', 'student1@university.edu', '$2a$10$9LVLPYAgnlURAw8mkRlOneUdcAchar1L6b7Qz1S9s8AftHZCl7v2K', 'STUDENT', 'Computer Science'),
('professor1', 'prof1@university.edu', '$2a$10$9LVLPYAgnlURAw8mkRlOneUdcAchar1L6b7Qz1S9s8AftHZCl7v2K', 'PROFESSOR', 'Computer Science'),
('admin', 'admin@university.edu', '$2a$10$9LVLPYAgnlURAw8mkRlOneUdcAchar1L6b7Qz1S9s8AftHZCl7v2K', 'ADMIN', 'Administration');
