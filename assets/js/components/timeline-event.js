'use strict';

class TimelineEvent extends HTMLElement {
    connectedCallback() {
        const template = document.querySelector('#timeline-event');
        const clone = template.content.cloneNode(true);
        clone.querySelector('.event').classList.add('event-' + this.getAttribute('pos'));
        clone.querySelector('h4 span').textContent = this.getAttribute('name');
        const img = clone.querySelector('img');
        img.src = '/assets/img/' + this.getAttribute('src');
        img.alt = this.getAttribute('name');
        this.appendChild(clone);

        // Has link
        if (this.getAttribute('href')) {
            this.classList.add('timeline-event-link');

            this.querySelector('span.big-button').addEventListener('click', () => {
                window.open(this.getAttribute('href'), '_blank');
            });

            this.querySelector('img').addEventListener('click', () => {
                window.open(this.getAttribute('href'), '_blank');
            });
        }
    }
}

// Register components
customElements.define('timeline-event', TimelineEvent);