function passwordMatch() {
    const newPasswored = document.getElementById('newPassword').value;
    const confirmPasswored = document.getElementById('confirmPassword').value;
    const msgId = document.getElementById('matchResult');
    const submitBtn = document.getElementById('submitButton');
    if(newPasswored.length > 0 & confirmPasswored.length > 0) {
        if(newPasswored == confirmPasswored) {
            msgId.innerHTML = `&nbsp;<span class="text-success">Password matching</span>`;
            submitBtn.disabled = false;
        }else {
            msgId.innerHTML = `&nbsp;<span class="text-danger">Password not matching</span>`;
            submitBtn.disabled = true;
        }
    }
}