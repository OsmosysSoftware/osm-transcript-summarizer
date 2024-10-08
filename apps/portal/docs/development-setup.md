# Development Setup

This document outlines the steps required to set up your Transcript Summarizer Portal for development. By following these steps, you'll be able to run your application locally with the necessary environment variables.

## Prerequisites

Before setting up Transcript Summarizer Portal for development, ensure you have the following prerequisites with the specified versions:

- **NVM (Node Version Manager):** Use NVM to manage Node.js versions.
- **Node.js** Node.js v20.x or higher. Can be installed via `nvm` using `nvm install 20` and used with `nvm use 20`.
- **Git:** Git v2.x or higher.

These prerequisites are essential for deploying and running Transcript Summarizer Portal in an environment.

Please make sure to have these versions installed on your development server before proceeding with the setup.

## Getting Started

1. Clone the repository to your local machine:

   ```sh
   git clone https://github.com/OsmosysSoftware/osm-transcript-summarizer.git
   cd osm-transcript-summarizer/apps/portal
   ```

2. Install project dependencies:

   ```sh
   npm install
   ```

3. Configure `src/environments/environment.prod.ts` (or `src/environments/environment.ts` for development) with environment variable values as needed:

   ```ts
   import { Environment } from './environment.interface';

   export const environment: Environment = {
     production: true, // false for development setup
     graphqlEndpoint: 'http://localhost:3000/graphql',
     tenantId: 'tenant-id',
     clientId: 'client-id',
     redirectUri: 'http://localhost:4200',
     apiScope: 'api://client-id/api.consume',
   };
   ```

   Make sure to replace the above example values with appropriate values as per your setup and configuration.

4. Declare project-name in the .env file:

   ```sh
   COMPOSE_PROJECT_NAME=osm-transcript-summarizer
   ```

   Updating .env file with COMPOSE_PROJECT_NAME=osm-transcript-summarizer is needed to set the project name for Docker Compose, which helps in organizing and managing multiple Docker projects running on the same system

5. Start the development server:

   ```sh
   npm run start
   ```

   Transcript Summarizer Portal should now be running locally at `http://localhost:4200`. In case this port is in use, Angular Live Development Server will ask for running at a different port and provide the URL to use.
