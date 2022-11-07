function changeId(couponId) {
    document.getElementById('couponId').value = couponId;
}
const element = document.getElementById("confirmButton");
element.addEventListener("click", function () {
let couponId = document.getElementById('couponId').value;
fetch('/admin/coupon/deleteCoupon', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponId })
        }).then(res => res.json()).then(data => {
            window.location = '/admin/coupon/couponList';
        });
});

function validateCoupon() {
    let errFlag = 0;
    let couponCode = document.getElementById('couponCode').value;
    couponCode = couponCode.trim();
    if(couponCode.length < 1) {
        errFlag = 1;
        document.getElementById('couponCodeErr').innerHTML = '* required';
    }else {
        document.getElementById('couponCodeErr').innerHTML = '';
    }
    let minPurchaseAmount = document.getElementById('minPurchaseAmount').value;
    minPurchaseAmount = minPurchaseAmount.trim();
    if(minPurchaseAmount.length < 1) {
        errFlag = 1;
        document.getElementById('purchaseAmountErr').innerHTML = '* required';
    }else {
        document.getElementById('purchaseAmountErr').innerHTML = '';
    }
    let couponPercentage = document.getElementById('couponPercentage').value;
    couponPercentage = couponPercentage.trim();
    if(couponPercentage.length < 1) {
        errFlag = 1;
        document.getElementById('percentageErr').innerHTML = '* required';
    }else if(couponPercentage > 50) {
        errFlag = 1;
        document.getElementById('percentageErr').innerHTML = '* more than 50 not allowed';
    }
    else {
        document.getElementById('percentageErr').innerHTML = '';
    }
    let maxLimit = document.getElementById('maxLimit').value;
    maxLimit = maxLimit.trim();
    if(maxLimit.length < 1) {
        errFlag = 1;
        document.getElementById('maxLimitErr').innerHTML = '* required';
    }else {
        document.getElementById('maxLimitErr').innerHTML = '';
    }
    let expiryDate = document.getElementById('expiryDate').value;
    expiryDate = expiryDate.trim();
    if(expiryDate.length < 1) {
        errFlag = 1;
        document.getElementById('expiryDateErr').innerHTML = '* required';
    }else if(new Date() > new Date(expiryDate)){
        errFlag = 1;
        document.getElementById('expiryDateErr').innerHTML = '* select a valid date';
    }
    else{
        document.getElementById('expiryDateErr').innerHTML = '';
    }
    if(errFlag == 1) {
        return false;
    }
}