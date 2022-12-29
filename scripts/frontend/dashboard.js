const profile = document.querySelector('#dp>img'),      // Dp img
addpic = document.getElementById('add-pic'),
updatepic = document.getElementById('update-pic');

async function testImage(url) {
    return new Promise(function(resolve) {
        var timeout = 5000;
        var timer, img = new Image();
        img.onerror = img.onabort = function() {
            clearTimeout(timer);
            resolve(false);
        };
        img.onload = function() {
            clearTimeout(timer);
            resolve(true);
        };
        timer = setTimeout(function() {
            img.src = "//!!!!/noexist.jpg";
            resolve(false);
        }, timeout); 
        img.src = url;
    });
}
function addPicture(addorupdate) {
    showModalWithTextField(addorupdate+' profile picture','Enter your image\'s URL:').then(async function (url) {
        if (url) {
            if (url.match(/\.(jpeg|jpg|gif|png|svg)$/) != null){
                await testImage(url).then((valid)=>{
                    if (valid){
                        // Update Firebase Account with new Photo URL
                        let user = cb_auth.currentUser;
                        user.updateProfile({photoURL : url}).then(() => {
                            profile.src = url;
                            addpic.style.display = 'none';
                            updatepic.style.display = 'flex';
                        });
                    }
                    else
                        alert('Image is Inavlid! Please provide a proper Image.')
                })
            }
            else
                alert('Invalid Image URL!');
            console.log(url);
        }
        else if (url === '') alert('The URL was empty :|')
    })
}
function removePicture() {
    showYesOrNoModal('Remove profile picture','Are you sure you want to remove your current profile picture?').then((res) =>{
        if (res) {
            // Set an empty string to Firebase Photo URL
            let user = cb_auth.currentUser;
            user.updateProfile({photoURL : ''})

            addpic.style.display = 'flex';
            updatepic.style.display = 'none';
            profile.src = './images/account_circle.svg';
            showModal('profile picture removed','Your profile picture has been successfully removed!')
        }
    })
}


const fname = document.getElementById('name'),      // Full name span
fullname = document.getElementById('fullname'),
editfname = fullname.querySelector('.edit'),
fninp = document.getElementById('edit-fullname'),   // Full name input field
done = fullname.querySelector('.done-fullname'),
close = fullname.querySelector('.close-fullname');

fninp.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        fninp.blur();
        done.click();
    }
});

function editFullname(){
    editfname.style.display = 'none';
    fname.style.display = 'none';
    fninp.style.display = 'inline-block';
    done.style.display = 'inline-block';
    close.style.display = 'inline-block';

    fninp.value = fname.innerHTML;
    fninp.focus();
}
function closeEditFullname() {
    editfname.style.display = '';
    fname.style.display = '';
    fninp.style.display = '';
    done.style.display = '';
    close.style.display = '';
}
function confirmFullname() {
    let updatedName = sanitizeContent(fninp.value.trim()),
    head = 'Change Name',
    msg = `Are you sure you want to change your full name from <b>"${fname.innerHTML}"</b> to <b>"${updatedName}"</b>?`;

    if (updatedName === fname.innerHTML.trim()) {
        closeEditFullname();
        return;
    }
    if (isFullnameValid(updatedName)){
        showYesOrNoModal(head,msg).then(function (dec){
            if (dec) {
                // Update Firebase Account with new Display Name
                let user = cb_auth.currentUser;
                user.updateProfile({displayName : updatedName}).then(() => {
                    closeEditFullname();
                    fname.innerHTML = updatedName;
                    console.log('Name Changed to', updatedName);
                })
            }
            else {
                fninp.focus();
            }
        })
    }
    else{
        showModal('Invalid Name!','Full name should not be empty or more than 30 characters.');
        closeEditFullname();
    }
}
function isFullnameValid(name) {
    return name.length > 0 && name.length <= 30;
}


const bio = document.getElementById('bio'),
biospan = bio.querySelector('span'),            // Biography span
editnote = bio.querySelector('.edit'),
editText = bio.querySelector('#edit-bio'),      // Biography input text area
donebio = bio.querySelector('.done-bio'),
closebio = bio.querySelector('.close-bio');

editText.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        editText.blur();
        donebio.click();
    }
});

function editBio() {
    biospan.style.display = 'none';
    editnote.style.display = 'none';
    editText.style.display = 'inline-block';
    donebio.style.display = 'inline-block';
    closebio.style.display = 'inline-block';

    editText.value = biospan.innerHTML.slice(1,-1);
    editText.focus();
}
function closeEditBio() {
    biospan.style.display = '';
    editnote.style.display = '';
    editText.style.display = '';
    donebio.style.display = '';
    closebio.style.display = '';
}
function confirmBio() {
    let updatedBio = sanitizeContent(editText.value.trim()),
    head = 'Change Bio',
    msg = 'Are you sure you want to change your bio?';

    if (updatedBio === biospan.innerHTML.trim().slice(1,-1)) {
        closeEditBio();
        return;
    }

    if (isBioValid(updatedBio)) {
        showYesOrNoModal(head,msg).then(function (dec){
            if (dec) {
                // Update Firebase Account with new Bio
                let user = cb_auth.currentUser;
                db.collection('users').doc(user.uid).set({bio : updatedBio}).then(() => {
                    closeEditBio();
                    biospan.innerHTML = '"'+updatedBio+'"';
                    console.log('Updated Bio to', updatedBio);
                })
            }
            else {
                editText.focus();
            }
        })
    }
    else{
        showModal('Invalid Bio!','Bio should not be empty or more than 100 characters.');
        closeEditBio();
    }
}
function isBioValid(bio) {
    return bio.length > 0 && bio.length <= 100;
}


var selectedFile = null,
files = document.getElementsByClassName('cb-file');

function selectFile(file) {
    selectedFile && selectedFile.classList.toggle('selected-file');
    file.classList.toggle('selected-file');
    selectedFile = file;
}
function deselectFile() {
    selectedFile && selectedFile.classList.toggle('selected-file');
    selectedFile = null;
}

for (let i = 0; i < files.length; i++) {
    files[i].onclick = function() {selectFile(this)};
}
window.addEventListener('click', function(e){   
    if (selectedFile && !selectedFile.contains(e.target))
        deselectFile();
});


function deleteCbFile(del) {
    let head = 'Delete CodeBlock',
    msg = 'Are you sure you want to delete the selected CodeBlock?<br><span style="color:orangered">(Note: You cannot retrieve it once deleted!</span>)',
    file = del.parentElement.parentElement,
    filename = file.querySelector('.filename').innerHTML.trim(),
    folderType = file.parentElement.parentElement.id;
    showYesOrNoModal(head,msg).then((res)=>{
        if (res) {
            deleteMyCodeBlock(file.title).then(() => {
                showModal('CodeBlock Deleted',`<b>"${filename}"</b> has been successfully deleted!`)
                file.remove();
            });
        }
    })
}


const exampleCbFolder = document.querySelector('#examples .cb-folder'),
userCbFolder = document.querySelector('#my-cbs .cb-folder');

function generateFileHTML(name, isUserFile=false) {
    let sname, imgsrc = isUserFile ? './images/cb-file.svg' : './images/cb-file-ex.svg';
    if (name.length>20)
        sname = name.substring(0,21).trim()+'...';
    let html = `<div class="cb-file" title="${name}" onclick="selectFile(this)">
        <img src="${imgsrc}" alt="example file">
        <span class="filename">${sname || name}</span>
        <div class="file-options" title>
            <div class="open-opt"${isUserFile?'':' style="border:0;border-radius:5px"'}><span class="material-symbols-outlined">file_open</span><span>Open</span></div>
            ${isUserFile ? '<div class="delete-opt" onclick="deleteCbFile(this)"><span class="material-symbols-outlined">delete</span><span>Delete</span></div>' : ''}
        </div>
    </div>`
    return html;
}

function populateCbFolders(user) {
    fetchExamples().then(arr => {
        let html = '';
        for (let i = 0; i < arr.length; i++) {
            html += generateFileHTML(arr[i].name);
        }
        exampleCbFolder.innerHTML = html;
    });
    fetchCustomFiles(user).then(arr => {
        let html = '';
        for (let i = 0; i < arr.length; i++) {
            html += generateFileHTML(arr[i].name, true);
        }
        userCbFolder.innerHTML = html;
    });
}



cb_auth.onAuthStateChanged(async function(user) {
    let udata = await userInfo(user);
    !udata && window.open('authenticate.html','_self');
    let [picUrl, displayFName, biography] = udata;

    // Update DP
    if (picUrl)
        profile.src = picUrl;
    else
        profile.src = './images/account_circle.svg'
    
    // Update Full Name
    fname.innerHTML = displayFName;
    
    // Update Biography
    biospan.innerHTML = `"${biography}"`

    // Change DP controls
    if (!profile.src.match('/images/account_circle.svg')) {
        addpic.style.display = 'none';
        updatepic.style.display = 'flex';
    }

    populateCbFolders(user);

    // Show the webpage
    document.querySelector('body').style.display = 'flex';
});
