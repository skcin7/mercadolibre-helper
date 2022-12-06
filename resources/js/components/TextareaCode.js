import {
    getComponent,
} from '../components';

class TextareaCode
{

    #config = {};
    static #default_config = {
        'tab_size': 4,
    };

    constructor(config = {}) {
        this.#config = {
            ...config,
            ...TextareaCode.#default_config,
        };
        console.log('Set Config To:');
        console.log(this.#config);


        console.log('Create new TextareaCode instance!!!');

        let _this = this;

        // Handle when a button is pressed in a textarea designed for code...
        $(document).on('keydown', '.textarea_code', function(event) {
            // Handle "TAB" being pressed...
            if(event.key == 'Tab') {
                event.preventDefault();
                let textBeforeIndenting = this.value;

                let start = this.selectionStart;
                let end = this.selectionEnd;

                let startLineNumber = _this.#getLineNumber(textBeforeIndenting, start);
                let endLineNumber = _this.#getLineNumber(textBeforeIndenting, end);

                app().log('start: ' + start);
                app().log('end: ' + end);

                app().log('start line number: ' + startLineNumber);
                app().log('end line number: ' + endLineNumber);

                console.log(getComponent('Keyboard'));

                // When start and end are the same, and shift is NOT held, then just do a regular indent at the current caret position.
                if(start == end) {
                    if( !getComponent('Keyboard').isKeyPressed("Shift") ) {
                        app().log('Shift is not currently pressed, so indent regularly (no highlighted text).');

                        this.value = this.value.substring(0, start) +
                            (" ".repeat(_this.#config.tab_size)) +
                            this.value.substring(end);

                        this.selectionStart =
                            this.selectionEnd = start + _this.#config.tab_size;
                    }
                    return;
                    // else {
                    //     app().log('Shift is currently pressed, so un-indent (no highlighted text).');
                    // }
                }


                // At this point, either Shift is held (un-indent), or some text is highlighted (start and end position are not the same), or both.
                // In this case we must indent/un-indent all the currently selected lines.
                let textLines = textBeforeIndenting.split("\n");
                app().log(textLines);

                if(! getComponent('Keyboard').isKeyPressed("Shift")) {
                    app().log('Shift is not currently pressed, so indent regularly.');

                    let totalCharactersAdded = 0;
                    let linesIndented = 0;
                    for(let currentLineNumber = startLineNumber; currentLineNumber <= endLineNumber; currentLineNumber++) {
                        app().log('indenting line number: ' + currentLineNumber);

                        textLines[currentLineNumber - 1] = " ".repeat(_this.#config.tab_size) + textLines[currentLineNumber - 1];
                        totalCharactersAdded = totalCharactersAdded + _this.#config.tab_size;
                        linesIndented++;

                        app().log(textLines[currentLineNumber - 1]);
                    }
                    app().log('total characters added: ' + totalCharactersAdded);
                    app().log('lines indented: ' + linesIndented);

                    this.value = textLines.join("\n");

                    this.selectionStart = start + _this.#config.tab_size;
                    this.selectionEnd = end + totalCharactersAdded;
                }
                else {
                    app().log('Shift is currently pressed, so un-indent.');

                    let totalCharactersRemoved = 0;
                    let linesUnindented = 0;
                    let newSelectionStart = start;
                    let newSelectionEnd = end;
                    for(let currentLineNumber = startLineNumber; currentLineNumber <= endLineNumber; currentLineNumber++) {
                        app().log('un-indenting line number: ' + currentLineNumber);

                        // Are the beginning characters of this line the number of spaces to be indented? If so, then we can un-indent this line.
                        if(textLines[currentLineNumber - 1].substring(0, _this.#config.tab_size) == " ".repeat(_this.#config.tab_size)) {
                            textLines[currentLineNumber - 1] = textLines[currentLineNumber - 1].substring(_this.#config.tab_size);
                            totalCharactersRemoved = totalCharactersRemoved + _this.#config.tab_size;
                            linesUnindented++;

                            app().log(textLines[currentLineNumber - 1]);

                            // Update the current start position only if the first line is being un-indented.
                            // If the start line number is being un-indented, then the start cursor subtracts by the tab size.
                            if(currentLineNumber == startLineNumber) {
                                newSelectionStart = newSelectionStart - _this.#config.tab_size;

                                // Don't allow the selection start to be anything lower than 0 because that's impossible to start anywhere before the beginning of the text.
                                if(0 > newSelectionStart) {
                                    newSelectionStart = 0;
                                }
                            }
                        }
                    }
                    newSelectionEnd = end - (linesUnindented * _this.#config.tab_size);

                    this.value = textLines.join("\n");

                    app().log('newSelectionStart: ' + newSelectionStart);
                    app().log('newSelectionEnd: ' + newSelectionEnd);

                    this.selectionStart = newSelectionStart;
                    this.selectionEnd = newSelectionEnd;
                }
            }
        });

    };

    #getLineNumber = (text, selectionPosition) => {
        return text.substr(0, selectionPosition).split("\n").length;
    };




}

export {
    TextareaCode,
};
