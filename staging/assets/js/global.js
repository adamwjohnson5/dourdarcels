'use strict';

/* Global vars */

window.touchScreen = false;

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
    const preload = document.querySelector('img#preload');
    preload.setAttribute('src', `assets/img/bg-${ int }.jpg`);

    // Preload bg image
    preload.onload = () => {
        document.querySelector('section#section-' + int).style.opacity = 1;
        int++;

        // Load next section if exists
        if (document.querySelector('section#section-' + int)) {
            loadSection(int);
        }
    };
}