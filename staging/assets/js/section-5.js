'use strict';

/* Global vars */

/* Section 5 */

document.addEventListener('DOMContentLoaded', () => {
    // Scroll
    window.addEventListener('scroll', () => {
        initEvents(window.pageYOffset);
    });

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
        navItems[x].style.opacity = 1;
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

function initEvents(pos) {
    const section = document.querySelector('section#section-5');
    const timeline = document.querySelector('#section-5-timeline');

    if (section.style.opacity === '1' && !timeline.style.visibility && pos >= section.offsetTop - window.innerHeight + (section.offsetHeight / 2)) {
        timeline.style.visibility = 'visible';
        showEvent(0);
    }
}

function showEvent(count) {
    const timeline = document.querySelector('#section-5-timeline');
    const event = timeline.children[count];
    var interval = 250;

    // Animate
    if (event.tagName === 'H3') {
        // Heading
        event.style.transform = 'scale(1)';
        interval = 300;
    } else if (event.tagName === 'DIV') {
        // Line
        event.style.width = '160px';
        interval = 150;
    } else {
        // Event
        event.style.transform = 'scale(1)';

        setTimeout(() => {
            event.querySelector('.event').style.opacity = 1;
            const bottomEvent = event.querySelector('.event-bottom');

            if (bottomEvent) {
                // Bottom
                bottomEvent.style.marginTop = '32px';
            } else {
                // Top
                event.querySelector('.event').style.marginTop = 0;
            }
        }, interval);
    }

    // Wait for animation to finish
    setTimeout(() => {
        if (count < timeline.children.length - 1) {
            // Next event
            showEvent(count + 1);
        }
    }, 250);
}