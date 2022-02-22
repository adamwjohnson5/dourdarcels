'use strict';

/* Web3 */

setMintProgress(0); // Should be called on init with count of NFTs minted

//toggleOverlay('A Heading', 'Some text') // Can be used to show an alert. Second var can contain HTML

function connectWallet() {
    // Devs do your magic
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