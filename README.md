## Auth Service – Fullstack Authentication System

This project is a production-grade authentication system built with Node.js, Express, TypeScript, and MongoDB.  
It demonstrates my ability to design secure and scalable backend systems by implementing features commonly used in real-world applications such as JWT, Google OAuth2, password recovery, and automated CI/CD deployment.

---

## Key Features

- **JWT-based Authentication**  
  Issues access and refresh tokens upon login, and protects private routes from unauthenticated access.

- **Refresh Token Rotation & httpOnly Cookies**  
  Refresh tokens are stored in secure httpOnly cookies and used to issue new access tokens.

- **Google OAuth2 Login Integration**  
  Enables social login with Google accounts using OAuth2.

- **Password Reset via Gmail API**  
  Sends a secure tokenized reset link to the user’s email, allowing password recovery.

- **Secure Password Hashing with Argon2**  
  Uses the Argon2 algorithm for password encryption to ensure security.

- **Protected Routes with JWT Middleware**  
  Redirects unauthenticated users attempting to access restricted pages like the dashboard.

- **Swagger (OpenAPI) Documentation**  
  Full API documentation is available at the `/api-docs` endpoint.

- **Test Suite with Jest + Supertest**  
  Includes integration tests using in-memory MongoDB (MongoMemoryServer).

- **CI/CD Pipeline with Docker & GitHub Actions (Deployed to AWS EC2)**  
  Automates build, test, and deployment processes to a live EC2 instance using Docker Compose.
