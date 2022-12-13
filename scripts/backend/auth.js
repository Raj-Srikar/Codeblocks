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
        try{
            cb_auth.createUserWithEmailAndPassword(email, pass).then(cred => {
                let col = db.collection('users').doc(cred.user.uid);
                return col.set({
                    'username': name,
                    'bio' : '' 
                })
            }).then(() => {
                window.open('./codeblock','_self');
            })
        }
        catch(e){
            console.log('Error occurred: ', e.message)
        }
    }
    else {
        try{
            await cb_auth.signInWithEmailAndPassword(email, pass).then(cred => {
                window.open('./codeblock','_self');
            })
        } catch(e){
            if (e.code == 'auth/user-not-found' || e.code == "auth/wrong-password")
                showModal("Uh Oh! :(", 'Wrong email or password! Please try again or <a href="#signup">Create a new account</a>.')
            else if (e.code == "auth/email-already-in-use")
                window.open('./codeblock','_self');
            console.log(e);
        }
    }
}