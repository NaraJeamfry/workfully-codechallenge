# Decisions for the kata

This document holds some reasonings for some of the decisions taken during the 
development of this project. These are just the things I feel could be 
interesting to do differently depending on real-life variables on a real 
project.

## Setup and execution

To avoid having to install further dependencies, and knowing that the 
boilerplate already had a more-or-less working Dockerfile, I have not used 
anything more complex. 

Two options I have considered is using shell scripts/package.json to store
commands for running testing and similar things; and using docker-compose to run
docker images like Schemathesis.

I have decided to avoid both of these options, because they could prove to not
be "future-proof" for CI/CD and/or require additional tooling that may not be 
compatible with some systems. For example, the current "script-in-docs" approach
works for systems that use Podman with an alias, and can be integrated with any
CI/CD runner quickly.

## Documentation-first approach

* Everything is implemented following a doc-first approach, and will be
  implemented following TDD.
* For the API objects (will be used to validate request bodies): these should be
  auto-generated using the installed library `openapi-typescript`. This ensures
  the code always matches the documentation.
* Schemathesis is both a validation and a chaos-testing tool for OpenAPI
  specifications. It can be run in CI/CD pipelines to ensure validity of docs
  and is used in this project to test the documentation automatically. 

## API Design

For the path parameters vs. request parameters:

* I've decided to take on this API as if it was secured and users call it with 
  a given token. This means that, for example, the transfer endpoint uses the 
  "from" account as a parameter, but the "to" account is in the request body.
  The user is doing a transfer on his resource (the "from" account), not the 
  "to" account.
* I have added another endpoint, `/status/{accountId}`, to check on the
  accounts for some tests.
* Errors have been documented on the API spec. The idea is that API users will
  use this spec to know what errors can be expected. 
* I thought about sending oldBalance and newBalance after each operation, but I
  feel like it's better to just send the status after the operation, as that
  makes the response more similar to the status request.
* All errors return an error 400, instead of using the more meaningful 404 for
  not found and other similar errors. This is because as a bank API, we want to
  make sure we do not leak *any* information, like existing accounts, to any
  user.

## Project Architecture

The project is structured using an approximation to Robert C. Martin's Clean
Architecture, trying to maintain the following rules:

* Dependencies always go from external services to the business layer. Entities
  are totally independent, Use-Cases depend on Entities, Adapters depend on the
  Use-Cases and Entities, and the external interfaces depend on everything else.
* Dependency management has been implemented with Brandi, using Dependency
  Injection. The `app/container.ts` file is currently used to bind instances,
  and in future commits I'll implement different bindings for tests (mocks).
