'use strict';

/* Global vars */

/* Section 9 */

function walletConnectedMerch() {
    document.querySelector('#section-9-merch-connected').style.display = 'inline'; // Show
    document.querySelector('#section-9-merch-connect').style.display = 'none'; // Hide
}

async function validateMerch9(form) {
    var valid = true;
    var errorMessage = '';
    const submitButton = document.querySelector('input#section-9-merch-submit');
    submitButton.disabled = true;
    const token = parseInt(document.querySelector('input#section-9-merch-token').value);
    const size = document.querySelector('select#section-9-merch-size').value;
    const color = document.querySelector('select#section-9-merch-color').value;

    if (!size) {
        errorMessage += '<p>Please select your size.</p>';
        valid = false;
    }

    if (!color) {
        errorMessage += '<p>Please select a color.</p>';
        valid = false;
    }

    if (!token) {
        errorMessage += '<p>Please enter the token number of your Dour Darcel.</p>';
        valid = false;
    }

    if (!valid) {
        // Form not valid
        toggleOverlay('Form Error', errorMessage);
    } else {
        // Verify
        var verified = false;
        submitButton.value = 'Verifying token...';
        errorMessage = 'Token number not found in your wallet.';
        const address = await getWalletAddress();

        if (address) {
            const asset = await getOSAsset('0x8d609bd201beaea7dccbfbd9c22851e23da68691', token);

            if (asset.owner && asset.owner.address === address) {
                const payPalID = document.querySelector('input[name="hosted_button_id"]');

                if (color === 'Red') {
                    // Loop token traits
                    for (let x = 0; x < asset.traits.length; x++) {
                        if (asset.traits[x].trait_type === 'Legs & Clothes' && asset.traits[x].value === 'Darcel T-Shirt') {
                            verified = true;
                        }
                    }

                    if (!verified) {
                        errorMessage = 'Your Dour Darcel does not have the \'Darcel T-Shirt\' trait.';
                    } else {
                        payPalID.value = '8KWGQW5ZUKBDQ';
                    }
                } else {
                    // Black
                    verified = true;
                    payPalID.value = 'TBC2KCANHSXZ6';
                }
            }
        }

        if (!verified) {
            toggleOverlay('Verification Error', errorMessage);
        } else {
            document.querySelector('input#section-9-merch-wallet-token').value = address + ' ' + token;
            document.querySelector('input#section-9-merch-variant').value = size + ' ' + color;
            //form.submit();
            toggleOverlay('Sold Out!', 'Wen more apparel? Soon!);
        }
    }

    submitButton.disabled = false;
    submitButton.value = 'Purchase';
}