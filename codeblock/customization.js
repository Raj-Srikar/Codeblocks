Blockly.Variables.flyoutCategory = function(a) {
    var b = [],
        c = document.createElement("button");
    c.setAttribute("text", "%{BKY_NEW_VARIABLE}");
    c.setAttribute("callbackKey", "CREATE_VARIABLE");
    a.registerButtonCallback("CREATE_VARIABLE", function(d) {
        (0, Blockly.Variables.createVariableButtonHandler)(d.getTargetWorkspace())
    });
    b.push(c);
    a = (0, Blockly.Variables.flyoutCategoryBlocks)(a);
    return b = b.concat(a)
};

Blockly.Variables.flyoutCategoryBlocks = function(a) {
    a = a.getVariablesOfType("");
    var b = [];
    if (0 < a.length) {
        var c = a[a.length - 1];
        if (Blockly.Blocks.variables_set) {
            var d = (0, Blockly.utils.xml.createElement)("block");
            d.setAttribute("type", "variables_set");
            d.setAttribute("gap", Blockly.Blocks.math_change ? 8 : 24);
            d.appendChild((0, Blockly.Variables.generateVariableFieldDom)(c));
            b.push(d)
        }
        if (Blockly.Blocks.variables_get)
            for (a.sort(Blockly.VariableModel.compareByName),
                c = 0; d = a[c]; c++) {
                var e = (0, Blockly.utils.xml.createElement)("block");
                e.setAttribute("type", "variables_get");
                e.setAttribute("gap", 8);
                e.appendChild((0, Blockly.Variables.generateVariableFieldDom)(d));
                b.push(e)
            }
    }
    return b
};


Blockly.Blocks['prompt_inp'] = {
  init: function() {
    this.appendValueInput("TEXT")
        .appendField("prompt")
        .appendField(new Blockly.FieldVariable("variable"), "VAR")
        .appendField("with message");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};
Blockly.Python.prompt_inp = function(a) {
  var b = Blockly.Python.provideFunction_("text_prompt", "\ndef " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(msg):\n  try:\n    return raw_input(msg)\n  except NameError:\n    return input(msg)\n");
  var c = a.getField("TEXT") ? Blockly.Python.quote_(a.getFieldValue("TEXT")) : Blockly.Python.valueToCode(a, "TEXT", Blockly.Python.ORDER_NONE) || "''";
  b = b + "(" + c + ")";
  var vname = Blockly.Python.variables_set(a);
  return vname.replace('0', b)
};

