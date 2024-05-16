# Development Setup

This document outlines the steps required to set up your Transcript Summarizer API for development. By following these steps, you'll be able to run your application locally with the necessary environment variables and database configuration.

## Prerequisites

Before setting up Transcript Summarizer API for development, ensure you have the following prerequisites with the specified versions:

- **NVM (Node Version Manager):** Use NVM to manage Node.js versions.
- **Node.js** Node.js v20.x or higher. Can be installed via `nvm` using `nvm install 20` and used with `nvm use 20`.
- **Git:** Git v2.x or higher.
- **MariaDB:** MariaDB v10.x or higher.
- **Redis:** Redis v6.x or higher

These prerequisites are essential for deploying and running Transcript Summarizer API in an environment.

Please make sure to have these versions installed on your development server before proceeding with the setup.

Make sure Redis and MariaDB server are up and running.

```bash
sudo systemctl status redis
sudo systemctl status mariadb
```

## Getting Started

1. Clone the repository to your local machine:

   ```sh
   git clone https://github.com/OsmosysSoftware/osm-transcript-summarizer.git
   cd osm-transcript-summarizer/apps/api
   ```

2. Install project dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the project root and add the required environment variables:

   ```env
   # Server
   SERVER_PORT=3000

   # Node env
   NODE_ENV=development # Use "development" for graphql playground to work

   # Upload folder location
   UPLOAD_FOLDER_PATH= # If not present will use "uploads" folder in the root cwd

   # Database configuration
   DB_TYPE=
   DB_HOST=transcript-summarizer-mariadb
   DB_PORT=
   DB_USERNAME=
   DB_PASSWORD=
   DB_NAME=
   MARIADB_DOCKER_PORT= 3307

   # Redis configuration
   DB_HOST=transcript-summarizer-redis
   REDIS_PORT=6379
   REDIS_DOCKER_PORT=6379

   OPENAI_API_KEY="sk-your api key"
   GPT_MODEL="gpt-4o"

   # Docker env
   COMPOSE_PROJECT_NAME=transcript-summarizer-api 
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

   Transcript Summarizer API will now be running locally at `http://localhost:3000`.
