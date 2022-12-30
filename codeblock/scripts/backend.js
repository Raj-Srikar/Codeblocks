const urlParams = new URLSearchParams(window.location.search);

async function fetchCodeBlock(filename, isExample=false) {
    let s;
    if (isExample) {
        s = await db.collection('examples').doc(filename).get()
        return s.data().json
    }
    else {
        s = await db.collection('users').doc(user.uid).collection('custom-files').doc(filename).get()
        return s.data().json
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