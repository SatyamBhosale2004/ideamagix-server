# IdeaMagix Scheduling System Backend API 🚀

An robust Node.js, Express, and MongoDB backend application designed for academic schedules and lecture calendars, featuring automated date-clash prevention and hybrid image storage syncing (Cloudinary + Local serving fallback).

---

## 📁 Project Structure

```text
server/
├── config/
│   ├── db.js                 # MongoDB connection logic
│   └── cloudinary.js         # Cloudinary configuration
├── controllers/
│   ├── authController.js       # Admin & Instructor login/registration
│   ├── courseController.js     # Course management (create, delete, list)
│   ├── dashboardController.js  # High-level metrics for admin panel
│   ├── instructorController.js # Instructor onboarding & accounts
│   └── lectureController.js    # Lecture planning & double-booking prevention
├── middleware/
│   ├── auth.js                 # JWT verification & role validation (isAdmin)
│   └── uploadMiddleware.js     # Multer local buffering configuration
├── models/
│   ├── Admin.js                # Schema for Administrator users
│   ├── Course.js               # Schema for academic Courses
│   ├── Instructor.js           # Schema for teaching Instructors
│   └── Lecture.js              # Schema for planned Lectures
├── routes/
│   ├── authRoutes.js           # /api/auth/* endpoints
│   ├── courseRoutes.js         # /api/courses/* endpoints
│   ├── dashboardRoutes.js      # /api/dashboard/* endpoints
│   ├── instructorRoutes.js     # /api/instructors/* endpoints
│   └── lectureRoutes.js        # /api/lectures/* endpoints
├── uploads/                    # Local folder serving fallback course images
├── .env                        # Configuration secrets (ignored by git)
├── .gitignore                  # Git untracked settings (ignores uploads & .env)
├── package.json                # Project dependencies and script commands
└── server.js                   # Application bootstrap, CORS, & security headers
```

---

## 🔑 Environment Variables (`.env`)

Configure the following variables in a `.env` file at the root of the server directory:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key_secret

# Cloudinary Integration (Optional, but highly recommended for persistent files)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_URL=your_full_cloudinary_connection_url
```

---

## 📡 API Endpoints Reference

All requests expect JSON bodies unless specified otherwise. Token-authenticated routes require the header `Authorization: Bearer <TOKEN>`.

### 1. Authentication (`/api/auth`)

| Endpoint | Method | Auth | Description | Input Parameters |
| :--- | :---: | :---: | :--- | :--- |
| `/api/auth/admin/register` | `POST` | Public | Register a new administrator account | `name`, `email`, `password` |
| `/api/auth/admin/login` | `POST` | Public | Sign in to the Admin Console | `email`, `password` |
| `/api/auth/instructor/login` | `POST` | Public | Sign in to the Instructor Portal | `email`, `password` |

### 2. Course Management (`/api/courses`)

| Endpoint | Method | Auth | Description | Input Parameters |
| :--- | :---: | :---: | :--- | :--- |
| `/api/courses` | `POST` | Admin | Create a new course (Multipart Form Upload) | Form data: `name`, `level`, `description`, file `image` |
| `/api/courses` | `GET` | Verified | Get paginated list of courses (supports search) | Query: `?page=1&limit=9&search=biology` |
| `/api/courses/:id` | `DELETE` | Admin | Permanently delete a course from the catalog | URL Parameter: `id` |

### 3. Instructor Management (`/api/instructors`)

| Endpoint | Method | Auth | Description | Input Parameters |
| :--- | :---: | :---: | :--- | :--- |
| `/api/instructors` | `POST` | Admin | Onboard a new instructor (generates account) | `name`, `email`, `password` |
| `/api/instructors` | `GET` | Admin | Retrieve all registered instructors | None |
| `/api/instructors/:id` | `GET` | Admin | Get details of a single instructor | URL Parameter: `id` |
| `/api/instructors/:id` | `DELETE` | Admin | Delete an instructor and revoke portal access | URL Parameter: `id` |

### 4. Lecture & Calendar Scheduling (`/api/lectures`)

| Endpoint | Method | Auth | Description | Input Parameters |
| :--- | :---: | :---: | :--- | :--- |
| `/api/lectures` | `POST` | Admin | Schedule a new lecture (triggers conflict checks) | `course`, `instructor`, `title`, `date`, `time`, `batch` |
| `/api/lectures` | `GET` | Admin | Retrieve all planned lectures (paginated) | Query: `?page=1&limit=10` |
| `/api/lectures/:id` | `PUT` | Admin | Update scheduled lecture details | `course`, `instructor`, `title`, `date`, `time`, `batch` |
| `/api/lectures/:id` | `DELETE` | Admin | Cancel/delete a lecture from the database | URL Parameter: `id` |
| `/api/lectures/instructor/:instructorId` | `GET` | Verified | Retrieve calendar of assigned lectures for an instructor | URL Parameter: `instructorId` |

### 5. Metrics & Dashboard Statistics (`/api/dashboard`)

| Endpoint | Method | Auth | Description | Output Response |
| :--- | :---: | :---: | :--- | :--- |
| `/api/dashboard/stats` | `GET` | Admin | Fetch count summaries for the admin home view | `totalInstructors`, `totalCourses`, `totalLectures`, `upcomingLectures` |

---

## 🔒 Smart Conflict & Double-Booking Prevention

When creating (`POST /api/lectures`) or modifying (`PUT /api/lectures/:id`) a lecture, the backend automatically performs a double-booking check:
1. It extracts the targeted date and isolates the exact boundaries (`00:00:00.000` to `23:59:59.999`).
2. It queries for any existing lecture assigned to the same **instructor** on the same **date**.
3. If an overlap is detected, it terminates the request, returning a `409 Conflict` status code and a descriptive error message: 
   *"This instructor already has a lecture scheduled on this date. Please choose a different date or instructor."*

---

## 🖼️ Hybrid Image Sync & Local Fallback System

To guarantee course image uploads are highly reliable, the backend utilizes a custom hybrid storage pipeline:

1. **Multer Buffering**: When an image is uploaded, it is temporarily cached securely in the local disk directory (`server/uploads`).
2. **Cloudinary Sync**:
   * The server attempts to upload the locally buffered image up to Cloudinary.
   * **Success case:** The local buffer is instantly unlinked (deleted) from disk, and the database stores the secure `cloudinary` CDN URL.
   * **Failure fallback:** If Cloudinary is offline or missing credentials, the server preserves the local file and dynamically generates a serving path pointing to the backend host (e.g. `https://your-domain.com/uploads/filename.png`).
3. **CORS & CORP Policy**: The server exposes the local static files on `/uploads` and overrides Helmet's Cross-Origin resource sharing policy (`Cross-Origin-Resource-Policy: cross-origin`) to allow frontend clients on other ports/domains to render the images seamlessly.

---

## 🚀 Running Locally & Deploying

### Local Commands
```bash
# Install dependencies
npm install

# Start in development mode (reloads automatically on changes via nodemon)
npm run dev

# Start in production mode
npm start
```

### Server Deployment (Render)
This server is fully optimized to run on **Render's Free Tier** ($0/month) out of the box:
1. Create a **New Web Service** linked to your repository.
2. Select **Runtime:** `Node`, **Build Command:** `npm install`, and **Start Command:** `npm start` (or `node server.js`).
3. Under the **Environment** tab, copy over your `.env` variables.
4. Render will deploy and automatically rebuild on every git push to the `main` branch!
