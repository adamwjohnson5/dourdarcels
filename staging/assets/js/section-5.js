'use strict';

/* Global vars */

/* Section 5 */

document.addEventListener('DOMContentLoaded', () => {
    // Scroll
    const wrapper = document.querySelector('#section-5 .section-wrapper');

    wrapper.addEventListener('scroll', () => {
        setTimelineNav(wrapper.scrollLeft);
    });

    setTimelineNav(0);
});

function setTimelineNav(pos) {
    const timeline = document.querySelector('#section-5-timeline');
    const contentWidth = timeline.offsetLeft + timeline.offsetWidth - window.innerWidth;
    const contentDivided = contentWidth / 6;

    // Reset all
    const navItems = document.querySelectorAll('#timeline-nav a');

    for (let x = 0; x < navItems.length; x++) {
        document.querySelector('a#timeline-nav-' + (x + 1)).style.opacity = 1;
    }

    // Select item
    var item = 1;

    if (pos >= contentDivided * 5) {
        item = 4;
    } else if (pos >= contentDivided * 3) {
        item = 3;
    } else if (pos >= contentDivided) {
        item = 2
    }

    document.querySelector('a#timeline-nav-' + item).style.opacity = 0.25;
}

function moveTimeline(pos) {
    const timeline = document.querySelector('#section-5-timeline');
    const contentWidth = timeline.offsetLeft + timeline.offsetWidth - window.innerWidth;
    const contentDivided = contentWidth / 3;

    document.querySelector('#section-5 .section-wrapper').scrollTo({
        left: pos === 3 ? contentWidth : pos * contentDivided,
        behavior: 'smooth'
    });
}