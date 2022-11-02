function searchOrder() {
    let orderId = document.getElementById('commonSearchContent').value;
        orderId = orderId.trim();
    fetch('/admin/order/searchOrder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId })
    }).then(res => res.json()).then(data => {
        if(data.objectId) {
            document.getElementById('searchResult').innerHTML = '';
            window.location = '/admin/order/viewOrder/'+data.objectId;
        }else {
            document.getElementById('searchResult').innerHTML = data.message;
        }
    });
}