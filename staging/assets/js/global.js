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