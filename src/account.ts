import * as zksync from 'zksync'
import * as ethers from 'ethers'
import {Providers} from './providers'

class ZkSyncAccount {
  providers: Providers
  wallet: zksync.Wallet

  constructor(networkName: zksync.types.Network) {
    this.providers = new Providers(networkName)
  }


  init = async ({ mnemonic = process.env.MNEMONIC!, index = 0 }: { mnemonic?: string, index?: number }) => {
    const providers = await this.providers.get()
    const evmWallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${index}`).connect(providers.evm)
    this.wallet = await zksync.Wallet.fromEthSigner(evmWallet, providers.zkSync)
    console.log(`Initialized zksync wallet ${this.wallet.address()} on ${this.wallet.provider.network}`)
  }


  register = async () => {
    console.log(`Registering the ${this.wallet.address()} account on zkSync ${this.wallet.provider.network}`)

    if (!await this.wallet.isSigningKeySet()) {
      if (await this.wallet.getAccountId() === undefined) throw new Error('Unknown account')

      const changePubkey = await this.wallet.setSigningKey({ feeToken: 'ETH', ethAuthType: 'ECDSA' })
      await changePubkey.awaitReceipt()
    }
    console.log(`Account ${this.wallet.address()} registered`)
  }

  deposit = async ({ token = 'ETH', amount }: { token?: string, amount: string }) => {
    const deposit = await this.wallet.depositToSyncFromEthereum({
      depositTo: this.wallet.address(),
      token,
      amount: ethers.utils.parseEther(amount),
    })
    try {
      await deposit.awaitReceipt()
    } catch (error) {
      console.log('Error while awaiting confirmation from the zkSync operators.')
      console.log(error)
    }
  }

  transfer = async ({
                      to,
                      amount,
                      fee,
                      token,
                    }: { to: string, amount: string, fee: string, token: string }) => {
    const closestPackableAmount = zksync.utils.closestPackableTransactionAmount(ethers.utils.parseEther(amount))
    const closestPackableFee = zksync.utils.closestPackableTransactionFee(ethers.utils.parseEther(fee))

    const tx = await this.wallet.syncTransfer({ to, token, amount: closestPackableAmount, fee: closestPackableFee })
    const receipt = await tx.awaitReceipt()

    console.log('Got transfer receipt.', receipt)
  }
}

export {
  ZkSyncAccount,
}