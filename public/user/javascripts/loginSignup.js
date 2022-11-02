function signupValidate() {
    let errFlag = 0,password='',userName='';
    let email = document.getElementById('userEmail').value;
    if(document.getElementById('userPassword')) {
        password = document.getElementById('userPassword').value;
        userName = document.getElementById('userName').value;
    }
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    email = email.trim();
    password = password.trim();
    userName = userName.trim();
    if(email.length < 1 ) {
        errFlag = 1;
        document.getElementById('emailErr').innerHTML = '* required';
    }else if(!email.match(emailRegex)) {
        errFlag = 1;
        document.getElementById('emailErr').innerHTML = 'required valid email';
    }else {
        document.getElementById('emailErr').innerHTML = '';
    }
    if(password.length < 1) {
        errFlag = 1;
        document.getElementById('signupPasswordErr').innerHTML = '* required';
    }else {
        document.getElementById('signupPasswordErr').innerHTML = '';
    }
    if(userName.length < 1) {
        errFlag = 1;
        document.getElementById('signupUsernameErr').innerHTML = '* required';
    }else {
        document.getElementById('signupUsernameErr').innerHTML = '';
    }
    if(errFlag == 1) {
        return false;
    }
}
function loginValidate() {
    let errFlag = 0;
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    email = email.trim();
    password = password.trim();
    if(email.length < 1 ) {
        errFlag = 1;
        document.getElementById('loginEmailErr').innerHTML = '* required';
    }else if(!email.match(emailRegex)) {
        errFlag = 1;
        document.getElementById('loginEmailErr').innerHTML = 'required valid email';
    }else {
        document.getElementById('loginEmailErr').innerHTML = '';
    }
    if(password.length < 1) {
        errFlag = 1;
        document.getElementById('loginPasswordErr').innerHTML = '* required';
    }else {
        document.getElementById('loginPasswordErr').innerHTML = '';
    }
    if(errFlag == 1) {
        return false;
    }else {
        loginCheck();
    }
}
function loginCheck() {
    let userEmail = document.getElementById('loginEmail').value;
    let userPassword = document.getElementById('loginPassword').value;
    let loginMsg = document.getElementById('loginErr');
    fetch('/ap/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, userPassword })
    }).then(res => res.json()).then(data => {
        if (data.resultMsg) {
            loginMsg.innerHTML = data.resultMsg;
        } else {
            location.reload();
        }
    })
}
function refreshModal() {
    const emailField = document.getElementById('userEmail');
    emailField.readOnly = false;
    emailField.value = '';
    document.getElementById('signupBody').innerHTML = '';
    document.getElementById('submitButton').innerHTML = `<input type="button" class="btn btn-primary" id="confirmButton" value="Next" onclick="generateOtp()">`;
}
function generateOtp() {
    const userEmailField = document.getElementById('userEmail');
    const emailErr = document.getElementById('emailErr');
    const signupBody = document.getElementById('signupBody');
    const submitButton = document.getElementById('submitButton');
    let userEmail = userEmailField.value;
    userEmail = userEmail.trim();
    if (userEmail.length < 1) {
        emailErr.innerHTML = 'required *';
        return false;
    } else {
        emailErr.innerHTML = '';
        fetch('/ap/signup/existUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail })
        }).then(res => res.json()).then(data => {
            console.log(data.mailSendErr);
            if(data.mailSendErr) {
                emailErr.innerHTML = 'OTP sending failed';
                return false;
            }else {
                if (data.user) {
                emailErr.innerHTML = 'user already exist';
            } else {
                signupBody.innerHTML = `<div class="col-12"><span id="otpErr" class="text-danger">5 minutes only valid</span><input type="text" name="userOtp" id="userOtp" placeholder="Enter your OTP" required></div>`;
                submitButton.innerHTML = `<input type="button" class="btn btn-primary" onclick="confirmOtp()" value="Next">`;
                userEmailField.readOnly = true;
            }
            }
        })
    }
}
function confirmOtp() {
    const userEmail = document.getElementById('userEmail').value;
    const otpErr = document.getElementById('otpErr');
    const signupBody = document.getElementById('signupBody');
    const submitButton = document.getElementById('submitButton');
    let userOtp = document.getElementById('userOtp').value;
    userOtp = userOtp.trim();
    if (userOtp.length < 4 ) {
        otpErr.innerHTML = 'required valied otp *';
        return false;
    } else {
        otpErr.innerHTML = '';
        fetch('/ap/signup/otpVerify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail, userOtp })
        }).then(res => res.json()).then(data => {
            if (!data.otpUser) {
                otpErr.innerHTML = 'Otp verification failed';
            } else {
                signupBody.innerHTML = `<div class="col-12"><span id="signupUsernameErr" class="text-danger"></span><input type="text" name="userName" id="userName" placeholder="Your full name" required></div>
                                        <div class="col-12"><input type="text" name="userMobile" id="userMobile" placeholder="Your mobile number"></div>
                                        <div class="col-12"><span id="signupPasswordErr" class="text-danger"></span><input type="password" name="userPassword" id="userPassword" placeholder="Your password" required></div>`;
                submitButton.innerHTML = `<input type="submit" class="btn btn-primary" form="signupForm" value="Submit">`;
            }
        })
    }
}