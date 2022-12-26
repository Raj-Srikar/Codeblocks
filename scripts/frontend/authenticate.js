var loginSelected = true,
login = document.querySelector('#login'),
signup = document.querySelector('#signup'),
home = document.querySelector('.home'),
logo = document.getElementById('logo'),
msgs = document.getElementsByClassName('msg'),
suinps = document.getElementsByClassName('su-inp'),
pass = document.querySelector('input[name="pass"]'),
cnfpass = document.querySelector('input[name="cnfpass"]'),
btn = document.querySelector('input[type="button"]'),
eyes = document.querySelectorAll('.eye');

function showsignup() {
    if (loginSelected) {
        home.style.borderBottomRightRadius = 0;
        login.classList.toggle('selected');
        login.style.borderBottom = '2px solid';
        login.style.borderRight = '2px solid';
        login.style.borderBottomRightRadius = '10px';
        login.style.cursor = 'pointer';
        signup.style.border = 0;
        signup.style.borderBottomLeftRadius = 0;
        signup.classList.toggle('selected');
        logo.style.margin = 0;
        logo.style.marginTop = '2%';
        msgs[0].style.display = 'none';
        msgs[1].style.display = 'block';
        // show signup inputs
        for (let i = 0; i < suinps.length; i++) {
            suinps[i].style.display = 'block';
        }
        
        pass.classList.toggle('login-pass');
        pass.value = '';
        cnfpass.value = '';
        cnfpass.style = '';
        document.querySelectorAll('.focus-input')[3].style = '';
        eyes[0].classList.remove('err-eye');
        let warnings = document.querySelectorAll('.warning');
        for (let i = 0; i < warnings.length; i++) {
            warnings[0].remove();
        }
        // !validPass && (pass.style.borderBottom = '2px solid indianred');
        // document.querySelectorAll('.focus-input')[2].style.color = 'indianred';
        loginSelected = false;
        btn.value = 'signup';
        window.open('#signup','_self');
    }
}

function showlogin() {
    if (!loginSelected) {
        home.style = '';
        login.classList.toggle('selected');
        login.style = '';
        signup.style = '';
        signup.classList.toggle('selected');
        logo.style = '';
        msgs[0].style = '';
        msgs[1].style.display = 'none';
        // hide signup inputs
        for (let i = 0; i < suinps.length; i++) {
            suinps[i].style = '';
        }

        pass.classList.toggle('login-pass');
        pass.value = '';
        pass.style = '';
        eyes[0].classList.remove('err-eye');
        eyes[1].classList.remove('err-eye');
        let warnings = document.querySelectorAll('.warning');
        for (let i = 0; i < warnings.length; i++) {
            warnings[0].remove();
        }
        document.querySelectorAll('.focus-input')[2].style = '';
        loginSelected = true;
        btn.value = 'login';
        window.open('#login','_self');
    }
}

var validName = false, validEmail = false, validPass = false, validCnfpass = false;

function validateInput(inp) {
    let val = inp.value.trim(),
    parent = inp.parentNode,
    inpname = inp.name,
    focusinp = parent.querySelector('.focus-input'),
    exwarn = parent.querySelector('.warning'),
    warning = exwarn || document.createElement('span'),
    whtml = '',
    eye = parent.querySelector('.eye');
    inperr = true;

    warning.className = 'warning';

    switch (inpname) {
        case 'name':
            if (val.length > 30) {
                validName = false;
                whtml += 'Name should not contain more than 30 characters.';
            }
            else if (val.length == 0) {
                validName = false;
                whtml += 'Name should not be empty.';
            }
            else {
                validName = true;
                inperr = false;
            }
            break;
        case 'email':
            if (/^[\w-\.]+@([\w-]+\.)+[\w-]+$/.test(val) && val.length != 0) {
                validEmail = true;
                inperr = false;
            }
            else {
                validEmail = false;
                whtml += 'Invalid email!';
            }
            break;
        case 'pass':
            let lesschars = val.length < 8,
            nolcase = val.toUpperCase() == val,
            noucase = val.toLowerCase() == val,
            nonum = !/\d/.test(val);
            if (lesschars || nolcase || noucase || nonum) {
                validPass = false;
                !eye.classList.contains('err-eye') && !inp.classList.contains('login-pass') && eye.classList.toggle('err-eye');
                whtml += 'Must contain the following:<ul>';
                if (lesschars)
                    whtml += '<li>Atleast 8 characters.</li>';
                if (nolcase)
                    whtml += '<li>A lowercase letter.</li>';
                if (noucase)
                    whtml += '<li>A capital letter.</li>';
                if (nonum)
                    whtml += '<li>A number.</li>';
                whtml += '</ul>';
            }
            else {
                validPass = true;
                inperr = false;
            }
            break;
        case 'cnfpass':
            let pass = document.querySelector('input[name="pass"]').value;
            if (val != pass || val.length == 0) {
                validCnfpass = false;
                !eye.classList.contains('err-eye') && eye.classList.toggle('err-eye');
                whtml += 'The passwords doesn\'t match!';
            }
            else {
                validCnfpass = true;
                inperr = false;
            }
            break;
    }
    if (inperr) {
        if (inpname == 'pass' && inp.classList.contains('login-pass'))      // check if password input contains 'login-pass' class
            return
        inp.style.borderBottom = '2px solid indianred';
        focusinp.style.color = 'indianred';
        // updating warning message box
        warning.innerHTML = whtml;
        exwarn || parent.insertBefore(warning, inp);
    }
    else {
        inp.style = '';
        focusinp.style = '';
        eye && eye.classList.contains('err-eye') && eye.classList.toggle('err-eye');
        // deleting warning message box
        warning.remove();
    }
}

function passwordVisibility(eye) {
    let eyeHtml = eye.innerHTML.trim(),
    inp = eye.parentNode.querySelector('input');
    if (eyeHtml == 'visibility') {
        eye.innerHTML = 'visibility_off';
        inp.type = 'text';
    }
    else {
        eye.innerHTML = 'visibility';
        inp.type = 'password';
    }
    inp.focus();
}

function submitForm() {
    let inps = document.querySelectorAll('input'),
    focusinps = document.querySelectorAll('.focus-input'),
    msg = 'Please fill up the following field(s) in the specified format:\n';
    if (!(validName && validEmail && validPass && validCnfpass) && !(loginSelected && validEmail)) {
        if (!validName && !loginSelected) {
            msg += '\n- Name (Your name is above 30 characters)'
            inps[0].style.borderBottom = '2px solid indianred';
            focusinps[0].style.color = 'indianred';
        }
        if (!validEmail) {
            msg += '\n- Email (Provided email is invalid)'
            inps[1].style.borderBottom = '2px solid indianred';
            focusinps[1].style.color = 'indianred';
        }
        if (!validPass && !loginSelected) {
            msg += '\n- Password (Provided password doesn\'t meet the requirements)'
            inps[2].style.borderBottom = '2px solid indianred';
            focusinps[2].style.color = 'indianred';
            eyes[0].classList.add('err-eye');
        }
        if (!validCnfpass && !loginSelected) {
            msg += '\n- Confirm Password (The passwords doesn\'t match)'
            inps[3].style.borderBottom = '2px solid indianred';
            focusinps[3].style.color = 'indianred';
            eyes[1].classList.add('err-eye');
        }
        alert(msg);
        for (let i = 0; i < focusinps.length; i++) {
            if (focusinps[i].style.color == 'indianred')
                focusinps[i].classList.add('flash');
        }
        setTimeout(() => {
            for (let i = 0; i < focusinps.length; i++) {
                if (focusinps[i].style.color == 'indianred')
                    focusinps[i].classList.remove('flash');
            }
        }, 1000);
    }
    else {
        if (pass.value == '')
            alert('The password field is empty!');
        else
            cb_authenticate();
    }
}


window.addEventListener('load', function () {
    if (window.location.href.endsWith('#signup')) {
        showsignup();
    }
    else if (window.location.href.endsWith('#signup')) {
        showlogin();
    }
})
window.addEventListener('hashchange', function () {
    if (window.location.href.endsWith('#signup')) {
        showsignup();
        closeModal();
    }
    else if (window.location.href.endsWith('#signup')) {
        showlogin();
    }
});