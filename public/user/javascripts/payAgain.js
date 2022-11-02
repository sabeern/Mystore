function cancelOrder(orderId) {
    document.getElementById('orderId').value = orderId;
}
function payAgain(orderId) {
    fetch('/account/myorder/payagain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
    }).then(res => res.json()).then(data => {
        razerpayFunction(data.options,data.userDetails,data.orderId);
    });
}
