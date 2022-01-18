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
        animateSection(1, window.pageYOffset);
        animateSection(3, window.pageYOffset);
        animateSection(4, window.pageYOffset);
        animateSection(6, window.pageYOffset);
        animateSection(7, window.pageYOffset);
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

function animateSection(sectionNum, pos) {
    const section = document.querySelector('section#section-' + sectionNum);

    // Only if section is loaded and visible
    if (sectionNum === 1 && section.style.opacity === '1') {
        // Section 1
        let percent = Math.round(pos / section.offsetHeight * 100);
        let scale = pos >= section.offsetHeight ? 1.1 : 1 + (percent / 10) / 100;
        section.querySelector('img').style.transform = `scale(${ scale })`; // Scale max 110% on scroll
    } else if (sectionNum !== 1 && section.style.opacity === '1') {
        // All other sections excluding timeline
        let percent = Math.round((pos - section.offsetTop + window.innerHeight) / section.offsetHeight * 100);
        const column = section.querySelector('.section-column');

        // Opacity
        const opacity = pos < section.offsetTop - window.innerHeight ? 0 : pos >= section.offsetHeight - window.innerHeight + section.offsetTop ? 1 : percent / 100;
        column.style.opacity = window.innerWidth >= 927 ? opacity : 1; // 0% - 100% (excluding mobile)

        // Top
        const top = pos < section.offsetTop - window.innerHeight ? (section.offsetHeight / 4) : pos >= section.offsetHeight - window.innerHeight + section.offsetTop ? 0 : (100 - percent) * (section.offsetHeight / 4) / 100;
        column.style.marginTop = window.innerWidth >= 927 ? top + 'px' : 0; // Top moves 1/4 of section size (excluding mobile)
    }
}