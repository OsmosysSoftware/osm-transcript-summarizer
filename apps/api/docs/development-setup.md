# Development Setup

This document outlines the steps required to set up your Transcript Summarization for development. By following these steps, you'll be able to run your application locally with the necessary environment variables and database configuration.

## Prerequisites

Before setting up Transcript Summarization for development, ensure you have the following prerequisites with the specified versions:

- **NVM (Node Version Manager):** Use NVM to manage Node.js versions.
- **Node.js** Node.js v20.x or higher. Can be installed via `nvm` using `nvm install 20` and used with `nvm use 20`.
- **Git:** Git v2.x or higher.
- **MariaDB:** MariaDB v10.x or higher.

These prerequisites are essential for deploying and running Transcript Summarization in an environment.

Please make sure to have these versions installed on your development server before proceeding with the setup.

Make sure MariaDB server is up and running.

```bash
sudo systemctl status mariadb
```

## Getting Started

1. Clone the repository to your local machine:

   ```sh
   git clone https://github.com/OsmosysSoftware/osm-transcript-summarizer
   cd osm-transcript-summarizer/apps/api
   ```

2. Install project dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the project root and add the required environment variables:

   ```env

   # Node env
   NODE_ENV=development

   # Database configuration
   DB_TYPE=mariadb
   DB_HOST=localhost # use value as transcriptsummary-mariadb in docker
   DB_PORT=3333
   DB_USERNAME=root
   DB_PASSWORD=your-password
   DB_NAME=your-database
   
   ```

   Alternatively, use the `.env.example` file instead.

   Make sure to replace the above example values with appropriate values as per your setup and configuration. Server Port is `3000`, you can update it if you want to use a different port of your choice.

4. Set up the database:

   Ensure your database server (e.g., MariaDB) is running.

   Run database migrations to create tables:

   ```sh
   npm run typeorm:run-migrations
   ```

5. Start the development server:

   ```sh
   npm run start:dev
   ```

   Transcript Summarization will now be running locally at `http://localhost:3000`.
