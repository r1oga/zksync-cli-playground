import * as zksync from 'zksync'
import * as ethers from 'ethers'

import { Provider } from './providers'

class Account {
  provider

  constructor(networkName: zksync.types.Network) {
    this.provider = new Provider(networkName)
  }

  init = async (evmWallet: ethers.Signer) => {
    const zkSyncProvider = await this.provider.zkSync()
    await zksync.Wallet.fromEthSigner(
      evmWallet, zkSyncProvider)
  }

  register = async (zksyncWallet: zksync.Wallet) => {
    console.log(`Registering the ${zksyncWallet.address()} account on zkSync`)

    if(!await zksyncWallet.isSigningKeySet()) {
      if(await zksyncWallet.getAccountId() === undefined) throw new Error('Unknown account')

      const changePubkey = await zksyncWallet.setSigningKey({ feeToken: 'ETH', ethAuthType: 'Onchain' })
      await changePubkey.awaitReceipt()
    }
    console.log(`Account ${zksyncWallet.address()} registered`)
  }
}

export { Account }
