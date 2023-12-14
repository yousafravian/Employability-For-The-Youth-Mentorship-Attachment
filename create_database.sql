#SELECT database
USE employability;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  dob DATE NOT NULL,
  userType ENUM('employer', 'student') NOT NULL,
  company VARCHAR(255),
  education ENUM('secondary', 'college', 'university'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP USER IF EXISTS 'user'@'localhost';
CREATE USER 'user'@'localhost' IDENTIFIED BY 'youth';
GRANT ALL PRIVILEGES ON employability.* TO 'user'@'localhost';