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
let tokensRemaining;


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
var contractNetwork = 4;
var saleState;
var allowListState;
var availableToMint;
var contract;
var leaves = [
  "0xc4996857d25e902eBEa251621b758F86D3761C0f",
  "0xB887A81683ed3cD4a5C0414C5456B6D7F0E11b00",
  "0x4e8AA3C649c2511E18328e08649D0f8d174b1e35",
  "0xA75725aEa06F49177677d692d594672D32de55ce",
  "0xb99426903d812A09b8DE7DF6708c70F97D3dD0aE",
  "0x47452ba544acc423cb77077243348300C7cc1c2d",
  "0xdeF2afbB3B5244723e80bcC775373E9F505E43ee",
  "0x2A03A89Aa15639A8ca045cB48e05a1f1c800A682",
  "0x9652e335647Fa18B7b9FFb2c092CAa0D31d9853d",
  "0x307047162b8357c34dc9fb5fde62cd5c91ccde20",
  "0x034c81A1bD952Ed7a6Ff5Cb49bDE0BBA23263291",
  "0x70F4eA8E350c0eEd3cD344bF3693f10eDA145ce7",
  "0x25428d29a6fa3629ff401c6dade418b19cb2d615",
  "0xad3372Cd209550e03AEebA8a756688d6255F94EB",
  "0x54390Ff492946a8766a383272C9521a915A06deE",
  "0x2013E3Db6F1b0eDda0acdB32F271D10B4f6a17A6",
  "0xBe1D95BD480fFC1447B5D39e14f1f308cDdC744e",
  "0xDFD8f2d34f8B233878FA16fa5Fd4d177108ABF00",
].map((v) => keccak256(v));


var tree = new MerkleTree(leaves, keccak256, { sort: true });
var root = tree.getHexRoot();

var getProof = () => {
  var leaf = keccak256(accounts[0]);
  return tree.getHexProof(leaf);
};

var abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"MAX_ALLOWLIST_MINT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_PUBLIC_MINT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PRICE_PER_TOKEN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PROVENANCE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"RESERVE_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isAllowListActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isSaleActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"}],"name":"mintAllowList","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"claimer","type":"address"},{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"}],"name":"numAvailableToMint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"claimer","type":"address"},{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"}],"name":"onAllowList","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reserve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_merkleRoot","type":"bytes32"}],"name":"setAllowList","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_isAllowListActive","type":"bool"}],"name":"setAllowListActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI_","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"provenance","type":"string"}],"name":"setProvenance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"newState","type":"bool"}],"name":"setSaleActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

var networkNames = {1: "Ethereum Mainnet", 4: "Rinkeby Test Network"};
var etherscanSubdomain = {1: "", 4: "rinkeby."};
var alertBar = document.getElementById("alert-bar");
var alertBarMetamask = document.getElementById("alert-bar-mobile");
var mintForm = document.getElementById("mint-form");
var mintButton = document.getElementById("minting-button-4");
var onboardConnectHeader = document.getElementById("header-connect");
var onboardConnect = document.getElementById("minting-button-1");//document.getElementById("onboard-connect");
// var onboardInProgress = document.getElementById("onboard-in-progress");
// var onboardConnected = document.getElementById("onboard-connected");
// var mintInProgress = document.getElementById("mint-in-progress");
var mintPriceDiv = document.getElementById("mint-price");
var availableQty = document.getElementById("section-2-counter-text span");
var quantityInput = document.querySelector('#minting-button-2 span');
var contractLink = document.getElementById("contract-link");
contractLink.href = "https://" + etherscanSubdomain[contractNetwork] + "etherscan.io/address/" + contractAddress + "#code";
/**
 * Setup the orchestra
 */

async function init() {

  // console.log("Initializing example");
  // console.log("WalletConnectProvider is", WalletConnectProvider);
  // console.log("Fortmatic is", Fortmatic);
  // console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

  document.querySelector("#minting-button-4").setAttribute("disabled", "disabled");
//   alertBar.classList.add("w-hidden");
//   alertBarMetamask.classList.add("w-hidden");
  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  if(location.protocol !== 'https:') {
    // https://ethereum.stackexchange.com/a/62217/620
    const alert = document.querySelector("#alert-error-https");
    alert.style.display = "block";
    document.querySelector("#minting-button-1").setAttribute("disabled", "disabled")
    return;
  }

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
      cacheProvider: false,
      providerOptions, // required
    });
  }

  // console.log("Web3Modal instance is", web3Modal);
  await refreshCounter();
}

function price(quantity) {
  return (mintPrice * quantity);
}

function priceInEther(quantity) {
  return (mintPriceInEther * quantity);
}

  function createAlert(header, alertMessage) {
    toggleOverlay(header, alertMessage);
  }


function clearAlert() {
  alertBar.classList.add("w-hidden");
}

var etherscanLink =
  contractNetwork === 1
    ? "https://etherscan.io/tx"
    : "https://rinkeby.etherscan.io/tx";

async function mint() {
  if (!account) {
   return;
  }
  // clearAlert();
  var gasEstimate;

  var provider20 = new ethers.providers.Web3Provider(provider);
  var erc20 = new ethers.Contract(contractAddress, abi, provider20);

  var numberToMint = quantityInput.innerHTML;

  var amountInEther = priceInEther(Number(numberToMint));
  mintButton.disabled = true;

  const signer = provider20.getSigner();
  var contract20 = new ethers.Contract(contractAddress,abi,signer);
  mintButton.innerText = "Minting..";
  const overrides = {
    from: account,
    value: ethers.utils.parseEther(`${amountInEther}`),
    gasLimit: undefined,
  }

  try {
    gasEstimate = await erc20.estimateGas.mint(numberToMint, overrides);

    gasEstimate = gasEstimate.mul(
      ethers.BigNumber.from("125").div(ethers.BigNumber.from("100"))
    );
    overrides.gasLimit = gasEstimate;

    const tx = await contract20.mint(numberToMint, overrides);

    const receipt = await tx.wait();
    const hash = receipt.transactionHash;

    refreshCounter();
    createAlert(
      `Thanks for minting!`,`Your transaction link is <a href='${etherscanLink}/${hash}' target="_blank" >${etherscanLink}/${hash.slice(0, 6)}...${hash.slice(-4)}</a>`
    );
  } catch(err) {
    createAlert('Failed', 'Canceled transaction.');
    console.log(err);
  };

  mintButton.disabled = false;
  mintButton.innerText = 'Mint!';
};
  // checks total minted on the contract
  async function totalSupply() {
    var web3Infura = new Web3(
      contractNetwork == 1 ?
        "https://mainnet.infura.io/v3/4b48220ef22f43c1a1c842c850869019" :
        "https://rinkeby.infura.io/v3/c31e1f10f5e540aeabf40419532cbbb6"
    );
    var contract = new web3Infura.eth.Contract(abi, contractAddress);
    tokensRemaining = await contract.methods.totalSupply().call();

    return tokensRemaining;
  }

  async function refreshCounter() {
    tokensRemaining = await totalSupply();
    document.querySelector('#section-2-counter-text span').innerHTML = (maxTokens - tokensRemaining).toString();
    setMintProgress(Number(tokensRemaining));
    var saleState = await getSaleState();
    if (!saleState) mintButton.disabled = true;
  }
  async function getSaleState() {
    var web3Infura = new Web3(
        contractNetwork == 1 ?
          "https://mainnet.infura.io/v3/4b48220ef22f43c1a1c842c850869019" :
          "https://rinkeby.infura.io/v3/c31e1f10f5e540aeabf40419532cbbb6"
      );
      var contract = new web3Infura.eth.Contract(abi, contractAddress);

      saleState = await contract.methods.isSaleActive().call();
    return saleState;
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

  // document.querySelector("#selected-account").textContent = `${account.slice(0, 6)}...${accounts[0].slice(-4)}`;
  // document.querySelector("#btn-disconnect").textContent = `${account.slice(0, 6)}...`;
  mintButton.disabled = false;
  onboardConnectHeader.innerHTML = `${account.slice(0, 6)}...${accounts[0].slice(-4)}`;
  walletConnected();
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
  web3Modal.clearCachedProvider();
  try {
    provider = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    account = await signer.getAddress();

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
  // document.querySelector("#selected-account").textContent = '';

  account = null;
  walletDisConnected();
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
  document.querySelector("#header-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
  document.querySelector("#minting-button-4").addEventListener("click", mint);
});
