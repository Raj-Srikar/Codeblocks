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
  document.getElementById('cpp').innerHTML = includes + 'using namespace std;\n\n' + cfuncs + 'int main() {\n'
                                              + cppcode + '\n  return 0;\n}';
  hljs.highlightAll();
}
