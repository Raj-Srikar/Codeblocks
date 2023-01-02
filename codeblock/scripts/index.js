'use strict';

var workspace = null, jscode = "", originalJsonCode, jsonChanged=false;
const docTitle = document.querySelector('title');

function start() {
  // Create main workspace.
  workspace = Blockly.inject('blocklyDiv',
    {
      toolbox: document.getElementById('toolbox-categories'),
    });
    
  workspace.addChangeListener(myUpdateFunction);
}

function myUpdateFunction(event) {
  var pycode = Blockly.Python.workspaceToCode(workspace);
  document.getElementById('python').innerHTML = pycode;
  jscode = Blockly.JavaScript.workspaceToCode(workspace);
  var cppcode = cppGenerator.workspaceToCode(workspace);
  var includes = '#include &lt;iostream.h&gt;\n';
  if(cppGenerator.definitions){
    for(const k in cppGenerator.definitions){
      includes += cppGenerator.definitions[k] + '\n';
    }
  }
  var cfuncs = '';
  if(cppGenerator.custom_functions){
    for(const k in cppGenerator.custom_functions){
      cfuncs += cppGenerator.custom_functions[k] + '\n\n';
    }
  }
  document.getElementById('cpp').innerHTML = cppcode;
  if (cb_auth.currentUser && !jsonChanged && originalJsonCode !== JSON.stringify(Blockly.serialization.workspaces.save(workspace))) {
    docTitle.innerHTML = '&#9679; ' + docTitle.innerHTML;
    jsonChanged = true;
  }
  hljs.highlightAll();
}

function updateOriginalJson() {
  originalJsonCode = JSON.stringify(Blockly.serialization.workspaces.save(workspace));
  jsonChanged = false;
  docTitle.innerHTML = docTitle.innerHTML.replace('● ', '')
}

window.addEventListener('beforeunload', function (e) {
    if (jsonChanged) {
        e.preventDefault();
        e.returnValue = '';
    }
});

function copyToClipboard(ele){
  var range = document.createRange();
  range.selectNode(ele.parentElement.children[2]);
  range.setStart(ele.parentElement.children[2], 0);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
  ele.className = 'fa fa-check';
  ele.title = 'Copied To Clipboard!!'
  setTimeout(() => {
    ele.className = 'fa fa-clone';
    ele.title = 'Copy To Clipboard!!'
  }, 2000);
}

async function getCodeBlock() {
  let file = urlParams.get('filename'),
  isExample = urlParams.has('isExample');
  return file && await fetchCodeBlock(decodeURIComponent(file), isExample)
}
function cbFillWorkspace(json) {
  Blockly.serialization.workspaces.load(JSON.parse(json.replaceAll('\\\\','\\')), workspace);
  updateOriginalJson();
}

function openMenu(btn) {
  btn.classList.toggle('opened');
  btn.setAttribute('aria-expanded', btn.classList.contains('opened'))
  if (btn.classList.contains('opened')){
    let f = urlParams.has('filename'), iex = urlParams.has('isExample');
    btn.previousElementSibling.style.width =  f && !iex ? '201px' : '166.68px';
    btn.previousElementSibling.style.paddingRight = '5px';
  }
  else
    btn.previousElementSibling.style = ''
}

function saveCodeBlock(filename, saveAs=false) {
  let json = JSON.stringify(Blockly.serialization.workspaces.save(workspace));
  if (json!=='{}') {
    uploadCodeBlock(json, filename, saveAs)
  }
  else
    showModal('Failed to save the CodeBlock', `There's nothing to save ¯\\_(ツ)_/¯`)
}

function menuSave() {
  let filename = decodeURIComponent(urlParams.get('filename'));
  if(!sanitizeContent(filename, true)) {
    showModal('Illegal file name', 'The file has illegal name and hence can\'t be saved.');
    return
  }
  showYesOrNoModal('Confirm CodeBlock save', `Are you sure you want to save "<b>${filename}</b>"?`).then(dec => {
    if (dec) {          // If want to save
      if (filename) {       // If url has 'filename' get parameter
        !urlParams.has('isExample') && saveCodeBlock(filename);      // If url doesn't have 'isExample' get parameter, then save
      }
      else {
        showModal('Umm...', "This shouldn't be here.🤔 Try reloading the page.")
      }
    }
  })
}

function menuSaveAs() {
  showModalWithTextField('Save CodeBlock as', 'Enter your CodeBlock\'s name:', 30).then(filename => {
    if(!sanitizeContent(filename, true)) {
      showModal('Illegal file name', "Try not to use any symbols while naming your file.");
      return
    }
    filename && saveCodeBlock(filename, true)
  })
}

async function createMenuBar()  {
  let menu='', iex = urlParams.has('isExample');
  let getFile = await getCodeBlock();
  getFile && cbFillWorkspace(getFile);
  menu = `<div class="menu-bar">
            <span id="menu-import" title="Import">
                <span class="menu-item material-symbols-outlined">vertical_align_bottom</span>
            </span>${ getFile && !iex ? `<span id="menu-save" title="Save" onclick="menuSave()">
                    <span class="menu-item material-symbols-outlined">save</span>
            </span>` : ''}
            <span id="menu-save-as" title="Save As" onclick="menuSaveAs()">
                <span class="menu-item material-symbols-outlined">save_as</span>
            </span>
            <a id="menu-new-cb" href="/codeblock">
              <span class="menu-item material-symbols-outlined">note_add</span>
            </a>
            <span id="menu-run" class="menu-item" title="Run the Code" onclick="eval(jscode)">
                <span class="material-symbols-outlined">play_arrow</span>
                <span>Run</span>
            </span>
        </div>
        <button class="menu-btn" onclick="openMenu(this)" aria-label="Main Menu">
            <svg width="25" height="25" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path class="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                <path class="line line2" d="M 20,50 H 80" />
                <path class="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
            </svg>
        </button>`;
  document.querySelector('.menu').innerHTML = menu;
};