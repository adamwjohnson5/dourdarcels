'use strict';

/* Global vars */

/* Section 9 */

function walletConnectedMerch() {
    document.querySelector('#section-9-connected').style.display = 'inline-block'; // Show
    document.querySelector('#section-9-connect').style.display = 'none'; // Hide
}

async function validateMerch9(form) {
    var valid = true;
    var errorMessage = '';
    const submitButton = document.querySelector('input#section-9-merch-submit');
    submitButton.disabled = true;
    const size = document.querySelector('select#section-9-merch-size').value;

    if (!size) {
        errorMessage += '<p>Please select your size.</p>';
        valid = false;
    }

    if (!valid) {
        // Form not valid
        toggleOverlay('Form Error', errorMessage);
    } else {
        // Verify
        var verified = false;
        submitButton.value = 'Verifying...';
        errorMessage = 'Dour Darcel not found in your wallet.';
        const address = await getWalletAddress();

        // Get DD from wallet using Alchemy
        const darcels = await getData(`https://eth-mainnet.alchemyapi.io/v2/kA0GvyDvzb_9brFE0cU4YM5cKdbdmWe9/getNFTs/?owner=${ address }&contractAddresses[]=0x8d609bd201beaea7dccbfbd9c22851e23da68691`);
        const nfts = darcels.ownedNfts;
        const colette = await getData(`https://eth-mainnet.alchemyapi.io/v2/kA0GvyDvzb_9brFE0cU4YM5cKdbdmWe9/getNFTs/?owner=${ address }&contractAddresses[]=0x6d93d3fd7bb8baebf853be56d0198989db655e40`);

        // All Colette owners eligible
        if (colette.ownedNfts.length > 0) {
            verified = true;
        }

        if (nfts.length > 0 && !verified) {
            // Loop tokens
            for (let x = 0; x < nfts.length; x++) {
                let traits = nfts[x].metadata.attributes;

                // Loop traits
                for (let x = 0; x < traits.length; x++) {
                    if (traits[x].trait_type === 'Hair & Hats' && traits[x].value === 'Gray Cap') {
                        verified = true;
                    }
                }
            }

            if (!verified) {
                errorMessage = 'Your Dour Darcel does not have the \'Gray Cap\' trait.';
            }
        }

        if (!verified) {
            toggleOverlay('Verification Error', errorMessage);
        } else {
            document.querySelector('input#section-9-merch-wallet').value = address;
            document.querySelector('input#section-9-merch-size').value = size;
            form.submit();
            //toggleOverlay('Sold Out!', 'Wen more apparel? Soon!');
        }
    }

    submitButton.disabled = false;
    submitButton.value = 'Purchase';
}