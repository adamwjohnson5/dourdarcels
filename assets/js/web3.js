'use strict';

/* Web3 */

// setMintProgress(0); // Should be called on init with count of NFTs minted

//toggleOverlay('A Heading', 'Some text') // Can be used to show an alert. Second var can contain HTML

// This func is called on load
function isConnected() {
    // Check if wallet already connected
    //window.whitelisted = false; // Please set if user address is connected and whitelisted
    // window.whitelistQty = 0; // Please set allowance if user whitelisted. Set to 0 if not whitelisted
    return window.whitelisted; // Return true or false (connected/not connected)
}

async function disconnectWallet() {
    disableConnectButtons(); // This temporarily disables the connect buttons. Please leave at top.

    // Devs do your magic
    await onDisconnect();

    walletDisconnected(); // Please call when wallet successfully disconnected
}

async function connectWallet() {
    await onConnect();
    // disableConnectButtons(); // This temporarily disables the connect buttons. Please leave at top.

    // Devs do your magic here

    // this is updated in the connect wallet function in mint script
    // window.whitelisted = false; // Please set if user address is whitelisted
    // window.whitelistQty = 0; // Please set allowance if user whitelisted. Set to 0 if not whitelisted
    // walletConnected(); // Please call when wallet successfully connected
}

// I commented out this mint function coz I don't need it here
// it is in mint-wc script

// function mint() {
//     //window.mintQuantity // This int variable contains the quantity user has selected
//     setMintProgress(0); // Update count of NFTs minted on success to update progress bar
//     window.whitelistQty = 0; // Please set remaining allowance if user whitelisted. Set to 0 if not whitelisted
//     showMintingSuccess('https://1234567891012345678910123456789101234567891012345678910'); // Show minting success pop-up. Pass transaction URL.
// }

function launchSmartContract() {

}

function launchIP() {

}