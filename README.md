# Project Setup and Customization Guide

Welcome to this project! This guide will walk you through the steps to set up the project locally, customize the color scheme, and change the Ad URL used in the iframe.

---

## Prerequisites

Before setting up the project, make sure you have the following tools installed:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **npm** or **Yarn** (package manager)  
  - npm comes with Node.js by default.
  - You can install Yarn by running: `npm install -g yarn`

---

## 1. Clone the Repository

Start by cloning the repository to your local machine.

```bash
git clone https://github.com/kulikov-debug/youtube-download-react-card-template-
cd your-repository
```

## 2. Install Dependencies

Once inside the project directory, install the necessary dependencies.

Using **npm**:

```bash
npm install
```
## 3. Run the Development Server

After the dependencies are installed, you can run the development server. This will start the application locally and allow you to view it in your browser.

Using **npm**:

```bash
npm run dev
```

## 4. Change Color Scheme

The color scheme for the project can be easily customized by modifying the styles in the project.

### Update Global Styles
- Open the `tailwind.config.ts` (or wherever your global styles are stored).
- Look for color variables or hardcoded color values.

Example:

```css
    body: "#f3f4f6",
    header_bg: "#FFFFFE",
    purple_main: "#22d3ee",
    heading_main: "#2D3436",
    dark_heading_main: "#FFFFFF",
    base_one: "#4A5455",
    dark_base_one: "#b8b8b8",
    dark_body: "#121316",
    dark_heading: "#191a1d",
    partner: "#9ca3af"
```
## 5. Change the Ad URL

The URL for the advertisement iframe is stored inside (`configs`) folder. To change the ad url, follow these steps:

1. Open `index.ts` inside the folder.
2. Find the constant that holds the Ad URL, which may look like this:

```ts
// constant.ts

export const ADS_URL = "https://example.com/ad";
```
## 6. Test Your Changes

After updating the color scheme and Ad URL, refresh the development server to see the changes live.

You can also run the project in production mode to ensure everything works as expected:

Using **npm**:

```bash
npm run build
npm start

