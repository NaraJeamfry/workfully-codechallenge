# Bank Account API
Develop a Bank REST API using Node.js, with the following functionalities

### Deposit

`/deposit` with **accountId** and **amount** as parameters 

### Withdrawal

`/withdraw` with **accountId** and **amount** as parameters

### Transfer

`/transfer` with **fromAccountId**, **toAccountId** and **amount** as parameters

## Considerations 
* Deposits can not be above $5000 per day.
* Withdrawal supports a $200 overdraft (balance, can be down to -$200).
* Transfers don’t support overdrafts (can’t leave the balance below 0).
* Add the validations and errors you see necessary.
* The Account entity is not the main focus of the exercise, so only add what’s needed for the functionalities above.
* The code provided is a boilerplate to save you some time. Feel free to change it as you see fit

`When in doubt, don’t get blocked. Fill in the gaps and just write down in a Readme file whatever considerations or design decisions you had to make.`

## What we value
* Testing Strategy
* Effective Architectural decisions
* Effective response/error handling
* Simple design
* GIT
* Straightforward setup and execution
## The Extra Mile
* Database management
* Docker

Inspired by [Bank Kata](https://github.com/sandromancuso/Bank-kata)
