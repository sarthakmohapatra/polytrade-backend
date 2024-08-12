# Project Name: Poly-Ecom Backend

This is the backend service for the Poly-Ecom application. It is built using NestJS, Prisma, and PostgreSQL. The project provides APIs for managing users, products, and orders, and includes features such as authentication, role-based access control, logging, pagination, and Docker containerization.

## Getting Started

### Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v16.x recommended)
- npm (v7.x or later)
- Docker (for containerization)
- PostgreSQL (if not using Docker)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/poly-ecom-backend.git
   cd poly-ecom-backend

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

   Make sure to configure the `.env` file with your specific environment settings.

4. **Generate Prisma client:**

   ```bash
   npx prisma generate
   ```

5. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   ```

6. **Start the application:**

   For development mode:

   ```bash
   npm run start:dev
   ```

### Running the Project with Docker

The application can be containerized and run using Docker Compose. This setup includes both the application and a PostgreSQL database.

1. **Build the Docker images:**

   ```bash
   docker-compose build
   ```

2. **Start the Docker containers:**

   ```bash
   docker-compose up
   ```

This will start both the backend application and the PostgreSQL database in Docker containers. The application will be available at `http://localhost:3000`.

### Admin User Setup

For security purposes, the `ADMIN` role is not created through the API but is instead seeded directly into the database during application initialization. This ensures that the admin user is created securely without exposing endpoints for admin creation.

- **Admin Email:** `admin@example.com`
- **Admin Password:** `yourAdminPassword`

### Features Implemented

1. **Docker Containerization:**

   The application is fully containerized using Docker and Docker Compose. The Docker setup includes both the application and a PostgreSQL database, making it easy to run the project without additional setup.

2. **Logging:**

   Logging is implemented using NestJS's built-in logger. The logger provides detailed logs for various operations, including errors, warnings, and successful actions.

3. **Pagination:**

   Pagination has been implemented for the product listing endpoint. You can specify the page number and the number of items per page when fetching products.

4. **Admin Role Seeding:**

   The `ADMIN` role is seeded during application startup for security reasons. This ensures that the admin user is securely created without exposing this functionality through an API.

### CI/CD Pipeline

The CI/CD pipeline was not implemented as part of this project. The assignment requirements were not clear on whether the CI/CD should be set up for a live environment and which platform to use (AWS, Azure, GCP, etc.). Therefore, it has been excluded from the current implementation.

### API Documentation

The API documentation is generated using Swagger and can be accessed at `http://localhost:3000/api` after starting the application.

### Running Tests

To run the unit and integration tests, use the following command:

```bash
npm run test
```

### Contributing

If you want to contribute to this project, please fork the repository and submit a pull request. All contributions are welcome!

### License

This project is licensed under the MIT License.

### Contact

For any questions or support, please contact [your email] or open an issue on GitHub.

---