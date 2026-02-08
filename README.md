# 🕵️‍♂️Second Look: AI-Powered Scam Detection for Emails and Messages
Second Look is an interactive platform designed to help users detect potential scams in emails and messages. By combining AI analysis with visual risk highlights and actionable guidance, Second Look empowers users to safely identify suspicious content and make informed decisions online.

## Problem  
Online scams are becoming more convincing and common, especially for older adults. These scams can cause:  

- Financial loss
- Identity theft
- Stress and anxiety
- Confusion about what is safe to click or respond to

Traditional spam filters often just label messages as “spam” without explaining why, or even not labelled at all, leaving users unsure or at risk.

## Solution  
Second Look addresses this problem by:  

- Allowing users to **upload screenshots or paste messages** for analysis
- Using **Google Gemini AI** to detect suspicious content in text and images
- Explaining why a message might be unsafe
- Providing **actionable guidance** for what to do next

## Technologies Used  

- **Frontend:** React, Vite, Chakra UI
- **AI:** Google Gemini AI, OCR for text extraction from screenshots
- **Backend:** Node.js

## Project Structure
```
├── client
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   ├── components
│   │   │   ├── ResultsDisplay.jsx
│   │   │   ├── ui
│   │   │   │   ├── color-mode.jsx
│   │   │   │   ├── provider.jsx
│   │   │   │   ├── toaster.jsx
│   │   │   │   └── tooltip.jsx
│   │   │   └── UploadCard.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── vite.config.js
├── package-lock.json
├── package.json
├── README.md
└── server
    ├── index.js
    ├── package-lock.json
    ├── package.json
    └── public
        └── Images
```

## Installation

```
# Clone the repository
git clone <repository-url>
cd Macathon

# Install dependencies
npm install

# Create .env with:
GEMINI_API_KEY=your_gemini_key

# Run the server
cd server
npm start

# Run development client
cd client
npm run dev
```
