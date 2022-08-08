'use strict';

/* Global vars */

window.portalToken;
window.portalBg;
window.portalTitle;
window.generateDate;

/* Section 10 */

async function walletConnectedPortal() {
    document.querySelector('#section-10-connected').style.display = 'inline-block'; // Show
    document.querySelector('#section-10-connect').style.display = 'none'; // Hide
    const container = document.querySelector('#section-10-portal-darcels');
    const format = document.querySelector('select#section-10-portal-format');

    if (window.touchScreen) {
        container.style.display = 'none';
        format.style.display = 'none';
        document.querySelector('p#section-10-portal-note').style.display = 'none';
        document.querySelector('a#section-10-portal-download').style.display = 'none';
        document.querySelector('p#section-10-portal-instructions').textContent = 'Unfortunately the MetaMask app is not compatible with the portal. Please use a desktop browser instead.';
    }

    // Get DD from wallet using Alchemy
    var nfts = [];

    try {
        const darcels = await getData(`https://eth-mainnet.alchemyapi.io/v2/kA0GvyDvzb_9brFE0cU4YM5cKdbdmWe9/getNFTs/?owner=${ await getWalletAddress() }&contractAddresses[]=0x8d609bd201beaea7dccbfbd9c22851e23da68691`);
        nfts = darcels.ownedNfts;
    } catch (error) {
        console.log(error);
    }

    if (nfts.length > 0) {
        // Loop Darcels
        for (let x = 0; x < nfts.length; x++) {
            let title = nfts[x].title;
            let thumb = document.createElement('a');
            thumb.title = title;
            thumb.classList.add('section-10-portal-thumb');
            let img = document.createElement('img');
            img.src = `https://traitmatch.s3.us-west-1.amazonaws.com/dourdarcels/${ title.replace('Dour Darcel #', '') }.png`;
            img.alt = title;
            thumb.appendChild(img);
            container.appendChild(thumb);

            thumb.addEventListener('click', () => {
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
                window.portalToken = title.replace('Dour Darcel #', '');
                //window.portalToken = nfts[x].media[0].gateway;
                window.portalBg = nfts[x].metadata.attributes[0].value;
                window.portalTitle = title;
            });
        }
    } else {
        container.innerHTML = '<p>No Dour Darcels found :-(<br /><br /><a href="https://opensea.io/collection/dourdarcels" target="_blank">View on OpenSea</a></p>';
    }

    // Format
    format.addEventListener('change', async (e) => {
        const download = document.querySelector('a#section-10-portal-download');
        download.setAttribute('target', '_self');
        const val = e.currentTarget.value;
        window.generateDate = Date.now();

        if (val === 'hi-res') {
            download.href = `https://dourdarcels.s3.amazonaws.com/hires/${ window.portalToken }.png`;
            download.setAttribute('target', '_blank');
            portalToggleDownload('enabled');
        } else if (val === 'theme') {
            download.href = 'https://dourdarcels.s3.amazonaws.com/audio/Dour+Darcels+Theme+Song.mp3.zip';
            download.setAttribute('download', 'Dour Darcels Theme Song');
            portalToggleDownload('enabled');
        } else if (val !== '') {
            portalGenerate(val);
        } else {
            portalToggleDownload();
        }
    });
}

function portalToggleDownload(action) {
    const download = document.querySelector('a#section-10-portal-download');

    // Reset
    download.classList.remove('wait');
    download.classList.remove('enabled');

    // Set
    download.textContent = action === 'wait' ? 'Generating...' : 'Download';

    if (action) {
        download.classList.add(action);
    }
}

async function portalGenerate(format) {
    const date = window.generateDate;
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

        img.src = `https://dourdarcels.s3.amazonaws.com/token/${ window.portalToken }.png`;
        //img.src = `${ window.portalIPFS.replace('ipfs.io', 'cloudflare-ipfs.com') }?date=${ date }`;
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
                            ctx.drawImage(bg, 0, -1800, 1800, 1800);
                            break;
                        case 'tablet':
                            ctx.scale(1, -1);
                            ctx.drawImage(bg, 1800, -1800, 1800, 1800); // TC
                            ctx.setTransform(1, 0, 0, 1, 0, 0); // Restore context
                            ctx.scale(-1, -1);
                            ctx.drawImage(bg, -1800, -1800, 1800, 1800); // TL
                            ctx.drawImage(bg, -5400, -1800, 1800, 1800); // TR
                            ctx.setTransform(1, 0, 0, 1, 0, 0); // Restore context
                            ctx.scale(-1, 1);
                            ctx.drawImage(bg, -1800, 1800, 1800, 1800); // BL
                            ctx.drawImage(bg, -5400, 1800, 1800, 1800); // BR
                            break;
                        case 'banner':
                            ctx.drawImage(bg, 0, 0, 1800, 1800);
                            ctx.scale(-1, 1);
                            ctx.drawImage(bg, -3600, 0, 1800, 1800);
                            ctx.setTransform(1, 0, 0, 1, 0, 0); // Restore context
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
                            ctx.drawImage(bg, -900, 0, 1800, 1800);
                            ctx.drawImage(bg, -4500, 0, 1800, 1800);
                    }

                    ctx.restore();
                }
            };

            bg.src = `https://dourdarcels.s3.amazonaws.com/bg/${ window.portalBg.toLowerCase().replace(/ /g, '_') }.png?date=${ date }`;
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
            document.querySelector('select#section-10-portal-format').value = ''; // Reset
            portalToggleDownload();
        }
    }
}