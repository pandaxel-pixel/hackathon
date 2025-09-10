# EcoCiclo

EcoCiclo is a modern web application designed to connect people who want to recycle materials with local collectors, creating an efficient and gamified ecosystem for waste management. The platform offers two distinct roles: **Poster** and **Collector**, each with its own tailored interface and functionalities.

## ⚠️ Project Status: Frontend Prototype

It is important to note that this project is a **functional frontend-only prototype**.

- **No Backend:** The application does not connect to any server or database.
- **Mock Data:** All the information displayed (items, stats, users) comes from mock data files located in `src/data/mockData.ts`.
- **No Persistence:** `localStorage` or any other form of persistent storage is not used. Any changes you make, such as creating a new item, **will be lost upon page reload**.

## ✨ Core Features

The application is divided into two main user experiences:

### 👨‍🚀 Poster Role

The interface for those who post materials for recycling.

- **Create Posts:** Allows users to easily post items they have for recycling, adding details such as title, description, category (plastic, paper, metal, etc.), weight, and a photo.
- **Manage Items:** View and manage the status of posted items: `active`, `accepted` by a collector, or `completed`.
- **Stats and Ranking:** Access a statistics dashboard to track the total number of items posted, total recycled, points earned, and position in a community ranking.

### 🚴 Collector Role

The interface for those who pick up the recyclable materials.

- **Discover Items:** Browse available items for pickup in an interactive card format, allowing to `accept` or `reject` each opportunity.
- **Map View:** Visualize the location of recyclable items on a map to plan efficient collection routes.
- **Earnings Dashboard:** Keep track of total earnings, the number of completed pickups, and the collector's rating.
- **Communication:** Use an integrated messaging system to coordinate pickups with posters.

## 🌐 Contribution Guidelines

- **Language:** All code comments, documentation, and commit messages must be written in English.

## 🚀 Technologies Used

- **Frontend Framework:** React
- **Development Environment:** Vite
- **Language:** TypeScript
- **CSS Styling:** Tailwind CSS
- **Code Quality:** ESLint

## 🛠️ Getting Started

Follow these steps to set up and run the project in your local environment.

### Prerequisites

- Node.js (v18 or higher)
- npm (or a compatible package manager like yarn or pnpm)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <REPOSITORY_URL>
    cd ecociclo
    ```

2.  **Install project dependencies:**
    ```bash
    npm install
    ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the port indicated by Vite).

2.  **Build the application for production:**
    ```bash
    npm run build
    ```
    The optimized files will be generated in the `dist/` directory.

3.  **Run the linter to check code quality:**
    ```bash
    npm run lint
    ```
