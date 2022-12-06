import {
    UtilTypes,
} from '../Utils';

class Console
{
    /**
     * Default log level to used when a log level is not specified when logging a message.
     * @type {null|string}
     */
    #defaultLogLevel = null;
    setDefaultLogLevel = (defaultLogLevel) => {
        this.#defaultLogLevel = defaultLogLevel;
    };
    getDefaultLogLevel = () => {
        return this.#defaultLogLevel;
    };

    /**
     * Create a new Console instance.
     * @param config
     */
    constructor(config = {}) {
        if(config.hasOwnProperty('defaultLogLevel')) {
            this.setDefaultLogLevel(config.defaultLogLevel);
        }
    }

    /**
     * Log a message to the JavaScript Console standard out.
     * @param logMessage
     * @param logLevel
     */
    log(logMessage, logLevel = null) {
        // // If logging a JS object, don't add the CSS formatting so that it will still output with correct object formatting.
        // let logMessage_is_object = false;
        // if(typeof logMessage === 'object' && !Array.isArray(logMessage) && logMessage !== null) {
        //     logMessage_is_object = true;
        // }

        // Use log level from the configuration if no log level is specified here.
        if(UtilTypes.isNull(logLevel)) {
            logLevel = this.getDefaultLogLevel();
        }

        switch(logLevel) {
            case 'debug':
                this.debug(logMessage);
                break;
            case 'info':
            default:
                this.info(logMessage);
                break;
            case 'warn':
                this.warn(logMessage);
                break;
            case 'error':
                this.error(logMessage);
                break;
        }
    }

    /**
     * Log a debug message to the JavaScript Console std output.
     * @param debugMessage
     */
    debug(debugMessage) {
        if(UtilTypes.isObject(debugMessage)) {
            console.debug(debugMessage);
            return;
        }
        console.debug('%c' + debugMessage, this.getLogLevelCssString('debug'));
    }

    /**
     * Log an info message to the JavaScript Console std output.
     * @param infoMessage
     */
    info(infoMessage) {
        if(UtilTypes.isObject(infoMessage)) {
            console.debug(infoMessage);
            return;
        }
        console.info('%c' + infoMessage, this.getLogLevelCssString('info'));
    }

    /**
     * Log a warning message to the JavaScript Console std output.
     * @param warnMessage
     */
    warn(warnMessage) {
        if(UtilTypes.isObject(warnMessage)) {
            console.debug(warnMessage);
            return;
        }
        console.warn('%c' + warnMessage, this.getLogLevelCssString('warn'));
    }

    /**
     * Log an error message to the JavaScript Console std output.
     * @param errorMessage
     */
    error(errorMessage) {
        if(UtilTypes.isObject(errorMessage)) {
            console.debug(errorMessage);
            return;
        }
        console.error('%c' + errorMessage, this.getLogLevelCssString('error'));
    }


    /**
     * CSS properties and values that correspond to each log level.
     * @type {{warn: {"background-color": string, color: string}, debug: {"background-color": string, color: string}, error: {"background-color": string, color: string}, info: {"background-color": string, color: string}}}
     */
    #logLevelCssProperties = {
        'debug': {
            'background-color': '#dcedfa',
            'color': '#1a74be',
        },
        'info': {
            'background-color': '#fff',
            'color': '#000',
        },
        'warn': {
            'background-color': '#f5f0bd',
            'color': '#978800',
        },
        'error': {
            'background-color': '#f5b8b6',
            'color': '#ae1c17',
        },
    };

    /**
     * Get a CSS string of a log level.
     * @param logLevel
     * @returns {*}
     */
    getLogLevelCssString(logLevel) {
        // // One way to do it:
        // return this.#logLevelCssProperties[logLevel].map((this_level) => {
        //     return (this_level.hasOwnProperty('background-color') ? 'background-color:' + this_level['background-color'] + ';' : '') + (this_level.hasOwnProperty('color') ? 'color:' + this_level['color'] + ';' : '');
        //     // return this_level['background-color'];
        // });

        // Another way to do it:
        let final_css_string = '';
        for(const property in this.#logLevelCssProperties[logLevel].css) {
            final_css_string += `${property}:${this.#logLevelCssProperties[logLevel].css[property]};`;
        }
        return final_css_string;
    }




}

export {Console};
