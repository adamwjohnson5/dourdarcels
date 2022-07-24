'use strict';

/* Colette */

/* Global vars */

window.project = 'colette';

/* On DOM load */

document.addEventListener('DOMContentLoaded', () => {
    // Scroll
    window.addEventListener('scroll', () => {
        animateSection(1, window.pageYOffset);
        animateSection(2, window.pageYOffset);
        animateSection(3, window.pageYOffset);
        animateSection(4, window.pageYOffset);
    });

    // Mouse events
    const email = document.querySelector('#section-colette-1 form input');

    email.addEventListener('focus', (e) => {
        email.setAttribute('placeholder', 'Enter your email');
    });

    email.addEventListener('blur', (e) => {
        email.setAttribute('placeholder', 'Join the mailing list for updates');
    });
});