const cppGenerator = new Blockly.Generator('CPP');
cppGenerator.definitions = {};

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

function semify(block, stringValue) {
    if(!block.parentBlock_){
        stringValue = cppGenerator.prefixLines(stringValue, cppGenerator.INDENT);
        return stringValue + ';';
    }
    return stringValue;
}

var cppGenerator_texts_strRegExp = /^\s*'([^']|\\')*'\s*$/,
cppGenerator_texts_forceString = function(s) {
    if(cppGenerator_texts_strRegExp.test(s)){
        return [s, $.Blockly.Python.ORDER_ATOMIC];
    }
    cppGenerator.definitions["include_string"] = "#include &lt;string.h&gt;";
    return ["to_string(" + s + ")", cppGenerator.ORDER_FUNCTION_CALL];
};

cppGenerator['text'] = function(block) {
    var textValue = block.getFieldValue('TEXT');
    var code = semify(block, `"${textValue}"`);
    return [code, cppGenerator.ORDER_ATOMIC];
};

cppGenerator['text_join'] = function(block) {
    const values = [];
    for (var i = 0; i < block.itemCount_; i++) {
        let vtc = cppGenerator.valueToCode(block, 'ADD' + i, 0)
        let valueCode = vtc ? vtc || '' : '""';
        if (valueCode)
            values.push(valueCode);
    }
    let valueString = semify(block, values.join(' + '));
    return [valueString, cppGenerator.ORDER_ATOMIC];
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
    cppGenerator.definitions["include_string"] = "#include &lt;string.h&gt;";
    a = 'string(' + (cppGenerator.valueToCode(block, "VALUE", cppGenerator.ORDER_MEMBER) || "''") + ").length()";
    a = cppGenerator_texts_forceString(a)[0];
    a = semify(block, a);
    return [a, cppGenerator.ORDER_FUNCTION_CALL]
};
