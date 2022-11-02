function validateCheckout() {
    let delFlag = 0;
    let deliveryDate,paymentType;
    deliveryDate = $("input[type='radio'][name='deliveryDate']:checked").val();
    const selectedAddress = $("input[type='radio'][name='selectedAddress']:checked").val();
    if(!deliveryDate) {
        delFlag = 1;
        document.getElementById('deliveryDateErr').innerHTML = '* required';
    }else {
        document.getElementById('deliveryDateErr').innerHTML = '';
    }
    if(selectedAddress == 'new') {
        let fullName = document.getElementById('fullName').value;
        fullName = fullName.trim();
        if(fullName.length < 1) {
            delFlag = 1;
            document.getElementById('nameErr').innerHTML = '* required';
        }else {
            document.getElementById('nameErr').innerHTML = '*';
        }
        let mobileNumber = document.getElementById('mobileNumber').value;
        mobileNumber = mobileNumber.trim();
        if(mobileNumber.length < 1) {
            delFlag = 1;
            document.getElementById('mobileErr').innerHTML = '* required';
        }else if(!mobileNumber.match(/^\d{10}$/)){
            document.getElementById('mobileErr').innerHTML = '* valied number required';
        }else {
            document.getElementById('mobileErr').innerHTML = '*';
        }
        let pincode = document.getElementById('pincode').value;
        pincode = pincode.trim();
        if(pincode.length < 1) {
            delFlag = 1;
            document.getElementById('pinErr').innerHTML = '* required';
        }else {
            document.getElementById('pinErr').innerHTML = '*';
        }
        let locality = document.getElementById('locality').value;
        locality = locality.trim();
        if(locality.length < 1) {
            delFlag = 1;
            document.getElementById('localityerr').innerHTML = '* required';
        }else {
            document.getElementById('localityerr').innerHTML = '*';
        }
        let address = document.getElementById('address').value;
        address = address.trim();
        if(address.length < 1) {
            delFlag = 1;
            document.getElementById('addressErr').innerHTML = '* required';
        }else {
            document.getElementById('addressErr').innerHTML = '*';
        }
        let district = document.getElementById('address').value;
        district = district.trim();
        if(district.length < 1) {
            delFlag = 1;
            document.getElementById('districtErr').innerHTML = '* required';
        }else {
            document.getElementById('districtErr').innerHTML = '*';
        }
        let state = document.getElementById('address').value;
        state = state.trim();
        if(state.length < 1) {
            delFlag = 1;
            document.getElementById('stateErr').innerHTML = '* required';
        }else {
            document.getElementById('stateErr').innerHTML = '*';
        }
    }
    paymentType = $("input[type='radio'][name='paymentMethod']:checked").val();
    if(!paymentType) {
        delFlag = 1;
        document.getElementById('paymentErr').innerHTML = '* required';
    }else {
        document.getElementById('paymentErr').innerHTML = '';
    }
    if(delFlag == 1) {
        document.getElementById('errMsg').innerHTML = `<div class="alert alert-danger" role="alert">
                                                        Please Fill Required Fields</div>`;
        return false;
    }else {
        document.getElementById('errMsg').innerHTML = '';
        submitCheckout();
    }
}