'use strict';

let workspace = null;

function start() {
  // Create main workspace.
  workspace = Blockly.inject('blocklyDiv',
    {
      toolbox: document.getElementById('toolbox-categories'),
    });
    
  workspace.addChangeListener(myUpdateFunction);
}

function myUpdateFunction(event) {
  var code = Blockly.Python.workspaceToCode(workspace);
  document.getElementById('python').innerHTML = code;
  hljs.highlightAll();
}
