const toolbox = {
'kind': 'flyoutToolbox',
  'contents': [
    {
      'kind': 'block',
      'type': 'controls_repeat_ext',
      'inputs': {
        'TIMES': {
          'shadow': {
            'type': 'math_number',
            'fields': {
              'NUM': 5
            }
          }
        }
      }
    }
  ]
}

Blockly.inject('blocklyDiv', {
  toolbox: toolbox,
  scrollbars: false
});
