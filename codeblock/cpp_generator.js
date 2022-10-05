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
