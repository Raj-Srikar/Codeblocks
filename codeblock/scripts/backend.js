const urlParams = new URLSearchParams(window.location.search);
let exampleFiles, userFiles;

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


async function createNewCbDoc(filename, obj, colref, exists=false) {
    if (exists){
        let s;
        do {
            let n = filename.match(/\((\d)\)$/);
            if (n)
                filename = filename.slice(0,-4) + ` (${parseInt(n[1])+1})`;
            else
                filename += ' (2)';
            s = await db.collection('users').doc(cb_auth.currentUser.uid).collection('custom-files').doc(filename).get();
        } while(s.exists);
    }
    obj['name'] = filename;
    await colref.doc(filename).set(obj);
    updateOriginalJson();
    window.open('?filename='+encodeURIComponent(filename),'_self')
}

async function uploadCodeBlock(json, filename, saveAs=false) {
    try {
        let obj = {'json' : json};
        colref = db.collection('users').doc(cb_auth.currentUser.uid).collection('custom-files'),
        g = await colref.doc(filename).get();
        if (saveAs) {       // If saving as
            if (g.exists) {     // If file already exists in the database
                dec = await showYesOrNoModal('CodeBlock already exists',
                    `The CodeBlock, <b>"${filename}"</b> already exists. Do you want to replace it? Or create a new one?`,
                    'Replace', 'Create a new one');     // Ask if Replace or Create new one
                if (dec === true) {         // If Replace
                    if (g.data()['json'] !== json) {      // If there is some change in the workspace json
                        await colref.doc(filename).set(obj, {merge:true});        // append the fields in obj to filename doc (obj will have only json without name)
                        updateOriginalJson();
                    }
                    else console.log('No change in workspace');
                }
                else if (dec === 'Create a new one')               // If Create new
                    await createNewCbDoc(filename, obj, colref, true)
            }
            else            // If file doesn't exist
                await createNewCbDoc(filename, obj, colref)
        }
        else {      // If normal save
            if (g.exists) {     // If file exists in the database (actually how it should be)
                if (g.data()['json'] !== json) {      // If there is some change in the workspace json
                    await colref.doc(filename).set(obj, {merge:true});        // append the fields in obj to filename doc (obj will have only json without name)
                    showModal('File saved', `<b>"${filename}"</b> has been saved successfully!`);
                    updateOriginalJson();
                }
                else console.log('No change in workspace');
            }
            else {
                dec = await showYesOrNoModal("CodeBlock doesn't exist",
                    `The CodeBlock, "<b>${filename}</b>" doesn't exists. Do you want to create a new one?`)
                dec && saveCodeBlock(filename, true)
            }
        }
    } catch (error) {
        console.log(error.message);
        return false;
    }
    return true;
}