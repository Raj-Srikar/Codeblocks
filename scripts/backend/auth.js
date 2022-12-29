cb_auth.onAuthStateChanged(user => {
    if (user) {
        console.log('User logged in:', user)
    }
    else{
        console.log('User logged out')
    }
})

// const btn = document.querySelector('input[type="button"]');

async function cb_authenticate(){
    const email = document.querySelector('input[name="email"]').value,
    pass = document.querySelector('input[name="pass"]').value;

    if (!loginSelected) {
        const name = document.querySelector('input[name="name"]').value;
        cb_auth.createUserWithEmailAndPassword(email, pass).then(cred => {
            let col = db.collection('users').doc(cred.user.uid);
            db.collection('users').doc(cred.user.uid).collection('custom-files').doc('init').set({});
            col.set({
                'bio' : 'Hello there! My name is ' + name + ' :)'
            })
            return cred.user.updateProfile({
                displayName: name,
                photoURL : ''
            })
        }).then(() => {
            window.open('dashboard.html','_self');
        }).catch(e => {
            switch (e.code) {
                case "auth/email-already-in-use":
                    showModal('Email already exists', e.message)
                    break;
            }
            console.log('Error occurred: ', e.message)
        })
    }
    else {
        try{
            await cb_auth.signInWithEmailAndPassword(email, pass).then(cred => {
                window.open('dashboard.html','_self');
            })
        } catch(e){
            switch (e.code) {
                case '"auth/wrong-password"':
                case 'auth/user-not-found':                    
                    showModal("Uh Oh! :(", 'Wrong email or password! Please try again or <a href="#signup">Create a new account</a>.')
                    break;
                case "auth/email-already-in-use":
                    window.open('dashboard.html','_self');
                    break;
                default:
                    showModal(e.code, e.message)
            }
            console.log(e.message);
        }
    }
}