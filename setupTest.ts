import {Provider} from 'zksync'
import {BaseProvider} from '@ethersproject/providers'
import {ZkSyncAccount} from './src/account'
import {Providers} from './src/providers'

jest.setTimeout(20000)

declare global {
    var providers: { zkSync: Provider, evm: BaseProvider }
    var zksync: ZkSyncAccount
}


beforeAll(async () => {
    global.providers = await new Providers('rinkeby').get()
    global.zksync = new ZkSyncAccount('rinkeby')
})