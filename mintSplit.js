import {
    Connection,
    Keypair,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction,
    PublicKey,
    clusterApiUrl
  } from "@solana/web3.js";
import {
    creators,
    network
} from "./utils.js"

const connection = new Connection(
    clusterApiUrl(network),
    'confirmed',
);

const MY_SECRET_KEY = process.env.TREASURY_SECRET_KEY.split(",")
const wallet = Keypair.fromSecretKey(
    new Uint8Array(MY_SECRET_KEY)
)

async function handleTransaction(sigs, accountInfo) {
    const transaction = await connection.getTransaction(sigs[0].signature)
    const preBalances = transaction.meta.preBalances
    const postBalances = transaction.meta.postBalances

    const accounts = transaction.transaction.message.accountKeys

    let diff
    for (let i=0; i<accounts.length; i++) {
        if (accounts[i].toString() === wallet.publicKey.toString()) {
            diff = postBalances[i] - preBalances[i]
        }
    }
    if (diff > 0) {
        console.log(`Starting balance for treasury: ${accountInfo.lamports / LAMPORTS_PER_SOL}`)
        
        let creatorPubkey
        for (let i=0; i<creators.length; i++) {
                creatorPubkey = new PublicKey(creators[i].address)
                const startBalance = await connection.getAccountInfo(creatorPubkey)
                console.log(`Starting balance for account ${i + 1}: ${startBalance.lamports / LAMPORTS_PER_SOL}`)
                const transaction = new Transaction()
                    .add(SystemProgram.transfer({
                        fromPubkey: wallet.publicKey,
                        toPubkey: creatorPubkey,
                        lamports: (diff * creators[i].share / 100) 
                    })
                );

                const signature = await sendAndConfirmTransaction(
                    connection,
                    transaction,
                    [wallet],
                    {commitment: 'confirmed'},
                );
                console.log("Transaction confirmed with signature:", signature)
                await connection.confirmTransaction(signature)
                const endBalance = await connection.getAccountInfo(creatorPubkey)
                console.log(`Finish balance for account ${i + 1}: ${endBalance.lamports / LAMPORTS_PER_SOL}`)
        }
        const treasuryEnd = await connection.getAccountInfo(wallet.publicKey)
        console.log(`End balance for treasury: ${treasuryEnd.lamports / LAMPORTS_PER_SOL}`)
        
    }  
}

function onChange(accountInfo, _context) {
    (async () => {
        const sigs = await connection.getConfirmedSignaturesForAddress2(wallet.publicKey)
        await handleTransaction(sigs, accountInfo)
    })()
}

const id = connection.onAccountChange(wallet.publicKey, onChange)