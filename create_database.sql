-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 20, 2024 at 08:46 PM
-- Server version: 10.1.40-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employability`
--

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `j_id` int(11) NOT NULL,
  `j_cname` varchar(50) NOT NULL,
  `j_email` varchar(50) NOT NULL,
  `j_title` varchar(50) NOT NULL,
  `j_description` text NOT NULL,
  `j_appdeadline` date NOT NULL,
  `j_u_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`j_id`, `j_cname`, `j_email`, `j_title`, `j_description`, `j_appdeadline`, `j_u_id`, `created_at`) VALUES
(1, 'Fraunhofer', 'fitwm@gmail.com', 'Software Engineer', 'We are seeking a talented and motivated Software Engineer to join our dynamic team. As a Software Engineer, you will play a key role in designing, developing, and maintaining high-quality software solutions that meet our customers\' needs. You will collaborate closely with cross-functional teams to deliver innovative and scalable software products.', '2024-04-30', 2, '2024-04-10 22:32:57'),
(2, 'SAP', 'sap@gmail.com', 'Product Engineer', 'We are seeking a skilled and innovative Product Engineer to join our dynamic team. As a Product Engineer, you will be responsible for developing, implementing, and optimizing our company\'s products from conception to launch. You will collaborate closely with cross-functional teams to define product requirements, design solutions, and ensure the successful delivery of high-quality products that meet customer needs.', '2024-04-30', 2, '2024-04-10 22:40:43'),
(3, 'DFKI', 'dfki@gmail.com', 'Software Tester', 'We are seeking a meticulous and detail-oriented Software Tester to join our quality assurance team. As a Software Tester, you will be responsible for ensuring the quality and reliability of our software products through comprehensive testing and analysis. You will collaborate closely with development teams to identify issues, track defects, and verify fixes to deliver high-quality software solutions to our customers.', '2024-04-30', 2, '2024-04-10 22:41:00');

-- --------------------------------------------------------

--
-- Table structure for table `job_applications`
--

CREATE TABLE `job_applications` (
  `ja_id` int(11) NOT NULL,
  `ja_j_id` int(11) NOT NULL,
  `ja_file` longblob NOT NULL,
  `ja_u_id` int(11) NOT NULL,
  `ja_message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `mentorings`
--

CREATE TABLE `mentorings` (
  `m_id` int(11) NOT NULL,
  `m_name` varchar(50) NOT NULL,
  `m_email` varchar(50) NOT NULL,
  `m_phone` varchar(50) NOT NULL,
  `m_enquiry` text NOT NULL,
  `m_file` longblob NOT NULL,
  `m_u_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `trainings`
--

CREATE TABLE `trainings` (
  `t_id` int(11) NOT NULL,
  `t_u_id` int(11) NOT NULL,
  `t_trainings` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `trainings`
--

INSERT INTO `trainings` (`t_id`, `t_u_id`, `t_trainings`, `created_at`) VALUES
(1, 1, '[\"Communication Skills Course\",\"Programming Skills Course\",\"Organisation Skills Course\"]', '2024-04-16 06:42:52'),
(2, 1, '[\"Communication Skills Course\",\"Programming Skills Course\",\"Leadership Skills Course\"]', '2024-04-16 06:44:33'),
(3, 1, '\"Communication Skills Course\"', '2024-04-16 06:45:53');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `userType` enum('employer','student') NOT NULL,
  `company` varchar(255) DEFAULT NULL,
  `education` enum('secondary','college','university') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `lastname`, `email`, `password`, `dob`, `userType`, `company`, `education`, `created_at`) VALUES
(1, 'Hassaan', 'Khan', 'hassaankhan0096@gmail.com', '$2b$10$EA97i4apYF7041vQnXeurOqDeyQ6yVGnFO0scvMi8oDTinr039SJO', '1997-03-23', 'student', '', 'university', '2024-04-08 09:53:53'),
(2, 'Ahsan', 'Dilshad', 'ahsan@gmail.com', '$2b$10$tADtApgKkht4vnHs9qsX4eub2Wj8O6RniN3IY6/QlJERz553yY39y', '2024-04-10', 'employer', 'Pixcile', NULL, '2024-04-08 21:15:42'),
(3, 'Maaz', 'Khan', 'maaz@gmail.com', '$2b$10$Fwmh9QgFqU2qo.p8LLH2JudIEFXqkd1N1jGGIvZn/7qpWFKT03kPy', '2024-04-10', 'student', '', 'university', '2024-04-09 18:53:14'),
(8, 'Subhan', 'Shahzad', 'subhan@gmail.com', '$2b$10$am7oPzqZ9btXSLeyxPdvIejFMvxwyiOa/tQYxXAxKYPEOQsbKiKIO', '1997-03-14', 'employer', 'Upwork', NULL, '2024-04-17 03:48:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`j_id`);

--
-- Indexes for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD PRIMARY KEY (`ja_id`);

--
-- Indexes for table `mentorings`
--
ALTER TABLE `mentorings`
  ADD PRIMARY KEY (`m_id`);

--
-- Indexes for table `trainings`
--
ALTER TABLE `trainings`
  ADD PRIMARY KEY (`t_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `j_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `job_applications`
--
ALTER TABLE `job_applications`
  MODIFY `ja_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `mentorings`
--
ALTER TABLE `mentorings`
  MODIFY `m_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `trainings`
--
ALTER TABLE `trainings`
  MODIFY `t_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
