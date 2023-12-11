# Decisions for the kata

This document holds some reasonings for some of the decisions taken during the 
development of this project. These are just the things I feel could be 
interesting to do differently depending on real-life variables on a real 
project.

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