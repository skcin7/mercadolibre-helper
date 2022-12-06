import {
    UtilTypes,
} from '../Utils';
import {DataAndPropsClass} from "../DataAndPropsClass";

/**
 * Class that represents a single page that is loaded into the application and may be set as the current page that is
 * active and shown.
 */
class Page extends DataAndPropsClass
{
    /**
     * Create a new Page instance.
     * @param config
     */
    constructor(config) {
        super();
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !START: Page Lifecycles
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Process a page lifecycle event.
     * @param pageLifecycleName
     */
    processPageLifecycle = async (pageLifecycleName) => {
        app().log(this.constructor.name + " Page Lifecycle - " + pageLifecycleName, 'debug');
        // If a function exists for this current page lifecycle, then invoke it now:
        if(this.hasPageLifecycleFn(pageLifecycleName)) {
            // app().log("Creating Page: " + this.constructor.name, 'debug');
            // this.getPageLifecycleFn("beforeCreate").call(this);
            await this.runPageLifecycleFn(pageLifecycleName);
        }
    };
    /**
     * Keep track of if the page's create procedures (load data, etc.) have been run or not.
     * @type {boolean}
     */
    #isCreated = false;
    /**
     * Determine if the page has been created yet or not.
     * @returns {boolean}
     */
    isCreated = () => {
        return Boolean(this.#isCreated);
    };
    /**
     * Run the page's Create Lifecycle.
     * @returns {Page}
     */
    createPage = () => {
        // Don't let a page be created again if it's already been created.
        if(this.#isCreated) {
            return this;
        }

        this.processPageLifecycle('beforeCreate');
        this.processPageLifecycle('create');
        this.processPageLifecycle('afterCreate');

        // if(this.hasPageLifecycleFn("beforeCreate")) {
        //     app().log("Creating Page: " + this.constructor.name, 'debug');
        //     // this.getPageLifecycleFn("beforeCreate").call(this);
        //     this.runPageLifecycleFn("beforeCreate", config);
        // }
        //
        // // Invoke the page's Create lifecycle function (if one exists) to run the Create lifecycle procedures...
        // if(this.hasPageLifecycleFn("create")) {
        //     // this.getPageLifecycleFn("create").call(this);
        //     this.runPageLifecycleFn("create", config);
        // }
        //
        // if(this.hasPageLifecycleFn("afterCreate")) {
        //     // this.getPageLifecycleFn("afterCreate").call(this);
        //     this.runPageLifecycleFn("afterCreate", config);
        //     app().log("Created Page: " + this.constructor.name, 'debug');
        // }
        this.#isCreated = true;
        return this;
    };
    /**
     * Keep track of if the page's loading procedures (register events, load data, etc.) have been run or not.
     * @type {boolean}
     */
    #isLoaded = false;
    /**
     * Determine if the page has been loaded yet or not.
     * @returns {boolean}
     */
    isLoaded = () => {
        return Boolean(this.#isLoaded);
    };
    /**
     * Run the page's Load Lifecycle.
     * @param config
     * @returns {Page}
     */
    loadPage = () => {
        // Don't let a page be loaded again if it's already been loaded.
        if(this.#isLoaded) {
            return this;
        }

        this.processPageLifecycle('beforeLoad');
        this.processPageLifecycle('load');
        this.processPageLifecycle('afterLoad');



        // if(this.hasPageLifecycleFn("beforeLoad")) {
        //     app().log("Loading Page: " + this.constructor.name, 'debug');
        //     this.runPageLifecycleFn("beforeLoad");
        // }
        //
        // // Invoke the page's Load lifecycle function (if one exists) to run the Load lifecycle procedures...
        // if(this.hasPageLifecycleFn("load")) {
        //     this.runPageLifecycleFn("load");
        // }
        //
        // if(this.hasPageLifecycleFn("afterLoad")) {
        //     this.runPageLifecycleFn("afterLoad");
        //     app().log("Loaded Page: " + this.constructor.name, 'debug');
        // }
        this.#isLoaded = true;
        return this;
    };
    /**
     * Run the page's Unload Lifecycle.
     * @param config
     * @returns {Page}
     */
    unloadPage = (config = {}) => {
        // Don't let a page be unloaded if it isn't currently loaded.
        if(!this.#isLoaded) {
            return this;
        }

        if(this.hasPageLifecycleFn("beforeUnload")) {
            app().log("Unloading Page: " + this.constructor.name, 'debug');
            this.runPageLifecycleFn("beforeUnload", config);
        }

        // Invoke the page's Unload lifecycle function (if one exists) to run the unload lifecycle procedures...
        if(this.hasPageLifecycleFn("unload")) {
            this.runPageLifecycleFn("unload", config);
        }

        if(this.hasPageLifecycleFn("afterUnload")) {
            this.runPageLifecycleFn("afterUnload", config);
            app().log("Unloaded Page: " + this.constructor.name, 'debug');
        }
        this.#isLoaded = false;
        return this;
    };
    /**
     * Run the page's Destroy Lifecycle.
     * @param config
     * @returns {Page}
     */
    destroyPage = (config = {}) => {
        // Don't let a page be destroyed if it isn't currently created.
        if(!this.#isCreated) {
            return this;
        }

        if(this.hasPageLifecycleFn("beforeDestroy")) {
            app().log("Destroying Page: " + this.constructor.name, 'debug');
            this.runPageLifecycleFn("beforeDestroy", config);
        }

        // Invoke the page's Destroy lifecycle function (if one exists) to run the Destroy lifecycle procedures...
        if(this.hasPageLifecycleFn("destroy")) {
            this.runPageLifecycleFn("destroy", config);
        }

        if(this.hasPageLifecycleFn("afterDestroy")) {
            this.runPageLifecycleFn("afterDestroy", config);
            app().log("Destroyed Page: " + this.constructor.name, 'debug');
        }
        this.#isCreated = false;
        return this;
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !END: Page Lifecycles
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !START: Page Lifecycle Functions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Lifecycle functions that are invoked upon various stages of the page's lifecycle (create, load, etc).
     * Each lifecycle has 3 parts: before, current, and after. Values of each are 'before{lifecycleName}', '{lifecycleName}', and 'after{lifecycleName}'.
     * Each value must be either null (no function invoked), or the function to be invoked at that stage of the page's lifecycle).
     * @type {{beforeLoad: null, afterDestroy: null, beforeDestroy: null, beforeCreate: null, afterCreate: null, beforeUnload: null, afterUnload: null, afterLoad: null}}
     */
    #pageLifecycleFns = {
        // Create:
        "beforeCreate": null,
        "create": null,
        // "create": (config = {}) => {
        //     app().log('Default Page Create Function.', 'debug');
        // },
        "afterCreate": null,
        // Load:
        "beforeLoad": null,
        "load": null,
        // "load": (config = {}) => {
        //     app().log('Default Page Load Function.', 'debug');
        // },
        "afterLoad": null,
        // Unload:
        "beforeUnload": null,
        "unload": null,
        // "unload": (config = {}) => {
        //     app().log('Default Page Unload Function.', 'debug');
        // },
        "afterUnload": null,
        // Destroy:
        "beforeDestroy": null,
        "destroy": null,
        // "destroy": (config = {}) => {
        //     app().log('Default Page Destroy Function.', 'debug');
        // },
        "afterDestroy": null,
    };
    /**
     * List of valid lifecycle names that a page can have. This is here as an extra way to check to ensure only
     * valid lifecycle names can exist and be managed.
     * @type {string[]}
     */
    #valid_page_lifecycle_names = [
        "create",
        "load",
        "unload",
        "destroy",
    ];
    /**
     * List of valid page lifecycle key values. This is here just to ensure that only valid lifecycle key values can be set and are managed.
     * NOTE: This and isValidPageLifecycleKey() may be used as alternatives of each other.
     */
    #valid_page_lifecycle_keys = [
        "beforeCreate",
        "create",
        "afterCreate",
        "beforeLoad",
        "load",
        "afterLoad",
        "beforeUnload",
        "unload",
        "afterUnload",
        "beforeDestroy",
        "destroy",
        "afterDestroy",
    ];
    /**
     * Check to see if a lifecycle key value is a valid page lifecycle key value.
     * This takes all the valid lifecycle names (string values) and checks for before, current, and after versions of each.
     * @param pageLifecycleKey
     * @returns {boolean}
     */
    isValidPageLifecycleKey = (pageLifecycleKey) => {
        // NOTE - 2 different implementations can be used to check if a lifecycle key is valid.
        //    - Option 1) Check to see if the current key is included in the array of all the keys
        //    - Option 2) Check to see if the current key is one of the valid names, while also checking for 'before' and 'after' versions of it.
        let using_implementation_option = "2";

        // Both implementations are here. Neither is better than the other.
        if(using_implementation_option == "1") {
            if(this.#valid_page_lifecycle_keys.includes(lifecycleFnKey)) {
                return true;
            }
            return false;
        }
        else if(using_implementation_option == "2") {
            if(this.#valid_page_lifecycle_names.includes(pageLifecycleKey)) {
                return true;
            }
            // If "before" is the first substring of the key, then it is valid if the rest of the string is one of
            // the valid lifecycle names with a capitalized first letter and lowercase rest of letters.
            if(pageLifecycleKey.substring(0, 6) == 'before') {
                for(let i = 0; i < this.#valid_page_lifecycle_names.length; i++) {
                    if("before" + this.#valid_page_lifecycle_names[i].charAt(0).toUpperCase() + this.#valid_page_lifecycle_names[i].substring(1).toLowerCase() == pageLifecycleKey) {
                        return true;
                    }
                }
            }
            else if(pageLifecycleKey.substring(0, 5) == 'after') {
                for(let i = 0; i < this.#valid_page_lifecycle_names.length; i++) {
                    if("after" + this.#valid_page_lifecycle_names[i].charAt(0).toUpperCase() + this.#valid_page_lifecycle_names[i].substring(1).toLowerCase() == pageLifecycleKey) {
                        return true;
                    }
                }
            }
            return false;
        }
        // Implementation option not set, so just return false
        return false;
    };
    /**
     * Set a page lifecycle function value, which is a function that is invoked at the specific stage of the page's lifecycle.
     * @param lifecycleFnKey
     * @param lifecycleFnValue
     * @returns {boolean|*}
     */
    setPageLifecycleFn = (lifecycleFnKey, lifecycleFnValue) => {
        if(! this.#valid_page_lifecycle_keys.includes(lifecycleFnKey)) {
            return false;
        }

        // If value is null, then unset it.
        if(UtilTypes.isNull(lifecycleFnValue)) {
            return this.unsetPageLifecycleFn(lifecycleFnKey);
        }
        // If value is a function, then set it normally.
        else if(UtilTypes.isFunction(lifecycleFnValue)) {
            this.#pageLifecycleFns[lifecycleFnKey] = lifecycleFnValue;
            return true;
        }
        return false;
    };
    /**
     * Unset a page's lifecycle function value.
     * @param lifecycleFnKey
     * @returns {boolean}
     */
    unsetPageLifecycleFn = (lifecycleFnKey) => {
        if(! this.isValidPageLifecycleKey(lifecycleFnKey)) {
            return false;
        }
        this.#pageLifecycleFns[lifecycleFnKey] = null;
        return true;
    };
    /**
     * Get the lifecycle function of a specific lifecycle part of a page's life.
     * @param lifecycleFnKey
     * @returns {null|*}
     */
    getPageLifecycleFn = (lifecycleFnKey) => {
        if( !this.isValidPageLifecycleKey(lifecycleFnKey) || !this.#pageLifecycleFns.hasOwnProperty(lifecycleFnKey) ) {
            return null;
        }
        return this.#pageLifecycleFns[lifecycleFnKey];
    };
    /**
     * Determine if a page's lifecycle function exists for the specified lifecycle key.
     * @param lifecycleFnKey
     * @returns {boolean}
     */
    hasPageLifecycleFn = (lifecycleFnKey) => {
        if(this.#pageLifecycleFns.hasOwnProperty(lifecycleFnKey) && UtilTypes.isFunction(this.#pageLifecycleFns[lifecycleFnKey])) {
            return true;
        }
        return false;
    };
    /**
     * Run a page lifecycle function.
     * @param lifecycleFnKey
     * @param config
     */
    runPageLifecycleFn = (lifecycleFnKey, config = {}) => {
        let pageLifecycleFn = this.getPageLifecycleFn(lifecycleFnKey);
        if(UtilTypes.isFunction(pageLifecycleFn)) {
            app().log(' -- Running Page Lifecycle Function: ' + lifecycleFnKey, 'debug');
            pageLifecycleFn.call(this, config);
        }
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !END: Page Lifecycle Functions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////












    // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // // !START: Page Data
    // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // /**
    //  * Stores all the data that is associated with the page.
    //  * This is a private variable - to set, get, or unset the page data should use the related
    //  * methods below.
    //  * @type {{}}
    //  * @private
    //  */
    // #pageData = {};
    // /**
    //  * Default data to used for each page instance.
    //  * @type {{}}
    //  */
    // #defaultPageData = {};
    // /**
    //  * Set data that is associated with the page.
    //  * @param pageDataKey
    //  * @param pageDataValue
    //  * @returns {boolean}
    //  */
    // setPageData = (pageDataKey, pageDataValue = null) => {
    //     if(UtilTypes.isObject(pageDataKey)) {
    //         // Sets the entire pageData object all at once by passing an object.
    //         this.#pageData = {
    //             ...this.#pageData,
    //             ...pageDataKey,
    //         };
    //         return true;
    //     }
    //     else if(UtilTypes.isString(pageDataKey)) {
    //         // Sets a single pageData part by specifying the string of the pageData variable name.
    //         this.#pageData[pageDataKey] = pageDataValue;
    //         return true;
    //     }
    //     return false;
    // };
    // /**
    //  * Unset page data that is associated with this page.
    //  * @param pageDataKey
    //  * @returns {boolean}
    //  */
    // unsetPageData = (pageDataKey = null) => {
    //     if(UtilTypes.isNull(pageDataKey)
    //         || (UtilTypes.isString(pageDataKey) && pageDataKey.length == 0)
    //     ) {
    //         // If no page data key is passed (it's null or an empty string), then completely re-set all the page data
    //         // By setting it back to the default page data value.
    //         this.#pageData = this.#defaultPageData;
    //         return true;
    //     }
    //     else if(UtilTypes.isString(pageDataKey) && pageDataKey.length > 0 && this.#pageData.hasOwnProperty(pageDataKey)) {
    //         // A string value is passed as the page data key, so just unset that single page data value. Additional
    //         // checks are in place to ensure the page data value exists (based on the key) first before it is unset.
    //
    //         if(this.#defaultPageData.hasOwnProperty(pageDataKey)) {
    //             // If there is a default page data value for the key being deleted, then set it to the default value instead
    //             // of deleting it outright.
    //             this.#pageData[pageDataKey] = this.#defaultPageData[pageDataKey];
    //         }
    //         else {
    //             // Reset page data for the specified key by deleting that data outright.
    //             delete this.#pageData[pageDataKey];
    //         }
    //         return true;
    //     }
    //     return false;
    // };
    // /**
    //  * Get data that is loaded and being used currently in the page.
    //  * @param pageDataKey
    //  * @returns {{}|null|*}
    //  */
    // getPageData = (pageDataKey = null) => {
    //     if(UtilTypes.isNull(pageDataKey)
    //         || (UtilTypes.isString(pageDataKey) && pageDataKey.length == 0)
    //     ) {
    //         // When the data key is null or an empty string, then simply return the entire page data object (ALL of it).
    //         return this.#pageData;
    //     }
    //
    //     if(UtilTypes.isString(pageDataKey) && pageDataKey.length > 0) {
    //         // When page data key is a single string, then just return the data that is associated with that page data key value.
    //         if(this.#pageData.hasOwnProperty(pageDataKey)) {
    //             return this.#pageData[pageDataKey];
    //         }
    //         return null;
    //     }
    //     // No page data exists based on the specified key.
    //     return null;
    // };
    // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // // !END: Page Data
    // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !START: Page DOM (Document-Object Model) Elements
    // This is a list of important DOM elements that are associated with the current page, along with a key to identify each one.
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Store a list of important DOM (Document-Object Model) references that are currently loaded into the page.
     * For each one, a unique key (string) is used as the identifier of each one.
     * @type {{}}
     */
    #$pageDomElements = {};
    /**
     * Set a DOM element to be used in the page.
     * @param pageDomElementKey
     * @param pageDomElementInstance
     * @returns {Page}
     */
    setPageDomElement = (pageDomElementKey, pageDomElementInstance) => {
        // Only set the page DOM element if it's not already set based on the DOM element unique key.
        if(! this.#$pageDomElements.hasOwnProperty(pageDomElementKey)) {
            this.#$pageDomElements[pageDomElementKey] = pageDomElementInstance;
        }
        return this;
    };
    /**
     * Get a DOM element that is used in the page.
     * @param pageDomElementKey
     * @returns {*}
     */
    getPageDomElement = (pageDomElementKey) => {
        return this.#$pageDomElements[pageDomElementKey];
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !END: Page DOM (Document-Object Model) Elements
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



};


export {
    Page,
};
