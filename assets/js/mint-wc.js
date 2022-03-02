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
let contractNetwork = 4;
let contractAddress = "0xB2d611A979CdD0C2da2e6f1c481173F741C7F5EE";

let mintPrice = 100000000000000000;
let mintPriceInEther = 0.1; // to be changed in section-2.js as well
let maxTokens = 10000;
let counterRefreshRate = 120000;
let maxAllowlistMint = 3;
let saleIsActive = true;
let chainId;
let saleState;
let allowListState;
let availableToMint;
let contract;

let leaves = values.map((v) => keccak256(v));

// find the amount from a values list, or return undefined
const isWhiteListed = (values, account) => {
  const accountFound = values.includes(account);
  window.whitelisted = accountFound;

  return accountFound;
};

let tree = new MerkleTree(leaves, keccak256, { sort: true });
let root = tree.getHexRoot();

let getProof = (account) => {
  let leaf = keccak256(account);
  return tree.getHexProof(leaf);
};

let abi = [{"inputs":[{"internalType":"address payable","name":"shareholderAddress_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Claimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"merkleRoot","type":"bytes32"}],"name":"MerkleRootChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_ALLOWLIST_MINT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_PUBLIC_MINT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_RESERVE_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PRICE_PER_TOKEN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SUPPORT_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"allowListActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"}],"name":"devMint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"}],"name":"getAllowListMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"merkleRoot","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"}],"name":"mintAllowList","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"claimer","type":"address"},{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"}],"name":"onAllowList","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"provenance","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reserveSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"saleActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"merkleRoot","type":"bytes32"}],"name":"setAllowList","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"allowListActive","type":"bool"}],"name":"setAllowListActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI_","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"provenance_","type":"string"}],"name":"setProvenance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"state","type":"bool"}],"name":"setSaleActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"shareholderAddress","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

let networkNames = {1: "Ethereum Mainnet", 4: "Rinkeby Test Network"};
let etherscanSubdomain = {1: "", 4: "rinkeby."};
let alertBar = document.getElementById("alert-bar");
let alertBarMetamask = document.getElementById("alert-bar-mobile");
let mintForm = document.getElementById("mint-form");
let mintButton = document.getElementById("minting-button-4");
let onboardConnectHeader = document.getElementById("header-connect");
let onboardConnect = document.getElementById("minting-button-1");
let mintPriceDiv = document.getElementById("mint-price");
let availableQty = document.getElementById("section-2-counter-text span");
let quantityInput = document.querySelector('#minting-button-2 span');

/**
 * Setup
 */

async function init() {
  document.querySelector("#minting-button-4").setAttribute("disabled", "disabled");
  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  if (location.protocol !== 'https:') {
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

let etherscanLink =
  contractNetwork === 1
    ? "https://etherscan.io/tx"
    : "https://rinkeby.etherscan.io/tx";

async function updateAvailableToMint(account) {
  if (allowListState) {
    // let proof = getProof(account);

    availableToMint = await contract.methods.getAllowListMinted(account).call();

    availableToMint = maxAllowlistMint - Number(availableToMint);
    window.whitelistQty = availableToMint;
  }
  return availableToMint;
}

async function mint() {
  if (!account) {
    return;
  }
  if (chainId !== contractNetwork) {
    createAlert('Failed', 'Incorrect Network');
    return;
  }
  let gasEstimate;

  let provider20 = new ethers.providers.Web3Provider(provider);
  let erc20 = new ethers.Contract(contractAddress, abi, provider20);

  // quantity
  let numberToMint = quantityInput.innerHTML;

  // get price
  let price = ethers.BigNumber.from(mintPrice.toString());
  const amountInWei = price.mul(numberToMint);

  mintButton.disabled = true;

  const signer = provider20.getSigner();

  let contract20 = new ethers.Contract(contractAddress, abi, signer);

  const overrides = {
    from: account,
    value: amountInWei.toString(),
    gasLimit: undefined,
  }

  if (saleState) {
    mintButton.innerText = "Minting..";
    try {
      gasEstimate = await erc20.estimateGas.mint(numberToMint, overrides);

      gasEstimate = gasEstimate.mul(
        ethers.BigNumber.from("125").div(ethers.BigNumber.from("100"))
      );

      overrides.gasLimit = gasEstimate;
      const tx = await contract20.mint(numberToMint, overrides);

      const receipt = await tx.wait();
      const hash = receipt.transactionHash;

      await refreshCounter();
      showMintingSuccess(`${etherscanLink}/${hash}`);
    } catch (err) {
      createAlert('Failed', 'Canceled transaction.');
      console.log('got here. cancelled');
    };
  } else if (allowListState && availableToMint !== 0) {
    const proof = getProof(account);
    mintButton.innerText = "Minting..";

    try {
      let gasEstimate = await erc20.estimateGas.mintAllowList(numberToMint,proof,overrides);

      gasEstimate = gasEstimate.mul(ethers.BigNumber.from("125").div(ethers.BigNumber.from("100")))

      overrides.gasLimit = gasEstimate;

      const tx = await contract20.mintAllowList(numberToMint, proof, overrides);

      const receipt = await tx.wait();
      const hash = receipt.transactionHash;

      await refreshCounter();
      showMintingSuccess(`${etherscanLink}/${hash}`);

    } catch (err) {
      createAlert('Failed', 'Canceled transaction.');
      console.log('got here. cancelled');
    };

  } else if (allowListState && availableToMint === 0) {
      mintButton.disabled = true;
      return;
  } else {
    mintButton.disabled = true;
    return;
  }
  setMintingDetails();
  mintButton.disabled = false;
  mintButton.innerText = 'Mint!';
};

let web3Infura = new Web3(
  contractNetwork == 1 ?
    "https://mainnet.infura.io/v3/4b48220ef22f43c1a1c842c850869019" :
    "https://rinkeby.infura.io/v3/c31e1f10f5e540aeabf40419532cbbb6"
);
contract = new web3Infura.eth.Contract(abi, contractAddress);

// checks total minted on the contract
async function totalSupply() {
  tokensRemaining = await contract.methods.totalSupply().call();

  return tokensRemaining;
}

async function getSaleState() {
  saleState = await contract.methods.saleActive().call();

  return saleState;
}

async function allowList() {
  const allowList = await contract.methods.allowListActive().call();

  return allowList;
}

async function refreshCounter() {
  tokensRemaining = await totalSupply();
  document.querySelector('#section-2-counter-text span').innerHTML = (maxTokens - tokensRemaining).toString();
  setMintProgress(Number(tokensRemaining));

  saleState = await getSaleState();
  allowListState = await allowList();

  if (allowListState) {
    window.presale = true;
    if (account) { availableToMint = await updateAvailableToMint(account); }
  } else {
    window.presale = false;
  }

  if (!saleState && !allowListState) {
    mintButton.disabled = true;
  } else if (allowListState && availableToMint === 0) {
    mintButton.disabled = true;
  } else {
    mintButton.disabled = false;
  }
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);
  contract = await new web3.eth.Contract(abi, contractAddress);

  // Get connected chain id from Ethereum node
  chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
  const chainData = evmChains.getChain(chainId);
  // document.querySelector("#network-name").textContent = chainData.name;

  if (chainId !== contractNetwork) {
    createAlert('Failed', 'Incorrect Network');
    return;
  }
  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();
  mintButton.disabled = false;

  account = accounts[0];
  // commented out showing wallet address
  // onboardConnectHeader.innerHTML = `${account.slice(0, 6)}...${account.slice(-4)}`;

  availableToMint = await updateAvailableToMint(account);

  console.log('Connected account: '+ account);
  window.presale? window.whitelisted = isWhiteListed(values, account): window.whitelisted = false;

  walletConnected();
  isConnected();

}



/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

  // If any current data is displayed when
  // the user is switching accounts in the wallet
  // immediate hide this data

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  document.querySelector("#minting-button-1").setAttribute("disabled", "disabled");
  await fetchAccountData();
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

    await refreshAccountData();

    disableConnectButtons();
    walletConnected();
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

  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
  }
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {
  console.log("Killing the wallet connection", provider);

  // TODO: Which providers have close method?
  if (provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavior.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  account = null;
  walletDisconnected();
  // Set the UI back to the initial state
}


/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init();
  document.querySelector("#minting-button-4").addEventListener("click", mint);
});
