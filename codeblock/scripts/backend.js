const urlParams = new URLSearchParams(window.location.search);

async function fetchCodeBlock(filename, isExample=false) {
    let s;
    if (isExample) {
        s = await db.collection('examples').doc(filename).get()
        return s.data().json
    }
    else {
        try {
            s = await db.collection('users').doc(cb_auth.currentUser.uid).collection('custom-files').doc(filename).get()
            return s.data().json
        } catch (error) {
            return
        }
    }
}

async function getCodeBlock() {
    let file = urlParams.get('filename'),
    isExample = urlParams.has('isExample');
    return file && await fetchCodeBlock(decodeURIComponent(file), isExample)
}

function cbFillWorkspace(json) {
    Blockly.serialization.workspaces.load(JSON.parse(json.replaceAll('\\\\','\\')), workspace);
}

async function uploadCodeBlock(json, filename, saveAs=false) {
    try {
        let obj = {'json' : json};
        saveAs && (obj['name'] = filename);
        await db.collection('users').doc(cb_auth.currentUser.uid).collection('custom-files').doc(filename).set(obj);
    } catch (error) {
        console.log(error.message);
        return false;
    }
    return true;
}