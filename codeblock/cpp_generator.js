const cppGenerator = new Blockly.Generator('CPP');

cppGenerator.forceStrings = ['text_join', 'variables_set'];

cppGenerator.addReservedWords('alignas,alignof,and,and_eq,asm,auto,bitand,bitor,bool,break,case,catch,char,char16_t,char32_t,char8_t,class,co_await,co_return,co_yield,compl,concept,const,const_cast,consteval,constexpr,constinit,continue,decltype,default,delete,do,do-while,double,dynamic_cast,else,enum,explicit,export,extern,false,final,float,for,friend,goto,if,import,inline,int,long,module,mutable,namespace,new,noexcept,not,not_eq,nullptr,operator,or,or_eq,override,posix,private,protected,public,reflexpr,register,reinterpret_cast,requires,return,short,signed,sizeof,static,static_assert,static_cast,struct,switch,template,this,thread_local,throw,true,try,typedef,typeid,typename,union,unsigned,using,virtual,void,volatile,wchar_t,while,xor,xor_eq');
cppGenerator.ORDER_ATOMIC = 0;
cppGenerator.ORDER_NEW = 1.1;
cppGenerator.ORDER_MEMBER = 1.2;
cppGenerator.ORDER_FUNCTION_CALL = 2;
cppGenerator.ORDER_INCREMENT = 3;
cppGenerator.ORDER_DECREMENT = 3;
cppGenerator.ORDER_BITWISE_NOT = 4.1;
cppGenerator.ORDER_UNARY_PLUS = 4.2;
cppGenerator.ORDER_UNARY_NEGATION = 4.3;
cppGenerator.ORDER_LOGICAL_NOT = 4.4;
cppGenerator.ORDER_TYPEOF = 4.5;
cppGenerator.ORDER_VOID = 4.6;
cppGenerator.ORDER_DELETE = 4.7;
cppGenerator.ORDER_AWAIT = 4.8;
cppGenerator.ORDER_EXPONENTIATION = 5;
cppGenerator.ORDER_MULTIPLICATION = 5.1;
cppGenerator.ORDER_DIVISION = 5.2;
cppGenerator.ORDER_MODULUS = 5.3;
cppGenerator.ORDER_SUBTRACTION = 6.1;
cppGenerator.ORDER_ADDITION = 6.2;
cppGenerator.ORDER_BITWISE_SHIFT = 7;
cppGenerator.ORDER_RELATIONAL = 8;
cppGenerator.ORDER_IN = 8;
cppGenerator.ORDER_INSTANCEOF = 8;
cppGenerator.ORDER_EQUALITY = 9;
cppGenerator.ORDER_BITWISE_AND = 10;
cppGenerator.ORDER_BITWISE_XOR = 11;
cppGenerator.ORDER_BITWISE_OR = 12;
cppGenerator.ORDER_LOGICAL_AND = 13;
cppGenerator.ORDER_LOGICAL_OR = 14;
cppGenerator.ORDER_CONDITIONAL = 15;
cppGenerator.ORDER_ASSIGNMENT = 16;
cppGenerator.ORDER_YIELD = 17;
cppGenerator.ORDER_COMMA = 18;
cppGenerator.ORDER_NONE = 99;
cppGenerator.ORDER_OVERRIDES = [
    [cppGenerator.ORDER_FUNCTION_CALL, cppGenerator.ORDER_MEMBER],
    [cppGenerator.ORDER_FUNCTION_CALL, cppGenerator.ORDER_FUNCTION_CALL],
    [cppGenerator.ORDER_MEMBER, cppGenerator.ORDER_MEMBER],
    [cppGenerator.ORDER_MEMBER,
        cppGenerator.ORDER_FUNCTION_CALL
    ],
    [cppGenerator.ORDER_LOGICAL_NOT, cppGenerator.ORDER_LOGICAL_NOT],
    [cppGenerator.ORDER_MULTIPLICATION, cppGenerator.ORDER_MULTIPLICATION],
    [cppGenerator.ORDER_ADDITION, cppGenerator.ORDER_ADDITION],
    [cppGenerator.ORDER_LOGICAL_AND,
        cppGenerator.ORDER_LOGICAL_AND
    ],
    [cppGenerator.ORDER_LOGICAL_OR, cppGenerator.ORDER_LOGICAL_OR]
];

cppGenerator.init = function(a) {
    Object.getPrototypeOf(cppGenerator).init.call(cppGenerator);
    cppGenerator.nameDB_ ? cppGenerator.nameDB_.reset() : cppGenerator.nameDB_ = new Blockly.Names(cppGenerator.RESERVED_WORDS_);
    cppGenerator.nameDB_.setVariableMap(a.getVariableMap());
    cppGenerator.nameDB_.populateVariables(a);
    cppGenerator.nameDB_.populateProcedures(a);
    for (var b = [], c = (0, Blockly.Variables.allDeveloperVariables)(a), d = 0; d < c.length; d++)
        b.push(cppGenerator.nameDB_.getName(c[d], cppGenerator.nameDB_.DEVELOPER_VARIABLE_TYPE) + " = None");
    var w = a;
    a = (0, Blockly.Variables.allUsedVarModels)(a);
    for (c = 0; c < a.length; c++) {
        cppGenerator.definitions_["include_string"] = "#include &lt;string&gt;";
        let vinit = cppGenerator.nameDB_.getName(a[c].name, "VARIABLE") + ' = ""';
        if (a.length == 1)
            b.push('string ' + vinit + ';')
        else if (c == a.length-1)
            b.push(vinit + ';')
        else if (c)
            b.push(vinit)
        else
            b.push('string ' + vinit);
    }
    cppGenerator.definitions_.variables = b.join(", ");
};

cppGenerator.finish = function(a) {
    var b = [],
        c = [],
        d;
    for (d in cppGenerator.definitions_) {
        var e = cppGenerator.definitions_[d];
        e.match(/#include\s?&lt;\S+&gt;/) ? b.push(e) : c.push(e)
    }
    a = Object.getPrototypeOf(cppGenerator).finish.call(cppGenerator, a);
    cppGenerator.isInitialized = !1;
    cppGenerator.nameDB_.reset();
    return "#include &lt;iostream&gt;\n" + (b.join("\n") + "\n\n")
            + "using namespace std;\n" + (c.join("\n\n")).replace(/\n\n+/g, "\n\n").replace(/\n*$/, "") + "\n\nint main() {\n" + a + "\n  return 0;\n}"
};

cppGenerator.scrubNakedValue = function(a) {
    return "  " + a + ";"
};

cppGenerator.scrub_ = function(a, b, c) {
    var d = "";
    if (!a.outputConnection || !a.outputConnection.targetConnection) {
        var e = a.getCommentText();
        e && (e = (0, Blockly.utils.string.wrap)(e, this.COMMENT_WRAP - 3), d += this.prefixLines(e + "\n", "// "));
        for (var f = 0; f < a.inputList.length; f++) a.inputList[f].type === Blockly.inputTypes.VALUE && (e = a.inputList[f].connection.targetBlock()) && (e = this.allNestedComments(e)) && (d += this.prefixLines(e, "// "))
    }
    a = a.nextConnection &&
        a.nextConnection.targetBlock();
    c = c ? "" : this.blockToCode(a);
    return d + b + c
};

var cppGenerator_texts_strRegExp = /^\s*"([^"]|\\")*'\s*$/,
cppGenerator_texts_forceString = function(s, block='') {
    if(cppGenerator_texts_strRegExp.test(s)){
        return [s, cppGenerator.ORDER_ATOMIC];
    }
    if(block && block.getParent() && cppGenerator.forceStrings.includes(block.getParent().type)){
        cppGenerator.definitions_["include_string"] = "#include &lt;string&gt;";
        return ["to_string(" + s + ")", cppGenerator.ORDER_FUNCTION_CALL];
    }
    return [s, cppGenerator.ORDER_ATOMIC];
};

function myscrub(block, stringValue) {
    tb = block.nextConnection && block.nextConnection.targetBlock();
    return tb ? stringValue + '\n' : stringValue;
}

cppGenerator.variables_set = function(block){
    let vname = cppGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE"),
    val = cppGenerator.valueToCode(block, "VALUE", cppGenerator.ORDER_ASSIGNMENT) || '"0"',
    code = myscrub(block, cppGenerator.prefixLines(vname + " = " + val + ';', cppGenerator.INDENT));
    return code;
};

cppGenerator.variables_get = function(block){
    var name = cppGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");
    return [name, cppGenerator.ORDER_ATOMIC]
};

cppGenerator['text'] = function(block) {
    var textValue = block.getFieldValue('TEXT');
    textValue = textValue.replaceAll('\\','\\\\').replaceAll('"','\\"');
    textValue = `"${textValue}"`;
    return [textValue, cppGenerator.ORDER_ATOMIC];
};

cppGenerator['text_join'] = function(block) {
    const values = [];
    for (var i = 0; i < block.itemCount_; i++) {
        let vtc = cppGenerator.valueToCode(block, 'ADD' + i, cppGenerator.ORDER_ADDITION);
        let valueCode = vtc ? vtc : '""';
        values.push(valueCode);
    }
    return [values.join(' + '), cppGenerator.ORDER_ADDITION];
};

cppGenerator.text_multiline = function(block) {
    a = block.getFieldValue("TEXT");
    a = a.replaceAll('\\','\\\\').replaceAll('"','\\"').replaceAll('\n','\\n');
    a = `"${a}"`;
    var b = -1 !== a.indexOf("+") ? cppGenerator.ORDER_ADDITION : cppGenerator.ORDER_ATOMIC;
    return [a, b];
};

cppGenerator.text_length = function(block) {
    cppGenerator.definitions_["include_string"] = "#include &lt;string&gt;";
    var code = 'string(' + (cppGenerator.valueToCode(block, "VALUE", cppGenerator.ORDER_FUNCTION_CALL) || "''") + ").length()";
    code = cppGenerator_texts_forceString(code, block)[0];
    return [code, cppGenerator.ORDER_FUNCTION_CALL]
};

cppGenerator.text_changeCase = function(block) {
    cppGenerator.definitions_["include_string"] = "#include &lt;string&gt;";
    cppGenerator.definitions_["include_cctype"] = "#include &lt;cctype&gt;";
    var c = '';
    switch(block.getFieldValue("CASE")){
        case 'UPPERCASE':
            c = 'upper(';
            cppGenerator.definitions_['case'] = "string upper(string s){\n  for(int i=0;i&lt;s.length();i++)\n    s[i]=toupper(s[i]);\n  return string(s);\n}";
            break;
        case 'LOWERCASE':
            c = 'lower(';
            cppGenerator.definitions_['case'] = "string lower(string s){\n  for(int i=0;i&lt;s.length();i++)\n    s[i]=tolower(s[i]);\n  return string(s);\n}";
            break;
        case 'TITLECASE':
            c = 'title(';
            cppGenerator.definitions_['case'] = "string title(string s) {\n  char prev = ' ';\n  for(int i=0; i < s.length(); i++) {\n    if(prev == ' ')\n      s[i] = toupper(s[i]);\n    prev = s[i];\n  }\n  return s;\n}";
            break;
    }
    var vtc = (cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_FUNCTION_CALL)) || '""';
    vtc = c + vtc + ')';
    return [vtc, cppGenerator.ORDER_FUNCTION_CALL];
};

cppGenerator.text_count = function(block) {
    cppGenerator.definitions_["include_string"] = "#include &lt;string&gt;";
    cppGenerator.definitions_['count'] = 'int strcount(string str, string sub_str) {\n  int c = 0;\n  for (int i = 0; i < str.length(); i++)\n    if (str.substr(i, sub_str.length()) == sub_str)\n      c++;\n  return c;\n}';
    var txt = cppGenerator.valueToCode(block, "TEXT", cppGenerator.ORDER_FUNCTION_CALL) || '""';
    var sub = cppGenerator.valueToCode(block, "SUB", cppGenerator.ORDER_NONE) || '""';
    var code = 'strcount(' + txt + ', ' + sub + ')';
    code = cppGenerator_texts_forceString(code, block)[0];
    return [code, cppGenerator.ORDER_FUNCTION_CALL];
};

cppGenerator.text_replace = function(block) {
    cppGenerator.definitions_["include_string"] = "#include &lt;string&gt;";
    cppGenerator.definitions_['replace'] = 'string replace(string search, string replaceStr, string s) {\n  size_t pos = s.find(search);\n  while (pos != string::npos) {\n    s.replace(pos, search.size(), replaceStr);\n    pos = s.find(search, pos + replaceStr.size());\n  }\n  return s;\n}';
    var txt = cppGenerator.valueToCode(block, "TEXT", cppGenerator.ORDER_NONE) || "''",
        frm = cppGenerator.valueToCode(block, "FROM", cppGenerator.ORDER_NONE) || "''",
		to = cppGenerator.valueToCode(block, "TO", cppGenerator.ORDER_NONE) || "''";
    var code = "replace(" + frm + ", " + to + ", " + txt + ")";
    return [code, cppGenerator.ORDER_FUNCTION_CALL];
};

cppGenerator.text_reverse = function(block) {
    cppGenerator.definitions_["include_string"] = "#include &lt;string&gt;";
    cppGenerator.definitions_['reverse'] = 'string reverse(string str) {\n  int n = str.length();\n  for (int i = 0; i < n / 2; i++)\n    swap(str[i], str[n - i - 1]);\n  return str;\n}';
    var code = "reverse(" + (cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_FUNCTION_CALL) || '""') + ")";
    return [code, cppGenerator.ORDER_FUNCTION_CALL];
};

cppGenerator.text_print = function(block) {
    var code = myscrub(block, 'cout << ' + cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_NONE) + ';');
    return cppGenerator.prefixLines(code, cppGenerator.INDENT);
}

cppGenerator.prompt_inp = function(block) {
    var tb = block.nextConnection && block.nextConnection.targetBlock(),
    print = cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_NONE) !== '""' ? tb ?  cppGenerator.text_print(block) + '' : cppGenerator.text_print(block) + '\n' : '',
    vname = cppGenerator.nameDB_.getName(block.getFieldValue("VAR"), 'VARIABLE'),
    inp = myscrub(block, cppGenerator.prefixLines('cin >> ' + vname + ';', cppGenerator.INDENT)); 
    return print + inp;
};


cppGenerator.controls_if = function(a) {
    var b = 0,
        c = "";
    cppGenerator.STATEMENT_PREFIX && (c += cppGenerator.injectId(cppGenerator.STATEMENT_PREFIX, a));
    do {
        var d = cppGenerator.valueToCode(a, "IF" + b, cppGenerator.ORDER_NONE) || "false",
            e = cppGenerator.statementToCode(a, "DO" + b);
            if(e) e+='\n';
        cppGenerator.STATEMENT_SUFFIX && (e = cppGenerator.prefixLines(cppGenerator.injectId(cppGenerator.STATEMENT_SUFFIX, a), cppGenerator.INDENT) + e);
        c += (0 < b ?
            "\nelse " : "") + "if (" + d + ") {\n" + e + "}";
        b++
    } while (a.getInput("IF" + b));
    if (a.getInput("ELSE") || cppGenerator.STATEMENT_SUFFIX) b = cppGenerator.statementToCode(a, "ELSE"), cppGenerator.STATEMENT_SUFFIX && (b = cppGenerator.prefixLines(cppGenerator.injectId(cppGenerator.STATEMENT_SUFFIX, a), cppGenerator.INDENT) + b), c += "\nelse {\n", c += b ? b+"\n}" : b + "}";
    c = cppGenerator.prefixLines(c, cppGenerator.INDENT);
    if(a.getNextBlock()) c+='\n';
    return c
};

cppGenerator.logic_compare = function(block) {
    var b = {
            EQ: "==",
            NEQ: "!=",
            LT: "<",
            LTE: "<=",
            GT: ">",
            GTE: ">="
        } [block.getFieldValue("OP")],
        c = "==" === b || "!=" === b ? cppGenerator.ORDER_EQUALITY : cppGenerator.ORDER_RELATIONAL,
        d = cppGenerator.valueToCode(block, "A", c) || 'false',
        a = cppGenerator.valueToCode(block, "B", c) || 'false',
        code = d + " " + b + " " + a;
    if (block.getParent() && block.getParent().type === "text_print") {
        code = "(" + code + ")";
    }
    code = cppGenerator_texts_forceString(code, block)[0];
    return [code, c]
};

cppGenerator.logic_operation = function(block) {
    var b = "AND" === block.getFieldValue("OP") ? "&&" : "||",
        c = "&&" === b ? cppGenerator.ORDER_LOGICAL_AND : cppGenerator.ORDER_LOGICAL_OR,
        d = cppGenerator.valueToCode(block, "A", c);
    a = cppGenerator.valueToCode(block, "B", c);
    if (d || a) {
        var e = "&&" === b ? "true" : "false";
        d || (d = e);
        a || (a = e)
    } else a = d = "false";
    return [d + " " + b + " " + a, c]
};

cppGenerator.logic_negate = function(block) {
    var b = cppGenerator.ORDER_LOGICAL_NOT;
    return ["!" + (cppGenerator.valueToCode(block, "BOOL", b) || "true"), b]
};

cppGenerator.logic_boolean = function(a) {
    return ["TRUE" === a.getFieldValue("BOOL") ? "true" : "false", cppGenerator.ORDER_ATOMIC]
};

cppGenerator.logic_ternary = function(block) {
    var b = cppGenerator.valueToCode(block, "IF", cppGenerator.ORDER_CONDITIONAL) || "false",
        c = cppGenerator.valueToCode(block, "THEN", cppGenerator.ORDER_CONDITIONAL) || 'true',
    a = cppGenerator.valueToCode(block, "ELSE", cppGenerator.ORDER_CONDITIONAL) || 'true',
    code = b + " ? " + c + " : " + a;
    if (block.getParent() && block.getParent().type === "text_print") {
        code = "(" + code + ")";
    }
    return [code, cppGenerator.ORDER_CONDITIONAL]
};


cppGenerator.math_number = function(a) {
    a = Number(a.getFieldValue("NUM"));
    return [a, 0 <= a ? cppGenerator.ORDER_ATOMIC : cppGenerator.ORDER_UNARY_NEGATION]
};

cppGenerator.controls_repeat_ext = function(block) {
    var b = block.getField("TIMES") ? String(Number(block.getFieldValue("TIMES"))) : cppGenerator.valueToCode(block, "TIMES", cppGenerator.ORDER_ASSIGNMENT) || "0";
    var c = cppGenerator.statementToCode(block, "DO");
    c = cppGenerator.addLoopTrap(c, block);
    a = "";
    var d = cppGenerator.nameDB_.getDistinctName("count", "VARIABLE"),
        e = b;
    b.match(/^\w+$/) || (0, Blockly.utils.string.isNumber)(b) || (e = cppGenerator.nameDB_.getDistinctName("repeat_end",
        "VARIABLE"), a += "int " + e + " = " + b + ";\n");
    a = a + ("for (int " + d + " = 0; " + d + " < " + e + "; " + d + "++) {\n" + c + (c?"\n}":"}"));
    a = cppGenerator.prefixLines(a, cppGenerator.INDENT);
    if((block.nextConnection && block.nextConnection.targetBlock()))
        a+='\n';
    return a;
};

cppGenerator.controls_whileUntil = function(block) {
    var b = "UNTIL" === block.getFieldValue("MODE"),
        c = cppGenerator.valueToCode(block, "BOOL", b ? cppGenerator.ORDER_LOGICAL_NOT : cppGenerator.ORDER_NONE) || "false",
        d = cppGenerator.statementToCode(block, "DO");
    d = cppGenerator.addLoopTrap(d, block);
    b && (c = "!" + c);
    var code = cppGenerator.prefixLines("while (" + c + ") {\n" + d + (d?"\n}":"}"), cppGenerator.INDENT);
    if((block.nextConnection && block.nextConnection.targetBlock()))
        code+='\n';
    return code
};

cppGenerator.controls_for = function(block) {
    var b = cppGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE"),
        c = cppGenerator.valueToCode(block, "FROM", cppGenerator.ORDER_ASSIGNMENT) || "0",
        d = cppGenerator.valueToCode(block, "TO", cppGenerator.ORDER_ASSIGNMENT) || "0",
        e = cppGenerator.valueToCode(block, "BY", cppGenerator.ORDER_ASSIGNMENT) || "1",
        f = cppGenerator.statementToCode(block, "DO");
    f = cppGenerator.addLoopTrap(f,
        block);
    if ((0, Blockly.utils.string.isNumber)(c) && (0, Blockly.utils.string.isNumber)(d) && (0, Blockly.utils.string.isNumber)(e)) {
        var g = Number(c) <= Number(d);
        a = "for (int " + b + " = " + c + "; " + b + (g ? " <= " : " >= ") + d + "; " + b;
        b = Math.abs(Number(e));
        a = (1 === b ? a + (g ? "++" : "--") : a + ((g ? " += " : " -= ") + b)) + (") {\n" + f + (f?"\n}":"}"))
    } else {
        cppGenerator.definitions_["include_cmath"] = "#include &lt;cmath&gt;";
        a = "", g = c, c.match(/^\w+$/) || (0, Blockly.utils.string.isNumber)(c) || (g = cppGenerator.nameDB_.getDistinctName(b + "_start", "VARIABLE"),
        a += "int " + g + " = " + c + ";\n"), c = d, d.match(/^\w+$/) || (0, Blockly.utils.string.isNumber)(d) || (c = cppGenerator.nameDB_.getDistinctName(b + "_end", "VARIABLE"), a += "int " + c + " = " + d + ";\n"), d = cppGenerator.nameDB_.getDistinctName(b + "_inc", "VARIABLE"), a += "int " + d + " = ", a = (0, Blockly.utils.string.isNumber)(e) ? a + (Math.abs(e) + ";\n") : a + ("abs(" + e + ");\n"), a = a + ("if (" + g + " > " + c + ") {\n") + (cppGenerator.INDENT +
        d + " = -" + d + ";\n"), a += "}\n", a += "for (int " + b + " = " + g + "; " + d + " >= 0 ? " + b + " <= " + c + " : " + b + " >= " + c + "; " + b + " += " + d + ") {\n" + f + "}";
    }
    if((block.nextConnection && block.nextConnection.targetBlock()))
        a+='\n';
    return cppGenerator.prefixLines(a, cppGenerator.INDENT)
};

cppGenerator.controls_flow_statements = function(a) {
    var b = "";
    cppGenerator.STATEMENT_PREFIX && (b += cppGenerator.injectId(cppGenerator.STATEMENT_PREFIX, a));
    cppGenerator.STATEMENT_SUFFIX && (b += cppGenerator.injectId(cppGenerator.STATEMENT_SUFFIX, a));
    if (cppGenerator.STATEMENT_PREFIX) {
        var c = a.getSurroundLoop();
        c && !c.suppressPrefixSuffix && (b += cppGenerator.injectId(cppGenerator.STATEMENT_PREFIX, c))
    }
    switch (a.getFieldValue("FLOW")) {
        case "BREAK":
            return b +
                "break;";
        case "CONTINUE":
            return b + "continue;"
    }
    throw Error("Unknown flow statement.");
};
