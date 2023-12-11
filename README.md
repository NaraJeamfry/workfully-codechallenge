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

