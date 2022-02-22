var contractNetwork = 4;
// hooked up an old contract for testing
var contractAddress = "0x38134bb53855b20ac924486e4643dfa9be917544";

var mintPrice = Number(30000000000000000);
var mintPriceInEther = 0.03;
var maxTokens = 10000;
var maxPerPurchase = 2;
var counterRefreshRate = 120000;
var saleState;
var allowListState;
var availableToMint;

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

var isMetaMaskInstalled = () => {
  var { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

var networkNames = { 1: "Ethereum Mainnet", 4: "Rinkeby Test Network" };
var etherscanSubdomain = { 1: "", 4: "rinkeby." };

var initialize = async () => {
  var etherscanLink =
    contractNetwork === 1
      ? "https://etherscan.io/tx"
      : "https://rinkeby.etherscan.io/tx";

  var provider;
  var erc20;

  refreshCounter();
  var accounts;
  var account;
  var net_version;
  var onboarding;

  var mintForm = document.getElementById("mint-form");
  var numAvailableToMint = document.getElementById("available-mint");
  var mintButton = document.getElementById("minting-button-4");
  var onboardConnect = document.getElementById("minting-button-1");
  var onboardConnectHeader = document.getElementById("header-connect");
  var mintPriceDiv = document.getElementById("mint-price");
  var availableQty = document.getElementById("section-2-counter-text span");
  var quantityInput = document.querySelector('#minting-button-2 span');
  var contractLink = document.getElementById("contract-link");
  contractLink.href =
    "https://" +
    etherscanSubdomain[contractNetwork] +
    "etherscan.io/address/" +
    contractAddress +
    "#code";

  try {
    onboarding = new MetaMaskOnboarding();
  } catch (error) {
    console.error(error);
  }

  var isMetaMaskConnected = () => accounts && accounts.length > 0;

  async function loadWeb3() {
    if (window.ethereum) {
      window.ethereum.enable();
      provider = new ethers.providers.Web3Provider(window.ethereum);
      erc20 = new ethers.Contract(contractAddress, abi, provider);
    }
  }

  async function loadContract() {
    await loadWeb3();
  }

  var onClickConnect = async (e) => {
    e.preventDefault();
    try {
      var newAccounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      var netVersion = await ethereum.request({
        method: "net_version",
      });
      await handleNewAccounts(newAccounts);
      await handleNewNetwork(netVersion);
    } catch (error) {
      console.error(error);
    }
  };

  function price(quantity) {
    return mintPrice * quantity;
  }

  function priceInEther(quantity) {
    return mintPriceInEther * quantity;
  }

  var mint = async () => {
    var numberToMint = quantityInput.innerHTML;

    var amountInEther = priceInEther(Number(numberToMint));
    mintButton.disabled = true;

    const signer = provider.getSigner();
    var contract = new ethers.Contract(contractAddress,abi,signer);

    const overrides = {
      from: account,
      value: ethers.utils.parseEther(`${amountInEther}`),
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

        const tx = await contract.mint(numberToMint, overrides);

        const receipt = await tx.wait();

        refreshCounter();
        createAlert(
          `Thanks for minting!`,`Your transaction link is <a href='${etherscanLink}/${receipt.transactionHash}' target="_blank" >${etherscanLink}/${receipt.transactionHash}</a>`
        );
      } catch(err) {
        createAlert('Failed', 'Canceled transaction.');
        console.log('got here. cancelled');
      };

    } else if (allowListState && availableToMint !== 0) {
      const proof = getProof();
      mintButton.innerText = "Minting..";

      try {
        let gasEstimate = await erc20.estimateGas.mintAllowList(numberToMint,proof,overrides);

        gasEstimate = gasEstimate.mul(ethers.BigNumber.from("125").div(ethers.BigNumber.from("100")))
        overrides.gasLimit = gasEstimate;
        const tx = await contract.mintAllowList(numberToMint, proof, overrides);

        const receipt = await tx.wait();

        refreshCounter();
        createAlert(
        `Thanks for minting!`,`Your transaction link is <a href='${etherscanLink}/${receipt.transactionHash}' target="_blank" >${etherscanLink}/${receipt.transactionHash}</a>`
        );
      } catch(err) {
        createAlert('Failed', 'Canceled transaction.');
        console.log('got here. cancelled');
        return;
      };

    } else if (allowListState && availableToMint === 0) {
        mintButton.disabled = true;
        mintButton.innerText = "You can't mint!";
        return;
    } else {
      mintButton.disabled = true;
      mintButton.innerText = 'Sale is inactive!';
      return;
    }
    mintButton.disabled = false;
    mintButton.innerText = 'Mint!';
  };

  var onClickInstall = (e) => {
    e.preventDefault();
    onboarding.startOnboarding();
  };

  var updateButtons = async () => {
    const headerConnect = document.querySelector('a#header-connect');
    headerConnect.style.opacity = 1;
    headerConnect.style.pointerEvents = 'auto';
    if (!isMetaMaskInstalled()) {
      onboardConnect.onclick = onClickInstall;
      onboardConnectHeader.onclick = onClickInstall;
      if (isMobile()) {
        createAlert('', "Please use a computer or <a href='https://metamask.app.link/dapp/'>download the MetaMask app to mint</a>");
      } else {
        createAlert(
          '', "You need MetaMask to mint. <a href='#' id='onboard-link'>Click here to install</a>"
        );
      }
      document.getElementById("onboard-link").onclick = onClickInstall;
    } else if (isMetaMaskConnected()) {
      await loadContract();

      // shorten wallet id
      const walletId = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
      onboardConnect.innerHTML = 'Connected!';// `[${walletId}]`;
      onboardConnectHeader.innerHTML = walletId;
      walletConnected();

      mintButton.onclick = mint;
      if (onboarding) {
        onboarding.stopOnboarding();
      }
    } else {
      mintButton.onclick = onClickConnect;
      onboardConnect.onclick = onClickConnect;
      onboardConnectHeader.onclick = onClickConnect;
    }
  };

  async function handleNewAccounts(newAccounts) {
    accounts = newAccounts;
    account = accounts[0];
    window.accounts = newAccounts;
    await updateAvailableToMint(account);
    await refreshCounter();
    updateButtons();
  }

  async function handleNewNetwork(netVersion) {
    net_version = netVersion;
    updateButtons();
  }

  updateButtons();

  if (isMetaMaskInstalled()) {
    ethereum.on("accountsChanged", handleNewAccounts);
    ethereum.on("chainChanged", (_chainId) => window.location.reload());

    try {
      var newAccounts = await ethereum.request({
        method: "eth_accounts",
      });
      var netVersion = await ethereum.request({
        method: "net_version",
      });
      await handleNewAccounts(newAccounts);
      await handleNewNetwork(netVersion);
      if (net_version != contractNetwork) {
        var network = networkNames[contractNetwork];
        createAlert('',
          `Your wallet is not connected to the ${network}. To mint, please switch to the ${network}.`
        );
      }
    } catch (err) {
      console.error('Error on init when getting accounts...', err);
    }
  }

  // Alert Bar
  function createAlert(header, alertMessage) {
    toggleOverlay(header, alertMessage);
  }

  async function updateAvailableToMint(account) {
    if (allowListState === true) {
      var proof = getProof();

      availableToMint = await erc20.numAvailableToMint(account, proof);

      availableToMint = Number(availableToMint);
      numAvailableToMint.classList.remove('w-hidden');

      if (availableToMint === 1 || availableToMint === '1') {
        numAvailableToMint.innerHTML = `You have ${availableToMint} NFT available to mint`;
      } else {
        numAvailableToMint.innerHTML = `You have ${availableToMint} NFTs available to mint`;
      }
    }
    return availableToMint;
  }

  // mobile detection
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  async function getSaleState() {
    const saleState = await erc20.isSaleActive();
    return saleState;
  }

  async function allowList() {
    const allowList = await erc20.isAllowListActive();
    return allowList;
  }

  async function totalSupply() {
    var totalSupply = await erc20.totalSupply();
    return totalSupply;
  }

  async function refreshCounter() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    erc20 = new ethers.Contract(contractAddress, abi, provider);

    var tokensRemaining = await totalSupply();
    saleState = await getSaleState();
    allowListState = await allowList();

    document.querySelector('#section-2-counter-text span').innerHTML = (maxTokens - tokensRemaining).toString();
    setMintProgress(Number(tokensRemaining));

    if (allowListState) {
      maxPerPurchase = 3;
      availableToMint = await updateAvailableToMint(accounts[0]);
    }

    if (!saleState && !allowListState) {
      mintButton.disabled = true;
      mintButton.innerText = 'Sale is inactive!';
    } else if (allowListState && availableToMint === 0) {
      mintButton.disabled = true;
      mintButton.innerText = "You can't mint!";
    } else {
      mintButton.disabled = false;
      mintButton.innerText = 'Mint!';
    }
  }

  refreshCounter();
  setTimeout(refreshCounter, counterRefreshRate);
};

window.addEventListener('DOMContentLoaded', initialize);

var abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"MAX_ALLOWLIST_MINT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_PUBLIC_MINT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PRICE_PER_TOKEN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PROVENANCE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"RESERVE_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isAllowListActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isSaleActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"}],"name":"mintAllowList","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"claimer","type":"address"},{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"}],"name":"numAvailableToMint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"claimer","type":"address"},{"internalType":"bytes32[]","name":"proof","type":"bytes32[]"}],"name":"onAllowList","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reserve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_merkleRoot","type":"bytes32"}],"name":"setAllowList","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_isAllowListActive","type":"bool"}],"name":"setAllowListActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI_","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"provenance","type":"string"}],"name":"setProvenance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"newState","type":"bool"}],"name":"setSaleActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];
