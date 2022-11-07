        const formElemnt = document.getElementById('addAddress');
        function showAddressForm(status) {
            if(status == 1) {
                formElemnt.style.display = 'block';
            }else {
                formElemnt.style.display = 'none';
            }
        }
    function validateAddress() {
        let errFlag = 0;
        let fullName = document.getElementById('fullName').value;
            fullName = fullName.trim();
        if(fullName.length < 1) {
            errFlag = 1;
            document.getElementById('nameErr').innerHTML = '*required';
        }else {
            document.getElementById('nameErr').innerHTML = '';
        }
        let mobile = document.getElementById('mobile').value;
            mobile = mobile.trim();
        if(mobile.length < 1) {
            errFlag = 1;
            document.getElementById('mobileErr').innerHTML = '*required';
        }else if(!mobile.match(/^\d{10}$/)){
            document.getElementById('mobileErr').innerHTML = '* valied number required';
        }else {
            document.getElementById('mobileErr').innerHTML = '';
        }
        let pincode = document.getElementById('pincode').value;
            pincode = pincode.trim();
        if(pincode.length < 1) {
            errFlag = 1;
            document.getElementById('pinErr').innerHTML = '*required';
        }else if(!pincode.match(/[0-9]/g)) {
            document.getElementById('pinErr').innerHTML = '*required valid pincode';
        }else {
            document.getElementById('pinErr').innerHTML = '';
        }
        let locality = document.getElementById('locality').value;
            locality = locality.trim();
        if(locality.length < 1) {
            errFlag = 1;
            document.getElementById('localityErr').innerHTML = '*required';
        }else {
            document.getElementById('localityErr').innerHTML = '';
        }
        let address = document.getElementById('address').value;
            address = address.trim();
        if(address.length < 1) {
            errFlag = 1;
            document.getElementById('addressErr').innerHTML = '*required';
        }else {
            document.getElementById('addressErr').innerHTML = '';
        }
        let district = document.getElementById('district').value;
            district = district.trim();
        if(district.length < 1) {
            errFlag = 1;
            document.getElementById('districtErr').innerHTML = '*required';
        }else {
            document.getElementById('districtErr').innerHTML = '';
        }
        let state = document.getElementById('state').value;
            state = state.trim();
        if(state.length < 1) {
            errFlag = 1;
            document.getElementById('stateErr').innerHTML = '*required';
        }else {
            document.getElementById('stateErr').innerHTML = '';
        }
        if(errFlag == 1) {
            return false;
        }
    }