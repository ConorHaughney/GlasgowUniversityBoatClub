# Glasgow University Boat Club Website

Live site: [https://glasgowuniversityrowing.co.uk](https://glasgowuniversityrowing.co.uk)

## Overview
This project is the official website for the Glasgow University Boat Club (GUBC). It is designed to serve as a platform for outreach and recruitment. The application follows a decoupled architecture with a Spring Boot backend and a Next.js frontend.

## Features
* **Recruitment and Membership**: Dedicated pages to facilitate joining the club.
* **Merchandise Shop**: Integration for purchasing club gear.
* **News and Updates**: A system for sharing the latest club news and articles.
* **Event Management**: Displaying upcoming rowing events and club activities.
* **Committee and Alumni**: Sections highlighting club leadership and history.
* **Secure Authentication**: User security managed via Spring Security and JSON Web Tokens (JWT).
* **Payment Processing**: E-commerce functionality powered by the Stripe API.

## Tech Stack

### Backend
* **Language**: Java 21
* **Framework**: Spring Boot 4.0.1
* **Database**: PostgreSQL with Spring Data JPA/JDBC
* **Security**: Spring Security and JJWT (0.11.5)
* **Payment Integration**: Stripe Java SDK (31.1.0)
* **Infrastructure**: Dockerised service with health checks.

### Frontend
* **Framework**: Next.js 16.1.0
* **Library**: React 19.2.1
* **Styling**: Tailwind CSS 4
* **Icons**: Lucide React
* **Data/State**: Supabase JS and Vercel Analytics integration.
* **Payments**: Stripe React and Stripe JS components.

## Infrastructure and Deployment
The application is orchestrated using Docker Compose.
* **Backend Service**: Runs on port 8080.
* **Health Checks**: Actuator endpoint available at `http://localhost:8080/actuator/health`.
* **Configuration**: Environment variables are managed via `.env` files located within the backend directory.

## Getting Started

### Prerequisites
* Java 21
* Node.js and npm
* Docker and Docker Compose

### Installation
1.  **Clone the Repository**:
    ```bash
    git clone [repository-url]
    ```
2.  **Start the Backend**:
    From the root directory, execute the following to build and start the containerised services:
    ```bash
    docker-compose up --build
    ```
3.  **Start the Frontend**:
    Navigate to the `frontend` directory and start the development server:
    ```bash
    npm install
    npm run dev
    ```
    The site will be accessible at `http://localhost:3000`.
