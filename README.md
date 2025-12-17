# PurbankFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.


## Docker / Deployment

1. Create a GitHub Personal Access Token (classic) with read:packages permissions.

2. Run this command in your terminal:
```Bash
echo YOUR_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

docker compose up -d
```

Note: if you normally use ```sudo docker compose up -d``` then make sure to perform the login command with sudo as well, else it wont detect the login. Alternatively add your user to the docker group and perform the command without sudo.

Docker pulls the latest build from the repo, there might not be one yet.
We do this as else it would have to download all dependencies which takes 15m+.

Note: the `extra_hosts: "host.docker.internal:host-gateway"` entry is used in
`docker-compose.yml` to allow containers to reach services running on the host
at `localhost` (Linux requires Docker Engine >= 20.10). If you prefer to run
the backend as a container on the same network, you can instead connect both
compose stacks to the same `purbank-network`.