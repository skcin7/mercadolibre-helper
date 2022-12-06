// From https://stackoverflow.com/a/6871820/721361
;(function($, undefined) {

    let defaults = {
        'selector': '.textarea_autogrow',
    };

    let methods = {
        'init': function(options) {
            console.log('textareaAutogrow init');
            let settings = $.extend({}, defaults, options);

            $('body').on('keyup', '.textarea_autogrow', (event) => {
                console.log('textarea_autosize keyup');

                $(this).css('overflow', 'hidden');
                $(this).css('height', 0);
                // $(this).css('height', $(this)[0].scrollHeight + 'px');

                // this.style.overflow = 'hidden';
                // this.style.height = 0;
                // this.style.height = this.scrollHeight + 'px';
            });
        },
        // 'show': function( ) {    },// IS
        // 'hide': function( ) {  },// GOOD
        // 'update': function( content ) {  }// !!!
    };

    $.fn.textareaAutogrow = function(methodOrOptions) {
        if(methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if(typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' +  methodOrOptions + ' does not exist in the jQuery.textareaAutogrow plugin.');
        }
    };

})(jQuery);



// ;(function($, window, undefined) {
//     const defaults = {
//         elementId   : null,
//         shape       : "square",
//         color       : "aqua",
//         borderWidth : "10px",
//         borderColor : "DarkGray"
//     };
//
//     $.fn.myPlugin = function(options) {
//         // settings, e.g.:
//         var settings = $.extend({}, defaults, options);
//
//         // private methods, e.g.:
//         var setBorder = function(color, width) {
//             settings.borderColor = color;
//             settings.borderWidth = width;
//             drawShape();
//         };
//
//         var drawShape = function() {
//             $('#' + settings.elementId).attr('class', settings.shape + " " + "center");
//             $('#' + settings.elementId).css({
//                 'background-color': settings.color,
//                 'border': settings.borderWidth + ' solid ' + settings.borderColor
//             });
//             $('#' + settings.elementId).html(settings.color + " " + settings.shape);
//         };
//
//         return this.each(function() { // jQuery chainability
//             // set stuff on ini, e.g.:
//             settings.elementId = $(this).attr('id');
//             drawShape();
//
//             // PUBLIC INTERFACE
//             // gives us stuff like:
//             //
//             //    $("#...").data('myPlugin').myPublicPluginMethod();
//             //
//             var myPlugin = {
//                 element: $(this),
//                 // access private plugin methods, e.g.:
//                 setBorder: function(color, width) {
//                     setBorder(color, width);
//                     return this.element; // To ensure jQuery chainability
//                 },
//                 // access plugin settings, e.g.:
//                 color: function() {
//                     return settings.color;
//                 },
//                 // access setting "shape"
//                 shape: function() {
//                     return settings.shape;
//                 },
//                 // inspect settings
//                 inspectSettings: function() {
//                     msg = "inspecting settings for element '" + settings.elementId + "':";
//                     msg += "\n--- shape: '" + settings.shape + "'";
//                     msg += "\n--- color: '" + settings.color + "'";
//                     msg += "\n--- border: '" + settings.borderWidth + ' solid ' + settings.borderColor + "'";
//                     return msg;
//                 },
//                 // do stuff on element, e.g.:
//                 change: function(shape, color) {
//                     settings.shape = shape;
//                     settings.color = color;
//                     drawShape();
//                     return this.element; // To ensure jQuery chainability
//                 }
//             };
//             $(this).data("myPlugin", myPlugin);
//         }); // return this.each
//     }; // myPlugin
// })(jQuery);
//
//
//
// /**
//  * Automatically re-size a textarea as new text is typed into it.
//  *
//  * Copyright (C) Nick Morgan
//  * Licensed under MIT license
//  */
// ;(function(app, $, undefined) {
//
//     $.fn.extend({
//         'textareaAutogrow': function () {
//             function autoHeight_(element) {
//                 return jQuery(element)
//                     .css({ "height": 0, "overflow-y": "hidden" })
//                     .height(element.scrollHeight);
//             };
//
//             return this.each(function() {
//                 autoHeight_(this).on("input", function() {
//                     autoHeight_(this);
//                 });
//             });
//         }
//     });
//
// })(window.notAnotherWebApplication, jQuery);
