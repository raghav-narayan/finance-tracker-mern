Financio: Personal Finance Management Tool
PROJECT DESCRIPTION
Financio is a comprehensive personal finance management app that helps users
track expenses, manage budgets, and visualize their financial data. With features
like expense tracking, budget monitoring, data visualization, and automated
reporting, Financio empowers users to take control of their financial well-being
and make informed decisions. The app's user-friendly interface, security
measures, and multi-currency support make it an invaluable tool for individuals
seeking to improve their personal financial management.
Objectives:
1.User Authentication: Secure sign-up, login, and logout capabilities using
email
2.Expense & Revenue tracking
Allow users to enter, categorize, manage, and view their expenses and revenue
3. Expense Visualization:
Graphical representation of financial data using pie charts and bar graphs for
easy comprehension.
4. Budget Management
Tools to set and monitor monthly budgets with visual feedback on remaining
balances.
5. Monthly Reports
Automatic generation of detailed monthly financial reports highlighting
spending trends and budget compliance
6. Data Filtering
Advanced filtering options to view finances by categories, dates, or months
7. Multi-Device Compatibility
Responsive design ensuring functionality across desktops, tablets, and
smartphones.
8. Data Security & Privacy
Robust encryption and secure session management to protect user data
9. Export & Backup Data
Options for users to export data in CSV or PDF formats and back up to cloud
storage.
10. Alerts & Notifications:
Automated notifications for critical financial updates and reminders.
Key Features:
 Intuitive expense and revenue tracking
 Intelligent budgeting
 Comprehensive financial reporting and insights
 Secure and responsive multi-device experience
 Empowering users with financial literacy and control
Technical Architecture
Financio follows a MERN (MongoDB, Express, React, Node.js) stack
architecture, consisting of the following key components:
1. Frontend: Built using React.js, React-Bootstrap, and other React-based
libraries for a dynamic and responsive user interface.
2. Backend: Developed with Node.js and Express.js, handling server-side
logic, API management, and authentication.
3. Database: MongoDB, a NoSQL database, is used to store user data,
transactions, budgets, and other financial information.
4. Security and Integrations: Leverages technologies like JWT for secure
authentication, bcryptjs for password hashing, and CORS for managing
cross-origin requests.
5. Tools and Libraries: The project utilize a variety of tools and libraries,
including Git for version control, Postman for API testing, and third-party
packages like Chart.js for data visualization.
Run Locally
Prerequisites
 Node.js (v14 or higher)
 MongoDB
 Npm
o Environment Variables
o MONGODB_URI=your_mongodb_connection_string
o PORT=5000
o Install Dependencies
o cd backend
o npm install
o cd ../frontend
o npm install
o Start Application
o cd backend
o npm run dev
o cd ../frontend
o npm start
o Access Application
o http://localhost:3000
Environment Variables
To run this project, you will need to add the following environment variables to your .env
file in backend/config/config.env:
PORT = 5000
MONGO_URL = your_mongodb_connection_string