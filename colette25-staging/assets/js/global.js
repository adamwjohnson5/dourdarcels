'use strict';

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
});

/* Colette */