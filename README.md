# 🌍 Travel Experiences

A full-stack web application that allows users to explore, book, and manage exciting travel experiences around the world.  
Built with modern technologies for seamless booking, user authentication, and a smooth browsing experience.

---

## 🚀 Features

- 🧳 Browse curated travel experiences
- 🗓️ Book experiences with date & time selection
- 🎫 Optional promo code system
- 👤 Secure login & registration (JWT-based authentication)
- 💬 User dashboard to view and manage bookings
- 🌗 Light/Dark mode support
- ⚙️ Admin panel for managing experiences and users

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (with Tailwind CSS / Chakra UI)
- **React Router DOM** for navigation
- **Axios** for API communication

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with Mongoose
- **JWT Authentication**
- **CORS** and **dotenv** for environment management

---

## 📁 Folder Structure

```
Travel-experiences/
 ├── backend/              # Express server & API routes
 │    ├── models/
 │    ├── routes/
 │    ├── controllers/
 │    ├── server.js
 ├── frontend/             # React app for user interface
 │    ├── src/
 │    ├── public/
 ├── .gitignore
 ├── package.json
 ├── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/anandbhardwaj456/Travel-experiences.git
cd Travel-experiences
```

### 2️⃣ Install dependencies
For backend:
```bash
cd backend
npm install
```

For frontend:
```bash
cd ../frontend
npm install
```

### 3️⃣ Set environment variables
Create a `.env` file in `backend/`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the app
In two separate terminals:
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm start
```

Your app will now run on:
- Frontend → `http://localhost:3000`
- Backend → `http://localhost:5000`

---

## 🌐 Deployment

You can deploy:
- **Frontend** → Vercel / Netlify  
- **Backend** → Render / Railway / Heroku  
- **Database** → MongoDB Atlas  

---

## 🧑‍💻 Author

**Anand Bhardwaj**  
💼 Full Stack Developer | 🚀 Passionate about scalable web apps  
🔗 [GitHub](https://github.com/anandbhardwaj456)

---

## 🪄 License

This project is licensed under the **MIT License** — feel free to use and modify it.

---

### ⭐ If you like this project, consider giving it a star on GitHub!
=======
# Travel-experiences
>>>>>>> e361dc3 (Updated backend code and seed logic (local image paths))
