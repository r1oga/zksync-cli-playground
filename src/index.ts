import { ZkSyncAccount } from './account'
import { Providers } from './providers'

const main = async () => {
  const networkName = 'rinkeby'
  const providers = await new Providers(networkName).get()

  const zkSyncAccount = new ZkSyncAccount(networkName, providers)

  console.log(zkSyncAccount)
}

main()