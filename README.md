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

### Celo Alfajores Testnet
- **RPCEndpoint:** [https://alfajores-forno.celo-testnet.org](https://alfajores-forno.celo-testnet.org)
- **ChainID:** 44787
- **NativeCurrency:** CELO
- **BlockExplorer:** [https://alfajores-blockscout.celo-testnet.org](https://alfajores-blockscout.celo-testnet.org)
- **Faucet:** [https://celo.org/developers/faucet](https://celo.org/developers/faucet)

### Smart Contract Address

- **CCToken Contract Address:** `0x63d3449b18f0977E7c3317357797ffF801AA1f19`
- **AllOrNothing Contract Address:** `0xb22Aa44E62B182c69a9a738D6c7EdAEe23E5FE32`

### Smart Contract Details
#### CCToken
A simple ERC20 contract deployed on Celo Alfajores Testnet. It is used in the AllOrNothing contract as the pledge token.
#### AllOrNothing
A campaign contract deployed on Celo Alfajores Testnet. It is used as a treasury where pledges for the campaign are collected. If the campaign is successful, the creator of the campaign can withdraw the pledged amount. If the campaign is unsuccessful, the backers can claim a refund for their pledged amount. The function `createCampaign` is used to create a new campaign. The function `pledgeForAReward` is used to pledge for a reward to a campaign (internally it calls `transferFrom` on the CCToken to transfer the funds from the backer to itself). The function `withdraw` is used to withdraw the pledged amount if the campaign is successful. The function `claimRefund` is used to claim a refund if the campaign is unsuccessful.
