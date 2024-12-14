# Secure Full-Stack App 🕡

A **secure full-stack web application** built with **React**, **Node.js**, and **SQLite**, designed to showcase modern security practices. This project serves as a foundation for developers to build secure and scalable applications.

---

## ✨ Features

- **Authentication**: Access and refresh token-based authentication.
- **CSRF Protection**: Ensures state-changing requests are legitimate.
- **Content Security Policy (CSP)**: Mitigates XSS by restricting resource loading.
- **Rate Limiting**: Defends against brute force attacks on sensitive endpoints.
- **Secure Cookies**: Configured with `httpOnly`, `sameSite`, and `secure` attributes.
- **Basic Frontend**: React-based frontend for easy customization and learning.

---

## 🔧️ Tech Stack

### Frontend:
- **React**: Simple components for login, registration, and authentication checks.
- **Axios**: Handles API requests with CSRF and token refresh.

### Backend:
- **Node.js** + **Express**: RESTful API with security-focused middleware.
- **SQLite**: Lightweight database for user authentication and session management.
- **Helmet**: Adds secure HTTP headers, including CSP.
- **Csurf**: Protects against CSRF attacks.
- **Bcrypt**: Secure password hashing.
- **JSON Web Tokens (JWT)**: Manages access and refresh tokens.

---

## 🚀 Getting Started

### Prerequisites:
- **Node.js** (v14 or higher)
- **npm** (v7 or higher)

---

### Installation:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vikernes1981/SecureApp.git
   cd SecureApp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and configure the following:
   ```env
   PORT=5000
   SECRET=your-secret-key
   ```

4. **Run the app**:
   ```bash
   npm start
   ```

5. **Access the app**:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

---

## 📂 Folder Structure

```
SecureApp/
├── backend/
│   ├── server.js        # Express server with authentication & security
│   └── database.sqlite  # SQLite database (auto-created)
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (Login, Register, Home, Check)
│   │   ├── utils/       # Axios config for API communication
│   │   └── App.jsx      # Main frontend app file
├── package.json         # Backend dependencies
├── README.md            # Project documentation
└── .env                 # Environment variables
```

---

## 🔡 Security Highlights

1. **Access and Refresh Tokens**:
   - Short-lived access tokens for secure API calls.
   - Long-lived refresh tokens stored in HTTP-only cookies.

2. **CSRF Protection**:
   - CSRF tokens ensure state-changing requests are authenticated.

3. **Content Security Policy (CSP)**:
   - Default policy: `default-src 'none';` (customize as needed).

4. **Rate Limiting**:
   - Login: Max 5 attempts per 15 minutes.
   - Registration: Max 10 attempts per 15 minutes.

5. **Secure Cookies**:
   - `httpOnly`: Prevents client-side access.
   - `sameSite`: Protects against cross-origin attacks.
   - `secure`: Enforces HTTPS-only transmission.

---

## 🖍 Features in Progress

- Password reset functionality with email confirmation.
- User roles (e.g., admin, user) and access control.
- Deployment-ready scripts for production environments.

---

## 🔧️ How to Contribute

1. Fork the project.
2. Create your feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add a new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---

## 📧 Feedback

I’d love to hear your thoughts and feedback! Feel free to open an issue or drop me a message on LinkedIn. Let’s build a secure and scalable web together! 🚀✨
