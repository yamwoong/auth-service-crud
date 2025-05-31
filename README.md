# Auth Service – Fullstack Authentication System

This project is a production-grade authentication system built with Node.js, Express, TypeScript, and MongoDB.  
It showcases my ability to build secure and scalable backend systems by implementing commonly required features such as:

- JWT authentication  
- Google OAuth2 login  
- Password recovery via Gmail  
- Automated CI/CD deployment to AWS EC2

## 🚀 Key Features

- **JWT-based Authentication**  
  Issues access and refresh tokens upon login and protects private routes from unauthenticated access.

- **Refresh Token Rotation & httpOnly Cookies**  
  Refresh tokens are stored in secure httpOnly cookies and used to issue new access tokens.

- **Google OAuth2 Login Integration**  
  Enables social login with Google accounts using OAuth2.

- **Password Reset via Gmail API**  
  Sends a secure tokenized reset link to the user’s email, allowing password recovery.

- **Secure Password Hashing with Argon2**  
  Uses the Argon2 algorithm for password encryption to ensure security.

- **Protected Routes with JWT Middleware**  
  Restricts access to private pages (e.g., dashboard) and redirects unauthenticated users to the login page.

- **Swagger (OpenAPI) Documentation**  
  Full API documentation is available at the `/api-docs` endpoint.

- **Test Suite with Jest + Supertest**  
  Includes integration tests using in-memory MongoDB (`MongoMemoryServer`).

- **CI/CD Pipeline with Docker & GitHub Actions (Deployed to AWS EC2)**  
  Automatically builds, tests, and deploys the application to a production server using Docker Compose.

---

## 🛠️ Tech Stack

### Backend

- **Node.js + Express 5** – RESTful API server framework  
- **TypeScript** – Statically typed language for better code safety and maintainability  
- **MongoDB + Mongoose** – NoSQL database and Object Data Modeling (ODM)  
- **JWT (jsonwebtoken)** – Access and refresh token-based authentication  
- **Argon2** – Secure password hashing algorithm  
- **Google OAuth2 + Gmail API** – Social login and email-based password recovery  
- **Joi** – Schema-based validation for user input  
- **Typedi** – Dependency injection system for loosely coupled service design  
- **cookie-parser** – Stores and parses refresh tokens in secure httpOnly cookies  
- **Swagger (OpenAPI) + YAML** – Auto-generated interactive API docs (`/api-docs`)

### Development & Testing Tools

- **ts-node-dev** – Hot-reload TypeScript environment for development  
- **tsconfig-paths + module-alias** – Path aliasing for clean import structure  
- **Jest + ts-jest + Supertest** – Unit and integration testing framework  
- **mongodb-memory-server** – In-memory MongoDB used for isolated test environments

### Deployment & Infrastructure

- **Docker + Docker Compose** – Containerized application environment  
- **GitHub Actions** – CI/CD pipeline for automated build, test, and deploy  
- **AWS EC2** – Deployed to a production server with custom domain routing

---

## 🧱 Architecture

This project follows a layered architecture based on SOLID principles.  
Each layer has clearly defined responsibilities to enhance modularity, testability, and maintainability.

───────────────────────────────────────────────

🧩 Layered Structure

Router → Controller → Service → Repository → MongoDB  
                  ↓  
           DTO(Joi) / Validation  
                  ↓  
         Middleware (Auth, Error)

───────────────────────────────────────────────

📚 Layer Responsibilities

🔹 **Router**  
Maps HTTP methods and routes to corresponding controllers.

🔹 **Controller**  
Handles request/response logic, validates DTOs using Joi, and calls the service layer.

🔹 **Service**  
Contains business logic such as token generation, login, and password reset.  
Uses `Typedi` for dependency injection.

🔹 **Repository**  
Interfaces with MongoDB using `Mongoose` to perform CRUD operations.

🔹 **Middleware**  
Handles JWT authentication, error handling, and logging.

🔹 **DTO / Joi**  
Validates incoming request bodies against a schema using `Joi`.

🔹 **Test Layer (`tests/__tests__`)**  
Unit and integration tests are organized by feature in the `tests/__tests__` directory.  
Uses `Jest`, `Supertest`, and `MongoMemoryServer` for isolated and reliable testing.

───────────────────────────────────────────────

✨ Design Highlights

✅ SOLID-compliant modular structure  
✅ Dependency injection with Typedi  
✅ Robust input validation with Joi + OpenAPI-powered API docs  
✅ Clean module aliasing via `tsconfig-paths` and `module-alias`  
✅ Isolated testing using `MongoMemoryServer` in `tests/__tests__`  
✅ CI/CD pipeline with Docker + GitHub Actions → Deployed on AWS EC2

───────────────────────────────────────────────

## 📁 Folder Structure

This project follows a feature-based, layered architecture.  
Core components are organized under the `src/` directory inside the `backend/` folder.

```bash
backend/
├── src/
│   ├── config/               # Environment config, Swagger, MongoDB connection
│   ├── constants/            # Shared constants (e.g., error messages)
│   ├── controllers/          # Handles incoming HTTP requests
│   ├── dtos/                 # Data Transfer Objects (request body types)
│   ├── errors/               # Custom error classes
│   ├── interfaces/           # TypeScript interfaces (optional)
│   ├── mappers/              # Converts DB models to response format
│   ├── middlewares/          # JWT auth, error handling, validation
│   ├── models/               # Business-level models (e.g., user with password)
│   ├── repositories/         # MongoDB access logic using Mongoose
│   ├── routes/               # API route definitions
│   ├── schemas/              # Mongoose schema definitions
│   ├── services/             # Core business logic (login, reset password, etc.)
│   ├── tests/__tests__/      # Jest + Supertest test cases organized by feature
│   ├── types/                # Custom TypeScript types (e.g., env.d.ts)
│   ├── utils/                # Helper functions (JWT, mail, hashing, etc.)
│   ├── validations/          # Joi schema validation logic
│   └── server.ts             # Application entry point
├── Dockerfile                # Docker build configuration
├── .env.*                    # Environment variables for dev/prod/test
├── jest.config.ts            # Jest test configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript compiler configuration
```

> Test files are grouped under `tests/__tests__`, and all source modules follow a clear layered structure (Controller → Service → Repository) for scalability and maintainability.
