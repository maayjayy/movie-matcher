## Movie Matcher

> A real-time, collaborative movie swiping web application that helps groups decide what to watch together without the endless scrolling.

[![Live Demo](https://img.shields.io/badge/Demo-Live_App-292c5b?style=for-the-badge&logo=vercel)](https://movie-matcher-seven.vercel.app/)
[![Tech Stack](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

---

## Features

* **Real-time Synchronization:** Live room creation and joining powered by Firebase Firestore listeners.
* **Tinder-Style Swiping:** Fluid movie deck interface for quick "Like" or "Pass" decisions.
* **Smart Matching & Podium:** Instant match detection that routes all room participants directly to a podium voting tally.
* **TMDB Integration:** Dynamic movie posters, details, and recommendations fetched live via TMDB API.
* **Responsive Dark Theme:** Mobile-first, fully locked viewport optimized for seamless phone and desktop swiping.

---

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router, React, TypeScript)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database & Realtime Sync:** [Firebase Firestore](https://firebase.google.com/docs/firestore)
* **API:** [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)
* **Deployment:** [Vercel](https://vercel.com/)

---

## Getting Started Locally

### Prerequisites

* Node.js 18+ installed
* A TMDB API Key
* A Firebase Project with Firestore enabled

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/maayjayy/movie-matcher.git](https://github.com/maayjayy/movie-matcher.git)
   cd movie-matcher

2. Install dependencies: ```npm install```
   
3. Create a .env.local file in the root directory and add your API keys:
    TMDB_API_KEY=your_tmdb_api_key
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

4. Run the development server: ```npm run dev```

5. Open  [http://localhost:3000](http://localhost:3000) with your browser to see the result.
    


Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
