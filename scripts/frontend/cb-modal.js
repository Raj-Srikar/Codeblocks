var modal;

const modal_link = document.createElement('link');
modal_link.setAttribute('rel','stylesheet');
modal_link.setAttribute('type','text/css');
modal_link.setAttribute('href', (window.location.pathname.match('codeblock') ? '../' : '') + 'styles/cb-modal.css');
document.querySelector('head').appendChild(modal_link);

function closeModal() {
    modal && modal.remove();
}

function showModal(heading, msg) {
    modal && closeModal();
    modal = document.createElement('div');
    modal.setAttribute('id','modal');
    modal.innerHTML = `<div id="modal-content">
                            <span id="modal-close" onclick="closeModal()">&times;</span>
                            <h3 id="modal-heading">${heading}</h3>
                            <p id="modal-msg">${msg}</p>
                       </div>`;
    document.querySelector('body').appendChild(modal);
    modal.addEventListener('click', function(e){
        closeModal();
    })
}


var decision = '';

async function waitForDecision() {
    const timeout = async function(ms) {
        return new Promise(function (res) {
            return setTimeout(res, ms);
        });
    };
    while (decision === '' || (decision === 'open' && !modalSelectedFile)) {
        await timeout(50);
    }
}

async function showYesOrNoModal(heading, msg, yes='Yes', no='No') {
    modal && closeModal();
    modal = document.createElement('div');
    modal.setAttribute('id','modal');
    modal.innerHTML = `<div id="modal-content">
                            <span id="modal-close" onclick="closeModal();decision='No'">&times;</span>
                            <h3 id="modal-heading">${heading}</h3>
                            <p id="modal-msg">${msg}</p>
                            <div id="modal-decision">
                                <button id="modal-yes" onclick="decision='yes'">${yes}</button>
                                <button id="modal-no" onclick="decision='${no}'">${no}</button>
                            </div>
                        </div>`
    ;
    document.querySelector('body').appendChild(modal);
    await waitForDecision();
    closeModal();
    if(decision==='yes'){
        decision='';
        return true
    }
    else if(decision==='No'){
        decision='';
        return false
    }
    else {
        decision = '';
        return no
    }
}


async function showModalWithTextField(heading, msg, limit=0) {
    modal && closeModal();
    modal = document.createElement('div');
    modal.setAttribute('id','modal');
    modal.innerHTML = `<div id="modal-content">
                            <span id="modal-close" onclick="closeModal();decision='cancel'">&times;</span>
                            <h3 id="modal-heading">${heading}</h3>
                            <p id="modal-msg">${msg}</p>
                            <input type="text" id="modal-text-field" ${limit ? `maxlength="${limit}"`:''}>
                            <div id="modal-decision" style="margin:0">
                                <button id="modal-ok" onclick="decision='ok'">Ok</button>
                                <button id="modal-cancel" onclick="decision='cancel'">Cancel</button>
                            </div>
                        </div>`
    ;
    document.querySelector('body').appendChild(modal);
    let textval = document.getElementById('modal-text-field');
    textval.focus();
    textval.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("modal-ok").click();
        }
    });
    await waitForDecision();
    textval && (textval = textval.value);
    closeModal();
    if(decision==='ok'){
        decision='';
        return textval
    }
    else if(decision==='cancel'){
        decision='';
        return false
    }
}


var modalSelectedFile = null, files = null;

function selectModalFile(file) {
    modalSelectedFile && modalSelectedFile.classList.toggle('modal-selected-file');
    file.classList.toggle('modal-selected-file');
    modalSelectedFile = file;
}
function deselectModalFile(event) {
    if (modalSelectedFile
        && !modalSelectedFile.contains(event.target) 
        && document.getElementById('modal-open') !== event.target) {
            modalSelectedFile && modalSelectedFile.classList.toggle('modal-selected-file');
            modalSelectedFile = null;
    }
}

async function showOpenCodeBlocksModal() {
    let exhtml='', uhtml='';
    modal && closeModal();
    modal = document.createElement('div');
    modal.setAttribute('id','modal');
    
    for (let i = 0; i < exampleFiles.length; i++) {
        exhtml += `<div class="cb-file" onclick="selectModalFile(this)">
                    <img src="../images/cb-file-ex.svg" alt="example file">
                    <span class="filename">${exampleFiles[i].name}</span>
                </div>\n`;
    }
    for (let i = 0; i < userFiles.length; i++) {
        uhtml += `<div class="cb-file" onclick="selectModalFile(this)">
                    <img src="../images/cb-file-ex.svg" alt="example file">
                    <span class="filename">${userFiles[i].name}</span>
                </div>\n`;
    }
    
    modal.innerHTML =   `<div id="modal-content">
                            <span id="modal-close" onclick="closeModal();decision='close'">&times;</span>
                            <h2 id="modal-heading">Open CodeBlocks</h2>
                            <div id="modal-codeblocks">
                                <div id="examples">
                                    <span>Example CodeBlocks</span>
                                    <div class="cb-folder">
                                        ${exhtml}
                                    </div>
                                </div>
                                <div id="my-cbs">
                                    <span>My CodeBlocks</span>
                                    <div class="cb-folder">
                                        ${uhtml}
                                    </div>
                                </div>
                            </div>
                            <div id="modal-decision">
                                <button id="modal-open" onclick="modalSelectedFile && (decision='open')">Open</button>
                                <button id="modal-cancel" onclick="decision='cancel'">Cancel</button>
                            </div>
                        </div>`;
    document.querySelector('body').appendChild(modal);

    window.addEventListener('click', deselectModalFile);

    await waitForDecision(true);
    
    if (decision === 'open' && modalSelectedFile) {
        decision = '';
        let filename = modalSelectedFile.querySelector('.filename').innerHTML.trim(),
        folderType = modalSelectedFile.parentElement.parentElement.id,
        url = '/codeblock?filename=' + encodeURIComponent(filename) + (folderType==='examples' ? '&isExample' : '');
        window.open(url, '_self');
    }
    else if (decision === 'cancel' || decision === 'close') {
        decision = '';
        window.removeEventListener('click', deselectModalFile);
    }
    closeModal();
}