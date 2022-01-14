# split-mint

A package to split the SOL funds raised from an NFT mint between various creators. This was made in order to attempt to provide a way to split the funds raised from the initial mint as can be done using the creators array for royalties from secondary market sales.

## Overview

While this program is running, it will pick up all transactions made to the Treasury Account (or whatever address you specify), and distribute the funds between a different group of accounts. Similiar to how royalties on sales of NFTs on secondary markets distributed to various creators works. 

Suggestions and PRs welcome!

Note: This is experimental software for a young ecosystem. Use at your own risk. The author is not responsible for misuse of the software or for the user failing to test on devnet before using in production.

## Installation

To get started, you will need to make the following changes to the files in the package:

### 1. Update the .envexample file with your Treasury Private Key

In the .envexample file, there is only 1 variable needed to update. Change the TREASURY_SECRET_KEY to the byte array of the Private Key of the Treasury wallet set in your Candy Machine config setup. Make sure you enter it WITHOUT the brackets [].

For example, if your private key is: [1,2,3,4,5,...,64]

You would enter:

```
TREASURY_SECRET_KEY=1,2,3,4,5,...,64
```

Once this is done you can save the file as .env.

### 2. Update the variables in utils.js

There are 2 variables to update here, being the creators array and the network.

Update the creators array as required. Add more creators and change the share as necessary. Note a share of 50 means that the creator will receive 50% of the funds. Within the creators array, the address should be the string of the creators' address, and share should be a number. For example:

```
export const creators = [
    { 
        "address" : 'BdmWyA3TNjthQddscAsqEfB18F2Fh8QtFAcshbHt6xcZ',
        "share" : 50
    },
    { 
        "address" : '8tVhVuphrKs9TeZPkJgU5im3qVZfonNCpKZe5mBbWFHx',
        "share": 50
    }
]
```

Set the network as required. **NB** Please do your own testing on devnet before deploying this on mainnet-beta.

```
export const network = 'devnet' // 'mainnet-beta'
```

Once this is done, run the following commands

```
yarn install

yarn start
```

And it should be running! Whilst the program is running, it should distribute all payments made to the Treasury Account to the creators with the specified splits as entered by the user. Simply stop the program if you wish to stop the distribution of payments made to this account.

## Disclaimer

This is a beta version! Please do your own testing and use at your own risk. 

## Contributing

All contributions are welcome and encouraged. Send through a PR if you find any bugs. In an ideal world, this would be converted into a Rust program to deploy as well. That build is on my list for when I can find the time. If someone beats me to it I wouldn't mind at all!

## Contact

Twitter: @WallyWilliams2

Discord: @wallypues#2876
