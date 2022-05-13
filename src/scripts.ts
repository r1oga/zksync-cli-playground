import { ethers } from 'ethers'
import path from 'path'
import { writeFile } from 'fs/promises'


const extraEntropy = Buffer.from(process.argv[2])

const { address, _signingKey } = ethers.Wallet.createRandom({ extraEntropy })
const PATH = path.join(__dirname, '..', '.env')

;(async () => {
  await writeFile(PATH, `ADDRESS=${address}
PRIVATE_KEY=${_signingKey().privateKey}
`)
  console.log('Saved private key to .env')
})()

