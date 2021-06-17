<p align="center">
<img src="docs/logo/arvol_token.svg" width="150" title="{{Arvol Dapp Screenshot 2020}}">
</p>

<p align="center">
{{Arvol}}.
</p>

# Arvol Coin

A standard for Arvol tokens. 

Built in collaboration with [Kleros](https://github.com/kleros) and the [UBI](https://github.com/DemocracyEarth/ubi) project.

[![Build Status](https://travis-ci.com/Arvol/arvol.svg?branch=master)](https://travis-ci.com/Arvol/arvol) [![Coverage Status](https://coveralls.io/repos/github/Arvol/arvol/badge.svg?branch=master)](https://coveralls.io/github/Arvol/arvol?branch=master)

## Features

- {{ERC20 token that can `mint` new supply for verified humans over time at a given rate.}}
- Tokens get streamed directly to a users wallet.
- {{Interfaces with `ProofOfHumanity` to get curated list of verified humans.}}
- {{`ProofOfHumanity` registry can be updated with overnance mechanism.}}
- Implements `ERC20Upgradeable` contracts with [OpenZeppelin](https://github.com/openzeppelin) proxy libraries.

Built with [Hardhat](https://github.com/nomiclabs/hardhat). 

Latest release is [`version 0.0.1`](https://github.com/Arvol/arvol/releases)

## Setup

1. Clone Repository

    ```sh
    $ git clone https://github.com/masch/arvol.git
    $ cd arvol
    ```

2. Install Dependencies

    ```sh
    $ npm install
    ```

3. Run Tests

    ```sh
    $ npx hardhat test
    ```

    To compute their code coverage run `npx hardhat coverage`.

## Deploy

1. On `hardhat.config.js` configure the following constants for the `kovan` testnet:

    ```
    INFURA_API_KEY
    KOVAN_PRIVATE_KEY
    ```

2. Deploy on Ethereum `kovan` testnet: 

    ```sh
    $ npx hardhat run scripts/deploy.js --network kovan
    ```
3. Interact with the console:

    ```sh
    $ npx hardhat console --network kovan
    ```

    Initalize the token with:

    ```js
    const Arvol = await ethers.getContractFactory("Arvol"); // Get contract deployed
    (await ethers.provider.listAccounts()).toString(); // List accounts on the provider

    const address = '0x6c797e6629FA9496e3C3A3309709b9D381fDAFD1' // Replace with your token address
    const arvol = await Arvol.attach(address) // Get a contract instance
    (await arvol._totalSupply()).toString(); // Display total supply from account attached
    ```

### Upgrade

1. Deploy new contract in a fresh address:

    ```sh
    $ npx hardhat run scripts/prepare.js --network kovan
    ```

2. Upgrade the proxy contract with the freshly deployed address: 

    ```sh
    $ npx hardhat run scripts/upgrade.js --network kovan
    ```

### Verify

TBD

## Contribute

These contracts are free, open source and censorship resistant. Support us via TBD.

## License

This software is under an [MIT License](LICENSE.md). This is a free software built by TBD.

<p align="center">
<img src="docs/democracy-earth.png" width="400" title="{{Arvol Foundation}}">
</p>
