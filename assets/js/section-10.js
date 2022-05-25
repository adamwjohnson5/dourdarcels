'use strict';

/* Global vars */

window.portalIPFS;
window.portalBg;
window.generateDate;
window.imgURL;

/* Section 10 */

async function walletConnectedPortal() {
    document.querySelector('#section-10-connected').style.display = 'inline-block'; // Show
    document.querySelector('#section-10-connect').style.display = 'none'; // Hide
    const container = document.querySelector('#section-10-portal-darcels');
    const format = document.querySelector('select#section-10-portal-format');

    // Get DD from wallet
    const darcels = await getData(`https://eth-mainnet.alchemyapi.io/v2/kA0GvyDvzb_9brFE0cU4YM5cKdbdmWe9/getNFTs/?owner=${ await getWalletAddress() }&contractAddresses[]=0x8d609bd201beaea7dccbfbd9c22851e23da68691`);
    const nfts = darcels.ownedNfts;

    if (nfts.length > 0) {
        // Loop Darcels
        for (let x = 0; x < nfts.length; x++) {
            let title = nfts[x].title;
            let thumb = document.createElement('a');
            thumb.title = title;
            thumb.classList.add('section-10-portal-thumb');
            thumb.innerHTML = `<img src="https://traitmatch.s3.us-west-1.amazonaws.com/dourdarcels/${ title.replace('Dour Darcel #', '') }.png" alt="${ title }" />`;
            container.appendChild(thumb);

            thumb.addEventListener('click', (e) => {
                let thumbs = container.querySelectorAll('a');

                // Reset all
                for (let x = 0; x < thumbs.length; x++) {
                    thumbs[x].classList.remove('selected');
                }

                thumb.classList.add('selected'); // Select
                format.classList.add('enabled');
                format.value = ''; // Reset
                toggleGenerateButton('remove', 'enabled', '');
                window.portalIPFS = nfts[x].media[0].gateway;
                window.portalBg = nfts[x].metadata.attributes[0].value;
            });
        }
    } else {
        container.innerHTML = '<p>No Dour Darcels found :-(<br /><br /><a href="https://opensea.io/collection/dourdarcels" target="_blank">View on OpenSea</a></p>';
    }

    // Format
    format.addEventListener('change', async (e) => {
        const val = e.currentTarget.value.toLowerCase();

        if (val !== '') {
            toggleGenerateButton('add', 'enabled', '');
            document.querySelector('img#section-10-portal-preview-template').src = `assets/img/portal-${ val }.png`;
        } else {
            toggleGenerateButton('remove', 'enabled', '');
            document.querySelector('img#section-10-portal-preview-template').src = `assets/img/portal.gif`;
        }
    });
}

function test() {
    if (navigator.share) {
        navigator.share({
          title: 'WebShare API Demo',
          url: window.imgURL
        }).then(() => {
          console.log('Thanks for sharing!');
        })
        .catch(console.error);
      } else {

      }
}

function toggleGenerateButton(action, style, text) {
    const generate = document.querySelector('a#section-10-portal-generate');

    if (action === 'add') {
        generate.classList.add(style);
    } else {
        generate.classList.remove(style);

        if (style === 'enabled') {
            generate.classList.remove('wait');
        }
    }

    generate.textContent = text ? text : 'Generate';
}

async function portalGenerate() {
    const date = Date.now()
    window.generateDate = date;

    try {
        toggleGenerateButton('add', 'wait', 'Please wait...');
        const format = document.querySelector('select#section-10-portal-format').value;
        const canvas = document.querySelector(format === 'Phone' ? 'canvas#section-10-portal-canvas-y' : 'canvas#section-10-portal-canvas-x');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Reset

        // PFP
        var img = new Image();
        img.setAttribute('crossOrigin', '*');

        img.onload = () => {
            if (window.generateDate === date) {
                ctx.drawImage(img, format === 'Phone' ? 0 : 1800, format === 'Phone' ? 1800 : 0, 1800, 1800);
            }
        };

        img.src = window.portalIPFS;
        await img.decode(); // Wait until image finished loading

        if (window.generateDate === date) {
            // Bg
            var bg = new Image();
            bg.setAttribute('crossOrigin', '*');

            bg.onload = () => {
                if (window.generateDate === date) {
                    ctx.save();
                    ctx.scale(format === 'Phone' ? 1 : -1, format === 'Phone' ? -1 : 1);
                    ctx.drawImage(bg, 0, 0, format === 'Phone' ? 1800 : 1800 * -1, format === 'Phone' ? 1800 * -1 : 1800);

                    if (format !== 'Phone') {
                        ctx.drawImage(bg, -5400, 0, 1800, 1800);
                    }

                    ctx.restore();
                    document.querySelector('img#section-10-portal-preview-file').src = canvas.toDataURL('image/png'); // Set preview
                    window.imgURL = canvas.toDataURL('image/png');
                    toggleGenerateButton('remove', 'wait', '');
                }
            };

            bg.src = `https://dourdarcels.s3.amazonaws.com/bg/${ window.portalBg.toLowerCase().replace(/ /g, '_') }.png`;
            await img.decode(); // Wait until image finished loading
        }
    } catch (error) {
        //console.error(error);
        if (window.generateDate === date) {
            toggleOverlay('Error', 'Argh sorry! Something went wrong. Please try again.');
            toggleGenerateButton('remove', 'wait', '');
        }
    }
}