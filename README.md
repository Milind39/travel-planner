# 🌍 Travel Planner

A **Next.js + TypeScript** powered web application to help users explore destinations and plan their trips seamlessly.  
Deployed on **Vercel** for a fast, modern, and responsive experience.

🔗 **Live Demo:** [Travel Planner on Vercel](https://travel-planner-rosy-nine.vercel.app/)  
📂 **Repository:** [GitHub Repo](https://github.com/Milind39/travel-planner)

---

## ✨ Features

- 🗺️ Browse and search travel destinations  
- 📝 Plan, create, and manage itineraries  
- 📱 Mobile-first responsive design with Tailwind CSS  
- 🛠️ Prisma integration for database and user data management  
- 🔐 Middleware setup for authentication and secure routes  
- 🚀 One-click deployment with Vercel  

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)  
- **Language:** TypeScript / JavaScript  
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)  
- **Database ORM:** [Prisma](https://www.prisma.io/)  
- **Deployment:** [Vercel](https://vercel.com/)  
- **Other Tools:** PostCSS, ESLint, Middleware  

---



## 🚀 Getting Started

### ✅ Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) (v16 or above recommended)  
- npm / yarn / pnpm  

### 📥 Installation

Clone the repository:

```bash
git clone https://github.com/Milind39/travel-planner.git
cd travel-planner

Install dependencies:

npm install
# or
yarn install
# or
pnpm install

⚙️ Environment Setup

Create a .env.local file in the project root and add the following variables (update values as needed):

DATABASE_URL="postgresql://user:password@localhost:5432/travelplanner"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

Run Prisma migrations:

npx prisma migrate dev --name init
npx prisma generate

🏃 Running Locally

Start the dev server:

npm run dev

Then open http://localhost:3000.

🏗️ Build & Production

Create a production build:

npm run build

Run the production server:

npm start


---

☁️ Deployment

This project is optimized for Vercel.

1. Push your code to GitHub


2. Import the repo in Vercel


3. Add required environment variables (DATABASE_URL, NEXTAUTH_SECRET, etc.)


4. Deploy 🎉




