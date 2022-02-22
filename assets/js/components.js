'use strict';

export class TimelineEvent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `</div><div class="event event-${ this.getAttribute('pos') }"><div class="event-line"></div><h4><span class="big-button">${ this.getAttribute('name') }</span></h4><img src="assets/img/${ this.getAttribute('src') }" alt="${ this.getAttribute('name') }" /></div><div class="event-pupil">`;

        // Has link
        if (this.getAttribute('href')) {
            this.classList.add('timeline-event-link');

            this.querySelector('span.big-button').addEventListener('click', (e) => {
                window.open(this.getAttribute('href'), '_blank');
            });

            this.querySelector('img').addEventListener('click', (e) => {
                window.open(this.getAttribute('href'), '_blank');
            });
        }
    }
}

// Register components
customElements.define('timeline-event', TimelineEvent);