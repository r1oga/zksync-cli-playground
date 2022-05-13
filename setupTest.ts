import { Provider } from 'zksync'
import { BaseProvider } from '@ethersproject/providers'
import { ZkSyncAccount } from './src/account'
import { Providers } from './src/providers'

declare global {
  var providers: { zkSync: Provider, evm: BaseProvider }
  var zksync: ZkSyncAccount
}


beforeAll(async () => {
  const providers = await new Providers('mainnet').get()
  global.providers = providers
  global.zksync = new ZkSyncAccount('mainnet', providers)
})