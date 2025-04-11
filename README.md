Project Overview

Tech Stack
This project is built using the NestJS framework, which is a progressive Node.js framework for building efficient and scalable server-side applications. The primary language used is TypeScript. The project also utilizes MongoDB as the database, interfaced through Mongoose.

/////////////////////////////////////////////////////////////////////////////////////////////////////
Project Setup
To set up the project, follow these steps:

Clone the Repository:
git clone https://github.com/Deepanshu-Raghuwanshi/Student-Management-BE.git
cd Student-Management-BE

Install Dependencies: yarn install

Create Environment Variables File:
Copy the .env.example to .env:
cp .env.example .env
Edit the .env file to configure your environment-specific variables such as database connection strings, API keys, etc

Compile and Run the Project:
Development Mode: yarn run start
Watch Mode: yarn run start:dev
Production Mode: yarn run start:prod

///////////////////////////////////////////////////////////////////////////////////////////////////////

Accessing Swagger
Swagger is used for API documentation and can be accessed by navigating to the /api endpoint of your running application. This provides an interactive interface to explore and test the API endpoints.

Exception Handling
The project implements a Global Exception Handler using NestJS's ExceptionFilter. This handler captures all exceptions thrown in the application and formats the response to include status codes, error messages, and validation errors if applicable. This ensures consistent and informative error responses across the application.

Interceptors
The project also includes Global Interceptors to handle cross-cutting concerns such as logging, transformation, and caching. These interceptors can modify incoming requests or outgoing responses, providing a centralized way to implement common logic.

API Endpoints
Student Endpoints
GET /students: Retrieve all students or filter by name.
GET /students/:id: Retrieve a student by ID.
POST /students: Create a new student.
PATCH /students/:id: Update a student's profile.
DELETE /students/:id: Delete a student.
GET /students/course/:courseId: Get students by course.
GET /students/:id/courses: Get courses enrolled by a student.
DELETE /students/:studentId/courses/:courseId: Student leaves a course.
Course Endpoints
POST /courses: Create a new course.
GET /courses: Retrieve all courses.
GET /courses/topic?name=topicName: Find courses by topic.
GET /courses/:id: Retrieve a course by ID.
PATCH /courses/:id: Update a course.
DELETE /courses/:id: Delete a course.
POST /courses/:courseId/students/:studentId: Assign a student to a course.
DELETE /courses/:courseId/students/:studentId: Remove a student from a course.
GET /courses/:id/students: Get all students enrolled in a course.
Exception Handling
