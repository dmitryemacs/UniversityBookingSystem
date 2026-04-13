-- V6__insert_more_sample_data.sql
-- Insert more categories
INSERT INTO equipment_categories (name, description) VALUES
('3D Printers', '3D printers and accessories'),
('VR Equipment', 'Virtual reality headsets and controllers'),
('Photography', 'Cameras, lenses, and lighting equipment'),
('Sports Equipment', 'Sports and fitness equipment'),
('Office Equipment', 'Printers, scanners, and office supplies'),
('Measurement Tools', 'Oscilloscopes, multimeters, and testing devices');

-- Insert more equipment using subqueries to get category IDs
-- 3D Printers (category_id = 5)
INSERT INTO equipment (name, description, category_id, serial_number, status, location, capacity) VALUES
('Creality Ender 3 V2', 'FDM 3D printer, 220x220x250mm build volume', (SELECT id FROM equipment_categories WHERE name = '3D Printers'), '3DP-001', 'AVAILABLE', 'Maker Lab 105', 1),
('Prusa i3 MK3S+', 'High-quality FDM 3D printer with auto-leveling', (SELECT id FROM equipment_categories WHERE name = '3D Printers'), '3DP-002', 'AVAILABLE', 'Maker Lab 105', 1),
('Formlabs Form 3', 'SLA resin 3D printer for high-detail prints', (SELECT id FROM equipment_categories WHERE name = '3D Printers'), '3DP-003', 'MAINTENANCE', 'Maker Lab 105', 1);

-- VR Equipment (category_id = 6)
INSERT INTO equipment (name, description, category_id, serial_number, status, location, capacity) VALUES
('Meta Quest 3', 'Standalone VR headset with mixed reality', (SELECT id FROM equipment_categories WHERE name = 'VR Equipment'), 'VR-001', 'AVAILABLE', 'VR Lab 210', 4),
('HTC Vive Pro 2', 'PC-powered VR headset with base stations', (SELECT id FROM equipment_categories WHERE name = 'VR Equipment'), 'VR-002', 'AVAILABLE', 'VR Lab 210', 2),
('Valve Index', 'High-end PC VR kit with finger tracking controllers', (SELECT id FROM equipment_categories WHERE name = 'VR Equipment'), 'VR-003', 'BOOKED', 'VR Lab 210', 2);

-- Photography (category_id = 7)
INSERT INTO equipment (name, description, category_id, serial_number, status, location, capacity) VALUES
('Canon EOS R6 Mark II', 'Full-frame mirrorless camera with 24.2MP sensor', (SELECT id FROM equipment_categories WHERE name = 'Photography'), 'CAM-001', 'AVAILABLE', 'Media Room 302', 1),
('Sony A7 IV', 'Hybrid full-frame camera for photo and video', (SELECT id FROM equipment_categories WHERE name = 'Photography'), 'CAM-002', 'AVAILABLE', 'Media Room 302', 1),
('Godox SL-60W LED Kit', 'Professional LED video lighting kit (3 lights)', (SELECT id FROM equipment_categories WHERE name = 'Photography'), 'LT-001', 'AVAILABLE', 'Media Room 302', 1),
('Manfrotto Tripod Set', 'Professional carbon fiber tripods (set of 3)', (SELECT id FROM equipment_categories WHERE name = 'Photography'), 'TRP-001', 'AVAILABLE', 'Media Room 302', 3);

-- Sports Equipment (category_id = 8)
INSERT INTO equipment (name, description, category_id, serial_number, status, location, capacity) VALUES
('Tennis Racket Set', 'Professional tennis rackets (set of 6)', (SELECT id FROM equipment_categories WHERE name = 'Sports Equipment'), 'SPT-001', 'AVAILABLE', 'Sports Center', 6),
('Yoga Mat Set', 'Premium non-slip yoga mats (set of 20)', (SELECT id FROM equipment_categories WHERE name = 'Sports Equipment'), 'SPT-002', 'AVAILABLE', 'Gym Hall', 20),
('Basketball Set', 'Official size basketballs (set of 5)', (SELECT id FROM equipment_categories WHERE name = 'Sports Equipment'), 'SPT-003', 'AVAILABLE', 'Sports Center', 5);

-- Office Equipment (category_id = 9)
INSERT INTO equipment (name, description, category_id, serial_number, status, location, capacity) VALUES
('HP LaserJet Pro M404dn', 'Monochrome laser printer, duplex printing', (SELECT id FROM equipment_categories WHERE name = 'Office Equipment'), 'PRT-001', 'AVAILABLE', 'Library Print Station', 1),
('Epson EcoTank ET-5850', 'Color inkjet printer with scanner and copier', (SELECT id FROM equipment_categories WHERE name = 'Office Equipment'), 'PRT-002', 'AVAILABLE', 'Admin Office', 1),
('Fujitsu ScanSnap iX1600', 'High-speed document scanner', (SELECT id FROM equipment_categories WHERE name = 'Office Equipment'), 'SCN-001', 'AVAILABLE', 'Library', 1);

-- Measurement Tools (category_id = 10)
INSERT INTO equipment (name, description, category_id, serial_number, status, location, capacity) VALUES
('Rigol DS1054Z Oscilloscope', '4-channel digital oscilloscope, 50MHz bandwidth', (SELECT id FROM equipment_categories WHERE name = 'Measurement Tools'), 'OSC-001', 'AVAILABLE', 'Electronics Lab 401', 1),
('Fluke 87V Multimeter', 'True-rms industrial multimeter', (SELECT id FROM equipment_categories WHERE name = 'Measurement Tools'), 'MM-001', 'AVAILABLE', 'Electronics Lab 401', 2),
('Rigol DG1032Z Function Generator', 'Dual-channel arbitrary waveform generator', (SELECT id FROM equipment_categories WHERE name = 'Measurement Tools'), 'FG-001', 'AVAILABLE', 'Electronics Lab 401', 1);

-- More computers (category_id = 1 for Computers)
INSERT INTO equipment (name, description, category_id, serial_number, status, location, capacity) VALUES
('iMac 24-inch M3', 'All-in-one desktop with Apple M3 chip', (SELECT id FROM equipment_categories WHERE name = 'Computers'), 'MAC-001', 'AVAILABLE', 'Design Lab 110', 1),
('MacBook Pro 16" M3 Pro', 'Laptop for video editing and development', (SELECT id FROM equipment_categories WHERE name = 'Computers'), 'MBP-001', 'BOOKED', 'Design Lab 110', 1),
('Lenovo ThinkPad X1 Carbon', 'Ultrabook for business and research', (SELECT id FROM equipment_categories WHERE name = 'Computers'), 'LN-001', 'AVAILABLE', 'Study Room A', 1),
('Gaming PC RTX 4070', 'High-performance desktop with RTX 4070 GPU', (SELECT id FROM equipment_categories WHERE name = 'Computers'), 'GPC-001', 'AVAILABLE', 'Game Dev Lab 115', 1);

-- More projectors (category_id = 2 for Projectors)
INSERT INTO equipment (name, description, category_id, serial_number, status, location, capacity) VALUES
('BenQ MH560', 'Full HD DLP projector, 3800 lumens', (SELECT id FROM equipment_categories WHERE name = 'Projectors'), 'BNQ-001', 'AVAILABLE', 'Lecture Hall A', 1),
('Sony VPL-FHZ65', 'Laser projector, 6000 lumens, WUXGA', (SELECT id FROM equipment_categories WHERE name = 'Projectors'), 'SNY-001', 'AVAILABLE', 'Conference Room', 1),
('Portable Projector Screen', '100-inch foldable projection screen', (SELECT id FROM equipment_categories WHERE name = 'Projectors'), 'SCR-001', 'AVAILABLE', 'Equipment Storage', 1);

-- More audio equipment (category_id = 4 for Audio Equipment)
INSERT INTO equipment (name, description, category_id, serial_number, status, location, capacity) VALUES
('Yamaha MG10XU Mixer', '10-channel audio mixing console with USB', (SELECT id FROM equipment_categories WHERE name = 'Audio Equipment'), 'MXR-001', 'AVAILABLE', 'Audio Room', 1),
('JBL EON 715 Speaker', '15-inch powered PA speaker', (SELECT id FROM equipment_categories WHERE name = 'Audio Equipment'), 'SPK-001', 'AVAILABLE', 'Audio Room', 2),
('Audio-Technica ATH-M50x', 'Professional studio headphones (pair)', (SELECT id FROM equipment_categories WHERE name = 'Audio Equipment'), 'HP-002', 'AVAILABLE', 'Audio Room', 3),
('Zoom H6 Handy Recorder', 'Portable 6-track audio recorder', (SELECT id FROM equipment_categories WHERE name = 'Audio Equipment'), 'REC-001', 'RETIRED', 'Audio Room', 1);

-- More lab equipment (category_id = 3 for Laboratory Equipment)
INSERT INTO equipment (name, description, category_id, serial_number, status, location, capacity) VALUES
('Centrifuge Hettich EBA 20', 'Benchtop centrifuge, 6000 RPM', (SELECT id FROM equipment_categories WHERE name = 'Laboratory Equipment'), 'CNT-001', 'AVAILABLE', 'Lab 301', 1),
('pH Meter Hanna HI98103', 'Portable waterproof pH tester', (SELECT id FROM equipment_categories WHERE name = 'Laboratory Equipment'), 'PHM-001', 'AVAILABLE', 'Lab 301', 2),
('Autoclave Tuttnauer 2540M', 'Steam sterilizer for lab instruments', (SELECT id FROM equipment_categories WHERE name = 'Laboratory Equipment'), 'AUT-001', 'MAINTENANCE', 'Lab 301', 1);

-- Insert more users (password is 'password' encoded with BCrypt)
INSERT INTO users (username, email, password, role, department) VALUES
('student2', 'student2@university.edu', '$2a$10$9LVLPYAgnlURAw8mkRlOneUdcAchar1L6b7Qz1S9s8AftHZCl7v2K', 'STUDENT', 'Electrical Engineering'),
('student3', 'student3@university.edu', '$2a$10$9LVLPYAgnlURAw8mkRlOneUdcAchar1L6b7Qz1S9s8AftHZCl7v2K', 'STUDENT', 'Mechanical Engineering'),
('student4', 'student4@university.edu', '$2a$10$9LVLPYAgnlURAw8mkRlOneUdcAchar1L6b7Qz1S9s8AftHZCl7v2K', 'STUDENT', 'Physics'),
('student5', 'student5@university.edu', '$2a$10$9LVLPYAgnlURAw8mkRlOneUdcAchar1L6b7Qz1S9s8AftHZCl7v2K', 'STUDENT', 'Biology'),
('professor2', 'prof2@university.edu', '$2a$10$9LVLPYAgnlURAw8mkRlOneUdcAchar1L6b7Qz1S9s8AftHZCl7v2K', 'PROFESSOR', 'Electrical Engineering'),
('professor3', 'prof3@university.edu', '$2a$10$9LVLPYAgnlURAw8mkRlOneUdcAchar1L6b7Qz1S9s8AftHZCl7v2K', 'PROFESSOR', 'Physics'),
('admin2', 'admin2@university.edu', '$2a$10$9LVLPYAgnlURAw8mkRlOneUdcAchar1L6b7Qz1S9s8AftHZCl7v2K', 'ADMIN', 'IT Department');

-- Insert sample bookings with various statuses
-- Booking 1: student1 books Dell OptiPlex (equipment_id=1) - CONFIRMED
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose) VALUES
(1, 1, '2025-04-10 09:00:00', '2025-04-10 12:00:00', 'CONFIRMED', 'Programming assignment for CS101');

-- Booking 2: student1 books Epson projector (equipment_id=3) - PENDING
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose) VALUES
(1, 3, '2025-04-12 14:00:00', '2025-04-12 16:00:00', 'PENDING', 'Group project presentation');

-- Booking 3: student2 books HP ProBook (equipment_id=2) - COMPLETED
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose) VALUES
(2, 2, '2025-03-15 10:00:00', '2025-03-15 14:00:00', 'COMPLETED', 'Research paper writing');

-- Booking 4: student2 books Meta Quest 3 (equipment_id=8) - CONFIRMED
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose) VALUES
(2, 8, '2025-04-11 13:00:00', '2025-04-11 17:00:00', 'CONFIRMED', 'VR application testing for EE lab');

-- Booking 5: student3 books Microscope (equipment_id=4) - REJECTED
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose, rejection_reason) VALUES
(3, 4, '2025-04-08 09:00:00', '2025-04-08 11:00:00', 'REJECTED', 'Biology experiment', 'Equipment under maintenance');

-- Booking 6: student3 books 3D Printer (equipment_id=6) - PENDING
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose) VALUES
(3, 6, '2025-04-14 10:00:00', '2025-04-14 18:00:00', 'PENDING', '3D printing mechanical parts for thesis');

-- Booking 7: student4 books Canon camera (equipment_id=13) - CONFIRMED
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose) VALUES
(4, 13, '2025-04-09 08:00:00', '2025-04-09 17:00:00', 'CONFIRMED', 'Physics lab documentation');

-- Booking 8: student4 books Oscilloscope (equipment_id=28) - COMPLETED
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose) VALUES
(4, 28, '2025-03-20 14:00:00', '2025-03-20 18:00:00', 'COMPLETED', 'Signal analysis experiment');

-- Booking 9: student5 books Yoga Mat Set (equipment_id=19) - CANCELLED
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose) VALUES
(5, 19, '2025-04-13 16:00:00', '2025-04-13 18:00:00', 'CANCELLED', 'Wellness club session');

-- Booking 10: student5 books Centrifuge (equipment_id=35) - PENDING
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose) VALUES
(5, 35, '2025-04-15 09:00:00', '2025-04-15 13:00:00', 'PENDING', 'Cell culture separation experiment');

-- Booking 11: professor2 books Gaming PC (equipment_id=12) - CONFIRMED
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose) VALUES
(6, 12, '2025-04-10 10:00:00', '2025-04-10 16:00:00', 'CONFIRMED', 'GPU computing research');

-- Booking 12: professor2 books VR Index (equipment_id=10) - PENDING
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose) VALUES
(6, 10, '2025-04-16 09:00:00', '2025-04-16 17:00:00', 'PENDING', 'VR simulation development');

-- Booking 13: student1 books Shure microphone (equipment_id=5) - COMPLETED
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose) VALUES
(1, 5, '2025-03-10 15:00:00', '2025-03-10 17:00:00', 'COMPLETED', 'Podcast recording for media class');

-- Booking 14: student3 books MacBook Pro (equipment_id=11) - REJECTED
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose, rejection_reason) VALUES
(3, 11, '2025-04-11 09:00:00', '2025-04-11 18:00:00', 'REJECTED', 'Video editing project', 'Already booked by another user');

-- Booking 15: student2 books HP LaserJet printer (equipment_id=22) - CONFIRMED
INSERT INTO bookings (user_id, equipment_id, start_time, end_time, status, purpose) VALUES
(2, 22, '2025-04-09 11:00:00', '2025-04-09 12:00:00', 'CONFIRMED', 'Print thesis draft');
