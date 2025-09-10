# Artist Services Platform - Backend API

## Overview
A Node.js/Express + MongoDB backend for a marketplace where artists offer services and clients can discover artists, view profiles/portfolios, message, and review them. This README documents the backend in detail for future developers (backend/front-end/devops) and can be shared with stakeholders.

- **Runtime**: Node.js, Express
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: Cookie-based JWT (httpOnly cookie `token`)
- **Emails**: Nodemailer (SMTP) for verification and password reset
- **Session**: `express-session` for flash/session (not used for auth)
- **CORS**: Configured for a single frontend origin

Directory highlights:
- `server.js` — App bootstrap, middlewares, route mounting, error handling
- `routes/*` — Route definitions per module
- `controllers/*` — Request handlers
- `models/*` — Mongoose models and schemas
- `middlewares/*` — Auth and guards
- `config/*` — DB connection, keys (Cloudinary placeholder)
- `utils/*` — Helpers (JWT token, email sender, templates)


## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance/URI
- SMTP credentials for sending emails

### Installation
```bash
npm install
```

### Environment Variables (.env)
Create a `.env` in the project root with the following keys:

- `PORT` — Express port, defaults to 3000
- `NODE_ENV` — `development` | `production`
- `MDB_URI` — MongoDB connection string
- `EXPRESS_SESSION_SECRET` — Secret for `express-session`
- `CLIENT_URL` — Frontend origin (e.g., https://app.example.com). Used by CORS and email links
- `JWT_KEY` — Secret for login/auth JWT (httpOnly cookie `token`)
- `JWT_EMAIL_VERIFY` — Secret used to sign the verification token sent on signup
- `JWT_EMAIL_SECRET` — Secret used to verify the token in the `/email/verify/:token` route
- `JWT_RESET_PASS_SECRET` — Secret for password reset tokens
- `SMTP_HOST` — SMTP server host
- `SMTP_PORT` — SMTP server port (e.g., 587)
- `SMTP_USER` — SMTP username (sender address)
- `SMTP_PASS` — SMTP password
- `COMPANY_NAME` — Display name in outbound emails
- `COMPONY_NAME` — Legacy/typo key referenced in one place for verification email sender (keep synchronized with COMPANY_NAME)

Example:
```env
PORT=3000
NODE_ENV=development
MDB_URI=mongodb+srv://user:pass@cluster/dbname
EXPRESS_SESSION_SECRET=super-secret
CLIENT_URL=http://localhost:5173
JWT_KEY=auth-secret
JWT_EMAIL_VERIFY=email-verify-secret
JWT_EMAIL_SECRET=email-secret
JWT_RESET_PASS_SECRET=reset-secret
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=postmaster@example
SMTP_PASS=••••••••
COMPANY_NAME=Artist Services
COMPONY_NAME=Artist Services
```

### Run
```bash
npm start
```
Server starts on `http://localhost:3000` unless `PORT` is set.


## Data Models

### User (`models/User.js`)
- `name: String` (required)
- `email: String` (required, unique, lowercase)
- `password: String` (required, hashed)
- `role: 'client' | 'artist'` (default: `client`)
- `isVerified: Boolean` (default: false)
- `services: ObjectId[Service]` — services created by artist
- `reviews: ObjectId[Review]` — reviews received
- `portfolio: ObjectId[Portfolio]` — single portfolio reference
- `massages: ObjectId[User]` — misnamed field used to store user message refs (see Message model; treat as legacy)
- Timestamps

Relationships:
- Artist (User.role = 'artist') ↔ Service (1:N via `artist`)
- Artist ↔ Portfolio (1:1 via `portfolio`)
- Client ↔ Review ↔ Artist (N:M through Review)
- User ↔ Message ↔ User (N:M through Message)

### Service (`models/Service.js`)
- `artist: ObjectId[User]` (required)
- `title: String` (required)
- `description: String` (required)
- `category: 'Interior Design' | 'Drawing Classes' | 'Music & Studio'` (required)
- `price: Number` (required, ≥ 0)
- `priceType: 'per_hour' | 'per_session' | 'fixed'` (required)
- `availableSlots: { day, startTime, endTime }[]` (optional)
- Timestamps

### Portfolio (`models/Portfolio.js`)
- `artist: ObjectId[User]` (required)
- `title: String` (required)
- `description: String`
- `images: String[]`
- `mediaUrl: String`
- `projectType: String`
- `caseStudy: String`
- Timestamps

### Review (`models/Review.js`)
- `clientId: ObjectId[User]` (required)
- `artistId: ObjectId[User]` (required)
- `rating: Number` (1..5, required)
- `comment: String`
- Timestamps

### Message (`models/Message.js`)
- `senderId: ObjectId[User]` (required)
- `receiverId: ObjectId[User]` (required)
- `message: String` (required)
- Timestamps


## Authentication & Authorization
- Login issues a JWT signed with `JWT_KEY` and sets it in an httpOnly cookie `token`.
- `middlewares/isLogedIn.js` verifies cookie, loads user to `req.user` and blocks otherwise.
- Many routes require authentication.
- Email verification flow: signup issues a short-lived token signed with `JWT_EMAIL_VERIFY`; `/email/verify/:token` verifies using `JWT_EMAIL_SECRET` and marks `user.isVerified = true`.
  - Ensure both secrets are aligned or update code to use one key consistently.

Cookie details (from `express-session`): session is enabled, but auth relies on JWT cookie, not the session. Cookies are secure when `NODE_ENV=production`.


## API Reference
Base URL: `${SERVER_URL}` (e.g., `http://localhost:3000`)

Global behaviors:
- All JSON requests should send `Content-Type: application/json`.
- Auth-required endpoints expect the login cookie `token` to be present.
- Pagination and filtering not yet implemented unless noted.

### Health
- GET `/health`
  - 200 OK: `{ status: 'ok', message: 'API is healthy' }`

### Auth (`/api/auth`)
- POST `/register`
  - Body: `{ name, email, password, role?: 'client'|'artist' }`
  - 201 → Sends verification email. `{ success, message }`
- POST `/login`
  - Body: `{ email, password }`
  - 200 → Sets cookie `token`. `{ success, message, token }`
- GET `/logout` (auth)
  - 200 → Clears cookie.
- GET `/profile` (auth)
  - 200 → Returns current user (minus password).
  - If role is `artist`, additionally returns `{ services, portfolio, reviews, messages }`.

### Email Verification (`/email`)
- GET `/verify/:token`
  - Marks user verified and sends welcome email.

### Password Reset (`/api`)
- POST `/forgot-password`
  - Body: `{ email }`
  - 200 → Sends password reset email to the user.
- POST `/reset-password/:token`
  - Body: `{ newPassword }`
  - 200 → Updates password, sends confirmation email.

### Users (Artist-owned resources) (`/api/users`) — auth required
- POST `/createService`
  - Body: `{ title, description, category, price, priceType, availableSlots? }`
  - 201 → Creates a service and pushes to user.services.
- POST `/service/edit/:id`
  - Body: Partial service fields
  - 200 → Updates service (owner-only).
- POST `/service/delete/:id`
  - 200 → Deletes service (owner-only) and removes ref from user.services.
- POST `/createPortfolio`
  - Body: `{ title, description, images, mediaUrl, projectType, caseStudy }`
  - 201 → Creates portfolio and sets `user.portfolio` (only one allowed).
- POST `/portfolio/edit/:id`
  - Body: Partial portfolio fields
  - 200 → Updates portfolio (owner-only).
- POST `/portfolio/delete/:id`
  - 200 → Deletes portfolio and clears `user.portfolio`.

### Artist Discovery and Profiles
- GET `/getAllArtist` (auth)
  - 200 → `{ success, message, artist: User[] }` (role=artist only, password excluded)
- GET `/artist/:id` (auth)
  - 200 → Artist profile with populated `services`, `portfolio`, and `reviews`.

### Reviews (`/reviews`) — auth required
- POST `/:artistId`
  - Body: `{ rating, comment }`
  - 201 → Creates a review from current user (client) to artist. One review per client-artist pair.

### Messages (`/messages`) — auth required
- POST `/send/:id` (route param `:id` is currently unused in controller)
  - Body: `{ receiverId, message }`
  - 201 → Creates a message from current user to receiver; pushes ref to receiver.

### Errors
- 404 JSON handler for unknown routes.
- Global 500 handler logs stack and returns JSON `{ success: false, message: 'Internal Server Error' }`.


## Data Flow Notes for Frontend
- After `POST /api/auth/register`, the user must click the email verification link before login works.
- After `POST /api/auth/login`, store the returned `token` if needed for mobile; web relies on httpOnly cookie for subsequent requests.
- For authenticated requests from browser:
  - Send `fetch(..., { credentials: 'include' })` so cookies are included.
  - Ensure frontend origin matches `CLIENT_URL` for CORS.
- Profiles:
  - Use `GET /artist/:id` for public artist viewing (requires auth as coded). Consider relaxing in the future.
  - Use `GET /api/auth/profile` to power the dashboard. If user is artist, it returns `services`, `portfolio`, `reviews`, and `messages` arrays for that artist.
- Services and Portfolio management are all POST-based; plan forms accordingly.


## Integrating Frontend
- Set `CLIENT_URL` to your frontend origin.
- Enable credentials in requests: `axios.defaults.withCredentials = true` or per-request `withCredentials: true`.
- Example (Axios):
```js
axios.post('/api/auth/login', { email, password }, { withCredentials: true });
axios.get('/api/auth/profile', { withCredentials: true });
```
- For password reset email links, the backend generates links using `CLIENT_URL` (e.g., `${CLIENT_URL}/api/reset-password/:token`). Build a frontend route to capture that token and call `POST /reset-password/:token` to submit the new password.
- For email verification, implement a frontend route at `${CLIENT_URL}/email/verify/:token` that calls `GET /email/verify/:token` and then navigates to login.


## Deployment

### Build artifacts
- This backend is Node.js-only; no build step required.

### Environment
- Provide all `.env` variables via your hosting provider (render.com, railway, fly.io, Heroku, Docker, etc.).
- Ensure `CLIENT_URL` matches your deployed frontend domain.
- Use a production SMTP provider (e.g., SendGrid, Postmark).
- Set `NODE_ENV=production` to enable secure cookies.

### MongoDB
- Use a managed MongoDB cluster (MongoDB Atlas). Whitelist server IPs.

### Process manager (optional)
- Use `pm2` to keep the process alive and auto-restart across crashes/deploys.

### Example Dockerfile (optional)
```Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
```

### Reverse proxy & TLS
- Terminate TLS at your proxy (NGINX, Caddy, platform default).
- Proxy pass to Node on `PORT`.


## Testing
- Use Postman collections to exercise endpoints.
- For browser flows, ensure cookies are included and CORS origin equals `CLIENT_URL`.


## Known Gaps and Recommendations
- Email verification secrets: unify `JWT_EMAIL_VERIFY` and `JWT_EMAIL_SECRET` usage or refactor to one variable.
- Messaging: route param `:id` is unused; align route and controller.
- Typo fields: `massages` on `User`, `COMPONY_NAME` env, `err.massage` in DB connect logs. Consider renaming/fixing.
- Cloudinary config is empty; if media uploads are planned, implement `config/cloudinary.js` and update portfolio image handling to upload and store URLs.
- Consider adding validation, rate-limiting, and input sanitization.
- Add pagination/filtering for artist discovery and messaging.
- Use PUT/PATCH/DELETE for updates/deletes to follow REST semantics.


## License
Private project. All rights reserved by the client unless otherwise specified.
