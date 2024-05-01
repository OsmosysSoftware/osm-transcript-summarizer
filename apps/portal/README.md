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