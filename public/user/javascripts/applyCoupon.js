function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value;
    const totalAmount = document.getElementById('totalAmount').value;
    fetch('/admin/coupon/applyCoupon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ couponCode,totalAmount })
            }).then(res => res.json()).then(data => {
                if(data.errMsg) {
                    document.getElementById('couponErr').innerHTML = data.errMsg;
                    document.getElementById('couponCode').value = '';
                    return false;
                }else {
                    document.getElementById('discountAmount').innerHTML = '₹'+(data.discount).toFixed(2);
                    let newTotal = totalAmount-(data.discount);
                    document.getElementById('totalPayable').innerHTML = '₹'+newTotal.toFixed(2);
                    document.getElementById('totalAmount').value = newTotal;
                    document.getElementById('couponDiscount').value = data.discount;
                    document.getElementById('discountDetails').innerHTML = `Discount Amount = ${data.discount} - Net Total = ${newTotal}`;
                    document.getElementById('applyButton').disabled = true;
                    document.getElementById('couponCode').disabled = true;
                    document.getElementById('couponErr').innerHTML = `<span class="text-success">Coupon Applied</span>`;
                }
            });
}