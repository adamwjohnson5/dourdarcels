'use strict';

export class TimelineEvent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<div class="event-pupil"></div><div class="event event-${ this.getAttribute('pos') }"><div class="event-line"></div><h4><span class="big-button">${ this.getAttribute('name') }</span></h4><img src="assets/img/${ this.getAttribute('src') }" alt="${ this.getAttribute('name') }" /></div>`;
    }
}

// Register components
customElements.define('timeline-event', TimelineEvent);