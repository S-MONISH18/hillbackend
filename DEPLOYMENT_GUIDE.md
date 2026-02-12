# 🚀 Deployment Guide: Deploying Backend to Render

This guide will walk you through the steps to deploy your Node.js backend to [Render](https://render.com).

## Prerequisites

1.  **GitHub Repository**: Ensure this project is pushed to a GitHub repository.
2.  **Render Account**: Create an account on [Render](https://render.com) if you haven't already.
3.  **MongoDB Connection String**: You detailed this in `backend/.env`. You'll need the `MONGO_URI` value.

## Step 1: Push Changes to GitHub

Ensure all your recent changes, including the new `render.yaml` and updated `package.json`, are committed and pushed to your GitHub repository.

```bash
git add .
git commit -m "Configure backend for Render deployment"
git push origin main
```

## Step 2: Create a New Web Service on Render

1.  Log in to your Render dashboard.
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub account if prompted.
4.  Search for your repository (`HILL` or whatever you named it) and click **Connect**.

## Step 3: Configure the Service

Render should automatically detect the `render.yaml` file, but if you need to configure manually:

*   **Name**: `green-field-hub-backend` (or any name you like)
*   **Region**: Select the one closest to your users (e.g., `Singapore` or `Frankfurt`).
*   **Branch**: `main` (or `master`).
*   **Root Directory**: `backend` (Important! Since your `package.json` is inside `backend/`).
*   **Runtime**: `Node`
*   **Build Command**: `npm install`
*   **Start Command**: `npm start`

## Step 4: Environment Variables

**Crucial Step:** You must add your environment variables.

1.  Scroll down to the **Environment Variables** section (or "Advanced").
2.  Add the following variables:
    *   **Key**: `MONGO_URI`
    *   **Value**: `your_mongodb_connection_string` (Replace with your actual MongoDB Atlas connection string from your `.env` file).
    *   **Key**: `PORT`
    *   **Value**: `5000` (Render will override this, but good to have)

## Step 5: Deploy

1.  Click **Create Web Service**.
2.  Render will start building your application. You can watch the logs in the dashboard.
3.  Once the build is successful and the service is live, you will see a green "Live" badge.
4.  Copy the service URL (e.g., `https://green-field-hub-backend.onrender.com`).

## Step 6: Test the Deployment

Use Postman or your browser to test the live API:

*   **GET** `https://<your-app-url>/` -> Should return `{"message": "🌾 Tractor Backend Running"}`
*   **GET** `https://<your-app-url>/api/tractors` -> Should return list of tractors.

## Troubleshooting

*   **Build Failures**: Check the logs. Common issues include missing dependencies or incorrect node versions (we set `engines` in `package.json` to help with this).
*   **Runtime Errors**: If the app crashes, check the "Logs" tab. Ensure `MONGO_URI` is correct and your database allows connections from anywhere (0.0.0.0/0) or you've whitelisted Render's IPs.

## Updating the Frontend

Your frontend is now configured to use an environment variable for the backend URL.

1.  **Local Development**: usage is automatic via the `.env` file I created (`VITE_API_URL=http://localhost:5000`).
2.  **Production (Render)**:
    *   If you deploy your frontend to Render (Static Site), go to **Environment Variables**.
    *   Add `VITE_API_URL` with your **Render Backend URL** (e.g., `https://green-field-hub-backend.onrender.com`).
    *   Redeploy the frontend.

