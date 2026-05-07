# 🎓 Campus Connect

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Campus Connect** is a unified digital ecosystem designed for modern universities. It streamlines campus communication, academic organization, and student life by providing a centralized platform for social engagement, official announcements, and peer-to-peer commerce.

---

## 🚀 Features

### 📱 Core Experience
- **Real-time Activity Feed**: Stay updated with campus happenings, sorted dynamically by latest activity.
- **Smart Messaging**: Integrated chat system for seamless peer-to-peer and faculty communication.
- **User Profiles**: Custom profiles for students and faculty featuring academic history and batch details.

### 🏢 Campus Management
- **Departmental Hubs**: Dedicated sections for specific faculties and departments.
- **Societies & Clubs**: Official portals for campus organizations to manage events and announcements.
- **Admin Command Center**: Robust tools for user moderation and platform oversight.

### 🛒 Student Utility
- **Integrated Marketplace**: A dedicated space for students to buy, sell, or trade textbooks, electronics, and essentials.
- **Event Management**: Keep track of upcoming seminars, workshops, and social gatherings.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS |
| **Backend** | Next.js Server Actions, Node.js |
| **Database** | PostgreSQL with Prisma ORM |
| **Auth** | NextAuth.js (Auth.js) |
| **Icons** | Lucide React |

---

## 🏁 Getting Started

### Prerequisites
- Node.js 20+ installed
- PostgreSQL database instance

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/yourusername/campus-connect.git
   cd campus-connect-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/campus_connect"
   NEXTAUTH_SECRET="your_secret_key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Launch**
   ```bash
   npm run dev
   ```

---

## 📂 Architecture

```text
campus-connect-app/
├── prisma/             # Database schema & migrations
├── public/             # Static assets (images, icons)
├── src/
│   ├── app/            # Routes & Server Actions
│   ├── components/     # UI Components (React)
│   ├── lib/            # Shared utilities & Prisma client
│   └── types/          # TypeScript definitions
└── tailwind.config.ts  # Design system configuration
```

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---



Developed as part of the **DBMS Course Project - 4th Semester**.
