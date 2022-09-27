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
  var pycode = Blockly.Python.workspaceToCode(workspace);
  document.getElementById('python').innerHTML = pycode;
  var cppcode = cppGenerator.workspaceToCode(workspace);
  document.getElementById('cpp').innerHTML = '#include &lt;iostream.h&gt;\nusing namespace std;\n\nint main() {\n'
                                              + cppcode + '\n  return 0;\n}';
  hljs.highlightAll();
}
