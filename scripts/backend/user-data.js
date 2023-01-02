async function userInfo(user, getBio = true) {
        if (user) {
            let p,d,b;
            p = user.photoURL;
            d = user.displayName;
            if (!getBio) {
                return [p,d];
            }
            await db.collection('users').doc(user.uid).get().then(doc => {
                b = doc.data().bio;
            })
            return [p,d,b];
        }
        else{
            console.log('User logged out');
            return
        }
}

async function fetchExamples() {
    const snapshot = await db.collection('examples').get();
    return snapshot.docs.map(doc => doc.data());
}

async function fetchCustomFiles(user) {
    const snapshot = await db.collection('users').doc(user.uid).collection('custom-files').get();
    return snapshot.docs.filter(doc => doc.id != 'init').map(doc => doc.data());
}

async function deleteMyCodeBlock(name) {
    await db.collection('users').doc(cb_auth.currentUser.uid).collection('custom-files').doc(name).delete();
}


function cb_logout() {
    showYesOrNoModal('Log Out', 'Are you sure you want to log out?').then(dec =>{
        dec && cb_auth.signOut().then(() => {
            window.location.pathname=='/' || window.location.pathname.match('codeblock') ? (showModal('Logged Out', 'You are logged out successfully!')) : window.open('authenticate.html','_self');
        });
    })
}
