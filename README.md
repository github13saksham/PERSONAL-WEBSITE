# Saksham Makhija - Portfolio Website

A premium modern full-stack developer portfolio showcasing my work, experience, and skills with a beautiful, interactive user interface.

## Tech Stack
-   **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion
-   **Backend:** Node.js, Express.js, MongoDB (Mongoose)

## Features
-   ✨ Modern dark mode theme with glassmorphism and gradient accents
-   🎨 Advanced Mask Hover effect on hero image
-   📱 Fully responsive design
-   ⚡ Ultra-fast performance (score >90)
-   🔥 Animated scroll interactions
-   📧 Contact form integrated with Nodemailer
-   📂 Live GitHub repositories fetch

---

## Deployment Instructions

### Frontend (Vercel)
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import the repository and select the `frontend` folder as the Root Directory.
4. Framework Preset should automatically detect Vite.
5. Add the following Environment Variables in Vercel:
   - `VITE_API_URL`: `https://your-backend-render-url.onrender.com/api`
6. Click Deploy.

### Backend (Render)
1. Go to [Render](https://render.com/) and create a new Web Service.
2. Connect your GitHub repository.
3. Select the `backend` folder as the Root Directory.
4. Set the Build Command: `npm install`
5. Set the Start Command: `node server.js`
6. Add the following Environment Variables in Render:
   - `PORT`: `5000`
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio`
   - `EMAIL_USER`: `your-email@gmail.com` (for sending contact form messages)
   - `EMAIL_PASS`: Your App Password (if using Gmail, generate an App Password in security settings)
   - `RECEIVER_EMAIL`: `smakhija140@gmail.com` (where you want to receive messages)
7. Click Create Web Service.

## Local Development Setup

### Backend Start
```bash
cd backend
npm install
npm run dev
```
Create a `.env` in the backend folder using the variables listed in the deployment section.

### Frontend Start
```bash
cd frontend
npm install
npm run dev
```

Create a `.env` in the frontend folder (or use defaults) with:
`VITE_API_URL=http://localhost:5000/api`
