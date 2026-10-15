Online Courses API
Project Description

The Online Courses API is a REST API built using Node.js and Express.js. It manages online course information using an in-memory array without a database.

Technologies Used
Node.js
Express.js
JavaScript
REST API
JSON
Course Fields

Each course contains the following fields:

id - Unique course ID
title - Course title
instructor - Instructor name
category - Course category
fee - Course fee
durationHours - Course duration in hours
published - Publication status
API Endpoints
Method	Endpoint	Description
GET	/	Check API status
POST	/api/courses	Create a new course
GET	/api/courses	Get all courses
GET	/api/courses/:id	Get a course by ID
PUT	/api/courses/:id	Replace a course
PATCH	/api/courses/:id	Update selected course fields
DELETE	/api/courses/:id	Delete a course
Query Parameters

The GET /api/courses endpoint supports:

page - Page number
limit - Number of courses per page
search - Search by course title or instructor
category - Filter by course category
published - Filter by publication status (true or false)
minFee - Minimum course fee
maxFee - Maximum course fee
sort - Field used for sorting
order - Sort order (asc or desc)
Example Requests

Get all courses:

GET /api/courses

Search for a course:

GET /api/courses?search=node

Filter by category:

GET /api/courses?category=Backend

Filter by publication status:

GET /api/courses?published=true

Filter by fee range:

GET /api/courses?minFee=1000&maxFee=3000

Sort courses by fee:

GET /api/courses?sort=fee&order=asc

Combined query:

GET /api/courses?category=Backend&published=true&minFee=1000&maxFee=3000&sort=fee&order=asc&page=1&limit=5

Installation and Execution
Prerequisites

Install Node.js from https://nodejs.org/.

Steps
Clone or download this repository.
Open the project folder in a terminal.
Install the dependencies:

npm install

Start the server:

npm start

Open `http://localhost
