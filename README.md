# SL Tax Calculator

A full-stack web application that helps Sri Lankans instantly calculate their monthly APIT/PAYE salary tax and EPF deductions.

🔗 **Live Demo:** https://sl-taxcal.vercel.app

---

## ✨ Features

- 💰 Progressive APIT/PAYE tax calculation engine
- 📊 EPF deduction calculator (8% employee contribution)
- 🗄️ Dynamic tax brackets fetched from MongoDB database
- 🔐 JWT protected admin panel
- ➕ Add / Edit / Delete tax slabs from admin panel
- 🎨 Beautiful minimal aesthetic UI design

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| Next.js 15 (App Router) | Full-stack framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB ODM |
| JWT (jose) | Admin authentication |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Installation

1. Clone the repository
\```bash
git clone https://github.com/induwara89/SL-TaxCal.git
cd SL-TaxCal
\```

2. Install dependencies
\```bash
npm install
\```

3. Create `.env` file
\```env
MONGODB_URI=your-mongodb-connection-string
ADMIN_SECRET=your-admin-secret
ADMIN_PASSWORD=your-admin-password
\```

4. Seed the database
\```bash
npx tsx prisma/seed.ts
\```

5. Run the development server
\```bash
npm run dev
\```

6. Open http://localhost:3000

---

## 📊 Sri Lanka Tax Slabs (2024/2025)

| Monthly Income | Tax Rate |
|---------------|----------|
| Rs. 0 — 100,000 | 0% |
| Rs. 100,001 — 141,667 | 6% |
| Rs. 141,668 — 183,333 | 12% |
| Rs. 183,334 — 225,000 | 18% |
| Rs. 225,001 — 266,667 | 24% |
| Rs. 266,668 — 308,333 | 30% |
| Rs. 308,334 and above | 36% |

---

## 🔐 Admin Panel

Access the admin panel at `/admin/login` to manage tax slabs dynamically.

---

## 📸 Screenshots

![Calculator](public/taxlogo.png)

---

## 📄 License

MIT License — feel free to use this project!

---

Made with ❤️ in Sri Lanka 🇱🇰
