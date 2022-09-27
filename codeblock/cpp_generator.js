const cppGenerator = new Blockly.Generator('CPP');

function semify(block, stringValue) {
    return !block.parentBlock_ ? stringValue + ';' : stringValue;
}

cppGenerator['text'] = function(block) {
    var textValue = block.getFieldValue('TEXT');
    var code = semify(block, `"${textValue}"`);
    return [code, 0];
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
    return [valueString, 0];
}