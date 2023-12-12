# Bank Account API

This is an API that fulfills three example basic actions for a Bank Account. It 
has been developed with Node.js following the Workfully Code Challenge repo, 
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
npx openapi-typescript docs/bank_api.yaml -o src/api/schema.d.ts
```

## Configuration

To set up environment configurations, we are trying to follow the twelve-factor
app methodology. We can load configuration from files loaded into the image,
environment variables stored safely or even change them for CI/CD and testing.
