Blockly.Themes.CodeBlock = Blockly.Theme.defineTheme('halloween', {
  'base': Blockly.Themes.Classic,
  'categoryStyles': {
    'variable_category': {
      'colour': "#f259a6"
    },
    'text_category': {
      'colour': "#2cc28f",
    },
    'logic_category': {
      'colour': "#5598db",
    },
    'loop_category': {
      'colour': "#85E21F",
    },
    'procedure_category': {
      'colour': "#FE9B13",
    },
  },
  'blockStyles': {
    'variable_blocks': {
      'colourPrimary': "#f259a6",
      'colourSecondary':"#f69ec5",
      'colourTertiary':"#f9bfd7",
    },
    'text_blocks': {
      'colourPrimary': "#2cc28f",
      'colourSecondary':"#90d6b8",
      'colourTertiary':"#b7e3cf"
    },
    'logic_blocks': {
      'colourPrimary': "#5598db",
      'colourSecondary':"#9dbde6",
      'colourTertiary':"#C5EAFF"
    },
    'loop_blocks': {
      'colourPrimary': "#85E21F",
      'colourSecondary':"#b3eb8e",
      'colourTertiary':"#cbf1b6"
    },
    'procedure_blocks': {
      'colourPrimary': "#FE9B13",
      'colourSecondary':"#febf8d",
      'colourTertiary':"#ffd3b5"
    },
  },
  'componentStyles': {
    'workspaceBackgroundColour': '#000000cc',
    'toolboxBackgroundColour': '#182236',
    'toolboxForegroundColour': '#fff',
    'flyoutBackgroundColour': '#8ba2ae',
    'flyoutForegroundColour': '#ccc',
    'flyoutOpacity': 0.23,
    'scrollbarColour': '#4c85af',
    'insertionMarkerColour': '#fff',
    'insertionMarkerOpacity': 0.3,
    'scrollbarOpacity': 0.4,
    'cursorColour': '#d0d0d0',
    'blackBackground': '#333'
  }
});


Blockly.Variables.createVariableButtonHandler = function(a, b, c) {
    var d = c || "",
      e = function(f) {
        (0, Blockly.Variables.promptName)(Blockly.Msg.NEW_VARIABLE_TITLE, f, function(g) {
          if (g) {
            var h = (0, Blockly.Variables.nameUsedWithAnyType)(g, a);
            if (h) {
              if (h.type === d) var k = Blockly.Msg.VARIABLE_ALREADY_EXISTS.replace("%1", h.name);
              else k = Blockly.Msg.VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE, k = k.replace("%1", h.name).replace("%2",
                h.type);
              (0, Blockly.dialog.alert)(k, function() {
                e(g)
              })
            } else a.createVariable(g, d), b && b(g)
          } else b && b(null)
        })
      };
    e("")
  };  

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
        // Blockly.Blocks.math_change &&
        //     (d = (0, Blockly.utils.xml.createElement)("block"), d.setAttribute("type", "math_change"), d.setAttribute("gap", 
        //         Blockly.Blocks.variables_get ? 20 : 8), d.appendChild((0, Blockly.Variables.generateVariableFieldDom)(c)), 
        //         c = (0, Blockly.Xml.textToDom)
        //             ('<value name="DELTA"><shadow type="math_number"><field name="NUM">1</field></shadow></value>'), 
        //         d.appendChild(c), b.push(d));
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
Blockly.JavaScript.prompt_inp = function(a) {
  var b = "window.prompt(" + (a.getField("TEXT") ? Blockly.JavaScript.quote_(a.getFieldValue("TEXT")) : Blockly.JavaScript.valueToCode(a, "TEXT", Blockly.JavaScript.ORDER_NONE) || "''") + ")";
  var vname = Blockly.JavaScript.variables_set(a);
  return vname.replace('0', b)
};

// Blockly.Blocks['variables_get'] = {
//   init: function() {
//     this.appendDummyInput()
//         .appendField("type")
//         .appendField(new Blockly.FieldDropdown([["text","STRING"], ["number","INT"]]), "TYPE")
//         .appendField(new Blockly.FieldVariable(), "VAR");
//     this.setOutput(true, null);
//     this.setColour(330);
//  this.setTooltip("");
//  this.setHelpUrl("");
//   }
// };