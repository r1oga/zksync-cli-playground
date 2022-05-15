import inquirer from 'inquirer'
import {Network} from 'zksync/build/types'

const validateNumber = (acceptZero: boolean) => (value: number): string | boolean => {
  if (isNaN(+value)) return 'Not a number'
  if (acceptZero ? value < 0 : value <= 0) {
    return `Value must be ${acceptZero ? '>=' : '>'} 0`
  }
  return true
}

export enum Action {
  Register = 'Register zksync account',
  Transfer = 'Make a transfer between zksync accounts',
}

export const getNetworkInput = async (): Promise<Network> => (await inquirer.prompt([{
    type: 'checkbox',
    name: 'network',
    message: 'Choose network',
    choices: ['rinkeby'],
  }])
).network[0]

export const getInitWalletInputs = async (): Promise<{ mnemonic: string, index: number }> => inquirer.prompt([
  { mask: '👻', message: 'Mnemonic:', name: 'mnemonic', type: 'password' },
  { type: 'number', name: 'index', message: 'Address index (BIP32):', validate: validateNumber(true) },
])

export const getActionInput = async (): Promise<Action> => (await inquirer.prompt([{
  type: 'list',
  name: 'action',
  message: 'What do you want to do?',
  choices: [Action.Register, Action.Transfer],
},
])).action

export const getAmountInput = async (message: string): Promise<string> => (await inquirer.prompt([
  {
    type: 'number',
    name: 'amount',
    message,
    validate: validateNumber(false),
  },
])).amount.toString()


