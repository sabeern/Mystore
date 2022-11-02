function addToCart(productId) {
    fetch('/gp/addToCart', {
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
                                <b>Item Added To Cart</b></div>`;
        setTimeout(hideMessage,3000);
        document.getElementById('cartCount').innerHTML = `<span>${data.cartCount[0].count}</span>`;
        }else {
            document.getElementById('cartCount').innerHTML = '';
        }
    });
}
function changeQuantity(operation) {
    const quantityField = document.getElementById('quantity');
    let currentQuantity = Number(quantityField.value);
    if(currentQuantity == 1 & operation == 'sub') {
        return false;
    }
    if(operation == 'add') {
        ++currentQuantity;
    }else {
        --currentQuantity;
    }
    quantityField.value = currentQuantity;
}
function addQuantityToCart(productId,type) {
    let productQuantity;
if(type == 'cart') {
    productQuantity = document.getElementById('quantity').value;
}else {
    productQuantity = 1;
}
fetch('/gp/addToCart', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ productId,productQuantity })
}).then(res => res.json()).then(data => {
    if(data.msg) {
        alert(data.msg);
    }
    if(type == 'buy') {
        window.location = '/gp/cart';
    }
    if(data.cartCount.length > 0) {
        document.getElementById('itemAddMessage').innerHTML=`<div class="alert alert-success text-center" role="alert" style="display:block;position:fixed;width:100%;z-index: 100;">
                            <b>Item Added To Cart</b></div>`;
    setTimeout(hideMessage,3000);
    document.getElementById('cartCount').innerHTML = `<span>${data.cartCount[0].count}</span>`;
    }else {
        document.getElementById('cartCount').innerHTML = '';
    }
});
}
function hideMessage() {
    document.getElementById('itemAddMessage').innerHTML='';
}