'use strict';

let workspace = null, jscode = "";

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
  hljs.highlightAll();
}

function copyToClipboard(ele){
  var range = document.createRange();
  range.selectNode(ele.parentElement);
  range.setStart(ele.parentElement, 2)
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

function showMenu(btn) {
  btn.classList.toggle('opened');
  btn.setAttribute('aria-expanded', btn.classList.contains('opened'))
  if (btn.classList.contains('opened')){
    btn.previousElementSibling.style.width = urlParams.has('filename') && !urlParams.has('isExample') ? '166px' : '131.68px';
    btn.previousElementSibling.style.paddingRight = '5px';
  }
  else
    btn.previousElementSibling.style = ''
}

function saveCodeBlock(filename, saveAs=false) {
  let json = JSON.stringify(Blockly.serialization.workspaces.save(workspace));
  return uploadCodeBlock(json, filename, saveAs)
}

cb_auth.onAuthStateChanged(async user => {
  let menu;
  if (user) {
    let getFile = await getCodeBlock();
    getFile && cbFillWorkspace(getFile);
    menu = `<div class="menu-bar">
              <span id="menu-import">
                  <span class="menu-item material-symbols-outlined">vertical_align_bottom</span>
              </span>
              ${getFile ? `<span id="menu-save-as">
                      <span class="menu-item material-symbols-outlined">save_as</span>
              </span>`: ''}
              <span id="menu-save">
                  <span class="menu-item material-symbols-outlined">save</span>
              </span>
              <span id="menu-run" class="menu-item">
                  <span class="material-symbols-outlined">play_arrow</span>
                  <span>Run</span>
              </span>
          </div>
          <button class="menu-btn" onclick="showMenu(this)" aria-label="Main Menu">
              <svg width="25" height="25" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path class="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                  <path class="line line2" d="M 20,50 H 80" />
                  <path class="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
              </svg>
          </button>`;
  }
  else {
    menu = `<div class="menu-bar no-user-menu">
                <span id="menu-run-only" class="menu-item">
                    <span class="material-symbols-outlined">play_arrow</span>
                    <span>Run</span>
                </span>
            </div>`;
  }
  document.querySelector('.menu').innerHTML = menu;
});