'use strict';

/* Global vars */

window.portalIPFS;
window.portalBg;
window.portalTitle;
window.generateDate;
window.waitInterval;

/* Section 10 */

async function walletConnectedPortal() {
    document.querySelector('#section-10-connected').style.display = 'inline-block'; // Show
    document.querySelector('#section-10-connect').style.display = 'none'; // Hide
    const container = document.querySelector('#section-10-portal-darcels');
    const format = document.querySelector('select#section-10-portal-format');

    if (window.touchScreen) {
        container.style.display = 'none';
        format.style.display = 'none';
        document.querySelector('a#section-10-portal-download').style.display = 'none';
        document.querySelector('#section-10-connected p').textContent = 'Unfortunately the MetaMask app is not compatible with the portal. Please use a desktop browser instead.';
    }

    // Get DD from wallet using Alchemy
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
                portalToggleDownload();
                window.generateDate = Date.now(); // Cancel if generating
                window.portalIPFS = nfts[x].media[0].gateway;
                window.portalBg = nfts[x].metadata.attributes[0].value;
                window.portalTitle = title;
            });
        }
    } else {
        container.innerHTML = '<p>No Dour Darcels found :-(<br /><br /><a href="https://opensea.io/collection/dourdarcels" target="_blank">View on OpenSea</a></p>';
    }

    // Format
    format.addEventListener('change', async (e) => {
        const val = e.currentTarget.value;

        if (val !== '') {
            portalGenerate(val);
        } else {
            window.generateDate = Date.now(); // Cancel if generating
            portalToggleDownload();
        }
    });
}

function portalToggleDownload(action) {
    const download = document.querySelector('a#section-10-portal-download');

    // Reset
    clearInterval(window.waitInterval);
    download.classList.remove('wait');
    download.classList.remove('enabled');
    download.textContent = 'Download';

    if (action === 'wait') {
        download.classList.add('wait');
        download.textContent = 'Please wait...';
        window.waitInterval = setInterval(waitAnimation, 1000);
    } else if (action === 'enabled') {
        download.classList.add('enabled');
    }

    function waitAnimation() {
        download.textContent = download.textContent === 'Please wait...' ? 'Please wait' : download.textContent + '.';
    }
}

async function portalGenerate(format) {
    const date = Date.now();
    window.generateDate = date;
    portalToggleDownload('wait');

    try {
        const canvas = document.querySelector('canvas#section-10-portal-canvas-' + format);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Reset

        // PFP
        var img = new Image();
        img.setAttribute('crossOrigin', '*');

        img.onload = () => {
            if (window.generateDate === date) {
                switch (format) {
                    case 'phone':
                        ctx.drawImage(img, 0, 1800, 1800, 1800);
                        break;
                    case 'tablet':
                        ctx.drawImage(img, 1800, 1800, 1800, 1800);
                        break;
                    case 'banner':
                        ctx.drawImage(img, 3600, 0, 1800, 1800);
                        break;
                    default:
                        // DT
                        ctx.drawImage(img, 900, 0, 1800, 1800);
                }
            }
        };

        img.src = window.portalIPFS.replace('ipfs.io', 'cloudflare-ipfs.com'); // Use Cloudflare gateway
        await img.decode(); // Wait until image finished loading

        if (window.generateDate === date) {
            // Bg
            var bg = new Image();
            bg.setAttribute('crossOrigin', '*');

            bg.onload = () => {
                if (window.generateDate === date) {
                    ctx.save();

                    switch (format) {
                        case 'phone':
                            ctx.scale(1, -1);
                            ctx.drawImage(bg, 0, 0, 1800, 1800 * -1);
                            break;
                        case 'tablet':

                            break;
                        case 'banner':
                            ctx.drawImage(bg, 0, 0, 1800, 1800);
                            ctx.scale(-1, 1);
                            ctx.drawImage(bg, -1800, 0, 1800 * -1, 1800);
                            ctx.setTransform(1, 0, 0, 1, 0, 0); // Restore
                            ctx.letterSpacing = '-12px';
                            ctx.font = '330px itc-avant-garde-gothic-lt-bold';
                            ctx.fillStyle = '#FFF';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(window.portalTitle, 1800, canvas.height / 2);
                            break;
                        default:
                            // DT
                            ctx.scale(-1, 1);
                            ctx.drawImage(bg, 900, 0, 1800 * -1, 1800);
                            ctx.drawImage(bg, -4500, 0, 1800, 1800);
                    }

                    ctx.restore();
                }
            };

            bg.src = `https://dourdarcels.s3.amazonaws.com/bg/${ window.portalBg.toLowerCase().replace(/ /g, '_') }.png`;
            await bg.decode(); // Wait until image finished loading

            if (window.generateDate === date) {
                // Done
                const download = document.querySelector('a#section-10-portal-download');
                download.href = canvas.toDataURL('image/png');
                download.setAttribute('download', window.portalTitle);
                portalToggleDownload('enabled');
            }
        }
    } catch (error) {
        //console.error(error);
        if (window.generateDate === date) {
            toggleOverlay('Error', 'Argh sorry! Something went wrong. Please try again.');
            portalToggleDownload();
        }
    }
}