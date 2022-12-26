var modal;

const modal_link = document.createElement('link');
modal_link.setAttribute('rel','stylesheet');
modal_link.setAttribute('type','text/css');
modal_link.setAttribute('href','styles/cb-modal.css');
document.querySelector('head').appendChild(modal_link);

function closeModal() {
    modal.remove();
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
    while (decision === ''){
        await timeout(50);
    }
}

async function showYesOrNoModal(heading, msg) {
    modal && closeModal();
    modal = document.createElement('div');
    modal.setAttribute('id','modal');
    modal.innerHTML = `<div id="modal-content">
                            <span id="modal-close" onclick="closeModal();decision='no'">&times;</span>
                            <h3 id="modal-heading">${heading}</h3>
                            <p id="modal-msg">${msg}</p>
                            <div id="modal-decision">
                                <button id="modal-no" onclick="decision='no'">No</button>
                                <button id="modal-yes" onclick="decision='yes'">Yes</button>
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
    else if(decision==='no'){
        decision='';
        return false
    }
}


async function showModalWithTextField(heading, msg) {
    modal && closeModal();
    modal = document.createElement('div');
    modal.setAttribute('id','modal');
    modal.innerHTML = `<div id="modal-content">
                            <span id="modal-close" onclick="closeModal();decision='cancel'">&times;</span>
                            <h3 id="modal-heading">${heading}</h3>
                            <p id="modal-msg">${msg}</p>
                            <div id="modal-decision">
                                <input type="text" id="modal-text-field">
                                <button id="modal-cancel" onclick="decision='cancel'">Cancel</button>
                                <button id="modal-ok" onclick="decision='ok'">Ok</button>
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