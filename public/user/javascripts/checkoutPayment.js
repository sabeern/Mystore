function showAddress(status) {
    const addressElement = document.getElementById('newAddress');
    if(status == 0) {
        addressElement.style.display = 'block';
        document.getElementById('selectedAddressNew').checked = true;
    }else {
        addressElement.style.display = 'none';
    }
}
function submitCheckout() {
    const fullName = document.getElementById('fullName').value;
    const mobileNumber  = document.getElementById('mobileNumber').value;
    const pincode = document.getElementById('pincode').value;
    const locality = document.getElementById('locality').value;
    const address = document.getElementById('address').value;
    const district = document.getElementById('district').value;
    const state = document.getElementById('state').value;
    const orderNote = document.getElementById('orderNote').value;
    const paymentMethod = $("input[type='radio'][name='paymentMethod']:checked").val();
    const cartId = document.getElementById('cartId').value;
    const deliveryDate = $("input[type='radio'][name='deliveryDate']:checked").val();
    const totalAmount = document.getElementById('totalAmount').value;
    const selectedAddress = $("input[type='radio'][name='selectedAddress']:checked").val();
    const deliveryCharge = document.getElementById('deliveryCharge').value;
    fetch('/gp/checkout/placeorder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selectedAddress,fullName,mobileNumber,pincode,locality,address,district,state,orderNote,paymentMethod,cartId,deliveryDate,totalAmount,deliveryCharge })
}).then(res => res.json()).then(data => {
    if(data.msg == 'COD') {
        window.location = '/gp/checkout/orderSuccess';
        return false;
    }else {
        razerpayFunction(data.options,data.userDetails,data.orderId);
    }
});
}

function razerpayFunction(payDetails,userDetails,orderId) {
var options = {
"key": "rzp_test_WQBVHxOppgqaxl", 
"amount": payDetails.amount, 
"currency": "INR",
"name": "MyStore",
"description": "MyStore Payment",
"image": "http://localhost:3000/user/img/logo.png",
"order_id": orderId,
"handler": function (response){
    paymentSuccess(response,payDetails,userDetails.cartId,orderId);
},
"prefill": {
    "name": userDetails.fullName,
    "email": userDetails.userEmail,
    "contact": userDetails.mobileNumber
},
"notes": {
    "address": userDetails.address
},
"theme": {
    "color": "#3399cc"
}
};
var rzp1 = new Razorpay(options);
rzp1.on('payment.failed', function (response){
window.location = '/gp/checkout/paymentFail';
});
rzp1.open();
e.preventDefault();
}
function paymentSuccess(response,payDetails,cartId,orderId) {
fetch('/gp/checkout/paymentSuccess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ response,payDetails,cartId,orderId })
}).then(res => res.json()).then(data => {
    if(data.paymentStatus == 'success') {
        console.log(data.paymentStatus)
        window.location = '/gp/checkout/orderSuccess';
    }else {
        window.location = '/gp/checkout/paymentFail';
    }
});
}