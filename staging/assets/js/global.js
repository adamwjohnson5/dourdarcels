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
        animateSection1(window.pageYOffset);
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

/* Section 1 */

function animateSection1(pos) {
    const section = document.querySelector('section#section-1');

    // Only if section is loaded and visible
    if (section.style.opacity === '1' && pos < section.offsetHeight) {
        const percent = Math.round(pos / section.offsetHeight * 100);
        const logo = section.querySelector('img');
        logo.style.opacity = (100 - percent) / 100; // Fade to 0% on scroll
        logo.style.transform = `scale(${ 1 + percent / 4 / 100 })`; // Scale max 150% on scroll
    }
}