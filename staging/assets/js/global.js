'use strict';

/* Global vars */

window.touchScreen = false;
window.mintQuantity = 0;

/* On DOM load */

document.addEventListener('DOMContentLoaded', () => {
    // Detect mobile
    window.addEventListener('touchstart', () => {
        document.querySelector('body').classList.remove('no-touch');
        window.touchScreen = ! window.touchScreen; // Toggle
    });

    setEventsGlobal(); // Mouse and keyboard

    // Scroll
    window.addEventListener('scroll', () => {
        //window.pageYOffset;
    });

    // Resize
    window.addEventListener('resize', () => {

    });

    document.querySelector('html').style.visibility = 'visible'; // Hack to avoid FOUC
    start();
});

/* Mouse and keyboard events */

function setEventsGlobal() {}

/* Start */

function start() {
    loadSection(1);
}

/* Global */

function loadSection(int) {
    const section = document.querySelector('section#section-' + int);
    const bg = section.querySelector('img.section-bg');
    bg.setAttribute('src', `assets/img/bg-${ int }.jpg`);

    // Preload bg image
    bg.onload = () => {
        section.style.opacity = 1;
        int++;

        if (document.querySelector('section#section-' + int)) {
            // Load next section if exists
            loadSection(int);
        } else {
            // All sections loaded - show footer
            document.querySelector('footer').style.visibility = 'visible';
        }
    };
}

/* Section 2 */

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

function walletConnected() {
    // Connect buttons
    const headerConnect = document.querySelector('a#header-connect');
    headerConnect.innerHTML = 'Connected!';
    headerConnect.style.pointerEvents = 'none';
    const mintingConnect = document.querySelector('a#minting-button-1');
    mintingConnect.innerHTML = 'Connected!';
    mintingConnect.style.pointerEvents = 'none';

    // Minting buttons
    const mintingQuantity = document.querySelector('#minting-button-2');
    mintingQuantity.style.opacity = 1;
    mintingQuantity.querySelector('a#button-2-minus').style.pointerEvents = 'auto';
    mintingQuantity.querySelector('a#button-2-plus').style.pointerEvents = 'auto';
    document.querySelector('#minting-button-3').style.opacity = 1;
}

function mintQuantityToggle(action) {
    if (action === 'pos' && window.mintQuantity < 3) {
        window.mintQuantity++;
    } else if (action === 'neg' && window.mintQuantity > 0) {
        window.mintQuantity--;
    }

    if (window.mintQuantity === 0) {
        document.querySelector('#minting-button-2 span').innerHTML = 'Quantity';
        document.querySelector('#minting-button-3').innerHTML = '0 ETH';
        let mintingMint = document.querySelector('a#minting-button-4');
        mintingMint.style.opacity = '';
        mintingMint.style.pointerEvents = '';
    } else {
        document.querySelector('#minting-button-2 span').innerHTML = window.mintQuantity;
        document.querySelector('#minting-button-3').innerHTML = (window.mintQuantity * 0.1).toFixed(1) + ' ETH'; // Calculate cost
        let mintingMint = document.querySelector('a#minting-button-4');
        mintingMint.style.opacity = 1;
        mintingMint.style.pointerEvents = 'auto';
    }
}