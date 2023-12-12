# Bank Account API

This is an API that fulfills three example basic actions for a Bank Account. It 
has been developed with NodeJS following the Workfully Code Challenge repo, 
available on [GitHub](https://github.com/Workfully-github/codechallenge).

## How to run

### API service

To run the API service, build and run the base Dockerfile available in the root
of the repo:

```shell
docker build --tag 'workfully-codechallenge' .
docker run --p '13465:3300' 'workfully-codechallenge'  
```

### API tests

This project uses Schemathesis to validate the API as well as run some basic
tests based on the API spec examples. To run it, just run this docker command:

```shell
docker run -v J:\Development\codechallenge:/app \
    --name workfully-schemathesis \
    --pull missing --network host schemathesis/schemathesis:stable \
    run --checks all --base-url http://localhost:13465 /app/docs/bank_api.yaml
```

### Update API schemas

The API schemas, located at `src/api/schema.d.ts` are auto-generated from the 
OpenAPI Specification. To re-generate them after changes, run this command:

```shell
npx openapi-typescript docs/bank_api.yaml -o src/api/schema.d.ts
```

## Project Architecture

This project is structured using an approximation to Robert C. Martin's Clean
Architecture, trying to maintain the following rules:

* Dependencies always go from external services to the business layer. Entities 
  are totally independent, Use-Cases depend on Entities, Adapters depend on the
  Use-Cases and Entities, and the external interfaces depend on everything else.
* Dependency management has been implemented with Brandi, using Dependency 
  Injection. The `app/container.ts` file is currently used to bind instances, 
  and in future commits I'll implement different bindings for tests (mocks).

### Documentation-first approach 

* Everything is implemented following a doc-first approach, and will be
  implemented following TDD.
* For the API objects (will be used to validate request bodies): these should be
  auto-generated using the installed library `openapi-typescript`. This ensures
  the code always matches the documentation.
* Schemathesis is both a validation and a chaos-testing tool for OpenAPI 
  specifications. It can be run in CI/CD pipelines to ensure validity of docs 
  and is used in this project to test the documentation automatically. 

## Configuration

To set up environment configurations, we are trying to follow the twelve-factor
app methodology. We can load configuration from files loaded into the image,
environment variables stored safely or even change them for CI/CD and testing.
