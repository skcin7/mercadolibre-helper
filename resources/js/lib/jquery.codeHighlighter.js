/*!
 * codeHighlighter v0.0.1
 * Adds HTML markup to beautify source code for various programming languages languages in a HTML document.
 *
 * URL: (None)
 * Copyright (c) Nick Morgan <nick@nicholas-morgan.com> — @skcin7 — https://nicholas-morgan.com
 * License: MIT
 */
(function ($, window, document) {
    'use strict';

    /**
     * The main codeHighligher function.
     *
     * @param options
     */
    $.fn.codeHighlighter = function (options) {

        // // Ensure that only one codeHighlighter exists
        // if(! $.data(document.body, 'codeHighlighter')) {
        //     $.data(document.body, 'codeHighlighter', true);
        //     $.fn.codeHighlighter.init(options);
        // }

        // return $.fn.codeHighlighter();
    };

    /**
     * codeHighlighter Initialization.
     *
     * @param options
     */
    $.fn.codeHighlighter.init = function (options) {
        console.log('initializing codeHighlighter...');

        $.fn.codeHighlighter.settings = $.extend({}, $.fn.codeHighlighter.defaults, options)

        let $codeHighlighterElems = $('.codeHighlighter');
        $codeHighlighterElems.each(function(index, thisCodeHighlighterElem) {
            let $thisCodeHighlighterElem = $(thisCodeHighlighterElem);

            // // get settings to be used (which override the default settings)
            // let thisElemSettings = $.fn.codeHighlighter.settings;
            // thisElemSettings.linebreaks = $thisCodeHighlighterElem.data('linebreaks');
            // thisElemSettings.tabSize = $thisCodeHighlighterElem.data('tab-size');

            let thisElemSettings = $.extend($.fn.codeHighlighter.settings, {
                "highlight": $thisCodeHighlighterElem.data('highlight'),
                "linebreaks": $thisCodeHighlighterElem.data('linebreaks'),
                "tabSize": $thisCodeHighlighterElem.data('tab-size'),
            });

            console.log(thisElemSettings);

            // the user may optionally omit this specific element from being highlighted if they set the "highlighted" data property to false.
            if(thisElemSettings.highlight === false) {
                console.log('this elem is not being highlighted');
                return;
            }

            // format the code and update the DOM:
            let language = $thisCodeHighlighterElem.data('language'); // determine the type of programming language code that is being highlighted.
            let raw_code = $thisCodeHighlighterElem.text();
            switch(language.toLowerCase()) {
                case 'json':
                    $thisCodeHighlighterElem.html($.codeHighlighter.addJsonHtmlFormattingMarkup(raw_code, thisElemSettings));
                    break;
            }
        });
    };

    /**
     * The defaults to use for the codeHighlighter.
     *
     * @type {{tabSize: number, linebreaks: boolean}}
     */
    $.fn.codeHighlighter.defaults = {
        "highlight": true,    // Whether or not to process the highlighting. Set to false to disable the highlighting from taking place.
        "linebreaks": true,   // Whether or not linebreaks should be added to the final outputted code
        "tabSize": 4,         // The size each tab should be in the outputted code (only applicable if the outputted code uses linebreaks)
    };

    /**
     * This is a test function to make sure that the jquery plugin is working fine.
     *
     * @param testParameter
     * @returns {string|*}
     */
    $.fn.codeHighlighter.testFunction = function(testParameter) {
        console.log('inside testFunction');
        console.log(testParameter);
        return 'test response data';
    };

    /**
     * Add HTML markup to some JSON code.
     *
     * @param raw_json
     * @param options
     * @returns {string|*}
     */
    $.fn.codeHighlighter.addJsonHtmlFormattingMarkup = function(raw_json, options = {}) {
        // optionally add line breaks to the final formatted code:
        if(options.linebreaks) {
            raw_json = JSON.parse(raw_json);
            raw_json = JSON.stringify(raw_json, undefined, options.tabSize ? options.tabSize : 4);
        }

        raw_json = raw_json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return raw_json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'codeHighlighter__json_number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'codeHighlighter__json_key';
                } else {
                    cls = 'codeHighlighter__json_string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'codeHighlighter__json_boolean';
            } else if (/null/.test(match)) {
                cls = 'codeHighlighter__json_null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    };

    // /**
    //  * Add the HTML markup to the code for the given programming language.
    //  *
    //  * @param code
    //  * @param language
    //  * @param options
    //  * @returns {string|*}
    //  */
    // $.fn.codeHighlighter.addHtmlMarkup = function(code, language = 'json', options = {}) {
    //     if(language === 'json') {
    //         // optionally add line breaks to the final formatted code:
    //         if(options.linebreaks) {
    //             code = JSON.parse(code);
    //             code = JSON.stringify(code, undefined, options.tabSize ? options.tabSize : 4);
    //         }
    //
    //         code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    //         return code.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    //             let cls = 'codeHighlighter__json_number';
    //             if (/^"/.test(match)) {
    //                 if (/:$/.test(match)) {
    //                     cls = 'codeHighlighter__json_key';
    //                 } else {
    //                     cls = 'codeHighlighter__json_string';
    //                 }
    //             } else if (/true|false/.test(match)) {
    //                 cls = 'codeHighlighter__json_boolean';
    //             } else if (/null/.test(match)) {
    //                 cls = 'codeHighlighter__json_null';
    //             }
    //             return '<span class="' + cls + '">' + match + '</span>';
    //         });
    //     }
    //
    //     // failsafe. no language was specified, so just return the unmodified code.
    //     return code;
    // };

    $.codeHighlighter = $.fn.codeHighlighter;

})(jQuery, window, document);
