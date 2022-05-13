import * as zksync from 'zksync'
import * as ethers from 'ethers'

class ZkSyncAccount {
  providers: { zkSync: zksync.Provider, evm: ethers.ethers.providers.BaseProvider }
  wallet: zksync.Wallet

  constructor(
    networkName: zksync.types.Network,
    { zkSync, evm }: { zkSync: zksync.Provider, evm: ethers.ethers.providers.BaseProvider }) {
    this.providers = { zkSync, evm }
  }


  init = async (mnemonic: string) => {
    const evmWallet = ethers.Wallet.fromMnemonic(mnemonic)
    this.wallet = await zksync.Wallet.fromEthSigner(
      evmWallet, this.providers.zkSync)
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

  deposit = async ({ token, amount }: { token: string, amount: string }) => {
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