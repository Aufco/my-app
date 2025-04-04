LANGUAGE LEARNING STORIES
========================

A Next.js application that generates adaptive language learning content using the "85-95% comprehension rule" for optimal language acquisition.

OVERVIEW
--------

This application generates stories in various languages and allows users to highlight unfamiliar words. It calculates the user's comprehension level and can regenerate simpler stories when the comprehension drops below 85%, creating the perfect balance for language learning.

PROJECT STRUCTURE
----------------

my-app/
├── components/
│   ├── Auth/           # Login and registration forms
│   ├── Layout/         # Header and layout components
│   └── Story/          # Story display and highlighting components
├── lib/
│   ├── api/            # OpenAI API integration for story generation
│   ├── db/             # SQLite database interaction
│   └── utils/          # Utility functions
├── pages/
│   ├── api/            # Next.js API routes
│   │   ├── auth/       # Authentication endpoints
│   │   ├── story/      # Story generation endpoints
│   │   └── user/       # User preferences endpoints
│   ├── _app.js         # Next.js app component
│   ├── dashboard.js    # User dashboard page
│   └── index.js        # Landing page
├── public/             # Static assets
├── styles/             # Global styles
├── .gitignore          # Git ignore file
├── next.config.mjs     # Next.js configuration
├── package.json        # Project dependencies
└── README.md           # Project documentation

SETUP INSTRUCTIONS
-----------------

1. Clone the repository

   git clone https://github.com/yourusername/my-app.git
   cd my-app

2. Install dependencies

   npm install

3. Environment setup

   Create a .env file in the project root with the following variables:

   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_URL=http://localhost:3000

4. Start the development server

   npm run dev

   The application will be available at http://localhost:3000

5. Build for production

   npm run build
   npm start

FEATURES
-------

- User Authentication: Register and login functionality
- Multilingual Support: Generate stories in over 50 languages
- Word Highlighting: Click on unfamiliar words to track your comprehension
- Adaptive Content: The app measures your comprehension level and can regenerate simpler stories
- Progress Tracking: Previous highlighted words are saved to track your vocabulary growth

HOW IT WORKS
-----------

1. Select your target language and native language
2. Generate a story in your target language
3. Click on words you don't understand to highlight them
4. The app calculates your comprehension percentage
5. If your comprehension drops below 85%, click "Regenerate Story" for a simpler version
6. Archived highlighted words help you track your progress over time

TECHNOLOGIES USED
---------------

- Frontend: Next.js, React, TailwindCSS
- Backend: Next.js API routes, SQLite with better-sqlite3
- Authentication: Iron Session for serverless cookie-based sessions
- Content Generation: OpenAI API

DATA STORAGE
-----------

The application uses SQLite for local data storage. The database is stored in the data/ directory and includes tables for users, stories, and highlighted words.