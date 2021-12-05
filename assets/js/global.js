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
    // Fade in Darcel on load
    const darcel = document.querySelector('img#darcel');
    darcel.setAttribute('src', 'assets/img/darcel.png'); // Hack! - iOS Safari not firing onLoad if image already in DOM

    darcel.onload = () => {
        darcel.style.opacity = 1;
    };
}

/* Global */