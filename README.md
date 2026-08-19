# 🚀 SankalpCode — Frontend

A modern, responsive, and intuitive web application frontend built for **SankalpCode** — an interactive coding and learning platform. Engineered with **React.js**, **Vite**, and styled with utility-first CSS for fast rendering and high responsiveness across all device form factors.

🔗 **Live Deployment:** [https://sankalpcode-frontend-silk.vercel.app/signup](https://sankalpcode-frontend-silk.vercel.app/signup)  
📂 **Repository:** [https://github.com/Dolikansal/sankalpcode_frontend](https://github.com/Dolikansal/sankalpcode_frontend)

---

## 🌟 Overview

The **SankalpCode Frontend** serves as the user-facing interface of the platform, delivering structured learning modules, authentication workflows, user dashboards, and code practice environments. It utilizes Vite for rapid Hot Module Replacement (HMR) and optimized static asset delivery via Vercel.

---

## ✨ Key Features

- 🔐 **Authentication Flows:** Clean, responsive UI for User Registration (Sign Up), Login, and Password Recovery.
- 💻 **Interactive Dashboard & Tracks:** Structured learning roadmaps and problem-solving modules.
- 📱 **Mobile-First & Fully Responsive:** Optimized interface across mobile devices, tablets, and wide desktop screens.
- ⚡ **High Performance:** Bundled with Vite for instant loading, sub-second route transitions, and code splitting.
- 🎨 **Reusable Component Architecture:** Scalable directory pattern with dedicated UI widgets, forms, layouts, and input validators.
- 🌐 **Seamless API Integration:** Configured for asynchronous REST/GraphQL communication with backend services.

---

## 🛠️ Tech Stack

| Domain | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Framework / Core** | React.js (v18+) | Component-based dynamic user interface |
| **Bundler & Tooling** | Vite | Rapid development server & production builder |
| **Styling** | Tailwind CSS / CSS Modules | Utility-driven, responsive UI styling |
| **Routing** | React Router DOM (v6) | Declarative client-side routing & page navigation |
| **Icons & Assets** | Lucide React / React Icons | Lightweight scalable vector icons |
| **HTTP Client** | Axios / Fetch API | Asynchronous API calls and interceptors |
| **Deployment** | Vercel | Production static hosting with CI/CD triggers |

---

## 📁 Project Directory Structure

```text
sankalpcode_frontend/
├── public/                 # Static assets, logos, and favicon
├── src/
│   ├── assets/             # Images, illustrations, and media assets
│   ├── components/         # Reusable atomic UI components (Button, Input, Navbar, Footer)
│   │   ├── common/         # Global shared components
│   │   └── auth/           # Authentication forms and cards
│   ├── pages/              # Route-level views (Signup, Login, Dashboard, Courses, Editor)
│   │   ├── Signup.jsx      # Signup entry view
│   │   ├── Login.jsx       # Login view
│   │   └── Home.jsx        # Landing page
│   ├── context/            # Global React Context providers (AuthContext, ThemeContext)
│   ├── services/           # API integration endpoints and Axios config (api.js)
│   ├── utils/              # Helper functions, form validation schemas, and constants
│   ├── App.jsx             # Top-level application routing wrapper
│   ├── index.css           # Tailwind base styles and global styling resets
│   └── main.jsx            # DOM root mounting point
├── index.html              # HTML shell
├── vite.config.js          # Vite plugins and server aliases
├── tailwind.config.js      # Theme colors, fonts, and breakpoint setup
├── package.json            # Project dependencies and script declarations
└── README.md               # Project documentation
