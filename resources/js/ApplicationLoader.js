import './bootstrap';


import {
    getComponent,
    getComponents,
    Application,
} from "./components";

import {
    UtilTypes,
} from "./Utils";

try {
    // window.Popper = require('popper.js').default;
    window.$ = window.jQuery = require('jquery');
    // window.showdown = require('showdown');
    // window.knockout = require('knockout');

    window.bootstrap = require('bootstrap');
    require('./lib/jquery.appear');
    require('./lib/jquery.autosize');
    require('./lib/jquery.notify');
    require('./lib/jquery.scrollup');
    require('./lib/jquery.unveil');

    // /**
    //  * We'll load the axios HTTP library which allows us to easily issue requests
    //  * to our Laravel back-end. This library automatically handles sending the
    //  * CSRF token as a header based on the value of the "XSRF" token cookie.
    //  */
    // window.axios = require('axios');
    // window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    // window.axios.defaults.withCredentials = true;
}
catch(error) {
    //
}




// Create namespace for the application.
window.notAnotherWebApplication = {};

// Fire the self-executing function which loads the application.
;(function(app, $, undefined) {
    // /**
    //  * Instance of the Application component.
    //  * @type {null}
    //  * @private
    //  */
    // app._applicationComponent = null;

    // /**
    //  * DOM element that represents the application loaded into the web page.
    //  * @type {null}
    //  */



    // app.$appElement = null;

    /**
     * Create a new Application instance.
     * @param config
     * @returns {Window.notAnotherWebApplication}
     */
    app.createApp = function(config = {}) {


        Application(config);

        // // function ac(){} //new class
        // let f = new Function( "return typeof Application == 'function'" ) //define function to verify
        // f(); //returns true if class exists in the current scope

        // console.log(typeof Application);
        // console.log(typeof Application2);
        // console.log(eval(Application));
        // console.log(eval(Application2));
        //
        // if(f()) {
        //     console.log('Exists');
        // }
        // else {
        //     console.log('Not Exists');
        // }


        // function ac(){} //new class
        // // let className = 'ac';
        // let f = function( className ){
        //     return new Function( "return typeof " + className + " == 'function'" )(); //define function to verify and invoke the same
        // }
        // f( "ac" ); //returns true if class exists in the current scope
        //
        // if(f("ac")) {
        //     console.log('AC Exists');
        // }
        // else {
        //     console.log('AC Not Exists');
        // }



        // console.log('Eval: ' + eval('Application'));



        // if(config.hasOwnProperty('mountTo')) {
        //     let $appElement = $(config['mountTo']);
        //     if($appElement.length > 0) {
        //         // this.$appElement = $appElement;
        //         this.$appElement = $appElement;
        //         // app().log('✅ Mounted App Element To: ' + config.mountTo + '.', 'info');
        //     }
        //     else {
        //         // app().log('⛔️ Could Not Mount Application.', 'error');
        //     }
        // }


        // Load the application components by making an instance of each one.
        if(config.hasOwnProperty('components') && UtilTypes.isArray(config.components)) {
            for(let i = 0; i < config.components.length; i++) {

                let componentName = '';
                let componentEnabled = true;
                let componentConfig = {};

                if(UtilTypes.isString(config.components[i])) {
                    componentName = config.components[i];
                }
                else if(UtilTypes.isObject(config.components[i])) {
                    componentName = config.components[i].name;
                    componentEnabled = Boolean(config.components[i].hasOwnProperty("enabled") && UtilTypes.isBoolean(config.components[i].enabled) ? config.components[i].enabled : true);
                    componentConfig = (config.components[i].hasOwnProperty("config") && UtilTypes.isObject(config.components[i].config) ? config.components[i].config : {});
                }

                if(!componentEnabled) {
                    continue;
                }

                console.log('ℹ️ Loading Component: ' + componentName + ' ...');
                getComponent(componentName, componentConfig);
                // app().log(' -- Loaded Component: ' + componentName);
            }
        }

        return this;


        // let applicationComponent = getComponent("Application", config);


        // let documentComponent = (new Document());
        // console.log(documentComponent);
        //
        // let pageManagerComponent = (new PageManager());
        // console.log(pageManagerComponent);
    };

    app.loadApp = function(config = {}) {

        console.log('Load App Config');
        console.log(config);

        if(config.hasOwnProperty('initCurrentPage') && UtilTypes.isBoolean(config.initCurrentPage) && config.initCurrentPage) {
            console.log(' -- loadApp: Initializing Current Page...');
            let initCurrentPageData = (config.hasOwnProperty('initCurrentPageData') && UtilTypes.isObject(config.initCurrentPageData) ? config.initCurrentPageData : {});
            getComponent("PageManager").initCurrentPage(initCurrentPageData);
        }

        // if(config.hasOwnProperty('initCurrentPage') && UtilTypes.isBoolean(config.initCurrentPage) && config.initCurrentPage) {
        //     let pageData = (config.hasOwnProperty('_pageData') && UtilTypes.isObject(config._pageData) ? config._pageData : {});
        // }
        //
        // if(config.hasOwnProperty('initCurrentPage')) {
        //     let pageData = (config.hasOwnProperty('_pageData') && UtilTypes.isObject(config._pageData) ? config._pageData : {});
        // }

        // NotifyJS Default Configurations:
        $.notify.defaults({
            "autoHide": true,
            "autoHideDelay": 5000,
            "position": 'left bottom',
            "elementPosition": 'right bottom',
            "globalPosition": 'right bottom',
            "showDuration": 200,
            "style": 'bootstrap',
            "className": 'success',
            "clickToHide": true
        });

        $('[data-var--border-color]').each(function(index, element) {
            $(element).css('--border-color', $(element).attr('data-var--border-color'));
            // $(element).css('--var-border-color', $(element).attr('data-var--border-color'));
        });

        $('[data-var--border-width]').each(function(index, element) {
            $(element).css('--border-width', $(element).attr('data-var--border-width'));
            // $(element).css('--var-border-width', $(element).attr('data-var--border-width: ' + '4px'));
        });

        // // Initialize all Bootstrap tooltip elements.
        // $('body').tooltip({
        //     "selector": '[data-toggle="tooltip"]',
        //     "placement": 'bottom',
        // });

        let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl, {
                "placement": "bottom"
            });
        });



        // document.body.addEventListener('keyup', function (event) {
        //     if(event.target.classList.contains('textarea_autosize')) {
        //         console.log('textarea_autosize keyup');
        //         this.style.overflow = 'hidden';
        //         this.style.height = 0;
        //         this.style.height = this.scrollHeight + 'px';
        //     };
        // });

        // $('.textarea_autogrow').textareaAutogrow();

        // document.getElementById(id).addEventListener('keyup', function() {
        //     this.style.overflow = 'hidden';
        //     this.style.height = 0;
        //     this.style.height = this.scrollHeight + 'px';
        // }, false);



        // Set all <textarea> to be autosized vertically as text is entered into them.
        $('.autosize').autosize();
        $(document).on('shown.bs.tab', function(event) {
            $('.autosize').resize();

            $("img").unveil();
        });

        // Default behavior for 'scrollup' feature.
        $.scrollup({
            scrollText: 'To The Top!'
        });

        // Unveil images that may be lazy-loaded.
        $("img").unveil();

        return this;
    };

    app.getComponents = () => {
        return getComponents();
    };

    app.getComponent = (componentName) => {
        return getComponent(componentName);
    };

    app.getCurrentPage = () => {
        return getComponent('PageManager').getCurrentPage();
    };

    app.getPages = () => {
        return getComponent('PageManager').getManagedPages();
    };

    app.getPage = (pageName) => {
        return getComponent('PageManager').getManagedPage(pageName);
    };

    /**
     * Log a message to the JavaScript console output.
     * @param {string} logMessage
     * @param {string} logLevel
     */
    app.log = (logMessage, logLevel = 'info') => {
        getComponent('Console').log(logMessage, logLevel);

        // let consoleComponent = getComponent('Console');
        // // console.log(consoleComponent);
        // consoleComponent.log(logMessage, logLevel);
    };

    // /**
    //  * Determine if jQuery is loaded and being used in the current application.
    //  * @returns {boolean}
    //  */
    // app.usingJquery = () => {
    //     if(window.jQuery) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // };

    /**
     * Form a URL for this application by concatenating the base URL with a specified URI.
     * @param uri
     * @returns {string}
     */
    app.url = (uri) => {
        let currentUrl = new URL(window.location.href);
        uri = uri.replace(/\/$/, ""); // Remove trailing slash, if there is one
        return currentUrl.protocol + '//' + currentUrl.hostname + '/' + uri;
    };

    /**
     * Throttle a function to ensure it only runs a maximum once for every specified amount of milliseconds
     * FROM https://stackoverflow.com/a/4367037
     *
     * @param fn
     * @param delay
     * @returns {Function}
     */
    app.throttle = function(fn, delay) {
        let timer = null;
        return function() {
            let context = this, args = arguments;
            clearTimeout(timer);
            timer = window.setTimeout(function(){
                    fn.apply(context, args);
                },
                delay || 500);
        };
    };

    /**
     * From https://stackoverflow.com/a/58920031
     * @param milliseconds
     * @returns {Promise<unknown>}
     */
    app.wait = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };

})(window.notAnotherWebApplication, window.jQuery);

/**
 * Get the instance of the application.
 * @type {function(): *|{}}
 */
window.app = window.application = () => {
    return window.notAnotherWebApplication;
}
