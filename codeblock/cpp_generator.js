const cppGenerator = new Blockly.Generator('CPP');

cppGenerator['text'] = function(block) {
    var textValue = block.getFieldValue('TEXT');
    var code = '"' + textValue + '"';
    return [code, 0];
};

// cppGenerator['text_multiline'] = function(block) {
    
// }