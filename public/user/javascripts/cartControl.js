function decQuantity(productId) {
    const quantityTextbox  = document.getElementById(productId);
    const price = document.getElementById('price'+productId).value;
    const sumTextbox = document.getElementById('grandTotalTextbox');
    const selectedQuantity = quantityTextbox.value;
    quantityTextbox.value = Number(selectedQuantity)-1;
    if((Number(selectedQuantity)-1) == 0) {
        removeItem(productId);
        return false;
    }
    let newSum = (Number(selectedQuantity)-1)*Number(price);
    let nowTotal = sumTextbox.value;
    let newTotal = Number(nowTotal)-Number(price);
    sumTextbox.value = newTotal;
    let deliveryCharge;
    document.getElementById('eachTotal'+productId).innerHTML = (newSum).toFixed(2);
    document.getElementById('subTotal').innerHTML = '₹'+(newTotal).toFixed(2);
    if(newTotal <= 99) {
        deliveryCharge = 50;
        document.getElementById('deliveryPrice').innerHTML = `<span>₹50<span>`;
    }else {
        deliveryCharge = 0;
        document.getElementById('deliveryPrice').innerHTML = `<span class="text-success"><b>Free</b><span>`;
    }
    document.getElementById('total').innerHTML = '₹'+(newTotal+deliveryCharge).toFixed(2);
    fetch('/gp/lessFromCart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId })
}).then(res => res.json()).then(data => {
    console.log('done');
});
}
function incQuantity(productId) {
    const quantityTextbox  = document.getElementById(productId);
    const price = document.getElementById('price'+productId).value;
    const sumTextbox = document.getElementById('grandTotalTextbox');
    const selectedQuantity = quantityTextbox.value;
    quantityTextbox.value = Number(selectedQuantity)+1;
    let newSum = (Number(selectedQuantity)+1)*Number(price);
    let nowTotal = sumTextbox.value;
    let newTotal = Number(nowTotal)+Number(price);
    sumTextbox.value = newTotal;
    document.getElementById('eachTotal'+productId).innerHTML = (newSum).toFixed(2);
    document.getElementById('subTotal').innerHTML = '₹'+(newTotal).toFixed(2);
    if(newTotal <= 99) {
        deliveryCharge = 50;
        document.getElementById('deliveryPrice').innerHTML = `<span>₹50<span>`;
    }else {
        deliveryCharge = 0;
        document.getElementById('deliveryPrice').innerHTML = `<span class="text-success"><b>Free</b><span>`;
    }
    document.getElementById('total').innerHTML = '₹'+(newTotal+deliveryCharge).toFixed(2);
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
});
}
function removeItem(productId) {
fetch('/gp/removeFromCart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId })
}).then(res => res.json()).then(data => {
    window.location = '/gp/cart';
});
}