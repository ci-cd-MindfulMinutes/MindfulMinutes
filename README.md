#  MindfulMinutes  
A mindful wellness application designed for daily motivation through quotes, breathing exercises, and journaling.  
Built with the **MEAN Stack** → **MongoDB, Express.js, Angular, Node.js**

---

## Features
✔ Daily motivational quote  
✔ Guided breathing exercises  
✔ Personal journal entries  
✔ Track completed activities  
✔ JWT Authentication & Protected APIs  

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular |
| Backend | Node.js + Express |
| Database | MongoDB |
| API Authentication | JWT |

## How to Run the Application Locally

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/mindfulminutes.git
cd mindfulminutes
```

MongoDB Atlas (Cloud)

🔗 Sign up: https://www.mongodb.com/cloud/atlas

➡ Create a cluster → copy connection string → example:

```bash
mongodb+srv://<username>:<password>@cluster0.mongodb.net/mindfulminutes
```
use this value in the backend .env file.

### 2.Backend Setup (Node + Express)

Go inside the backend folder:

```bash
cd backend
```

Install Dependencies
```bash
npm install
```

Create a .env file in /backend:

```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/mindfulminutes
JWT_SECRET=yourSuperSecretKey
```
There are some options by which you can generate your key:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Start Backend Server
```bash
npm start
```
API is now running at: http://localhost:3000

Frontend Setup (Angular)
Angular needs Node and NPM. Download and install:

🔗 https://nodejs.org/en/download/

After installation, verify:
```bash
node -v
npm -v
```
You should see version numbers (Node v18+ recommended).

Install Angular CLI Globally

Run this in the terminal:
```bash
npm install -g @angular/cli
```
Verify installation:
```bash
ng version
```
You should see Angular CLI version (v16+ recommended).

Open a new terminal tab/window, then:
```bash
cd frontend
npm install
ng serve
```
App will start on: http://localhost:4200