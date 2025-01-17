import { connect, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()

  // Initializing our contract APIs by contract name and configuration
  window.contract = await near.loadContract(nearConfig.contractName, { // eslint-disable-line require-atomic-updates
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['getAllPosts','getPostById'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['createPost', 'editPost'],
    // Sender is the account ID to initialize transactions.
    sender: window.accountId,
  })
}

// attached to the form used to update the greeting
// in utils because it works with a vanilla JS or a React approach
export async function onSubmit(event) {
  event.preventDefault()

  // get elements from the form using their id attribute
  const { postTitle, postContent } = event.target.elements

  
  // make an update call to the smart contract
  await window.contract.createPost({
    // pass the value that the user entered in the greeting field
    title: postTitle.value,
    body: postContent.value
  })

  
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  window.walletConnection.requestSignIn(
    // The contract name that would be authorized to be called by the user's account.
    nearConfig.contractName,
    // This is the app name. It can be anything.
    'Postr'
  )
}
