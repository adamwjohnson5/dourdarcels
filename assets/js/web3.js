'use strict';

/* Web3 */

setMintProgress(0); // Should be called on init with count of NFTs minted

//toggleOverlay('A Heading', 'Some text') // Can be used to show an alert. Second var can contain HTML

// This func is called on load
function isConnected() {
    // Check if wallet already connected
    window.whitelisted = false; // Please set if user address is connected and whitelisted
    return false; // Return true or false (connected/not connected)
}

function disconnectWallet() {
    disableConnectButtons(); // This temporarily disables the connect buttons. Please leave at top.

    // Devs do your magic

    walletDisconnected(); // Please call when wallet successfully disconnected
}

function connectWallet() {
    disableConnectButtons(); // This temporarily disables the connect buttons. Please leave at top.

    // Devs do your magic here

    window.whitelisted = false; // Please set if user address is whitelisted
    walletConnected(); // Please call when wallet successfully connected
}

function mint() {
    //window.mintQuantity // This int variable contains the quantity user has selected
    setMintProgress(0); // Update count of NFTs minted on success to update progress bar
    showMintingSuccess('https://1234567891012345678910123456789101234567891012345678910'); // Show minting success pop-up. Pass transaction URL.
}

function launchSmartContract() {

}

function launchIP() {

}