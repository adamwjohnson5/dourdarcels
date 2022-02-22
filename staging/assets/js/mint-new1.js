"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

 // Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal;

// Chosen wallet provider given by the dialog window
let provider;


// Address of the selected account
let account;

var contractNetwork = 4;
var contractAddress = "0x38134bb53855b20ac924486e4643dfa9be917544";

var mintPrice = Number(30000000000000000);
var mintPriceInEther = 0.03;
var maxTokens = 10000;
var maxPerPurchase = 2;
var counterRefreshRate = 120000;
var saleIsActive = true;
var contract;
var abi = [{"inputs":[{"internalType":"address","name":"creator","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"MAX_PURCHASE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"NUM_RESERVED_TOKENS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PROVENANCE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOKEN_PRICE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reserve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"saleIsActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI_","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"provenance","type":"string"}],"name":"setProvenance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"newState","type":"bool"}],"name":"setSaleState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"creator","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

// var isMetaMaskInstalled = () => {
//   var { ethereum } = window;
//   return Boolean(ethereum && ethereum.isMetaMask);
// };

var networkNames = {1: "Ethereum Mainnet", 4: "Rinkeby Test Network"};
var etherscanSubdomain = {1: "", 4: "rinkeby."};
var alertBar = document.getElementById("alert-bar");
//var closeAlertBar = document.getElementById("close-alert-bar");
var mintForm = document.getElementById("mint-form");
var mintButton = document.getElementById("minting-button-4");
var onboardConnect = document.getElementById("minting-button-1");//document.getElementById("onboard-connect");
var onboardConnectHeader = document.getElementById("header-connect");
// var onboardInProgress = document.getElementById("onboard-in-progress");
// var onboardConnected = document.getElementById("onboard-connected");
// var mintInProgress = document.getElementById("mint-in-progress");
var mintPriceDiv = document.getElementById("mint-price");
var availableQty = document.getElementById("available-qty");
var quantityInput = document.getElementById("mint-quantity");
var contractLink = document.getElementById("contract-link");
contractLink.href = "https://" + etherscanSubdomain[contractNetwork] + "etherscan.io/address/" + contractAddress + "#code";
/**
 * Setup the orchestra
 */
function init() {

  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);
  console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

  document.querySelector("#minting-button-4").setAttribute("disabled", "disabled")
  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  if(location.protocol !== 'https:') {
    // https://ethereum.stackexchange.com/a/62217/620
    const alert = document.querySelector("#alert-error-https");
    alert.style.display = "block";
    document.querySelector("#minting-button-1").setAttribute("disabled", "disabled")
    return;
  }

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  // const providerOptions = {
  //   walletconnect: {
  //     display: {
  //       // logo: "data:image/gif;base64,INSERT_BASE64_STRING",
  //       name: "Mobile",
  //       description: "Scan qrcode with your mobile wallet"
  //     },
  //     package: WalletConnectProvider,
  //     options: {
  //       infuraId: "382cd78357494aa4858610418fa7050c" // required
  //     }
  //   }
  // };

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "ba374aeade634d649c4aaf58f8fcfd07" // required
      },
    },
    'custom-walletlink': {
      display: {
        logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
        name: 'Coinbase',
      },
      options: {
        appName: 'Coinbase', // Your app name
        networkUrl: `https://rinkeby.infura.io/v3/ba374aeade634d649c4aaf58f8fcfd07`,
        chainId: 1,
      },
    },
  }

  if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
      network: 'mainnet', // optional
      cacheProvider: true,
      providerOptions, // required
    });
  }
  // web3Modal = new Web3Modal({
  //   cacheProvider: true, // optional
  //   providerOptions, // required
  //   disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  // });

  console.log("Web3Modal instance is", web3Modal);
  refreshCounter();
}

function price(quantity) {
  return (mintPrice * quantity);
}

function priceInEther(quantity) {
  return (mintPriceInEther * quantity);
}
function createAlert(alertMessage) {
    toggleOverlay('header', alertMessage);
//   alertBar.classList.remove("hidden");
//   alertBar.innerHTML = alertMessage;
}

function clearAlert() {

  //alertBar.classList.add("hidden");
}

async function mint() {
  if (!account) {
   return;
 }

  var numberToMint = 1;//quantityInput.value;
  var amount = price(Number(numberToMint));
  clearAlert();
  mintButton.disabled = true;
  mintButton.innerText = "Minting.."

  await contract.methods
    .mint(numberToMint)
    .send({ from: account,
            value: amount})
    .then(() => {
      refreshCounter();
      mintButton.disabled = false;
      mintButton.innerText = "Mint Your Commsaur";
      createAlert('Thanks for minting!');
    })
    .catch(() => {
      createAlert('Canceled transaction.');
      console.log('got here. cancelled');
      mintButton.disabled = false;
      mintButton.innerText = "Mint Your Commsaur"
      return;
    });
};
  // checks total minted on the contract
  async function totalSupply() {
    var web3Infura = new Web3(
      contractNetwork == 1 ?
        "https://mainnet.infura.io/v3/4b48220ef22f43c1a1c842c850869019" :
        "https://rinkeby.infura.io/v3/c31e1f10f5e540aeabf40419532cbbb6"
    );
    var contract = new web3Infura.eth.Contract(abi, contractAddress);
    var totalSupply = await contract.methods.totalSupply().call();
    return totalSupply;
  }

  async function refreshCounter() {
    var tokensRemaining = await totalSupply();
       document.querySelector('#section-2-counter-text span').innerHTML = (maxTokens - tokensRemaining).toString();
    setMintProgress(Number(tokensRemaining));
    // availableQty.innerText = (maxTokens - tokensRemaining).toString();
  }


/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);
  contract = await new web3.eth.Contract(abi, contractAddress);

  console.log("Web3 instance is", web3);

  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
  const chainData = evmChains.getChain(chainId);
  document.querySelector("#network-name").textContent = chainData.name;

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();

  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  // account = accounts[0];

  document.querySelector("#selected-account").textContent = account;
  onboardConnectHeader.innerHTML = 'Connected!';
  walletConnected();//`[${account.slice(0, 6)}...${accounts[0].slice(-4)}]`;
  // document.querySelector("#btn-disconnect").textContent = `${account.slice(0, 6)}...`;
  mintButton.disabled = false;
  // Get a handl
  const template = document.querySelector("#template-balance");
  const accountContainer = document.querySelector("#accounts");

  // Purge UI elements any previously loaded accounts
  accountContainer.innerHTML = '';

  // Go through all accounts and get their ETH balance
  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);
    // ethBalance is a BigNumber instance
    // https://github.com/indutny/bn.js/
    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    // Fill in the templated row and put in the document
    const clone = template.content.cloneNode(true);
    clone.querySelector(".address").textContent = address;
    clone.querySelector(".balance").textContent = humanFriendlyBalance;
    accountContainer.appendChild(clone);
  });

  // Because rendering account does its own RPC commucation
  // with Ethereum node, we do not want to display any results
  // until data for all accounts is loaded
  await Promise.all(rowResolvers);

  // Display fully loaded UI for wallet data
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "block";
}



/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

  // If any current data is displayed when
  // the user is switching acounts in the wallet
  // immediate hide this data
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#prepare").style.display = "block";

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  document.querySelector("#minting-button-1").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#minting-button-1").removeAttribute("disabled")
}


/**
 * Connect wallet button pressed.
 */
async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  web3Modal.clearCachedProvider();
  try {
    //provider = await web3Modal.connect();
    provider = await web3Modal.connect();
          const web3Provider = new ethers.providers.Web3Provider(provider);
          const signer = web3Provider.getSigner();
           account = await signer.getAddress();
console.log(account);
    await refreshCounter();

  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

  console.log("Killing the wallet connection", provider);

  // TODO: Which providers have close method?
  if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }
  document.querySelector("#selected-account").textContent = '';

  account = null;

  // Set the UI back to the initial state
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}


/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init();
  document.querySelector("#minting-button-1").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
  document.querySelector("#minting-button-4").addEventListener("click", mint);
});