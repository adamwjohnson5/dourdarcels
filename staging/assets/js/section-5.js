'use strict';

/* Global vars */

/* Section 5 */

function moveTimeline(pos) {
    const timeline = document.querySelector('#section-5-timeline');
    const contentWidth = timeline.offsetLeft + timeline.offsetWidth - window.innerWidth;
    const contentDivided = contentWidth / 3;

    document.querySelector('#section-5 .section-wrapper').scrollTo({
        left: pos === 3 ? contentWidth : pos * contentDivided,
        behavior: 'smooth'
    });
}