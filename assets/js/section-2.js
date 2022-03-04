'use strict';

/* Global vars */

window.mintQuantity = 0;
window.mintPrice = 0.1;
window.whitelisted = false;
window.whitelistQty = 0;

/* Section 2 */

async function mintingOpen() {
    // Check if wallet already connected
    const connected = await isConnected();

    document.querySelector('section#section-2').style.display = 'block'; // Show section

    // Header
    const headerConnect = document.querySelector('a#header-connect');
    headerConnect.style.opacity = 1;
    headerConnect.style.pointerEvents = 'auto';

    if (connected) {
        walletConnected();
    } else {
        setMintingWelcomeText();
    }
}

function setMintingWelcomeText() {
    if (window.presale) {
        document.querySelector('section#section-2').querySelector('p#section-2-details').innerHTML = '<strong>Welcome, please connect your wallet to participate in the pre-sale mint.</strong>';
    } else {
        document.querySelector('section#section-2').querySelector('p#section-2-details').innerHTML = '<strong>Welcome, please connect your wallet to mint.</strong> You can mint a maximum of <strong>3 Darcels</strong> per transaction. Dour Darcels are <strong>0.1ETH</strong> each.';
    }
}

function setMintProgress(minted) {
    const perMinted = minted / 10000 * 100; // Make percentage
    document.querySelector('#section-2-counter-progress').style.width = perMinted + '%';

    if (perMinted == 100) {
        // Sold out
        document.querySelector('p#section-2-counter-text').innerHTML = 'SOLD OUT';
    } else {
        // Update count text (insert comma using regex)
        document.querySelector('p#section-2-counter-text span').innerHTML = (10000 - minted).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

function disableConnectButtons() {
    // Deactivate
    document.querySelector('a#header-connect').style.pointerEvents = 'none';
    document.querySelector('a#minting-button-1').style.pointerEvents = 'none';
}

function walletConnected() {
    // Connect buttons
    const headerConnect = document.querySelector('a#header-connect');
    headerConnect.innerHTML = 'Disconnect';
    headerConnect.style.pointerEvents = 'auto'; // Re-enable
    headerConnect.setAttribute('href', 'javascript: disconnectWallet();');
    const mintingConnect = document.querySelector('a#minting-button-1');
    mintingConnect.innerHTML = 'Disconnect';
    mintingConnect.style.pointerEvents = 'auto'; // Re-enable
    mintingConnect.setAttribute('href', 'javascript: disconnectWallet();');

    // Must be whitelisted if pre-sale
    if (!window.presale || window.presale && window.whitelisted) {
        // Minting buttons
        const mintingQuantity = document.querySelector('#minting-button-2');
        mintingQuantity.style.opacity = 1;
        mintingQuantity.querySelector('a#button-2-minus').style.pointerEvents = 'auto';
        mintingQuantity.querySelector('a#button-2-plus').style.pointerEvents = 'auto';
        document.querySelector('#minting-button-3').style.opacity = 1;
    }

    setMintingDetails();
}

function setMintingDetails() {
    if (window.presale && window.whitelisted && !window.window.whitelistQty) {
        // Is presale and address whitelisted but all allocation minted
        document.querySelector('p#section-2-details').innerHTML = '<strong>Thank you!</strong> You\'ve reached the maximum amount of mints for the presale, please connect again during the public mint.';
        disableMinting();
    } else if (window.presale && window.whitelisted) {
        // Is presale and address whitelisted
        document.querySelector('p#section-2-details').innerHTML = `You can mint <strong>${ window.whitelistQty } Darcel${ window.whitelistQty === 1 ? '' : 's' }</strong>. Dour Darcels are <strong>0.1ETH</strong> each.`;
    } else if (window.presale) {
        // Is presale and address not whitelisted
        document.querySelector('p#section-2-details').innerHTML = '<strong>Unfortunately your wallet isn\'t on the pre-sale whitelist.</strong> Please connect again during the public mint on <strong>March 5th</strong>.';
    } else {
        // Is not presale
        document.querySelector('p#section-2-details').innerHTML = 'You can mint up to <strong>3 Darcels</strong>. Dour Darcels are <strong>0.1ETH</strong> each.';
    }
}

function walletDisconnected() {
    // Connect buttons
    const headerConnect = document.querySelector('a#header-connect');
    headerConnect.innerHTML = 'Connect Wallet';
    headerConnect.style.pointerEvents = 'auto'; // Re-enable
    headerConnect.setAttribute('href', 'javascript: connectWallet();')
    const mintingConnect = document.querySelector('a#minting-button-1');
    mintingConnect.innerHTML = 'Connect Wallet';
    mintingConnect.style.pointerEvents = 'auto'; // Re-enable
    mintingConnect.setAttribute('href', 'javascript: connectWallet();')

    disableMinting();
    mintQuantityToggle('reset');
    setMintingWelcomeText();
}

function disableMinting() {
    const mintingQuantity = document.querySelector('#minting-button-2');
    mintingQuantity.style.opacity = '';
    mintingQuantity.querySelector('a#button-2-minus').style.pointerEvents = '';
    mintingQuantity.querySelector('a#button-2-plus').style.pointerEvents = '';
    document.querySelector('#minting-button-3').style.opacity = '';
}

function mintQuantityToggle(action) {
    const maxQuantity = window.presale ? window.whitelistQty : 3;

    if (action === 'pos' && window.mintQuantity < maxQuantity) {
        window.mintQuantity++;
    } else if (action === 'neg' && window.mintQuantity > 0) {
        window.mintQuantity--;
    } else if (action === 'reset') {
        window.mintQuantity = 0;
    }

    if (window.mintQuantity === 0) {
        // Reset
        document.querySelector('#minting-button-2 span').innerHTML = 'Quantity';
        document.querySelector('#minting-button-3').innerHTML = '0 ETH';
        let mintingMint = document.querySelector('a#minting-button-4');
        mintingMint.style.opacity = '';
        mintingMint.style.pointerEvents = '';
    } else {
        // Update text
        document.querySelector('#minting-button-2 span').innerHTML = window.mintQuantity;
        document.querySelector('#minting-button-3').innerHTML = (window.mintQuantity * mintPriceInEther).toFixed(2) + ' ETH'; // Calculate cost

        // Enable mint button
        let mintingMint = document.querySelector('a#minting-button-4');
        mintingMint.style.opacity = 1;
        mintingMint.style.pointerEvents = 'auto';
    }
}

function showMintingSuccess(tranLink) {
    toggleOverlay('Congrats!', `<strong>You've successfully minted!</strong><br />Your transaction link is:<br /><a href="${ tranLink }" target="_blank">${ tranLink }</a><br /><br />The <strong>Dour Darcels</strong> will be revealed on OpenSea in the coming days.`, 'minting-success');
    mintQuantityToggle('reset');
    setMintingDetails();
}