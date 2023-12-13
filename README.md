# Bank Account API

This is an API that fulfills three example basic actions for a Bank Account. It 
has been developed with Node.js following the Workfully Code Challenge repo, 
available on [GitHub](https://github.com/Workfully-github/codechallenge).



## Architecture overview

The base for the architecture is an adaptation of Robert C. Martin's Clean
Architecture, in order to try and separate the business logic from technical
implementations.

Inside the business folder, you will find all the business logic implementing 
the available use-cases, the entities, the expected errors and the interfaces
for the providers and APIs. All this code is totally independent of technical
details like the data layer, the type of input API or lock management.

The app folder is the intermediate layer between the business layers and the
external layers. There, we have set up a Dependency Injection container system 
to programmatically inject the different external dependencies. The main 
Application also knows what use-cases to offer to external APIs and how to 
access the business layer to perform them.

The api folder holds all the code related to the HTTP API, including the Express
server and routes, the schema (auto-generated from the OpenAPI spec), and other
API things like middlewares.

Last but not least, in the db folder you can find the code related to the data
providers. In this case, there's a basic fake DB provider used to test the app, 
a SQLite implementation of the same provider, and an InMemory Lock provider for
mutual exclusion of key resources to avoid race conditions.

### Tests

For the tests, we have combined the usage of Schemathesis for API interface 
testing, as well as different tests for the business layer (unit-tests) and
integration tests that cover everything from Express to a mock DB provider.

Commands to run the tests can be found below.

To perform manual testing, the initial migrations on the DB include a variety of
accounts pre-created. Please, check the file at `migrations\02_initialData.sql`
to get the data for the accounts.

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

### Node.js tests

If you don't have a working Node.js environment in your machine, you can use
the following command to run the Jest test runner through Docker:

```shell
docker build --tag 'workfully-codechallenge-builder' .
docker run 'workfully-codechallenge-builder' APP_ENV=test npm test
```

### Update API schemas

The API schemas, located at `src/api/schema.d.ts` are auto-generated from the 
OpenAPI Specification. To re-generate them after changes, run this command:

```shell
npx openapi-typescript docs/bank_api.yaml -o src/api/schema/schema.d.ts
```

## Configuration

To set up environment configurations, we are trying to follow the twelve-factor
app methodology. We can load configuration from files loaded into the image,
environment variables stored safely or even change them for CI/CD and testing.
