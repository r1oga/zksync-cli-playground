import {rinkeby as wallet} from '../src'

    ;

(async () => {
    await wallet.init(process.env.PRIVATE_KEY!)
    console.log('initialized wallet')
    await wallet.register()
    const set = await wallet.wallet.isSigningKeySet()
    const accountState = await wallet.wallet.getAccountState()
    console.log({ set, accountState })
})()