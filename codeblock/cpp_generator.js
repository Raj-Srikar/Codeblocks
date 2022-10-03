const cppGenerator = new Blockly.Generator('CPP');

cppGenerator.forceStrings = ['text_join'];

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
    a = (0, Blockly.Variables.allUsedVarModels)(a);
    for (c = 0; c < a.length; c++)
        b.push("  int " + cppGenerator.nameDB_.getName(a[c].name, "VARIABLE") + " = 0;");
    cppGenerator.definitions_.variables = b.join("\n");
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
    return "#include &lt;iostream.h&gt;\n" + (b.join("\n") + "\n\n")
            + "using namespace std;" + (c.join("\n\n")).replace(/\n\n+/g, "\n\n").replace(/\n*$/, "") + "\n\nint main() {\n" + a + "\n  return 0;\n}"
};

var cppGenerator_texts_strRegExp = /^\s*"([^"]|\\")*'\s*$/,
cppGenerator_texts_forceString = function(s, block='') {
    if(cppGenerator_texts_strRegExp.test(s)){
        return [s, cppGenerator.ORDER_ATOMIC];
    }
    if(block && block.getParent() && cppGenerator.forceStrings.includes(block.getParent().type)){
        cppGenerator.definitions_["include_string"] = "#include &lt;string.h&gt;";
        return ["to_string(" + s + ")", cppGenerator.ORDER_FUNCTION_CALL];
    }
    return [s, cppGenerator.ORDER_ATOMIC];
};

function semify(block, stringValue) {
    if(!block.parentBlock_){
        stringValue = cppGenerator.prefixLines(stringValue, cppGenerator.INDENT);
        return stringValue + ';';
    }
    return stringValue;
}

cppGenerator.variables_get = function(block){
    var name = cppGenerator.nameDB_.getName(block.getFieldValue("VAR"), "VARIABLE");
    name = cppGenerator_texts_forceString(name, block)[0];
    name = semify(block, name);
    return [name, cppGenerator.ORDER_ATOMIC]
};

cppGenerator['text'] = function(block) {
    var textValue = block.getFieldValue('TEXT');
    var code = semify(block, `"${textValue}"`);
    return [code, cppGenerator.ORDER_ATOMIC];
};

cppGenerator['text_join'] = function(block) {
    const values = [];
    for (var i = 0; i < block.itemCount_; i++) {
        let vtc = cppGenerator.valueToCode(block, 'ADD' + i, cppGenerator.ORDER_ADDITION);
        let valueCode = vtc ? vtc : '""';
        values.push(valueCode);
    }
    let valueString = semify(block, values.join(' + '));
    return [valueString, cppGenerator.ORDER_ADDITION];
};

cppGenerator.text_multiline = function(block) {
    a = block.getFieldValue("TEXT");
    a = '"' + a + '"';
    a = a.replaceAll('\n','\\n');
    var b = -1 !== a.indexOf("+") ? cppGenerator.ORDER_ADDITION : cppGenerator.ORDER_ATOMIC;
    a = semify(block, a);
    return [a, b];
};

cppGenerator.text_length = function(block) {
    cppGenerator.definitions_["include_string"] = "#include &lt;string.h&gt;";
    var code = 'string(' + (cppGenerator.valueToCode(block, "VALUE", cppGenerator.ORDER_FUNCTION_CALL) || "''") + ").length()";
    code = cppGenerator_texts_forceString(code, block)[0];
    code = semify(block, code);
    return [code, cppGenerator.ORDER_FUNCTION_CALL]
};

cppGenerator.text_changeCase = function(block) {
    cppGenerator.definitions_["include_string"] = "#include &lt;string.h&gt;";
    cppGenerator.definitions_["include_cctype"] = "#include &lt;cctype.h&gt;";
    var c = '';
    switch(block.getFieldValue("CASE")){
        case 'UPPERCASE':
            c = 'upper(';
            cppGenerator.definitions_['case'] = "string upper(string s){\n  char up[s.length()+1];\n  for(int i=0;i&lt;s.length();i++)\n    up[i]=toupper(s[i]);\n  up[s.length()] = '\\0';\n  return string(up);\n}";
            break;
        case 'LOWERCASE':
            c = 'lower(';
            cppGenerator.definitions_['case'] = "string lower(string s){\n  char up[s.length()+1];\n  for(int i=0;i&lt;s.length();i++)\n    up[i]=tolower(s[i]);\n  up[s.length()] = '\\0';\n  return string(up);\n}";
            break;
        case 'TITLECASE':
            c = 'title(';
            cppGenerator.definitions_['case'] = 'string title(string s){\n  size_t pos = 0;\n  string token, t="";\n  while ((pos = s.find(\' \')) != string::npos) {\n    token = s.substr(0, pos);\n    t += (char)toupper(token[0]) + token.substr(1, token.length()) + " ";\n    s.erase(0, pos + 1);\n  }\n  token = s.substr(0, pos);\n  t += (char)toupper(token[0]) + token.substr(1, token.length());\n  return t;\n}\n';
            break;
    }
    var vtc = (cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_FUNCTION_CALL)) || '""';
    vtc = c + vtc + ')';
    vtc = semify(block, vtc);
    return [vtc, cppGenerator.ORDER_FUNCTION_CALL];
};

cppGenerator.text_count = function(block) {
    cppGenerator.definitions_["include_string"] = "#include &lt;string.h&gt;";
    cppGenerator.definitions_['count'] = 'int strcount(string str, string sub_str) {\n  int c = 0;\n  for (int i = 0; i < str.length(); i++)\n    if (str.substr(i, sub_str.length()) == sub_str)\n      c++;\n  return c;\n}';
    var txt = cppGenerator.valueToCode(block, "TEXT", cppGenerator.ORDER_FUNCTION_CALL) || '""';
    var sub = cppGenerator.valueToCode(block, "SUB", cppGenerator.ORDER_NONE) || '""';
    var code = 'strcount(' + txt + ', ' + sub + ')';
    code = cppGenerator_texts_forceString(code, block)[0];
    code = semify(block, code);
    return [code, cppGenerator.ORDER_FUNCTION_CALL];
};

cppGenerator.text_replace = function(block) {
    cppGenerator.definitions_["include_string"] = "#include &lt;string.h&gt;";
    cppGenerator.definitions_['replace'] = 'string replace(string search, string replaceStr, string s) {\n  size_t pos = s.find(search);\n  while (pos != string::npos) {\n    s.replace(pos, search.size(), replaceStr);\n    pos = s.find(search, pos + replaceStr.size());\n  }\n  return s;\n}';
    var txt = cppGenerator.valueToCode(block, "TEXT", cppGenerator.ORDER_NONE) || "''",
        frm = cppGenerator.valueToCode(block, "FROM", cppGenerator.ORDER_NONE) || "''",
		to = cppGenerator.valueToCode(block, "TO", cppGenerator.ORDER_NONE) || "''";
    var code = "replace(" + frm + ", " + to + ", " + txt + ")";
    code = semify(block, code);
    return [code, cppGenerator.ORDER_FUNCTION_CALL];
};

cppGenerator.text_reverse = function(block) {
    cppGenerator.definitions_["include_string"] = "#include &lt;string.h&gt;";
    cppGenerator.definitions_['reverse'] = 'string reverse(string str) {\n  int n = str.length();\n  for (int i = 0; i < n / 2; i++)\n    swap(str[i], str[n - i - 1]);\n  return str;\n}';
    var code = "reverse(" + (cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_FUNCTION_CALL) || '""') + ")";
    code = semify(block, code);
    return [code, cppGenerator.ORDER_FUNCTION_CALL];
};

cppGenerator.text_print = function(block) {
    var code = 'cout << ' + cppGenerator.valueToCode(block, 'TEXT', cppGenerator.ORDER_NONE) + ';';
    return cppGenerator.prefixLines(code, cppGenerator.INDENT);
}

