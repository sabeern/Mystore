const editElement = document.getElementById('edit');
        const nameTextbox = document.getElementById('fullName');
        const gender1 = document.getElementById('gender1');
        const gender2 = document.getElementById('gender2');
        const gender3 = document.getElementById('gender3');
        const emailTextbox = document.getElementById('email');
        const mobileTextbox = document.getElementById('mobile');
        const submitButton = document.getElementById('submitBtn');
        editElement.addEventListener('click',()=> {
            const editTextbox = document.getElementById('editType');
            const editType = editTextbox.value;
            if(editType == 0) {
                nameTextbox.readOnly = false;
                gender1.disabled = false;
                gender2.disabled = false;
                gender3.disabled = false;
                emailTextbox.readOnly = false;
                mobileTextbox.readOnly = false;
                editElement.innerHTML = `<span class="text-primary" style="cursor:pointer">&nbsp; Cancel</span>`;
                editTextbox.value = 1;
                submitButton.disabled = false;
            }else {
                nameTextbox.readOnly = true;
                gender1.disabled = true;
                gender2.disabled = true;
                gender3.disabled = true;
                emailTextbox.readOnly = true;
                mobileTextbox.readOnly = true;
                editElement.innerHTML = `<span class="text-primary" style="cursor:pointer">&nbsp; Edit</span>`;
                editTextbox.value = 0;
                submitButton.disabled = true;
            }
        });
function validateProfile() {
    let errFlag = 0;
    let fullName = document.getElementById('fullName').value;
    fullName = fullName.trim();
    if(fullName.length < 1) {
        errFlag = 1;
        document.getElementById('nameErr').innerHTML = '* required';
    }else {
        document.getElementById('nameErr').innerHTML = '';
    }
    let email = document.getElementById('email').value;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    email = email.trim();
    if(email.length < 1 ) {
        errFlag = 1;
        document.getElementById('EmailErr').innerHTML = '* required';
    }else if(!email.match(emailRegex)) {
        errFlag = 1;
        document.getElementById('EmailErr').innerHTML = '* required valid email';
    }else {
        document.getElementById('EmailErr').innerHTML = '';
    }
    if(errFlag == 1) {
        return false;
    }
}