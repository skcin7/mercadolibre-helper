// import {Console as ConsoleComponent} from "./Console";
// import {Document as DocumentComponent} from "./Document";
// import {Keyboard as KeyboardComponent} from "./Keyboard";
// import {PageManager as PageManagerComponent} from "./PageManager";
// import {ScrollBar as ScrollBarComponent} from "./ScrollBar";

/*
|--------------------------------------------------------------------------
| Utility: Device
|--------------------------------------------------------------------------
|
| Help determine what device the user is running the application under.
|
*/
class Device
{
    /**
     * Constructor for the static class.
     */
    constructor() {
        if (this instanceof Device) {
            throw Error('The static class `Device` cannot be instantiated.');
        }
    }

    static getDeviceType() {
        if(Device.isDesktop()) {
            return 'Desktop';
        }
        else if(Device.isMobile()) {
            return 'Mobile';
        }
        else if(Device.isTablet()) {
            return 'Tablet';
        }
        return 'Unknown';
    }

    static isDesktop() {
        // https://stackoverflow.com/a/14283643/721361
        return window.screenX != 0 && !Device.isTouchDevice();
    }

    static isMobile() {
        // https://stackoverflow.com/a/11381730/721361
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }

    static isTablet() {
        // https://stackoverflow.com/a/50195587
        const userAgent = navigator.userAgent.toLowerCase();
        return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
    }

    static isTouchDevice() {
        // https://stackoverflow.com/a/14283643/721361
        return 'ontouchstart' in window || 'onmsgesturechange' in window;
    }

    static isMobileAndTablets() {
        // https://stackoverflow.com/a/11381730/721361
        let check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    }
}


/*
|--------------------------------------------------------------------------
| Utility: Clipboard
|--------------------------------------------------------------------------
|
| Clipboard utility to manage the clipboard (cut/copy/paste).
|
*/
class Clipboard
{
    /**
     * Constructor for the static class.
     */
    constructor() {
        if (this instanceof Clipboard) {
            throw Error('The static class `Clipboard` cannot be instantiated.');
        }
    }

    /**
     * Copy some text to the clipboard.
     *
     * @see https://stackoverflow.com/a/36189915/721361
     *
     * @param {string} text_to_copy
     */

    /**
     * Copy some text to the clipboard.
     *
     * @see https://stackoverflow.com/a/36189915/721361
     *
     * @param text_to_copy
     * @param successCallback
     * @param errorCallback
     */
    static copy = (text_to_copy, successCallback = () => { console.log('Successfully copied to clipboard.'); }, errorCallback = () => { console.error('Failed copying to the clipboard.'); }) => {

        // navigator.clipboard.writeText(text_to_copy).then(function() {
        //     /* clipboard successfully set */
        // }, function() {
        //     /* clipboard write failed */
        // });

        navigator.clipboard.writeText(text_to_copy).then(successCallback, errorCallback);

        // // NOTE: document.execCommand() was marked as obsolete, but,
        // // it should be superseded by Clipboard API
        // // If you, for some reason, need to support IE9+, you will need to implement both in the future.
        // let $tempElem = $("<textarea>");
        // $("body").append($tempElem);
        // $tempElem.val(text_to_copy).select();
        // document.execCommand("copy");
        // $tempElem.remove();
    };
}

/*
|--------------------------------------------------------------------------
| Utility: Misc
|--------------------------------------------------------------------------
|
| Miscellaneous utility with helpful functions in it.
|
*/
class Helpers
{
    /**
     * Constructor for the static class.
     */
    constructor() {
        if(this instanceof Helpers) {
            throw Error('The static class `Helpers` cannot be instantiated.');
        }
    }


    /**
     * Get an attribute value from a child element.
     * Recursively continue checking the child element until it matches the parent.
     * @param $childElement
     * @param $parentElement
     * @param attr_name
     * @param current_call_stack_count
     * @param maximum_call_stack_count
     * @returns {*|jQuery}
     */
    static get_attr_from_child = ($childElement, $parentElement, attr_name, current_call_stack_count = 1, maximum_call_stack_count = 5) => {
        if(
            $parentElement.is($childElement)
        ) {
            return $parentElement.attr(attr_name);
        }

        if($childElement.attr(attr_name)) {
            return $childElement.attr(attr_name);
        }

        if(
            UtilTypes.isNull($childElement.parent())
            || current_call_stack_count >= maximum_call_stack_count
        ) {
            return undefined;
        }

        return Helpers.get_attr_from_child($childElement.parent(), $parentElement, attr_name, ++current_call_stack_count, maximum_call_stack_count);
    };

    /**
     * Download a file.
     * @param file_url
     * @param {string} filename
     */
    static downloadFile(file_url, filename = 'file') {
        axios({
            method: 'GET',
            url: file_url,
            responseType: 'blob',
        })
            .then((response) => {
                const url = window.URL
                    .createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
            });
    }

    /**
     * Get the browser version.
     * @param key
     * @returns {{name: string, version: *}|{name: string, version: (*|string)}|{name: *, version: *}|*}
     */
    static browserVersion(key = null) {
        let ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
            return {name:'IE',version:(tem[1]||'')};
        }
        if(M[1]==='Chrome'){
            tem=ua.match(/\bEdg\/(\d+)/)
            if(tem!=null)   {return {name:'Edge(Chromium)', version:tem[1]};}
            tem=ua.match(/\bOPR\/(\d+)/)
            if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }
        M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}

        let browserVersion = {
            name: M[0],
            version: M[1]
        };
        if(key) {
            return browserVersion[key];
        }
        return browserVersion;
    }

    /**
     * Get the pluralized version of a word.
     * @param word
     * @param number
     * @returns {*}
     */
    static pluralize(word, number = 0) {
        return word + (number == 1 ? '' : 's');
    }

    /**
     * Upper case the first letter of each word in the string.
     * @param string
     * @returns {string}
     */
    static ucwords(string) {
        let string_ucwords = '';

        // Additional delimiters to be considered what separates multiple words.
        string = string.replaceAll("_", " ");

        let words = string.trim().toLowerCase().split(" ");
        for(let i = 0; i < words.length; i++) {
            // string_ucwords += (words[i] + " ");
            string_ucwords += (Helpers.ucfirst(words[i]) + " ");
        }
        return string_ucwords.trim();

        // // This doesn't work in Safari:
        // return string.toLowerCase().replace(/(?<= )[^\s]|^./g, a=>a.toUpperCase());
    }

    /**
     * Uppercase the first letter of a single word/string.
     * @param string
     * @returns {string}
     */
    static ucfirst(string) {
        return string[0].toUpperCase() + string.substring(1).toLowerCase();
    }

    // /**
    //  * Move (aka swap) an element of an array from one index position to another index position.
    //  * From https://stackoverflow.com/a/6470794
    //  * @param array
    //  * @param from_index
    //  * @param to_index
    //  */
    // static array_move(array, from_index, to_index) {
    //     let element = array[from_index];
    //     array.splice(from_index, 1);
    //     array.splice(to_index, 0, element);
    // }

}

/*
|--------------------------------------------------------------------------
| Utility: Photo
|--------------------------------------------------------------------------
|
| Utility to help manage photos.
|
*/
class PhotoUtils
{
    /**
     * Constructor for the static class.
     */
    constructor() {
        if (this instanceof PhotoUtils) {
            throw Error('The static class `PhotoUtils` cannot be instantiated.');
        }
    }

    /**
     * Compress an image locally to prepare to send it to a server.
     * ***NOT CURRENTLY WORKING!!!***
     * @param imgToCompress
     * @param resizingFactor
     * @param quality
     */
    static compressImage(imgToCompress, resizingFactor = 0.8, quality = 0.8) {
        // resizing the image
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const originalWidth = imgToCompress.width;
        const originalHeight = imgToCompress.height;

        const canvasWidth = originalWidth * resizingFactor;
        const canvasHeight = originalHeight * resizingFactor;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context.drawImage(
            imgToCompress,
            0,
            0,
            originalWidth * resizingFactor,
            originalHeight * resizingFactor
        );

        // reducing the quality of the image
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    // showing the compressed image
                    // resizedImage.src = URL.createObjectURL(resizedImageBlob);
                    return URL.createObjectURL(resizedImageBlob);
                }
            },
            "image/jpeg",
            quality
        );
    };

    /**
     * Utility function to convert a canvas to a BLOB
     *
     * @see https://stackoverflow.com/a/24015367/721361
     *
     * @param dataURL
     * @returns {Blob}
     */
    static dataURLToBlob(dataURL) {
        let BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            let parts = dataURL.split(',');
            let contentType = parts[0].split(':')[1];
            let raw = parts[1];

            return new Blob([raw], {type: contentType});
        }

        let parts = dataURL.split(BASE64_MARKER);
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;

        let uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
    };


}

/*
|--------------------------------------------------------------------------
| Utility: Types
|--------------------------------------------------------------------------
|
| Utility to help determine variable types.
|
*/
class UtilTypes
{
    /**
     * Constructor for the static class.
     */
    constructor() {
        if(this instanceof UtilTypes) {
            throw Error('The static class `UtilTypes` cannot be instantiated.');
        }
    }

    /**
     * Determines if a value is of a specified type.
     * @param type
     * @param value
     * @returns {boolean|arg is *[]}
     */
    static isType(type, value) {
        // Ensure the type being checked is a valid one before proceeding.
        if(! [
            'array',
            'null',
            'object',
            'string',
            'undefined',
        ].includes(type.toLowerCase())) {
            switch(type.toLowerCase()) {
                case 'array':
                    return UtilTypes.isArray(value);
                case 'null':
                    return UtilTypes.isNull(value);
                case 'object':
                    return UtilTypes.isObject(value);
                case 'string':
                    return UtilTypes.isString(value);
                case 'undefined':
                    return UtilTypes.isUndefined(value);
            }
        }
        return false;
    }

    /**
     * Determines if a value is an array
     * @param value
     * @returns {arg is any[]}
     */
    static isArray(value) {
        return Array.isArray(value);
    }

    /**
     * Determines if a value is a boolean type.
     * @param value
     * @returns {boolean}
     */
    static isBoolean(value) {
        if(typeof value === "boolean") {
            return true;
        }
        return false;
    }

    /**
     * Determine if a value is a function.
     * @param value
     * @returns {boolean}
     */
    static isFunction(value) {
        return Boolean(typeof value === 'function');
    }

    /**
     * Alias function to determine if a value is a function.
     * @param value
     * @returns {boolean}
     */
    static isFn(value) {
        return UtilTypes.isFunction(value);
    }

    /**
     * Determines if a value is an instance of another object/type.
     * @param value
     * @param instance_of_item
     * @returns {boolean}
     */
    static isInstanceOf(value, instance_of_item) {
        return Boolean(value instanceof instance_of_item);
    }

    /**
     * Determine if a value is a valid JSON string.
     * @param value
     * @returns {boolean}
     */
    static isJson(value) {
        try {
            JSON.parse(value);
        }
        catch(error) {
            return false;
        }
        return true;
    }

    /**
     * Determines if a value is null
     * @param value
     * @returns {boolean}
     */
    static isNull(value) {
        if(value === null) {
            return true;
        }
        return false;
    }

    /**
     * Determines if a value is an object
     * @param value
     * @returns {boolean}
     */
    static isObject(value) {
        if(typeof value === 'object' && !Array.isArray(value) && value !== null) {
            return true;
        }
        return false;
    }

    /**
     * Determines if a value is a string.
     * @param value
     * @returns {boolean}
     */
    static isString(value) {
        if(typeof value === "string" || value instanceof String) {
            return true;
        }
        return false;
    }

    /**
     * Determines if a value is undefined.
     * @param value
     * @returns {boolean}
     */
    static isUndefined(value) {
        return (value === undefined);
    }

    // /**
    //  * Determine if a string is valid JSON or not.
    //  * @param string
    //  * @returns {boolean}
    //  */
    // static isValidJsonString(string) {
    //     try {
    //         JSON.parse(string);
    //     }
    //     catch(error) {
    //         return false;
    //     }
    //     return true;
    // }
    // /**
    //  * @depreciated Use Utils.isValidJsonString() instead
    //  * @param string
    //  * @returns {boolean}
    //  */
    // static isValidJson(string) {
    //     return Utils.isValidJsonString(string);
    // }

    /**
     * Cast an object as an array of its keys.
     * @param object
     * @returns {[string,unknown][]}
     */
    static castAsArray(object) {
        if(! UtilTypes.isObject(object)) {
            // TODO
            return object;
        }
        return Object.entries(object).map(e => [e[0], e[1]])
    }



    // /**
    //  * Determine if a string is a valid URL.
    //  * https://stackoverflow.com/a/43467144/721361
    //  * @param string
    //  * @returns {boolean}
    //  */
    // static isValidHttpUrl(string) {
    //     let url;
    //
    //     try {
    //         url = new URL(string);
    //     }
    //     catch(ex) {
    //         return false;
    //     }
    //
    //     return url.protocol === "http:" || url.protocol === "https:";
    // }
}

export {
    Clipboard,
    Device,
    Helpers,
    PhotoUtils,
    UtilTypes,
};
