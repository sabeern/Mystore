function addToWishlist(productId) {
    fetch('/gp/addToWishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId })
    }).then(res => res.json()).then(data => {
        if(data.msg) {
            document.getElementById('itemAddMessage').innerHTML=`<div class="alert alert-danger text-center" role="alert" style="display:block;position:fixed;width:100%;z-index: 100;">
                                <b>${data.msg}</b></div>`;
                setTimeout(hideMessage,3000);
        }
        if(data.cartCount.length > 0) {
            document.getElementById('itemAddMessage').innerHTML=`<div class="alert alert-success text-center" role="alert" style="display:block;position:fixed;width:100%;z-index: 100;">
                                <b>Item Added To Wishlist</b></div>`;
        setTimeout(hideMessage,3000);
        document.getElementById('wishListCount').innerHTML = `<span>${data.cartCount[0].count}</span>`;
        }else {
            document.getElementById('wishListCount').innerHTML = '';
        }
    });
}

function hideMessage() {
    document.getElementById('itemAddMessage').innerHTML='';
}

function removeWhishlistItem(productId) {
    fetch('/gp/removeFromWhishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
    }).then(res => res.json()).then(data => {
        window.location = '/gp/wishlist';
    });
    }