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

cb_auth.onAuthStateChanged(async user => {
  if (user) {
    let getFile = await getCodeBlock();
    getFile && cbFillWorkspace(getFile);
  }
});