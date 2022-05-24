'use strict';

/* Web3 */

setMintProgress(0); // Should be called on init with count of NFTs minted

//toggleOverlay('A Heading', 'Some text') // Can be used to show an alert. Second var can contain HTML

// This func is called on load
function isConnected() {
    // Check if wallet already connected
    window.whitelisted = false; // Please set if user address is connected and whitelisted
    window.whitelistQty = 0; // Please set allowance if user whitelisted. Set to 0 if not whitelisted
    return false; // Return true or false (connected/not connected)
}

/* function disconnectWallet() {
    toggleConnectButtons(false); // This temporarily disables the connect buttons. Please leave at top.

    // Devs do your magic

    walletDisconnected(); // Please call when wallet successfully disconnected
} */

async function connectWallet() {
    toggleConnectButtons(false); // This temporarily disables the connect buttons. Please leave at top.

    // Check for MetaMask
    if (typeof window.ethereum !== 'undefined') {
        // MetaMask installed
        var accounts;

        try {
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            //console.error(error)
        }

        if (accounts) {
            window.whitelisted = false; // Please set if user address is whitelisted
            window.whitelistQty = 0; // Please set allowance if user whitelisted. Set to 0 if not whitelisted
            walletConnected(); // Please call when wallet successfully connected
        } else {
            toggleConnectButtons(true);; // Enable
            toggleOverlay('Error', 'Wallet not found.');
        }
    } else {
        // No MetaMask
        toggleConnectButtons(true); // Enable
        toggleOverlay('Error', 'MetaMask not found. Download it <a href="https://metamask.io" target="_blank">here</a>.');
    }
}

async function getWalletAddress() {
    var address;

    // Check for MetaMask
    if (typeof window.ethereum !== 'undefined') {
        // MetaMask installed
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });

        if (accounts.length) {
            // Connected
            address = accounts[0];
        }
    }

    return address;
}

async function getOSAsset(contract, item) {
    return await getData(`https://api.opensea.io/api/v1/asset/${ contract }/${ item }/?include_orders=true`);
}

function mint() {
    //window.mintQuantity // This int variable contains the quantity user has selected
    setMintProgress(0); // Update count of NFTs minted on success to update progress bar
    window.whitelistQty = 0; // Please set remaining allowance if user whitelisted. Set to 0 if not whitelisted
    showMintingSuccess('https://1234567891012345678910123456789101234567891012345678910'); // Show minting success pop-up. Pass transaction URL.
}