# ECommerce-website

A full-stack e-commerce example application (frontend + backend) created by Partha Mondal.

This repository contains a Node.js + Express backend and a React + Vite frontend. The project supports user authentication, product management, cart/wishlist, orders, payments (Razorpay), image uploads (Cloudinary), email notifications, and sample seed data for development.

## Project structure

- `/backend` - Express API server (Node 18+, ES modules)
  - `src/` - server source code
  - `src/index.js` - server entry
  - `src/app.js` - express app, routes and middleware
  - `src/db/` - database connection
  - `src/routes/` - API routes (user, products, orders, payment)
  - `src/controllers/` - route handlers
  - `src/models/` - Mongoose models (User, Product, Order, Coupon, etc.)
  - `src/data/` - seed scripts (seedProducts.js, seedCoupons.js)

- `/frontend` - React application built with Vite
  - `src/` - React components, contexts and styles
  - `index.html` - app shell
  - `src/main.jsx` - app entry

- `docker-compose.yml` - development compose for backend + frontend

## Key features

- User registration, login (JWT access/refresh tokens)
- Product listing, search and product detail pages
- Cart, wishlist and order flow
- Payment integration with Razorpay
- Image uploads using Cloudinary
- Email notifications via Nodemailer
- Seed data scripts to populate products and coupons

## Tech stack

- Backend: Node.js, Express, Mongoose (MongoDB), Nodemailer, Cloudinary, Razorpay
- Frontend: React, Vite, Tailwind CSS (via dependency), react-router-dom
- Dev tools: nodemon, dotenv

## Requirements

- Node.js 18+
- npm
- MongoDB (Atlas or local)
- A Cloudinary account (optional for uploads)
- Razorpay account/keys for payment testing (optional)

## Environment variables

Create a `.env` file in `/backend` with at least the following keys:

```
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.example.mongodb.net/ecommerce
CORS_ORIGIN=http://localhost:5174
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
NODE_ENV=development
```

The frontend uses `axios` to talk to the backend. If you change ports/origin, update `CORS_ORIGIN` accordingly.

## Running locally

1. Install dependencies

- Backend
  - cd backend
  - npm install

- Frontend
  - cd frontend
  - npm install

2. Start services

- Start backend (development)
  - cd backend
  - npm run dev

- Start frontend
  - cd frontend
  - npm run dev

Open the frontend at http://localhost:5174 and the backend at http://localhost:3000 (or your configured PORT).

## Running with Docker Compose (development)

From the project root run:

- docker compose up --build

This will build both `frontend` and `backend` services defined in `docker-compose.yml` and expose ports used in the compose file (frontend: 5174, backend: 3000).

Note: The compose file mounts source directories for live development. Ensure Docker has access to your project files.

## Seed data

The backend contains seed scripts under `src/data/`:

- `seedProducts.js` - seed initial product catalog
- `seedCoupons.js` - seed coupons

You can run these scripts (or call their exported functions) during development to populate the database. Review the files for usage and adjust the MongoDB URI in `.env` before running.

## Useful scripts

- Backend
  - `npm run dev` — start backend with nodemon
  - `npm start` — start backend (node)

- Frontend
  - `npm run dev` — start Vite dev server
  - `npm run build` — build production bundle
  - `npm run preview` — preview production build

## API overview (main routes)

- Auth & Users: `/api/v1/user/*` (register, login, profile, password reset, OTP verify)
- Products: `/api/v1/products/*` (list, single product, search)
- Payment: `/api/v1/payment/*` (payment creation, verify) — protected
- Orders: `/api/v1/order/*` (create, list) — protected

See route files in `backend/src/routes/` for full details.

## Frontend notes

- Contexts: The app uses React Context for User, Orders and Home data (`frontend/context/`)
- Components: organized under `frontend/components/` (Header, Home, ProductPage, Cart, Checkout, Profile, Orders, etc.)
- Services: API wrappers are in `frontend/services/` (user, product, cart, order, wishlist)

## Contributing

Contributions are welcome. Please open an issue or submit a pull request with a clear description of your change.

## License

See the `LICENSE` file in the repository.

## Author

Partha Mondal
