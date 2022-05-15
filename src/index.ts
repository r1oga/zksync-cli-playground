import ora from 'ora'

import {ZkSyncAccount} from './account'
import {
  Action,
  getActionInput,
  getAmountInput,
  getInitWalletInputs,
  getNetworkInput,
} from './inquirer'
import {ethers} from 'ethers'

const main = async () => {
  const network = await getNetworkInput()
  const wallet = new ZkSyncAccount(network)

  const { mnemonic, index } = await getInitWalletInputs()
  await wallet.init({ mnemonic, index })
  console.log(`Initialized zksync wallet ${wallet.wallet.address()} on ${network}`)

  const action = await getActionInput()
  switch (action) {
    case Action.Register:
      const { hasEnoughFundsToRegister, fee } = await wallet.isEnoughFundedToRegister()
      if (!hasEnoughFundsToRegister) {
        const amount = await getAmountInput(
          `You need to fund your zksync wallet with at least ${ethers.utils.formatEther(
            fee)} ETH to cover the register transaction fee, how much ETH do you want to deposit?`)

        const spinner = ora(
          `Depositing ${amount} ETH from ethereum-${wallet.wallet.provider.network} to zksync-${wallet.wallet.provider.network}`).start()
        await wallet.deposit({ amount })
        spinner.stop()
        console.log('')
      }

      const spinner = ora(
        `Registering the ${wallet.wallet.address()} account on zkSync ${wallet.wallet.provider.network}...`)
      await wallet.register()
      spinner.stop()


      break
    default:
      return
  }
}

main()
