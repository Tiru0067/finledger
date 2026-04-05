# FinLedger

A backend REST API for managing financial records with role-based access control. Built as part of a backend engineering internship screening assignment for Zorvyn FinTech.

**Live API:** https://finledger-ufpb.onrender.com/api

> ⚠️ Hosted on Render's free tier. First request may take up to 50 seconds if the server has been idle.

---

## What This Project Does

FinLedger is an internal finance dashboard API. Different users have different levels of access depending on their role — a viewer can only see records, an analyst can also access financial insights, and an admin has full control over records and users.

The goal was to build a clean, well-structured backend that handles:

- User authentication with JWT
- Role-based access control (RBAC)
- Financial record management (create, read, update, soft delete)
- Dashboard summary endpoints (totals, trends, category breakdowns)
- Input validation and proper error handling

---

## Tech Stack

| Tool               | Purpose                         |
| ------------------ | ------------------------------- |
| Node.js + Express  | Backend framework               |
| PostgreSQL (Neon)  | Database                        |
| Prisma ORM         | Database access and migrations  |
| JWT (jsonwebtoken) | Authentication                  |
| bcrypt             | Password hashing                |
| dotenv             | Environment variable management |

---

## Project Structure

```
finledger/
├── prisma/
│   ├── schema.prisma        # Database models (User, Record)
│   ├── seed.js              # Creates the super admin on first run
│   └── migrations/          # Auto-generated migration history
│
├── src/
│   ├── server.js            # App entry point, route registration
│   ├── config/
│   │   └── db.js            # Prisma client setup (Neon adapter)
│   │
│   ├── middlewares/
│   │   ├── auth.js          # JWT verification middleware
│   │   ├── authorize.js     # Role-based access control middleware
│   │   └── errorHandler.js  # Global error handler
│   │
│   ├── utils/
│   │   ├── AppError.js      # Custom error class
│   │   ├── asyncHandler.js  # Wraps async controllers to catch errors
│   │   └── response.js      # Standardized JSON response helper
│   │
│   └── modules/
│       ├── auth/            # Login endpoint
│       ├── users/           # User management (admin only)
│       ├── records/         # Financial records CRUD
│       └── dashboard/       # Summary and analytics endpoints
│
├── api.http                 # Ready-to-use API test file (REST Client)
├── .env.example             # Environment variable template
└── package.json
```

Each module follows the same pattern: `routes → controller → service`. Routes handle HTTP, controllers extract inputs, services contain the business logic.

---

## Roles and Permissions

| Action                                  | Viewer | Analyst | Admin |
| --------------------------------------- | ------ | ------- | ----- |
| Login                                   | ✅     | ✅      | ✅    |
| View all records                        | ✅     | ✅      | ✅    |
| View single record                      | ✅     | ✅      | ✅    |
| Basic dashboard (income, expenses, net) | ✅     | ✅      | ✅    |
| Category breakdown                      | ❌     | ✅      | ✅    |
| Monthly/weekly trends                   | ❌     | ✅      | ✅    |
| Recent transactions                     | ❌     | ✅      | ✅    |
| Create records                          | ❌     | ❌      | ✅    |
| Update records                          | ❌     | ❌      | ✅    |
| Soft delete records                     | ❌     | ❌      | ✅    |
| Manage users                            | ❌     | ❌      | ✅    |

---

## Setup and Installation

### Prerequisites

- Node.js v18 or higher
- A PostgreSQL database (the project uses [Neon](https://neon.tech) — a free serverless Postgres)

### 1. Clone the repository

```bash
git clone https://github.com/Tiru0067/finledger.git
cd finledger
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set:

```env
DATABASE_URL=your_neon_postgres_connection_string
NODE_ENV=development
PORT=5001
SECRET_KEY=any_long_random_string_for_jwt

# These are used to create the first admin account on startup
ADMIN_NAME=Arjun Mehta
ADMIN_EMAIL=arjun@finledger.com
ADMIN_PASSWORD=Arjun@123
```

### 4. Run database migrations

```bash
npx prisma migrate deploy
```

### 5. Seed the database (creates the super admin)

```bash
node prisma/seed.js
```

### 6. Start the server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

The server runs at `http://localhost:5001`.

---

## API Reference

> All endpoints except `POST /api/auth/login` require a `Bearer <token>` in the `Authorization` header.

### Auth

| Method | Endpoint          | Description             | Access |
| ------ | ----------------- | ----------------------- | ------ |
| POST   | `/api/auth/login` | Login and get JWT token | Public |

**Request body:**

```json
{
  "email": "arjun@finledger.com",
  "password": "Arjun@123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGci...",
    "user": { "id": 1, "name": "Arjun Mehta", "email": "...", "role": "admin" }
  }
}
```

---

### Users (Admin only)

| Method | Endpoint         | Description                                                      |
| ------ | ---------------- | ---------------------------------------------------------------- |
| GET    | `/api/users`     | Get all users (filter by `?status=active` or `?status=inactive`) |
| GET    | `/api/users/:id` | Get a single user                                                |
| POST   | `/api/users`     | Create a new user                                                |
| PUT    | `/api/users/:id` | Update user (name, email, password, role, status)                |
| DELETE | `/api/users/:id` | Deactivate a user (soft — sets status to inactive)               |

**Create user body:**

```json
{
  "name": "Priya Nair",
  "email": "priya@finledger.com",
  "password": "Priya@123"
}
```

All new users start as `viewer` with `active` status. Role must be updated separately.

**Update user body (all fields optional):**

```json
{
  "role": "analyst"
}
```

---

### Financial Records

| Method | Endpoint           | Description          | Access     |
| ------ | ------------------ | -------------------- | ---------- |
| GET    | `/api/records`     | Get all records      | All roles  |
| GET    | `/api/records/:id` | Get a single record  | All roles  |
| POST   | `/api/records`     | Create a record      | Admin only |
| PUT    | `/api/records/:id` | Update a record      | Admin only |
| DELETE | `/api/records/:id` | Soft delete a record | Admin only |

Add `?includeDeleted=true` to `GET /api/records` to include soft-deleted records (admin only).

**Valid values:**

- `type`: `income` or `expense`
- `category`: `revenue`, `salary`, `operations`, `marketing`, `utilities`, `rent`, `travel`, `equipment`, `taxes`, `other`

**Create record body:**

```json
{
  "amount": 150000,
  "type": "income",
  "category": "salary",
  "date": "2026-03-01",
  "notes": "March salaries received"
}
```

---

### Dashboard

| Method | Endpoint                    | Description                         | Access          |
| ------ | --------------------------- | ----------------------------------- | --------------- |
| GET    | `/api/dashboard`            | Total income, expenses, net balance | All roles       |
| GET    | `/api/dashboard/categories` | Expense totals grouped by category  | Analyst + Admin |
| GET    | `/api/dashboard/trends`     | Income vs expenses over time        | Analyst + Admin |
| GET    | `/api/dashboard/recent`     | Latest N transactions               | Analyst + Admin |

**Trends query params:**

- `?period=monthly` (default) or `?period=weekly`

**Recent query params:**

- `?limit=5` (default is 10)

**Dashboard response example:**

```json
{
  "success": true,
  "data": {
    "total_income": 490000,
    "total_expenses": 150000,
    "net_balance": 340000
  }
}
```

---

## Key Design Decisions

### JWT Authentication

Tokens are signed with a secret key and expire after 8 hours. Every protected route runs `authMiddleware` which verifies the token and checks that the user still exists and is active.

### Role-Based Access Control

The `authorize(...roles)` middleware accepts a list of allowed roles and blocks the request with a `403 Forbidden` if the logged-in user's role isn't in that list.

### Soft Deletes for Records

Records are never permanently deleted. Instead, a `deletedAt` timestamp is set. This preserves financial history. Soft-deleted records are hidden from normal queries but visible to admins via `?includeDeleted=true`.

### Super Admin

The first admin created via seed is marked as `isSuperAdmin: true`. This account cannot be deactivated or modified through the API, protecting the system from being locked out.

### No Public Registration

There is no `POST /api/auth/register`. Only admins can create users via `POST /api/users`. This is intentional — it keeps the system internal and controlled.

### Users start as Viewer

When an admin creates a new user, the role defaults to `viewer`. The admin must explicitly update the role afterwards. This follows the principle of least privilege.

---

## Validation

All inputs are validated before reaching the database:

- Missing required fields return a clear error: `"Amount and Category are required"`
- Invalid email format is rejected
- Password must be at least 7 characters with uppercase, lowercase, a number, and a special character
- Invalid enum values (wrong type or category) return the list of valid options
- Invalid IDs (non-numeric) are caught before the database query

---

## Error Handling

All errors flow through a centralized `errorHandler` middleware. Responses always follow this format:

```json
{
  "success": false,
  "message": "Descriptive error message here"
}
```

Common status codes used:

- `400` — bad input or invalid operation
- `401` — not authenticated or wrong credentials
- `403` — authenticated but not authorized
- `404` — resource not found
- `409` — conflict (e.g. email already exists)
- `500` — unexpected server error

---

## Testing the API

An `api.http` file is included in the root of the project. If you're using VS Code, install the [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to run requests directly from the file.

1. Login as admin and copy the token
2. Paste it into the `@adminToken` variable at the top of `api.http`
3. Run any request from the file

---

## Test Credentials

The following users are pre-seeded for testing:

| Name        | Email               | Password  | Role    | Status   |
| ----------- | ------------------- | --------- | ------- | -------- |
| Arjun Mehta | arjun@finledger.com | Arjun@123 | Admin   | Active   |
| Priya Nair  | priya@finledger.com | Priya@123 | Analyst | Active   |
| Ravi Kumar  | ravi@finledger.com  | Ravi@123  | Viewer  | Active   |
| Sneha Das   | sneha@finledger.com | Sneha@123 | Viewer  | Inactive |

---

## Assumptions Made

- Financial amounts are stored as `Decimal(15, 2)` to avoid floating point issues with money
- The `date` field on records represents the transaction date, not the creation date
- Inactive users cannot log in, even with a valid token
- Category is an enum defined at the schema level — open-ended strings are not allowed
- The API is designed for internal use only — there is no public-facing registration

---

## What Could Be Improved (Given More Time)

- Filtering records by date range, category, or type (query params on `GET /api/records`)
- Pagination on list endpoints

---

## Author

**Thirumalarao Parasavedi**  
Backend Developer Intern Candidate — Zorvyn FinTech Screening Assignment

---
