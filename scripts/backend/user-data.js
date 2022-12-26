async function userInfo(user) {
        if (user) {
            let p,d,b;
            p = user.photoURL;
            d = user.displayName;
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