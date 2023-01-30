class CustomCategory extends Blockly.ToolboxCategory {
    /**
     * Constructor for a custom category.
     * @override
     */
    constructor(categoryDef, toolbox, opt_parent) {
      super(categoryDef, toolbox, opt_parent);
    }

    /** @override */
    addColourBorder_(colour){
        this.rowDiv_.style.border = '1.6px solid ' + colour;
        this.rowDiv_.addEventListener('mouseover', ()=>{
            this.rowDiv_.style.border = '1.6px solid ' + pSBC(0.5,this.colour_);
        })
        this.rowDiv_.addEventListener('mouseleave', ()=>{
            this.rowDiv_.style.border = '1.6px solid ' + this.colour_;
        })
    }

    /** @override */
    setSelected(isSelected){
        // We do not store the label span on the category, so use getElementsByClassName.
        var labelDom = this.rowDiv_.getElementsByClassName('blocklyTreeLabel')[0];
        if (isSelected) {
            // Get a lightened colour
            let c = pSBC(0.5,this.colour_);
            
            // Change the border of the div with a lightened colour.
            this.rowDiv_.style.border = '1.6px solid ' + c;
            // Add box shadow
            this.rowDiv_.style.boxShadow = '0 0 15px 2px ' + this.colour_;
            // Increase the size
            this.rowDiv_.style.transform = 'scale(1.2)';
            // Set the colour of the text to the lightened colour.
            labelDom.style.color = c;
        } else {
            // Set the background back to the original colour.
            this.rowDiv_.style.border = '1.6px solid ' + this.colour_;
            // Set the text back to white.
            labelDom.style.color = 'white';
            // Disable box shadow
            this.rowDiv_.style.boxShadow = '';
            // Restore to original size
            this.rowDiv_.style.transform = '';
        }
        
        // This is used for accessibility purposes.
        Blockly.utils.aria.setState(/** @type {!Element} */ (this.htmlDiv_),
            Blockly.utils.aria.State.SELECTED, isSelected);
    }
}

Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.ToolboxCategory.registrationName,
    CustomCategory, true);
