# TaxVantage - Frontend

An enterprise-grade Tax Consultancy, ITR Filing, and GST Compliance platform built for modern taxpayers, chartered accountants (CAs), and administrators.

---

## 🚀 Key Features

### 👤 Client Portal
- **ITR & GST Filing**: Step-by-step assisted filing flows for individuals, businesses, and LLPs.
- **Document Vault**: Secure upload and management for Form 16, PAN, Aadhaar, balance sheets, and bank statements.
- **Workflow & Status Tracking**: Real-time progress updates across document verification, CA review, and filing submission.
- **Invoices & Receipts**: View, track, and download billing receipts and service invoices.

### 💼 Chartered Accountant (CA) Portal
- **Case Management**: Dedicated workspace to review assigned client cases and documents.
- **Document Verification**: Approve, reject, or request additional documentation directly from clients.
- **Filing Workflows**: Advance client cases through stages: Draft, Review, Computation, and Complete.

### 🛡️ Admin Dashboard
- **Platform Analytics**: Track active filings, revenue metrics, and CA utilization.
- **User & CA Management**: Manage accounts, onboarding, and role assignments.
- **Case Delegation**: Assign and reassign client cases to specialized CAs.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Custom CSS Design Tokens
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Animations**: [Motion](https://motion.dev/)

---

## 📂 Project Structure

```text
Tax-latest/
├── public/                 # Static assets & public images
│   └── biztax.png
├── src/
│   ├── assets/             # SVG illustrations and graphics
│   ├── components/         # Reusable UI components & modals
│   │   ├── AssignCAModal   # CA assignment dialog
│   │   ├── DocumentUpload  # File upload with drag-and-drop
│   │   ├── Header / Footer # Navigation & footer
│   │   ├── PaymentModal    # Payment checkout modal
│   │   ├── Sidebar         # Dashboard navigation sidebar
│   │   └── WorkflowTracker # Milestone tracker
│   ├── data/               # Service definitions & mock dataset
│   ├── pages/              # Route pages (Home, Portals, Dashboards)
│   ├── styles/             # Global design tokens & responsive styles
│   ├── types/              # TypeScript interfaces & types
│   ├── utils/              # Client storage & helper functions
│   ├── App.tsx             # Root router configuration
│   └── main.tsx            # Application entry point
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `bun`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nainatechnologies/Tax-frontend.git
   cd Tax-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Setup:
   Copy the example environment file and configure if needed:
   ```bash
   cp .env.example .env
   ```

4. Run local development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on port 3000 |
| `npm run build` | Builds the optimized production bundle in `/dist` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |

---

## 🔒 License

Proprietary - Naina Technologies. All rights reserved.
