# Osmosys AI Assistant Portal

Frontend portal for the Osmosys AI Assistant. This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0.

The portal communicates with the [api](https://github.com/OsmosysSoftware/osmosys-assistant/tree/main/apps/api) for all the requests and response data.

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `npm run ng generate component component-name` to generate a new component. You can also use `npm run ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Linting

Run `npm run lint` to performing linting checks in the code.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

Alternatively, run `npm run build:prod` to build using production environment configuration.

## Production docker setup

1. Create a `.env` file from the provided `.env.example` file and update values as required.

2. Update the `graphqlEndpoint` value as required in `src/environments/environment.prod.ts`.

3. Build the docker container.

   ```bash
   docker-compose build --no-cache
   ```

4. Start the docker container in background.

   ```bash
   docker-compose up -d
   ```

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `npm run ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Documentation

- [Development Setup](docs/development-setup.md)

# Docker Deployment for Portal

## Prerequisites

Before deploying the Portal with Docker, ensure that you have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

Create an `.env` file and set the following value:

```dotenv
SERVER_PORT=5000
```

## Steps for Docker Deployment

1. **Build and Run Containers:**

   Open a terminal in the root directory of your Angular project and execute the following commands:

   ```bash
   docker-compose build
   docker-compose up -d
   ```

2. **Access the Portal:**

   Once the containers are running, access the Portal by navigating to `http://localhost:5000/transcript` in your web browser. If you specified a different port in your `docker-compose.yml` file, adjust the port number accordingly.

3. **Stop the Containers:**

   To stop the running containers, use the following command:

   ```bash
   docker-compose down
   ```

## Additional Notes

- Customize the `docker-compose.yml` file if you need to adjust port mappings or other configurations.
- If your application relies on additional environment variables, you can set them in the `.env` file in the same directory as your `docker-compose.yml` file.

## Contributing

We welcome contributions from the community! If you're interested in contributing to the OsmoX, please take a moment to review our [Contribution Guidelines](../../CONTRIBUTING.md).

Your contributions help make our app even better. Whether you're a developer, designer, or just enthusiastic about enhancing user experiences, we'd love to have you on board.

Before you get started, please familiarize yourself with our guidelines to ensure a smooth collaboration process.

[Contribution Guidelines](../../CONTRIBUTING.md)

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
