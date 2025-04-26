# Dynamic Widget Dashboard

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) 
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white)

A dynamic dashboard where users can add, remove, and manage widgets within different security categories.  
Built for the Frontend Trainee Assignment using JSON-driven data, Zustand for state management, and a responsive UI.


---

## 🚀 How to Run Locally

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/VaibhavSharma24/dynamic-widget-dashboard.git
   cd dynamic-widget-dashboard
   ```

2. **Install Dependencies**  
   ```bash
   npm install
   ```
    or
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the Development Server**  
   ```bash
   npm run dev
   ```

4. **Open in Browser**  
   Navigate to:  
   ```
   http://localhost:3000
   ```
   or the port mentioned in your terminal.

---

## 🔥 Project Overview

This website is a Dashboard that provides security monitoring and visualization for cloud environments. It's designed to give security teams a comprehensive view of their cloud security posture across different security domains.

---

## 📊 Purpose and Features

The dashboard organizes security information into three main categories:

1. **CSPM (Cloud Security Posture Management)** — Shows cloud account status and risk assessments.
2. **CWPP (Cloud Workload Protection Platform)** — Displays workload and namespace alerts.
3. **Registry Scan** — Presents container image security issues and vulnerabilities.

Each category contains widgets that visualize specific security metrics using charts and statistics. Examples include:

- **Cloud Accounts widget** — Shows connected vs. disconnected accounts.
- **Risk Assessment widget** — Displays passed, failed, and warning security checks.
- **Image Security widgets** — Show vulnerabilities by severity level.

Users can:
- Dynamically add new widgets (with a name and text).
- Remove widgets from a category.
- Search across all widgets.

---

## 🧠 State Management with Zustand

This application uses **Zustand**, a lightweight state management library.

```javascript
export const useWidgetStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      // Store state and functions
    }),
    {
      name: "dashboard-storage",
    }
  )
)
```

### Key Aspects:

- **Local Storage Persistence**  
  The `persist` middleware saves dashboard state to the browser's local storage, preserving user changes across sessions.

- **Widget Management Functions**
  - `addWidgetToCategory`: Add a widget to a specific category.
  - `removeWidgetFromCategory`: Remove a widget from a category.
  - `createWidget`: Create a new custom widget.
  - `searchWidgets`: Search across all available widgets.
  - `getWidgetsByCategory`: Retrieve widgets for a specific category.

- **Initial Data**  
  The store is pre-populated with initial categories and widgets for a ready-to-use dashboard experience.

---

## 🌟 Conclusion

The combination of **Zustand** with local storage persistence offers a smooth, backend-free solution for managing user preferences and dashboard configurations dynamically.

---

