# Installation Guide

HomeWise AI is designed to be easy to install on both Mac and Windows, allowing you to quickly start interacting with your documents, notes, and ask general knowledge questions. For more information about the project's goals, please see the [Goals document](Goals.md). The steps below outline the standard installation process. Future versions may include simpler installation options for less technical users. Before proceeding, ensure you have the necessary prerequisites installed as outlined in the [Developer Setup Guide](Developer-Setup.md).

## Installation Steps

1. **Clone the Repository from GitHub:**

   ```bash
   git clone https://github.com/micksolo/HomeWiseAI
   cd [repository directory]
   ```

2. **Install Dependencies:**
   Follow the instructions in the [Developer Setup Guide](Developer-Setup.md) to install the necessary dependencies for both the backend and frontend.

   - **Backend (Python):**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

   - **Frontend (JavaScript):**

   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. **Configure Environment Variables:**
   As described in the [Developer Setup Guide](Developer-Setup.md), create the necessary `.env` files and configure the environment variables for both the backend and frontend.

2. **Start the Backend Server:**

   ```bash
   cd backend
   python app.py
   ```

3. **Start the Frontend Development Server:**

   ```bash
   cd frontend
   npm start
   ```

4. **Access the Application:**
   Once both the backend and frontend servers are running, you can access the application in your web browser at the address specified in the frontend configuration (typically `http://localhost:3000`).

## Alternative Installation Methods

[This section will describe any alternative installation methods, such as using Docker.]

### Using Docker

[Detailed instructions on how to install and run the application using Docker will be provided here.]
