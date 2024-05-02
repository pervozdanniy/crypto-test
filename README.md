# Problem Statement: Crowdfunding Blockchain API

## Background:
You are to design and describe an API for a decentralized crowdfunding platform. This platform allows users to back projects using cryptocurrency, and each transaction is recorded on a blockchain.

## Task:
Develop an API endpoint that allows users to pledge to a project using their cryptocurrency wallet. The endpoint must accept certain user details, then interact with a blockchain to record the transaction.

The Personally Identifiable Information (PII) should not be stored on-chain.

In the blockchain, it calls the pledgeForAReward function of the smart contract `AllOrNothing`, which emits the event `Receipt` upon successful completion. The `AllOrNothing` contract pulls CCToken from the users wallet account address. The function receives 2 parameters, one is the wallet account address and the other is an array of hash of reward names.

Once the transaction is complete, the API should read the transaction logs and return relevant data about the pledge to the user. (Refer to the ABI for more information)

List of sample reward names: `Wildlife Friend`, `Lonely sinister`, `Valley the whale`, `Butterball`, `FoodWithoutNutrients`

## Requirements:

**API Endpoint:**
URL: /api/pledge
Method: POST
Request Body:
```
{
"name": "string",
"email": "string",
"document": "string",
"walletAddress": "string",
"reward": "string[ ]"
}
```
**Success Response:**
```
{
"success": 200
}
```
**Error Response:**
```
{
"error": "string"
}
```

## Functionality:

1.  Users should be able to upload their govt. Issued IDs, example: National ID, Drivers License etc.
2.  Users should be able to pledge for reward(s) using the API.
3.  Users should be able to view `tokenId`, `pledgeAmount`, `rewards` via an endpoint.
    
## Addresses:

CCToken Contract Address: [0x5AA7425b850b1697503FeA4e7462AFf9DD38f71d](https://alfajores.celoscan.io/address/0x5AA7425b850b1697503FeA4e7462AFf9DD38f71d)

AllOrNothing Contract Address: [0xF39849BE6609DCc91f02b207Ecc83a1E2b1c5671](https://alfajores.celoscan.io/address/0xF39849BE6609DCc91f02b207Ecc83a1E2b1c5671)

Sample User Wallet Account Address with Prefunded CCToken: [0xC3Ff9976E76c9737c92c4eC0e918c677C1285668](https://alfajores.celoscan.io/address/0xC3Ff9976E76c9737c92c4eC0e918c677C1285668)

The smart contracts are deployed with Celo Alfajores Network  

## Celo Alfajores Testnet
RPCEndpoint: [https://alfajores-forno.celo-testnet.org](https://alfajores-forno.celo-testnet.org)

ChainID: 44787

NativeCurrency: CELO

BlockExplorer: [https://alfajores-blockscout.celo-testnet.org](https://alfajores-blockscout.celo-testnet.org)

Faucet: [https://celo.org/developers/faucet](https://celo.org/developers/faucet)

## Optional Extensions:
-   Implement a feature to return the project's current total funds and number of backers.
-   Provide an endpoint to list all pledges made by a particular backer.


# Backend Scratch

This repository contains a project scratch built using ExpressJs(javascript), SQL(PostgreSQL being the preferred database), Sequelize(ORM). Basic configuration for starting up the API server is already configured.

## File structure

- `abi/` - Contains the latest ABIs from deployed smart contracts
- `config/` - Contains all configurations (imported from environment variables)
- `routes/` - Contains list of routes which map to different controllers and middleware
- `middleware/` - Contains various middleware functionalities used by different routes
- `controller/` - Contains handler functions for all kinds of routes
- `repository/` - Contains functions for database interactions
- `service/` - Contains functions which perform specialized (often extended) tasks 
- `util/` - Contains utility functions
- `model/` - Contains all models for the database
- `app.js` - Configure the application and all high-level routes
- `server.js` - Entrypoint for running application
- `.env` - Contains environment variables (sample provided in `sample.env`)

## Useful commands

```bash
# Start server
npm start
```

