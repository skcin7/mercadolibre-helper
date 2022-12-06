import {
    UtilTypes,
} from '../Utils';

import {
    getPage,
    getPages,
    Welcome,
    MercadoLibreApi,
    pageManagerRoutes,
} from './PageManagerConfig';

/**
 * Class that represents a single route that is used to handle a page of the application.
 */
class PageRoute
{
    /**
     * Create a new PageRoute instance.
     * @param routeUri
     * @param routeConfig
     * @returns {boolean}
     */
    constructor(routeUri, routeConfig) {
        console.log('routeUri');
        console.log(routeUri);
        //console.log('routeConfig');
        console.log(routeConfig);

        // Using Try/Catch to ensure a PageRoute can only be created and exist as long as it has all valid values for each property of it.
        try {
            // Set the URI to be used for matching the current PageRoute that is part of the application.
            this.setRouteUri(routeUri);

            // // Loop through all object properties in search for ones that end with "Param". This is a magic value.
            // // Whatever the substring before "Param" is the route param name to add additional properties for.
            // for(let [configKey, configValue] of Object.entries(routeConfig)) {
            //
            //     // Using "Param" as a special magic value that means that this property represents additional functionality about a parameter within the route URI.
            //     let endsWithParamString = "Param";
            //     if(configKey.endsWith(endsWithParamString)) {
            //         let routeParamName = configKey.substring(0, configKey.length - endsWithParamString.length);
            //         let routeParamValue = this.getRouteParam(routeParamName);
            //
            //
            //
            //         if(UtilTypes.isObject(routeParamValue)) {
            //
            //             // Route param has an additional 'where' constraint:
            //             if(configValue.hasOwnProperty('whereParam') && UtilTypes.isString(configValue.whereParam)) {
            //                 routeParamValue['whereParam'] = configValue['whereParam'];
            //             }
            //
            //             // Route param has an additional 'whereIn' constraint:
            //             if(configValue.hasOwnProperty('whereInParam') && UtilTypes.isArray(configValue.whereInParam)) {
            //                 routeParamValue['whereInParam'] = configValue['whereInParam'];
            //             }
            //
            //             // // Route param has an additional 'castAs' constraint:
            //             // if(configValue.hasOwnProperty('castAs') && UtilTypes.isString(configValue.castAs)) {
            //             //     routeParamValue['castAs'] = configValue['castAs'];
            //             // }
            //
            //             // Update the route parameter.
            //             this.setRouteParam(routeParamName, routeParamValue, true);
            //         }
            //     }
            // }

            // Set the handler function (if one is present, and its value is a function):
            if(routeConfig.hasOwnProperty('handlerFn') && UtilTypes.isFunction(routeConfig.handlerFn)) {
                this.setHandlerFn(routeConfig.handlerFn);
            }
            // Set the URI alias of value. This will set the PageRoute as an alias of another page route:
            else if(routeConfig.hasOwnProperty('aliasOf') && UtilTypes.isString(routeConfig.aliasOf) && routeConfig.aliasOf.length > 0) {
                this.setRouteAlias(routeConfig.aliasOf);
            }




            // // Parse each segment of the URI. If it's a route parameter (it's inside brackets {}), then
            // // add that route parameter to the list of route parameters.
            // let routeUriSegments = routeUri.split("/").slice(1);
            // for(let i = 0; i < routeUriSegments.length; i++) {
            //     if( routeUriSegments[i].startsWith("{") && routeUriSegments[i].endsWith("}") ) {
            //         // It is a route parameter. Now get the name of the route parameter.
            //
            //         let route_parameter_name = routeUriSegments[i].substring(1, routeUriSegments[i].length - 2);
            //         if(route_parameter_name.endsWith("?")) {
            //             // Optional params also need to remove the "?" at the end.
            //             route_parameter_name = route_parameter_name.substring(0, route_parameter_name.length - 1);
            //         }
            //
            //         let route_parameter_value = this.getRouteParam(route_parameter_name);
            //
            //
            //         this.setRouteParam(route_parameter_name, route_parameter_value, true);
            //
            //     }
            // }
            // console.log('routeUriSegments');
            // console.log(routeUriSegments);


            // A 'where' constraint is passed. This is an object, each key in the object is the value of the where constraint.
            if(routeConfig.hasOwnProperty('whereParam') && UtilTypes.isObject(routeConfig.whereParam)) {

                for (const [whereParamKey, whereParamValue] of Object.entries(routeConfig.whereParam)) {
                    let route_param_value = this.getRouteParam(whereParamKey);
                    if( !UtilTypes.isNull(route_param_value) ) {
                        this.setRouteParam(whereParamKey, {
                            ...route_param_value,
                            ...{
                                "where": whereParamValue,
                            },
                        }, true);
                    }
                }
            }

            // A 'whereInParam' constraint is passed. This is an object, each key in the object is the value of the whereInParam constraint.
            if(routeConfig.hasOwnProperty('whereInParam') && UtilTypes.isObject(routeConfig.whereInParam)) {

                for (const [whereInParamKey, whereInParamValue] of Object.entries(routeConfig.whereInParam)) {
                    let route_param_value = this.getRouteParam(whereInParamKey);
                    if( !UtilTypes.isNull(route_param_value) ) {
                        this.setRouteParam(whereInParamKey, {
                            ...route_param_value,
                            ...{
                                "whereIn": whereInParamValue,
                            },
                        }, true);
                    }
                }
            }


        }
        catch(error) {
            app().log(error, 'error');
        }
    };
    /**
     * Get the string representation of this PageRoute instance.
     * @returns {string}
     */
    toString = () => {
        return "PageRoute Instance, route URI: " + this.getRouteUri();
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !START: Route URI/Route Params
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * URI of the page route.
     * @private Private class property; use class methods to interact with this value
     * @type {string}
     */
    #routeUri = '';
    /**
     * Parameters that can be matched as part of the URI. This stores a list of param names, and an object of additional behavior to use for each one.
     * @type {{}}
     */
    #routeParams = {};
    /**
     * Default value to use for each route parameter.
     * @type {{optional: boolean, where: null, castAs: null, required: boolean, whereIn: null}}
     */
    #defaultRouteParamValue = {
        "optional": false,
        "required": true,
        "where": null,
        "whereIn": null,
        "castAs": null,
    };
    /**
     * Set the URI that is to be used that represents the current route that is loaded into the application.
     * @param routeUri
     */
    setRouteUri = (routeUri) => {
        // Ensure that the route URI is valid before adding the route. Since multiple different checks are in place
        // to ensure the route URI is valid, this local boolean value is created to prevent duplicate code from
        // being needed. This way, if the URI is invalid for any reason, the same behavior will be used.
        let invalid_route_uri = false;
        // Route URI must always be a string. Otherwise, it is invalid.
        if(!UtilTypes.isString(routeUri)) {
            invalid_route_uri = true;
        }
        // The first character of the route URI must always be a '/'. Otherwise, the route URI is invalid.
        if(routeUri.charAt(0) !== '/') {
            invalid_route_uri = true;
        }
        // If the route URI is determined to be invalid, then do not add this route and instead respond by returning
        // with the specified behavior.
        if(invalid_route_uri) {
            // app().log('Invalid Route URI: ' + routeUri + '. The PageRoute instance was not created.');
            // return false; // Just returning with false for now, to indicate the route was not successfully added.
            // // NOTE: Can optionally throw an error if desired (not implemented yet).
            throw 'Invalid Route URI: ' + routeUri + '. PageRoute could not be created.';
        }
        // Set the route's URI as per usual:
        this.#routeUri = routeUri;

        // Now we must parse the URI to determine the parameters of this route.
        let routeUriSegments = routeUri.split("/").slice(1);
        for(let i = 0; i < routeUriSegments.length; i++) {

            // If the current segment is a parameter
            if(routeUriSegments[i].startsWith("{") && routeUriSegments[i].endsWith("}")) {
                let routeParamName = routeUriSegments[i].substring(1, routeUriSegments[i].length - 1);
                if(routeParamName.endsWith("?")) {
                    routeParamName = routeParamName.substring(0, routeParamName.length - 1);
                }
                let routeParamValue = this.#defaultRouteParamValue;
                if(routeUriSegments[i].endsWith("?}")) {
                    routeParamValue['optional'] = true;
                    routeParamValue['required'] = false;
                }
                else if(routeUriSegments[i].endsWith("}")) {
                    routeParamValue['optional'] = false;
                    routeParamValue['required'] = true;
                }
                // Set the route param.
                this.setRouteParam(routeParamName, routeParamValue);
            }
        }
    };
    /**
     * Get the URI of the route.
     * @returns {string}
     */
    getRouteUri = () => {
        return this.#routeUri;
    };
    /**
     * Set a route parameter additional custom behavior for a specified route parameter name.
     * @param routeParamName
     * @param routeParamValue
     * @param forceUpdate
     */
    setRouteParam = (routeParamName, routeParamValue, forceUpdate = false) => {
        if(forceUpdate || !this.#routeParams.hasOwnProperty(routeParamName)) {
            this.#routeParams[routeParamName] = routeParamValue;
        }
    };
    /**
     * Get a route parameter property.
     * @param routeParamName
     * @returns {null|*}
     */
    getRouteParam = (routeParamName) => {
        if(this.#routeParams.hasOwnProperty(routeParamName)) {
            return this.#routeParams[routeParamName];
        }
        return null;
    };


    // /**
    //  * Get each part of the route URI. A route part is each part of the URI separated by a "/" character.
    //  * Each part may or may not be a parameter.
    //  * @returns {*[]}
    //  */
    // getRouteUriParts = () => {
    //     let routeUriParts = [];
    //
    //     let routeUriSegments = this.getRouteUri().split("/").slice(1);
    //     for(let i = 0; i < routeUriSegments.length; i++) {
    //         let thisRoutePartValue = routeUriSegments[i];
    //         let thisRoutePartIsParam = (thisRoutePartValue.charAt(0) == "{" && thisRoutePartValue.charAt(thisRoutePartValue.length - 1) == "}");
    //         let thisRoutePartParamConfig = (thisRoutePartIsParam ? {
    //             "name": thisRoutePartValue.substring(1, thisRoutePartValue.length - 1),
    //             "optional": (thisRoutePartValue.substring(thisRoutePartValue.length - 2) == "?}"),
    //             "required": (thisRoutePartValue.substring(thisRoutePartValue.length - 2) != "?}"),
    //             "where": "trash",
    //             "whereIn": ["trash"],
    //             "castAs": "Boolean",
    //         } : null);
    //
    //         // Remove the trailing "?" from the param name (if one is present).
    //         if(UtilTypes.isObject(thisRoutePartParamConfig) && thisRoutePartParamConfig.name.charAt(thisRoutePartParamConfig.name.length - 1) == "?") {
    //             thisRoutePartParamConfig.name = thisRoutePartParamConfig.name.substring(0, thisRoutePartParamConfig.name.length - 1);
    //         }
    //
    //         routeUriParts.push({
    //             "value": thisRoutePartValue,
    //             "isParam": thisRoutePartIsParam,
    //             "paramConfig": thisRoutePartParamConfig,
    //         });
    //     }
    //
    //     return routeUriParts;
    // };
    // /**
    //  * Determine if a path name matches the page route URI of this page route.
    //  * @param pathNameToCheck
    //  * @returns {boolean}
    //  */
    // pathNameMatchesRouteUri = (pathNameToCheck) => {
    //     let routeUriParts = this.getRouteUriParts();
    //
    //     let pathNameToCheckParts = pathNameToCheck.split("/").slice(1);
    //
    //     for(let i = 0; i < routeUriParts.length; i++) {
    //         if(routeUriParts[i].isParam) {
    //
    //             // No value exists in the current path name part. When this happens, we can automatically know if the entire
    //             // path passes based on if the route URI parameter is required or is optional.
    //             if(typeof pathNameToCheckParts[i] === 'undefined') {
    //                 // This route URI part is required but is not present in the path name being checked, so this path name is NOT a match.
    //                 if(routeUriParts[i].required) {
    //                     return false;
    //                 }
    //
    //                 // This route URI part is optional, and it isn't present in the path name being checked, so in that case it's OK since it's optional.
    //                 // Continue to the next pathName/URI part to be checked.
    //                 if(routeUriParts[i].optional) {
    //                     continue;
    //                 }
    //             }
    //             else if(typeof pathNameToCheckParts[i] !== 'undefined') {
    //                 // The path name part being checked is present.
    //                 // Now we need to make sure it matches all of the additional checks and really is a match.
    //
    //                 // Must match the RegExp
    //                 if(routeUriParts[i].hasOwnProperty('where') && UtilTypes.isString(routeUriParts[i].where)) {
    //                     let where_check_passes = false;
    //                     if( pathNameToCheckParts[i].match(routeUriParts[i].where) ) {
    //                         // Match found, which means the value in the where string matches, which means the where check passes.
    //                         where_check_passes = true;
    //                     }
    //                     if(!where_check_passes) {
    //                         return false;
    //                     }
    //                 }
    //
    //                 // At least one match must be found in the RegExp
    //                 if(routeUriParts[i].hasOwnProperty('whereIn') && UtilTypes.isArray(routeUriParts[i].whereIn)) {
    //                     let where_in_check_passes = false;
    //                     for(let j = 0; j < routeUriParts[i].whereIn.length; j++) {
    //                         if( pathNameToCheckParts[i].match(routeUriParts[i].whereIn[j]) ) {
    //                             // Match found, so at least one of the values in the whereIn array have matched, which means the whereIn check passes.
    //                             where_in_check_passes = true;
    //                         }
    //                     }
    //                     if(!where_in_check_passes) {
    //                         return false;
    //                     }
    //                 }
    //             }
    //         }
    //         else {
    //             // When the current URI part is NOT a parameter, then the value must match exactly.
    //             // If it does not match exactly in this case, then it is not a match.
    //             if(routeUriParts[i] != pathNameToCheckParts[i]) {
    //                 return false;
    //             }
    //         }
    //     }
    //
    //     // At this point, all parts of the path name match, so this path name successfully matches!
    //     // this.#matchedPathName = pathNameToCheck;
    //     return true;
    // };
    //
    //
    //
    // getParsedRouteParamsFromMatchedPathName = (matchedPathName) => {
    //     // The matched path name should be confirmed before this that it is a matched path name, but this is an additional
    //     // check first to ensure the path name matches.
    //     if( !this.pathNameMatchesRouteUri(matchedPathName) ) {
    //         return null;
    //     }
    //
    //     let matched_route_params = {};
    //
    //     let routeUriParts = this.getRouteUriParts();
    //
    //     let pathNameToCheckParts = matchedPathName.split("/").slice(1);
    //
    //     for(let i = 0; i < routeUriParts.length; i++) {
    //
    //         if(routeUriParts[i].isParam) {
    //             let matched_route_param_name = routeUriParts[i].paramConfig.name;
    //             let matched_route_param_value = (typeof pathNameToCheckParts[i] === 'undefined' ? null : pathNameToCheckParts[i]);
    //
    //             // If the value should be cast as a type before returning.
    //             if(routeUriParts[i].paramConfig.hasOwnProperty('castAs')) {
    //                 if(routeUriParts[i].paramConfig.castAs == 'Boolean') {
    //                     matched_route_param_value = Boolean(matched_route_param_value);
    //                 }
    //                 else if(routeUriParts[i].paramConfig.castAs == 'String') {
    //                     matched_route_param_value = String(matched_route_param_value);
    //                 }
    //                 else if(routeUriParts[i].paramConfig.castAs == 'Integer' || routeUriParts[i].paramConfig.castAs == 'Int') {
    //                     matched_route_param_value = parseInt(matched_route_param_value);
    //                 }
    //                 else if(routeUriParts[i].paramConfig.castAs == 'Float') {
    //                     matched_route_param_value = parseFloat(matched_route_param_value);
    //                 }
    //             }
    //
    //             matched_route_params[matched_route_param_name] = matched_route_param_value;
    //         }
    //
    //     }
    //
    //
    //     return matched_route_params;
    // };
    //
    // getManagedPageFromMatchedPathName = (matchedPathName) => {
    //     // The matched path name should be confirmed before this that it is a matched path name, but this is an additional
    //     // check first to ensure the path name matches.
    //     if( !this.pathNameMatchesRouteUri(matchedPathName) ) {
    //         return null;
    //     }
    //
    //     let matched_route_params = this.getParsedRouteParamsFromMatchedPathName();
    //
    //     let handlerFn = this.getHandlerFn();
    //     return handlerFn.call(this, ...matched_route_params);
    // };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !END: Route URI
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !START: Handler Function
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Function of how to handle the route when it is matched.
     * @private Private class property; use class methods to interact with this value
     * @type {null}
     */
    #handlerFn = null;
    /**
     * Set the handler function to be invoked when this route is matched.
     * @param handlerFn
     * @returns {boolean}
     */
    setHandlerFn = (handlerFn) => {
        if(!UtilTypes.isFunction(handlerFn)) {
            // There are 2 options of how to handle the handler function not being set.
            //     - Option 1) Return false
            //     - Option 2) Throw an error

            // // OPTION 1 - return false:
            // return false;

            // OPTION 2 - Throw an error:
            throw 'Could not set PageRoute handler function.  The PageRoute handler value must be a function.';
        }
        this.#handlerFn = handlerFn;
        return true; // True to signify that the handler function was successfully set.
    };
    /**
     * Unset the route's handler function.
     * @returns {boolean}
     */
    unsetHandlerFn = () => {
        this.#handlerFn = null;
        return true;
    };
    /**
     * Get the route's handler function.
     * @returns {null|function}
     */
    getHandlerFn = () => {
        return this.#handlerFn;
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !END: Handler Function
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !START: Route Alias
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * If the route is an alias of another route, then the other route's handler function will be used instead.
     * @private Private class property; use class methods to interact with this value
     * @type {boolean}
     */
    #isRouteAlias = false;
    /**
     * String that represents the URI of the correct route that this route is an alias of.
     * @private Private class property; use class methods to interact with this value
     * @type {null}
     */
    #aliasOf = null;
    /**
     * Set the route's URI alias value to represent that this page route is just an alias of another page route.
     * @param aliasOf
     * @returns {boolean}
     */
    setRouteAlias = (aliasOf) => {
        if(UtilTypes.isString(aliasOf) && aliasOf.length > 0) {
            this.#isRouteAlias = true;
            this.#aliasOf = aliasOf;
            return true;
        }
        return false;
    };
    /**
     * Unset the route's URI alias, so this page route will no longer be designated as an alias of another page route.
     * @returns {boolean}
     */
    unsetRouteAlias = () => {
        this.#isRouteAlias = false;
        this.#aliasOf = null;
        return true;
    };
    /**
     * Get the route's URI alias value.
     * @returns {null}
     */
    getRouteAlias = () => {
        return this.#aliasOf;
    };
    /**
     * Determine if this page route is simply an alias of another page route.
     * @returns {boolean}
     */
    isRouteAlias = () => {
        return this.#isRouteAlias;
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !END: Route Alias
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


};

/**
 * Class that represents the manager of all the pages (and their routes) that are loaded into and are part of the application.
 */
class PageManager {
    #config = null;
    #defaultConfig = {
        "mode": null,
        "isCreated": false,
        "managedPageRoutes": [],
        "managedPageClasses": [],
        "managedPages": {},
        "currentPageInstance": null,
        "$mountedDomElement": null,
    };
    /**
     * Set configuration of the page manager.
     * @param configKey
     * @param configValue
     * @returns {boolean}
     */
    setConfig = (configKey, configValue) => {
        if(UtilTypes.isObject(configKey)) {
            // Sets the entire configuration object all at once with the entire configuration object.
            this.#config = configKey;
            return true;
        }
        else if(UtilTypes.isString(configKey)) {
            // Sets a single configuration value.
            this.#config[configKey] = configValue;
            return true;
        }
        return false;
    };
    /**
     * Unset page manager configuration.
     * @param configKey
     * @returns {boolean}
     */
    unsetConfig = (configKey = null) => {
        if(UtilTypes.isNull(configKey)
            || (UtilTypes.isString(configKey) && configKey.length == 0)
        ) {
            // If no config key is passed, then completely re-set the configuration, by setting it back to the default configuration.
            this.#config = this.#defaultConfig;
            return true;
        }
        else if(UtilTypes.isString(configKey) && configKey.length > 0 && this.#config.hasOwnProperty(configKey)) {
            // A string value is passed as the page data key, so just unset this specific configuration based on the key.

            // If there is a default page data value for the key being deleted, then set it to the default value instead
            // of deleting it outright.
            if(this.#defaultConfig.hasOwnProperty(configKey)) {
                // Revert configuration value to the default config value.
                this.#config[configKey] = this.#defaultConfig[configKey];
            }
            else {
                // No default config value found, so just delete it.
                delete this.#config[configKey];
            }
            return true;
        }
        return false;
    };
    /**
     * Get configuration of the page manager.
     * @param configKey
     * @returns {{}|null|*}
     */
    getConfig = (configKey = null) => {
        if(UtilTypes.isNull(configKey)
            || (UtilTypes.isString(configKey) && configKey.length == 0)
        ) {
            // When the configuration key is not specified, then get the entire configuration object.
            return this.#config;
        }
        // Retrieve configuration for just the specified key (if one exists).
        if(UtilTypes.isString(configKey) && configKey.length > 0) {
            if(this.#config.hasOwnProperty(configKey)) {
                return this.#config[configKey];
            }
            return null;
        }
        // No configuration value exists for this key.
        return null;
    };

    /**
     * Create a new PageManager instance.
     * @param config
     */
    constructor(config) {
        // this.createManager(config);

        // pageManagerRoutes;

        this.createManager({
            ...config,
            ...{
                'pageRoutes': pageManagerRoutes,
            },
        });


        // // Bind the current page rendered view's $renderedElement - so that whenever that value updates or
        // // changes, the change is automatically reflected by the element being re-rendered in the view.
        // Object.defineProperties(this.#$currentPageRenderedView, {
        //     // The $renderedElement is the reference to the rendered DOM element, that is to be used to display the current page to the user.
        //     "$renderedElement": {
        //         "enumerable": false,
        //         "writable": true,
        //         "value": () => {
        //             return this.$renderedElement;
        //         },
        //         "set": ($renderedElement) => {
        //
        //
        //
        //             if(UtilTypes.isString($renderedElement)) {
        //
        //                 // Default rendered view preset is the view preset to be used:
        //                 if($renderedElement == 'Default') {
        //                     $renderedElement = $('<div/>')
        //                         .addClass('container-fluid')
        //                         .attr('data-is-created', 'false')
        //                         .attr('data-is-loaded', 'false')
        //                         .attr('data-current-lifecycle-status', 'loading')
        //                         .html('Default rendered page view.')
        //                     ;
        //                 }
        //                 // "Loading" rendered view preset is the view preset to be used:
        //                 else if($renderedElement == 'Loading') {
        //                     // Using the "Loading" special view preset - good to display to the user the current page is loading and not yet on the screen.
        //                     $renderedElement = $('<div/>')
        //                         .addClass('container-fluid p-0')
        //                         .append(
        //                             $('<div/>')
        //                                 .addClass('d-flex flex-row')
        //                                 .append(
        //                                     $('<i/>')
        //                                         .addClass('icon-spin1 animate-spin align-self-start')
        //                                 )
        //                                 .append(
        //                                     $('<div/>')
        //                                         .addClass('lh-1 ms-1')
        //                                         .append(
        //                                             $('<span/>')
        //                                                 .addClass('biggest')
        //                                                 .html('Loading...')
        //                                         )
        //                                         .append(
        //                                             $('<br/>')
        //                                         )
        //                                         .append(
        //                                             $('<span/>')
        //                                                 .addClass('text-muted')
        //                                                 .html('Chill, Dawg')
        //                                         )
        //                                 )
        //                         )
        //                     ;
        //                 }
        //             }
        //
        //             this.$renderedElement = $renderedElement;
        //
        //             // Update the page content viewpane in the DOM:
        //             if(UtilTypes.isNull(this.$renderedElement)) {
        //                 app().getComponent('PageManager').getMountedDomElement().empty();
        //             }
        //             else {
        //                 app().getComponent('PageManager').getMountedDomElement().empty().html(this.$renderedElement);
        //             }
        //
        //         },
        //         "get": () => {
        //             return this.$renderedElement;
        //         },
        //     },
        // });



        // // Initialize the current page.
        // // If page initialization is not done here when the PageManager is first created, then initialization must be done
        // // at some other point in the code manually somehow, in order for the PageManager to be used.
        // if(config.hasOwnProperty('initCurrentPage') && config.initCurrentPage) {
        //     this.initCurrentPage();
        // }
        //
        // return;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !START: Page Manager Creation/Instance
    // This includes management of 'mode' and '$mountedDomElement' class property values.
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Keep track of if the PageManager is created and is being used to manage pages in the application.
     * @type {boolean}
     */
    #isCreated = false;
    /**
     * Determine if the PageManager is created, which means it is being used for managing pages in the application.
     * @returns {boolean}
     */
    isCreated = () => {
        return Boolean(this.#isCreated);
    };
    /**
     * Create the PageManager, which means it is now being used to manage pages in the application.
     * @param config
     * @returns {PageManager}
     */
    createManager = (config) => {
        this.#config = this.#defaultConfig;

        try {
            if(config.hasOwnProperty('mode') && UtilTypes.isString(config.mode)) {
                this.setMode(config.mode);
            }

            // Mounts the PageManager to an element in the DOM (Document-Object Model).
            // This becomes the outermost parent element that displays the current page onto the screen.
            if(config.hasOwnProperty('mountTo') && UtilTypes.isString(config.mountTo) && config.mountTo.length > 0) {
                // this.mountPageElement(config.mountTo);
                let $mountedDomElement = null;

                // Using jQuery method:
                $mountedDomElement = $(config.mountTo);
                if($mountedDomElement.length > 0) {
                    this.setMountedDomElement($mountedDomElement);
                }

                // // Not using jQuery method (pure JavaScript):
                // $mountedDomElement = document.querySelector(mountTo);
                // if($mountedDomElement !== null) {
                //     this.setMountedDomElement($mountedDomElement);
                // }

                if(this.getMountedDomElement() !== null) {
                    app().log(' -- PageManager: Mounted To DOM Element: ' + config.mountTo + '.');
                }
                else {
                    app().log(' -- PageManager: Could Not Mount DOM Element:' + config.mountTo + '. DOM Element Not Found.' , 'error');
                }
            }

            // If any page routes are found in the configuration, then add each one as a PageRoute instance that is managed
            // as part of this application. Each route found will create a PageRoute instance.
            if(config.hasOwnProperty('pageRoutes') && UtilTypes.isArray(config.pageRoutes)) {
                for(let i = 0; i < config.pageRoutes.length; i++) {
                    let pageRouteUri = config.pageRoutes[i]['uri'];
                    let pageRouteValue = {
                        "handlerFn": null,
                        "aliasOf": null,
                        "whereParam": {},
                        "whereInParam": {},
                    };
                    if(config.pageRoutes[i].hasOwnProperty('handlerFn')) {
                        pageRouteValue['handlerFn'] = config.pageRoutes[i]['handlerFn'];
                    }
                    if(config.pageRoutes[i].hasOwnProperty('aliasOf')) {
                        pageRouteValue['aliasOf'] = config.pageRoutes[i]['aliasOf'];
                    }
                    if(config.pageRoutes[i].hasOwnProperty('whereParam')) {
                        pageRouteValue['whereParam'] = config.pageRoutes[i]['whereParam'];
                    }
                    if(config.pageRoutes[i].hasOwnProperty('whereInParam')) {
                        pageRouteValue['whereInParam'] = config.pageRoutes[i]['whereInParam'];
                    }
                    // Create the new PageRoute instance that represents a page's route that can be matched in the PageManager.
                    let currentPageRoute = new PageRoute(pageRouteUri, pageRouteValue);
                    this.addPageRoute(currentPageRoute);
                }
            }

            if(config.hasOwnProperty('initCurrentPage') && UtilTypes.isBoolean(config.initCurrentPage) && config.initCurrentPage) {
                app().log(' -- PageManager: Initializing Current Page...');
                let initCurrentPageData = (config.hasOwnProperty('initCurrentPageData') && UtilTypes.isObject(config.initCurrentPageData) ? config.initCurrentPageData : {});
                // app().log('initCurrentPageData');
                // app().log(initCurrentPageData);
                // console.log(initCurrentPageData);


                this.initCurrentPage(initCurrentPageData);
            }



            // if(config.hasOwnProperty('pageClasses') && UtilTypes.isArray(config.pageClasses)) {
            //     for(let i = 0; i < config.pageClasses.length; i++) {
            //         this.addManagedPageClass(config.pageClasses[i]);
            //     }
            // }

            this.setConfig("isCreated", true);
            return this;
        }
        catch(error) {
            app().log(error, 'error');
        }
    };

    initCurrentPage = (initCurrentPageData = {}) => {
        let current_pathname = new URL(document.location).pathname;
        app().log('Checking Current Pathname For Matched PageRoute - ' + current_pathname + ' ...');

        let matchedPageRoute = this.getMatchedPageRoute(current_pathname);
        if(matchedPageRoute) {
            app().log(' -- ✅ Found Matched PageRoute! - ' + matchedPageRoute.getRouteUri());
            // console.log(matchedPageRoute);
            // console.log(matchedPageRoute.getHandlerFn());

            let handlerFn = matchedPageRoute.getHandlerFn()
            // console.log(handlerFn);


            // TODO - get parsed input, and pass into the handlerFn as arguments.
            //let parsedInput = 'TODO';



            let matchedPageClass = handlerFn();
            console.log(matchedPageClass);
            let matchedPageInstance = new matchedPageClass({
                'pageData': initCurrentPageData,
            });
            console.log(matchedPageInstance);
            // matchedPageInstance.setPageData(initCurrentPageData);
            this.setCurrentPage(matchedPageInstance);




            // let matchedPage = handlerFn();
            // console.log(matchedPage);
            //
            // matchedPage.setPageData(initCurrentPageData);
            //
            // this.setCurrentPage(matchedPage);
        }
        else {
            app().log(' -- 🚫 No Matched PageRoute Found.');
        }
    };

    /**
     * Destroy the PageManager, which means it is no longer being used to manage pages in the application.
     * @returns {PageManager}
     */
    destroyManager = () => {
        this.unsetMode();
        this.unsetMountedDomElement();
        this.#isCreated = false;
        return this;
    };
    /**
     * The mode that the page manager is loaded as, and that is used for managing pages in the application.
     * NOTE: Must be either 'History' or 'Hash', or null.
     *     - null means the PageManager is not loaded (not being used).
     *     - 'History' means that pages are being managed using HTML5 History API (modern method for Single Page Applications (SPAs) - ideal way).
     *     - 'Hash' means that pages are being managed using the hash ('#') value within the page URL (older way but works).
     * @type {string|null}
     */
    #mode = null;
    /**
     * List of valid modes that a created PageManager can be using for it to function.
     * This class property exists just as an extra way to ensure that only valid valies can be set for the mode class property.
     * @type {string[]}
     */
    #valid_modes = [
        "History",
        "Hash",
    ];
    /**
     * Set the mode to be used for managing pages that are loaded into the application.
     * @param mode
     * @returns {boolean|void}
     */
    setMode = (mode = null) => {
        // If the mode value is null, then unset the mode.
        if(UtilTypes.isNull(mode)) {
            return this.unsetMode();
        }

        if(! (UtilTypes.isString(mode) && this.#valid_modes.includes(mode))) {
            throw 'Invalid PageManager Mode: ' + mode + '. Mode was not set.';
        }

        this.#mode = mode;
        return true; // True means the mode was successfully set.
    };
    /**
     * Unset the mode of the PageManager.
     * @returns {boolean}
     */
    unsetMode = () => {
        this.#mode = null;
        return true;
    };
    /**
     * Get the mode being used for managing pages in the application.
     * @returns {string|null}
     */
    getMode = () => {
        return this.#mode;
    };
    /**
     * A reference to the Document-Object Model (DOM) element that represents the outermost parent element that the
     * current page is being displayed into in the application.
     * @type {null}
     */
    #$mountedDomElement = null;
    /**
     * Set the current page DOM element to be used to display the current page to the screen.
     * @param $mountedDomElement
     */
    setMountedDomElement = ($mountedDomElement) => {
        this.#$mountedDomElement = $mountedDomElement;
    };
    /**
     * Unset the current page DOM element (used to show the current page on the page in the application).
     * @returns {boolean}
     */
    unsetMountedDomElement = () => {
        this.#$mountedDomElement = null;
        return true;
    };
    /**
     * Get the current page DOM element, that is used to show the current page to the page in the application.
     * @returns {null}
     */
    getMountedDomElement = () => {
        return this.#$mountedDomElement;
    };
    /**
     * Mount the page DOM element, which is used as the outer-parent element to display the current page's rendered view content in the application.
     * @param mountTo
     */
    mountPageElement = (mountTo) => {
        let $mountedDomElement = null;

        // Using jQuery method:
        $mountedDomElement = $(mountTo);
        if($mountedDomElement.length > 0) {
            this.setMountedDomElement($mountedDomElement);
        }

        // // Not using jQuery method (pure JavaScript):
        // $mountedDomElement = document.querySelector(mountTo);
        // if($mountedDomElement !== null) {
        //     this.setMountedDomElement($mountedDomElement);
        // }

        if(this.getMountedDomElement() !== null) {
            app().log(' -- PageManager: Mounted To DOM Element: ' + mountTo + '.');
        }
        else {
            app().log(' -- PageManager: Could Not Mount DOM Element:' + mountTo + '. DOM Element Not Found.' , 'error');
        }
    };
    // /**
    //  * The element that represents the currently rendered view, to be to the user in the current page DOM's page viewpane.
    //  * @type {null}
    //  */
    // #$currentPageRenderedView = {
    //     "$renderedElement": null,
    // };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // !END: Page Manager Creation/Instance
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





  //   /**
  //    * List of all managed page classes (classes ONLY - NOT instances) that are being managed in the application.
  //    * @type {[]}
  //    */
  //   #managedPageClasses = [];
  //   /**
  //    * Add a managed page class to be managed as part of the application.
  //    * @param managedPageClass
  //    * @returns {boolean}
  // */
  //   addManagedPageClass = (managedPageClass) => {
  //       // // If the page has already been added (by the constructor name), then don't let it be added again.
  //       // for(let i = 0; i < this.#managedPageClasses.length; i++) {
  //       //     if(this.#managedPageClasses[i].constructor.name == managedPageClass.constructor.name) {
  //       //         // This page has already been added. Don't allow it to be added again.
  //       //         return false;
  //       //     }
  //       // }
  //       this.#managedPageClasses.push(managedPageClass);
  //       return true;
  //   };
  //   /**
  //    * Remove a managed page class from being managed as part of the application.
  //    * @param managedPageNameOrClass
  //    * @returns {boolean}
  //    */
  //   removeManagedPageClass = (managedPageNameOrClass) => {
  //       for(let i = 0; i < this.#managedPageClasses.length; i++) {
  //           // The managed page name to check depends on if the page class was passed, or a string.
  //           let managedPageNameToCheck = (UtilTypes.isString(managedPageNameOrClass) ? managedPageNameOrClass : managedPageNameOrClass.constructor.name);
  //           // If a match is found based on the determined managed page name to check, then it must be removed from the full list.
  //           if(this.#managedPageClasses[i].constructor.name == managedPageNameToCheck) {
  //               // A managed page has been founded that matches the one to be removed.
  //               this.#managedPageClasses.splice(i, 1);
  //               return true;
  //           }
  //       }
  //       // No managed page was found in the current list, so none were removed.
  //       return false;
  //   };
  //   /**
  //    * Get all the page classes that are being managed in the application.
  //    * @returns {[]}
  //    */
  //   getManagedPageClasses = () => {
  //       return this.#managedPageClasses;
  //   };
  //   /**
  //    * Get a managed page class that is being managed in the application.
  //    * @param managedPageName
  //    * @returns {null|*}
  //    */
  //   getManagedPageClass = (managedPageName) => {
  //       for(let i = 0; i < this.#managedPageClasses.length; i++) {
  //           if(this.#managedPageClasses[i].constructor.name == managedPageName) {
  //               return this.#managedPageClasses[i];
  //           }
  //       }
  //       return null;
  //   };
  //   /**
  //    * Determine if a page class exists and is being managed in the application based on the name provided.
  //    * @param managedPageName
  //    * @returns {boolean}
  //    */
  //   hasManagedPageClass = (managedPageName) => {
  //       for(let i = 0; i < this.#managedPageClasses.length; i++) {
  //           if(this.#managedPageClasses[i].constructor.name == managedPageName) {
  //               return true;
  //           }
  //       }
  //       return false;
  //   }
    /**
     * Array of PageRoute objects that represents routes that can be matched in the page manager.
     * @type {[]}
     */
    #pageRoutes = [];
    /**
     * Add a PageRoute as a route to be managed in the application.
     * @param pageRoute
     */
    addPageRoute = (pageRoute) => {
        for(let i = 0; i < this.#pageRoutes.length; i++) {
            if(this.#pageRoutes[i].getRouteUri() == pageRoute.getRouteUri()) {
                // PageRoute already added with this URI, don't let it be added again.
                return false;
            }
        }
        this.#pageRoutes.push(pageRoute);
        app().log(' -- Added PageRoute: ' + pageRoute.getRouteUri());
        return true;
    };
    /**
     * Remove a page route in the application.
     * @param pageRoute
     * @returns {boolean}
     */
    removePageRoute = (pageRoute) => {
        for(let i = 0; i < this.#pageRoutes.length; i++) {
            // The route URI to be removed depends on if the page class was passed, or a string.
            let routeUriToBeRemoved = (UtilTypes.isString(pageRoute) ? pageRoute : pageRoute.getRouteUri());

            // If a match is found based on the determined page route URI, then remove that page route
            if(this.#pageRoutes[i].getRouteUri() == routeUriToBeRemoved) {
                this.#pageRoutes.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    /**
     * Get the page routes that are currently loaded into the application. Each one represents a route URI which corresponds to a page in the application.
     * @returns {[]}
     */
    getPageRoutes = () => {
        return this.#pageRoutes;
    };
    /**
     * Get the first page route that matches the specified URL pathname, or null if no page route is matched.
     * @param pathname
     */
    getMatchedPageRoute = (pathname) => {
        // app().log('Current PageRoute Checking: ' + pathname);

        // Each part of the pathname must match each part of the page route URI for a match to occur.
        let pathnameParts = pathname.split("/").slice(1);
        // Set to true, at any point in this function it can be changed to false if anything does not match properly.

        let pageRoutesToBeChecked = this.getPageRoutes();
        for(let i = 0; i < pageRoutesToBeChecked.length; i++) {

            app().log('Current PageRoute Checking: ' + pageRoutesToBeChecked[i].getRouteUri());

            // Current page route that is being checked for a match:
            let currentPageRoute = pageRoutesToBeChecked[i];
            let currentPageRouteUriParts = currentPageRoute.getRouteUri().split("/").slice(1);


            // Keep track of each part of if each individual part of the pathname has passed.
            // If all have passed by the end, then the entire pathname is a match.
            // Begin by setting the passed status of each part of the pathname to false, for the length of the pathname.
            // Each part will manually have to be found is valid.
            let current_page_route_uri_passed_parts = [];
            // for(let j = 0; j < pathnameParts.length; j++) {
            //     current_page_route_uri_passed_parts[j] = false;
            // }


            // Loop through each part of the current page route, and check to make sure each part satisfies/matches each part of the pathname's parts.
            for(let j = 0; j < currentPageRouteUriParts.length; j++) {



                // let each_current_page_route_part_passes = true;
                let this_current_page_route_part_passes = false;
                // current_page_route_uri_passed_parts.push();


                let current_page_route_uri_part_is_a_param = false;
                let current_page_route_uri_part_param_is_optional = false;

                let current_page_route_uri_part_param_name = '';
                current_page_route_uri_part_param_name = currentPageRouteUriParts[j].substring(1, currentPageRouteUriParts[j].length - 1);
                if(current_page_route_uri_part_param_name.endsWith("?")) {
                    current_page_route_uri_part_param_name = current_page_route_uri_part_param_name.substring(0, current_page_route_uri_part_param_name.length - 1);
                }

                if(currentPageRouteUriParts[j].startsWith("{") && currentPageRouteUriParts[j].endsWith("}")) {
                    current_page_route_uri_part_is_a_param = true;
                    if(currentPageRouteUriParts[j].endsWith("?}")) {
                        current_page_route_uri_part_param_is_optional = true;
                    }
                }

                // If the current URI segment being checked is NOT a parameter, then it's a static string value that must be matched.
                if(!current_page_route_uri_part_is_a_param) {
                    // It's not a param, so just ensure this part matches exactly to the corresponding pathname part.
                    if(currentPageRouteUriParts[j] == pathnameParts[j]) {
                        this_current_page_route_part_passes = true;
                    }
                }
                else {
                    // The current URI segment is a route parameter.

                    if(typeof pathnameParts[j] === 'undefined') {
                        if(current_page_route_uri_part_param_is_optional) {
                            this_current_page_route_part_passes = true;
                        }
                        else {
                            // part is not optional, and it is missing, so this piece is invalid.
                            this_current_page_route_part_passes = false;
                        }
                    }
                    else {

                        let current_page_route_param_config = pageRoutesToBeChecked[i].getRouteParam(current_page_route_uri_part_param_name);
                        console.log('current_page_route_param_config');
                        console.log(current_page_route_param_config);

                        // A 'where' constraint exists on the route parameter.
                        if( current_page_route_param_config.hasOwnProperty('where') && UtilTypes.isString(current_page_route_param_config.where) ) {

                            // Set to false.
                            // If it ends up matching, it will be changed to true.
                            this_current_page_route_part_passes = false;

                            // Pathname part does not match the regular expression, so this current page route part does not pass.
                            if(pathnameParts[j].match(current_page_route_param_config.where)) {
                                this_current_page_route_part_passes = true
                            }
                        }

                        // A 'whereIn' constraint exists on the route parameter.
                        if( current_page_route_param_config.hasOwnProperty('whereIn') && UtilTypes.isArray(current_page_route_param_config.whereIn) ) {

                            // Set to false.
                            // If it ends up matching, it will be changed to true.
                            this_current_page_route_part_passes = false;


                            // let at_least_one_wherein_property_passes = false;

                            for(let k = 0; k < current_page_route_param_config.whereIn.length; k++) {
                                if(pathnameParts[j].match(current_page_route_param_config.whereIn[k])) {
                                    // at_least_one_wherein_property_passes = true;

                                    // At least one of the whereIn passed, so it's successful.
                                    this_current_page_route_part_passes = true;
                                }
                            }

                            // // At least one of the whereIn passed, so it's successful.
                            // if(at_least_one_wherein_property_passes) {
                            //     this_current_page_route_part_passes = true;
                            // }

                        }
                        else {
                            // No 'where' or 'whereIn' constraints:
                            this_current_page_route_part_passes = true;


                            // TODO - additional checks for 'where' and 'whereIn'
                        }
                    }
                }

                // current_page_route_uri_passed_parts[j] = this_current_page_route_part_passes;
                current_page_route_uri_passed_parts.push(this_current_page_route_part_passes);
            }

            app().log(' -- passed route URI parts: ' + current_page_route_uri_passed_parts.map((this_val) => {
                if(this_val) {
                    return "✅true";
                }
                else {
                    return "🚫false";
                }
            }).join(','));

            app().log(' -- page route length >= pathname length: ' + (currentPageRouteUriParts.length >= pathnameParts.length ? '✅true' : '🚫false'));

            // A match occurs when every part of the current page route has passed, AND the length
            // of the current page route is greater than or equal to the length of the pathname's parts.
            // This is due to possible optional parameters that are in the pathname, but not in the route URI,
            // so the extra check is added to ensure the lengths are correct.
            let this_page_route_is_a_match = false;
            if(
                current_page_route_uri_passed_parts.every((element) => element === true)
                && currentPageRouteUriParts.length >= pathnameParts.length
            ) {
                this_page_route_is_a_match = true;
            }

            if(this_page_route_is_a_match) {
                app().log(' -- ✅ This Is A Match!');
                return currentPageRoute;
            }
            else {
                app().log(' -- 🚫 Not A Match');
            }
            app().log('');
        }

        // None of the page routes match the pathname specified.
        return null;
    };

    /**
     * Holds instances of all the pages that have been created and are being managed in the application.
     * @type {{}}
     */
    #managedPages = {};
    /**
     * Get all the managed pages (instances) of pages that have been created and are currently being managed in the application.
     * @returns {{}}
     */
    getManagedPages = () => {
        return this.#managedPages;
    };
    /**
     * Get an instance of a page that is currently being managed in the application.
     * @param managedPageKey
     * @param managedPageConfig
     * @param forceNewInstance
     * @returns {*}
     */
    getManagedPage = (managedPageName, managedPageConfig = {}, forceNewInstance = false) => {
        // // An instance of a page can only exist and be created as long as a page class exists and is being currently managed in the application.
        // if(! this.hasManagedPageClass(managedPageName)) {
        //     throw 'No Managed Page Exists With Name: ' + managedPageName + '. Could not get managed page instance.';
        // }
        // If a new instance is to be forced to be created, or if no page instance exists yet for this page key, then create the page instance.
        if(forceNewInstance || !this.#managedPages.hasOwnProperty(managedPageName) ) {
            let newManagedPageInstance = null;

            switch(managedPageName) {
                case 'Welcome':
                    newManagedPageInstance = new WelcomePage(managedPageConfig);
                    break;
                case 'MercadoLibreApi':
                    newManagedPageInstance = new MercadoLibreApiPage(managedPageConfig);
                    break;
            }

            if(newManagedPageInstance !== null) {
                this.#managedPages[managedPageName] = newManagedPageInstance;
                return this.#managedPages[managedPageName];
            }

            return null;

            // let managedPageClass = this.getManagedPageClass(managedPageName);
            // let newManagedPageInstance = new managedPageClass(managedPageConfig);
            // this.#managedPages[managedPageName] = newManagedPageInstance;
        }
        // By now the page instance should definitely exist, so just return it.
        return this.#managedPages[managedPageName];
    };
    /**
     * Instance of a managed page that is currently being used as the current active page that is loaded and is shown the DOM to the user in the application.
     * @type {null}
     */
    #currentPage = null;
    // /**
    //  * Change the managed page instance that is being used as the current page instance.
    //  * @param newCurrentPageName
    //  */
    // changeCurrentPage = (newCurrentPageName) => {
    //     let previousPageInstance = this.getCurrentPage();
    //     if( !UtilTypes.isNull(previousPageInstance) ) {
    //         try {
    //             // Unset the current page
    //             this.unsetCurrentPage();
    //         }
    //         catch(error) {
    //             app().log(error, 'error');
    //         }
    //
    //         this.getMountedDomElement().unsetRenderedView();
    //     }
    //
    //     let newCurrentPage = this.getManagedPage(newCurrentPageName);
    //     this.#currentPage = newCurrentPage;
    //     if( !this.#currentPage.isLoaded() ) {
    //         this.getCurrentPage().loadPage();
    //     }
    //     let currentPageRenderedView = this.getCurrentPage().getRenderedView();
    //     this.getMountedDomElement().empty().html(currentPageRenderedView);
    // };

    /**
     * Set the managed page instance that is used to represent the current page.
     * @param newCurrentPage
     */
    setCurrentPage = (newCurrentPage) => {
        // If a page is already being used as the current page, then it must first be removed as the current page before the
        // current page instance can be updated.
        let previousCurrentPage = this.getCurrentPage();
        if( !UtilTypes.isNull(previousCurrentPage) ) {
            try {
                this.unsetCurrentPage();
            }
            catch(error) {
                app().log(error, 'error');
            }
        }
        this.#currentPage = newCurrentPage;
        app().log('Set Current Page To: ' + newCurrentPage.constructor.name);

        // if(!this.#currentPage.isLoaded()) {
        //     this.#currentPage.loadPage();
        // }
    };
    // setCurrentPage = (newCurrentPageName, newCurrentPageConfig = {}, forceNewPageInstance = false) => {
    //     let previousCurrentPage = this.getManagedPage(this.#currentPageName);
    //     if(! UtilTypes.isNull(previousCurrentPage)) {
    //         try {
    //             this.unsetCurrentPage()
    //         }
    //         catch(error) {
    //             app().log(error, 'error');
    //         }
    //     }
    //
    //
    // };
    /**
     * Unset the current page instance from being designated as the current page instance.
     * This also automatically unloads and destroys that page instance as well.
     * @returns {boolean}
     */
    unsetCurrentPage = () => {
        // If the application has a current page already, then it must gracefully and correctly
        // be removed and unset as the current page, before the new current page instance can be set.
        if(! this.hasCurrentPageInstance()) {
            throw 'No Current Page Is Set. The Current Page Could Not Be Unset.';
        }
        let currentPageInstance = this.getCurrentPage();
        if(currentPageInstance.isLoaded()) {
            currentPageInstance.unloadPage();
        }
        if(currentPageInstance.isCreated()) {
            currentPageInstance.destroyPage();
        }
        this.unsetCurrentPage();
        return true;
    };
    /**
     * Get the current page that is current loaded and active in the application.
     * @returns {null}
     */
    getCurrentPage = () => {
        if(!UtilTypes.isNull(this.#currentPage)) {
            return this.#currentPage;
        }
        return null;
    };
    /**
     * Determine if a current page instance is currently loaded and being used in the application.
     * @returns {*|boolean}
     */
    hasCurrentPageInstance = () => {
        return !UtilTypes.isNull(this.#currentPage);
    };
    currentPageIsCreated = () => {

    };
    currentPageIsLoaded = () => {

    };
    // /**
    //  * Instance of the current page that is loaded and active in the application.
    //  * @type {null}
    //  */
    // #currentPage = null;











    // /**
    //  * Store a copy of all instantiated pages here. This prevents pages from needlessly
    //  * being re-created.  With this, only a single instance of each page should exist.
    //  * @type {{}}
    //  */
    // #pageInstances = {};
    // #currentPage = null;
    // getCurrentPage = () => {
    //     return this.#currentPage;
    // };



    // static #getMatchedPageFromPathname(pathname) {
    //     // // Remove first trailing slash (if one is there) to ensure it's not part of the URI that is checked.
    //     // if(pathname.charAt(0) === '/') {
    //     //     pathname = pathname.substr(1);
    //     // }
    //
    //     // app().log('Searching For Pathname: ' + pathname);
    //
    //
    //     for(let i = 0; i < PageManager.#routes.length; i++) {
    //         // URI can either be an array of strings (many URIs to check),
    //         // or a single string that is the URI to check.
    //         if(Array.isArray(PageManager.#routes[i].uri)) {
    //             // Array of URIs to check:
    //             for(let j = 0; j < PageManager.#routes[i].uri.length; j++) {
    //                 if(PageManager.#routes[i].uri[j] == pathname) {
    //                     return PageManager.#routes[i].fn();
    //                 }
    //             }
    //         }
    //         else if(typeof PageManager.#routes[i].uri === "string" || PageManager.#routes[i].uri instanceof String) {
    //             // Single URI string to check:
    //             if(PageManager.#routes[i].uri == pathname) {
    //                 return PageManager.#routes[i].fn();
    //             }
    //         }
    //     }
    //     return null;
    // }

    // /**
    //  * Change the current page to a new one.
    //  * @param newPageInstance
    //  * @returns {boolean}
    //  */
    // #changeCurrentPage(newPageInstance) {
    //     console.log(newPageInstance);
    //
    //     if(this.#currentPage !== null) {
    //         if(this.#currentPage.hasOwnProperty('unload')) {
    //             this.#currentPage.unload();
    //             this.#currentPage = null;
    //         }
    //     }
    //
    //     app().log(newPageInstance);
    //     // newPageInstance = (new newPageInstance());
    //
    //     if(newPageInstance.hasOwnProperty('load')) {
    //         newPageInstance.load();
    //     }
    //     this.#currentPage = newPageInstance;
    //     // this.#$mountedDomElement.attr('name', newPageInstance.constructor.name);
    //     // this.#$mountedDomElement.setAttribute('name', newPageInstance.constructor.name);
    //
    //     this.#$mountedDomElement.attr('name', newPageInstance.constructor.name);
    //
    //     app().log('Changed Page To: ' + newPageInstance.constructor.name);
    //     return true;
    // }
    //
    // initCurrentPage(config = {}) {
    //     // app().log("ℹ️ Initializing Current Page...");
    //     // console.log(config);
    //
    //     let current_pathname = new URL(document.location).pathname;
    //     app().log('ℹ️ Initializing Current Page - ' + current_pathname + ' -...');
    //     console.log(config);
    //     app().log('Current Path Name To Check For A Match: ' + current_pathname);
    //
    //     let matched_page = PageManager.#getMatchedPageFromPathname(current_pathname);
    //     if(matched_page != null) {
    //         app().log('✅ - ' + current_pathname + ' - Match Found! Matched Page: ' + matched_page.constructor.name);
    //         app().log('Matched Page From URL Pathname (URI): ' + matched_page.constructor.name)
    //         // this.#currentPage = matched_page;
    //         // app().log('Current Page: ' + this.#currentPage.constructor.name);
    //
    //
    //         // let _pageData = config.hasOwnProperty('_pageData') ? config._pageData : {};
    //
    //         // let pageConfig = {
    //         //     'data': config.hasOwnProperty('_pageData') ? config._pageData : {},
    //         // };
    //
    //         let pageConfig = config.hasOwnProperty('_pageData') ? config._pageData : {};
    //
    //         console.log('pageConfig:');
    //         console.log(pageConfig);
    //
    //         let newPageInstance = getPageByClass(matched_page.constructor.name, pageConfig);
    //         console.log('newPageInstance:');
    //         console.log(newPageInstance);
    //
    //         // let pageClass = getPageByClass(matched_page.constructor.name);
    //         // console.log('pageClass:');
    //         // console.log(pageClass);
    //         //
    //         // let newPageInstance = new pageClass(pageConfig);
    //         // console.log('newPageInstancee:');
    //         // console.log(newPageInstance);
    //
    //         this.#changeCurrentPage(newPageInstance);
    //
    //         app().log('✅ ...Initialized Current Page!', 'info');
    //     }
    //     else {
    //         app().log('⛔️ ...Failed Initializing Current Page.', 'error');
    //     }
    // }




    // /**
    //  * List of routes that are currently being managed in the PageManager.
    //  * @type {{}}
    //  */
    // #routes = {};
    // /**
    //  * Set a route URI value to be managed in the PageManager, along with the related handler function to be invoked
    //  * when the route URI is matched, OR if this route URI is an alias of another route then instead set the
    //  * value of the route URI that this current route URI is an alias of (so when a route URI is matched, the correct
    //  * aliased route handler function will be invoked instead.
    //  * @param routeUri URI of the route.
    //  * @param handlerFn Handler function that is invoked when a route is matched.
    //  * @param aliasOf String that represents the URI of the route that this route URI is an alias of.
    //  */
    // setRoute = (routeUri, handlerFn = null, aliasOf = null) => {
    //     // Ensure that the route URI is valid before adding the route. Since multiple different checks are in place
    //     // to ensure the route URI is valid, this local boolean value is created to prevent duplicate code from
    //     // being needed. This way, if the URI is invalid for any reason, the same behavior will be used.
    //     let invalid_route_uri = false;
    //     // Route URI must always be a string. Otherwise, it is invalid.
    //     if(!UtilTypes.isString(routeUri)) {
    //         invalid_route_uri = true;
    //     }
    //     // The first character of the route URI must always be a '/'. Otherwise, the route URI is invalid.
    //     if(routeUri.charAt(0) !== '/') {
    //         invalid_route_uri = true;
    //     }
    //     // If the route URI is determined to be invalid, then do not add this route and instead respond by returning
    //     // with the specified behavior.
    //     if(invalid_route_uri) {
    //         app().log('Invalid Route URI: ' + routeUri + '. The route was not added.');
    //         return false; // Just returning with false for now, to indicate the route was not successfully added.
    //         // NOTE: Can optionally throw an error if desired (not implemented yet).
    //     }
    //
    //
    //     // Object that represents how to handle the route URI when it is matched.
    //     // Initialize as null. It should be changed to an object below. If for some reason the value remains null,
    //     // this is used as an additional safety-check to ensure that only a valid route value is added for each route.
    //     let routeUriValue = null;
    //     if(UtilTypes.isFunction(handlerFn) && UtilTypes.isString(aliasOf) && aliasOf.length > 0) {
    //         routeUriValue = {
    //             'fn': null,
    //             'aliasOf': aliasOf,
    //         };
    //     }
    //     else if(UtilTypes.isFunction(handlerFn)) {
    //         routeUriValue = {
    //             'fn': handlerFn,
    //             'aliasOf': null,
    //         };
    //     }
    //     if(UtilTypes.isObject(routeUriValue)) {
    //         this.#routes[routeUri] = routeUriValue;
    //
    //         if(this.#routes.hasOwnProperty(routeUri)) {
    //             // this.#routes[routeUri] = routeUriValue;
    //             // The route has already been added based on the URI.
    //         }
    //
    //         this.#routes[routeUri] = routeUriValue;
    //     }
    //
    //
    //     // // Only let the route be added if there is not already a previous current entry for the route path in the list of routes.
    //     // if(! this.#routes.hasOwnProperty(routeUri)) {
    //     //     let routeValue = null;
    //     //
    //     //     if(UtilTypes.isString(aliasOf) && aliasOf.length > 0) {
    //     //         routeValue = {
    //     //             'fn': null,
    //     //             'aliasOf': aliasOf,
    //     //         };
    //     //     }
    //     //     else if(UtilTypes.isFunction(handlerFn)) {
    //     //         routeValue = {
    //     //             'fn': handlerFn,
    //     //             'aliasOf': null,
    //     //         };
    //     //     }
    //     //
    //     //     if(UtilTypes.isObject(routeValue)) {
    //     //         this.#routes[routeUri] = routeValue;
    //     //     }
    //     // }
    //     // return this;
    // };
    // /**
    //  * Unset a single route based on the specified route URI. If the route URI value is null, then completely reset the
    //  * routes which has the same effect of unsetting all the current routes.
    //  * @param routeUri
    //  * @returns {boolean}
    //  */
    // unsetRoute = (routeUri = null) => {
    //     if(UtilTypes.isNull(routeUri)) {
    //         this.#routes = {};
    //         return true;
    //     }
    //     if(this.#routes.hasOwnProperty(routeUri)) {
    //         delete this.#routes[routeUri];
    //         return true;
    //     }
    //     // False means unsetting of the route has failed.
    //     return false;
    // };
    // /**
    //  * Get a route based on the specified route URI, or null if none can be found.
    //  * @param routeUri
    //  * @returns {null|*}
    //  */
    // getRoute = (routeUri) => {
    //     if(this.#routes.hasOwnProperty(routeUri)) {
    //         return this.#routes[routeUri];
    //     }
    //     // No route can be found for the specified URI, so return null to signify no matched route exists.
    //     return null;
    // };





    // setMode(mode) {
    //     if(Util('Types').isString(mode)
    //         && ["History", "Hash"].includes(mode)
    //     ) {
    //         this.#mode = mode;
    //     }
    //     throw 'Invalid mode.';
    // }
    //
    // // getMode() {
    // //     return this.#mode;
    // // }
    //
    // /**
    //  * Convert the string route rule to RegExp rule
    //  *
    //  * @param {string} route
    //  * @returns {RegExp}
    //  * @private
    //  */
    // _parseRouteRule(route) {
    //     if (typeof route !== "string") {
    //         return route;
    //     }
    //     let uri = this._trimSlashes(route);
    //     let rule = uri
    //         .replace(/([\\\/\-\_\.])/g, "\\$1")
    //         // .replace(/\{[a-zA-Z0-9]+\}/g, "(:any)")
    //         .replace(/\{[a-zA-Z]+\}/g, "(:any)")
    //         .replace(/\:any/g, "[\\w\\-\\_\\.]+")
    //         .replace(/\:word/g, "[a-zA-Z]+")
    //         // .replace(/\:string/g, "[a-zA-Z0-9]+")
    //         .replace(/\:num/g, "\\d+");
    //
    //     return new RegExp("^" + rule + "$", "i");
    // }
    //
    // /**
    //  * Trim slashes for path
    //  *
    //  * @private
    //  * @param {string} path
    //  * @returns {string}
    //  */
    // _trimSlashes(path) {
    //     if (typeof path !== "string") {
    //         return "";
    //     }
    //     return path.toString().replace(/\/$/, "").replace(/^\//, "");
    // };
    //
    //
    //
    //
    // setPathname(pathname) {
    //
    //     let parsedRouteRule = this._parseRouteRule(pathname);
    //     app().log(parsedRouteRule);
    //
    //     app().log(pathname);
    //     this.pathname = pathname;
    // }
    //
    // getPathname() {
    //     return this.pathname;
    // }
    //
    //
    //
    // notFoundHandler() {
    //     app().log('handling route page not found');
    // }
    //
    //
    // /**
    //  * Get pages that are being managed.
    //  * @returns {[]}
    //  */
    // getRoutes() {
    //     return this.#routes;
    // }
    //
    // /**
    //  * Add a page into the PageManager.
    //  * @param page:Page
    //  */
    // addPage(page) {
    //     // Only load the page if it hasn't already been loaded.
    //     if(this.getPage(page.getPageIdentifier()) === null) {
    //         this.#routes.push(page);
    //     }
    // }
    //
    // /**
    //  * Remove a page from the PageManager.
    //  * @param pageIdentifier:Page|string
    //  */
    // removePage(pageIdentifier) {
    //     if(pageIdentifier instanceof Page) {
    //         pageIdentifier = pageIdentifier.getPageIdentifier();
    //     }
    //
    //     this.#routes.forEach(function(this_page, index) {
    //         if(this_page.getPageIdentifier() === pageIdentifier) {
    //             this.#routes.splice(index, 1);
    //             return;
    //         }
    //     });
    //
    //     throw 'No page with that identifier. Page not removed.';
    // }
    //
    // /**
    //  * Get a page by its identifier.
    //  * @param pageIdentifier
    //  * @returns {null}
    //  */
    // getPage(pageIdentifier) {
    //     let self = this;
    //
    //     for(let i = 0; i < this.#routes.length; i++) {
    //         if(this.#routes[i].getPageIdentifier() === pageIdentifier) {
    //             return this.#routes[i];
    //         }
    //     }
    //
    //     return null;
    // }
    //
    // setCurrentPage(currentPage) {
    //     // if(this.currentPage) {
    //     //     this.currentPage.unmountPage();
    //     // }
    //     //
    //     // this.currentPage = currentPage;
    //     // this.currentPage.mountPage();
    //     this.currentPage = currentPage;
    // }
    //
    // getCurrentPage() {
    //     return this.currentPage;
    // }
    //
    // changePage(pathname, newPage) {
    //     if(this.currentPage) {
    //         // this.currentPage.unmountPage();
    //     }
    //
    //     pathname = this._trimSlashes(pathname) || "";
    //     // this._pageState = state || null;
    //     // this._skipCheck = !!silent;
    //
    //     history.pushState({}, null, '/' + this._trimSlashes(pathname));
    //
    //     // this.navigateTo(pathname, {}, false);
    //
    //     this.currentPage = newPage;
    //
    //     // this.currentPage.mountPage();
    // }
    //
    //
    // /**
    //  * Parse query string and return object for it
    //  *
    //  * @param {string} query
    //  * @returns {object}
    //  * @private
    //  */
    // _parseQuery(query) {
    //     var _query = {};
    //     if (typeof query !== "string") {
    //         return _query;
    //     }
    //
    //     if (query[0] === "?") {
    //         query = query.substr(1);
    //     }
    //
    //     this._queryString = query;
    //     query.split("&").forEach(function (row) {
    //         var parts = row.split("=");
    //         if (parts[0] !== "") {
    //             if (parts[1] === undefined) {
    //                 parts[1] = true;
    //             }
    //             _query[decodeURIComponent(parts[0])] = parts[1];
    //         }
    //     });
    //     return _query;
    // };
    //
    // findPageByMatchedRoute3(pathname) {
    //     app().log('pathname: ' + pathname);
    //
    //     pathname = this._trimSlashes(pathname);
    //
    //     for(let i = 0; i < this.routes.length; i++) {
    //
    //         let route_rule = this._parseRouteRule(this.routes[i].rule);
    //         // let route_handler = this.routes[i].handler;
    //         app().log('attempting to match route rule: ' + route_rule);
    //
    //         // if(pathname.match(this._parseRouteRule(route_rule))) {
    //         let match = pathname.match(route_rule);
    //         if(match) {
    //             match.shift();
    //
    //             app().log('matchh');
    //             app().log(match);
    //             // app().log('matched: ' + this.#routes[i].getPageIdentifier());
    //
    //             // Apply the page's specific handler:
    //             let newCurrentPage = this.routes[i].handler.apply(this, match);
    //             app().log(newCurrentPage);
    //             // this.setCurrentPage(newCurrentPage);
    //             // app().log(route_handler);
    //             // route_handler.apply(this, match);
    //
    //             // Only change the page if it's not the page already set.
    //             if(newCurrentPage.getPageIdentifier() != this.getCurrentPage()?.getPageIdentifier()) {
    //                 this.changePage(pathname, newCurrentPage);
    //                 // this.setCurrentPage(newCurrentPage);
    //             }
    //
    //
    //             return newCurrentPage;
    //
    //             // return this.#routes[i];
    //         }
    //     }
    //
    //     app().log('no match');
    // }
    //
    // // findPageByMatchedRoute2(pathname) {
    // //     app().log('pathname: ' + pathname);
    // //
    // //     pathname = this._trimSlashes(pathname);
    // //
    // //     for(let i = 0; i < this.#routes.length; i++) {
    // //
    // //         let route_rule = this._parseRouteRule(this.#routes[i].routeRule);
    // //         app().log('attempting to match route ' + this.#routes[i].getPageIdentifier() + ' rule: ' + route_rule);
    // //
    // //         // if(pathname.match(this._parseRouteRule(route_rule))) {
    // //         let match = pathname.match(route_rule);
    // //         if(match) {
    // //             match.shift();
    // //
    // //             // app().log(match);
    // //             // app().log('matched: ' + this.#routes[i].getPageIdentifier());
    // //
    // //             // Apply the page's specific handler:
    // //             this.#routes[i].pageHandler.apply(this.#routes[i], match);
    // //
    // //
    // //
    // //             return this.#routes[i];
    // //         }
    // //     }
    // //
    // //     app().log('no match');
    // // }
    //
    // /**
    //  * Navigate to a page
    //  *
    //  * @param {string} path
    //  * @param {object} state
    //  * @param {boolean} silent
    //  *
    //  * @returns {Router}
    //  */
    // navigateTo(path, state, silent) {
    //     path = this._trimSlashes(path) || "";
    //     // this._pageState = state || null;
    //     // this._skipCheck = !!silent;
    //
    //     history.pushState(state, null, '/' + this._trimSlashes(path));
    //
    //
    //     // return this.check();
    //     // this._processUri();
    //
    //     // if(this.getMode() === "history") {
    //     //     history.pushState(state, null, '/' + this._trimSlashes(path));
    //     //     // return this.check();
    //     // }
    //     // else {
    //     //     window.location.hash = path;
    //     // }
    //     return this;
    // };
    //
    // /**
    //  * Get a page by its matched route.
    //  * @param pathname
    //  * @returns {null}
    //  */
    // findPageByMatchedRoute(pathname) {
    //     let pathname_regexp = this._parseRouteRule(pathname);
    //     app().log('pathname_regexp: ' + pathname_regexp);
    //
    //     pathname = this._trimSlashes(pathname);
    //
    //     if(pathname.match(this._parseRouteRule('listings/{sku}'))) {
    //         app().log('matched');
    //
    //         let idk = this._parseQuery(pathname);
    //         app().log(idk);
    //
    //         let query = new URL("https://quick-lister.development/listings/ABCD?search=true&yes=hooray").search;
    //         let idk2 = this._parseQuery(query);
    //         app().log(idk2);
    //
    //     }
    //     else {
    //         app().log('no match');
    //     }
    //     return;
    //
    //     for(let i = 0; i < this.#routes.length; i++) {
    //
    //         let match = this.#routes[i].pageRouteRule.match(pathname_regexp);
    //         if (match) {
    //             app().log('page match found!');
    //             return this.#routes[i];
    //         }
    //
    //         // if(this.#routes[i].pageRouteRule === pageRoute) {
    //         //     app().log('page found by matched route');
    //         //     return this.#routes[i];
    //         // }
    //     }
    //
    //
    //
    //     // var match = fragment.match(route.rule);
    //
    //     // for(let i = 0; i < this.#routes.length; i++) {
    //     //     if(this.#routes[i].pageRouteRule === pageRoute) {
    //     //         app().log('page found by matched route');
    //     //         return this.#routes[i];
    //     //     }
    //     // }
    //     //
    //     // app().log('page not found by matched route');
    //     // return null;
    // }
    //
    // // check() {
    // //     if (this._skipCheck) return this;
    // //
    // //     // if page has unload cb treat as promise
    // //     if (this._currentPage && this._currentPage.options && this._currentPage.options.unloadCb) {
    // //         this._treatAsync();
    // //     } else {
    // //         this._processUri();
    // //     }
    // //     return this;
    // // };
    // //
    // // addUriListener() {
    // //     window.onpopstate = this.check.bind(this);
    // //     return this;
    // // };
    //
    // // /**
    // //  * Change the page to a new page.
    // //  * @param newPage
    // //  * @returns {PageManager}
    // //  */
    // // changePage(newPage) {
    // //
    // //     // Don't change the page if the new page is the current page.
    // //     if(this.currentPage && newPage.getPageIdentifier() == this.currentPage.getPageIdentifier()) {
    // //         app().log('page not changed');
    // //         return;
    // //     }
    // //
    // //     app().log('Changing page to ' + newPage.getPageIdentifier());
    // //
    // //     // If a current page is currently set, then it must first be unloaded.
    // //     if(! Util('Types').isNull(this.currentPage)) {
    // //         this.currentPage.hidePage();
    // //     }
    // //
    // //     this.currentPage = newPage;
    // //     this.currentPage.showPage();
    // //
    // //     this.getViewpaneElement().empty();
    // //     this.getViewpaneElement().html(this.currentPage.getRenderedView());
    // //
    // //     // window.history.pushState({page: "login"}, "login page", "login");
    // //
    // //     window.history.pushState(newPage.data, newPage.getPageIdentifier() + " page", newPage.url);
    // //
    // //     // history.pushState({page: 1}, "title 1", "?page=1");
    // //     // history.pushState({page: 2}, "title 2", "?page=2");
    // //     // history.replaceState({page: 3}, "title 3", "?page=3");
    // //     // history.back(); // Logs "location: http://example.com/example.html?page=1, state: {"page":1}"
    // //     // history.back(); // Logs "location: http://example.com/example.html, state: null"
    // //     // history.go(2);  // Logs "location: http://example.com/example.html?page=3, state: {"page":3}"
    // //
    // //     return this;
    // // }





    registerPageManagerEvents = () => {
        // window.addEventListener('popstate', function(event) {
        //     app().log(event.originalEvent);
        //     app().log("Location: " + document.location + ", State: " + JSON.stringify(event.originalEvent.state));
        //     app().log(new URL(document.location).pathname);
        // });
        //
        // // Capture event when a link is clicked.
        // let _this = this;
        // $('body').on('click', 'a[href]', function(event) {
        //     event.preventDefault();
        //     // let link_href = $(this).attr('href');
        //     // app().log(link_href);
        //     let new_pathname = (new URL($(this).attr('href')).pathname);
        //     app().log('New Pathname To Check: ' + new_pathname);
        //
        //     if(new_pathname == (new URL(document.location).pathname)) {
        //         app().log('Pathname is not changing. Skipping.');
        //         return; // Don't do any changes unless the pathname (and page) is changing.
        //     }
        //
        //     let matched_page = PageManager.#getMatchedPageFromPathname(new_pathname);
        //     if(matched_page !== null) {
        //         app().log('✅ - ' + new_pathname + ' - Match Found! New Matched Page: ' + matched_page.constructor.name);
        //     }
        //
        //     _this.#changeCurrentPage(matched_page);
        //     window.history.replaceState({
        //
        //     }, 'Title', new_pathname);
        //
        //     // component.findPageByMatchedRoute(pathname);
        //     // let matchedPage2 = component.findPageByMatchedRoute3(pathname);
        //
        //     return;
        // });
        // return;






        // let links = document.querySelector('a.link[href]');
        // for(let i = 0; i < links.length; i++) {
        //     links[i].addEventListener('click', function(event) {
        //         let new_pathname = '/' + links[i].href.split('/').pop();
        //
        //     });
        // }

        // // Capture event when a link is clicked.
        // $('body').on('click', 'a[href]', function(event) {
        //     event.preventDefault();
        //
        //     let pathname = new URL($(event.target).attr('href')).pathname;
        //     // app().log('pathname: ' + pathname);
        //
        //     // component.findPageByMatchedRoute(pathname);
        //     let matchedPage2 = component.findPageByMatchedRoute3(pathname);
        //
        //     return;
        // });


        // let _this = this;
        // $('body').on('click', 'a.link[href]', function(event) {
        //     event.preventDefault();
        //
        //     let new_pathname = new URL($(event.target).attr('href')).pathname;
        //     app().log('New Pathname To Check: ' + new_pathname);
        //
        //     let current_pathname = (new URL(document.location).pathname);
        //     if(new_pathname == current_pathname) {
        //         app().log('Pathname is not changing. Skipping.');
        //         return; // Don't do any changes unless the pathname (and page) is changing.
        //     }
        //
        //     let matched_page = _this.getMatchedPageFromPathname(new_pathname);
        //     if(matched_page != null) {
        //         app().log('✅ - ' + new_pathname + ' - Match Found! Matched Page: ' + matched_page.constructor.name);
        //         // app().log('Matched Page: ' + matched_page.constructor.name)
        //         // this.#currentPage = matched_page;
        //         // app().log('Current Page: ' + this.#currentPage.constructor.name);
        //
        //
        //         let pageClass = getPageByClass(matched_page.constructor.name);
        //         _this.#changeCurrentPage(pageClass);
        //
        //         // window.location.pathname = new_pathname;
        //
        //     }
        //
        //     return;
        // });







        // // Add event listener to anchor links
        // const links = document.getElementsByClassName('link');
        // for(let i = 0; i < links.length; i++) {
        //     links[i].addEventListener('click', function(event) {
        //         event.preventDefault();
        //         // event.stopPropagation();
        //
        //         let new_pathname = '/' + links[i].href.split('/').pop();
        //         app().log('New Pathname To Check: ' + new_pathname);
        //
        //         let current_pathname = (new URL(document.location).pathname);
        //         if(new_pathname == current_pathname) {
        //             app().log('Pathname is not changing. Skipping.');
        //             return; // Don't do any changes unless the pathname (and page) is changing.
        //         }
        //
        //         // get(links[i].href.split('/').pop());
        //
        //         let matched_page = _this.getMatchedPageFromPathname(new_pathname);
        //         if(matched_page != null) {
        //             app().log('✅ - ' + new_pathname + ' - Match Found! Matched Page: ' + matched_page.constructor.name);
        //             // app().log('Matched Page: ' + matched_page.constructor.name)
        //             // this.#currentPage = matched_page;
        //             // app().log('Current Page: ' + this.#currentPage.constructor.name);
        //
        //
        //             let pageClass = getPageByClass(matched_page.constructor.name);
        //             _this.#changeCurrentPage(pageClass);
        //
        //             window.location.pathname = new_pathname;
        //         }
        //
        //
        //     }, false);
        // }

        // window.onpopstate = (event) => {
        //     app().log('window.onpopstate');
        //     app().log(event);
        //     app().log("location: " + document.location + ", state: " + JSON.stringify(event.state));
        //
        //     // window.history.pushState(newPage.data, newPage.getPageIdentifier() + " page", newPage.url);
        //     // window.history.replaceState(event.state, '', '');
        //
        //
        //
        //     // app().log("location: " + document.location + ", state: " + JSON.stringify(event.state));
        // };
        //
        // window.addEventListener('popstate', (event) => {
        //     app().log('window.addEventListener popstate 1');
        //     app().log("location: " + document.location + ", state: " + JSON.stringify(event.state));
        // });
        //
        //
        // window.addEventListener('popstate', (event) => {
        //     app().log('window.addEventListener popstate 2');
        //     app().log("location: " + document.location + ", state: " + JSON.stringify(event.state));
        // });


        // // listen to popstate events
        // $(window).bind('popstate', function (event) {
        //     app().log(event.originalEvent);
        //     app().log("location: " + document.location + ", state: " + JSON.stringify(event.originalEvent.state));
        //
        //     app().log(new URL(document.location).pathname);
        // });
        //
        // // Capture event when a link is clicked.
        // $('body').on('click', 'a[href]', function(event) {
        //     event.preventDefault();
        //
        //     let pathname = new URL($(event.target).attr('href')).pathname;
        //     // app().log('pathname: ' + pathname);
        //
        //     // component.findPageByMatchedRoute(pathname);
        //     let matchedPage2 = component.findPageByMatchedRoute3(pathname);
        //
        //     return;
        // });


        // // listen to popstate events
        // $(window).bind('popstate', function (event) {
        //     app().log(event.originalEvent);
        //     app().log("location: " + document.location + ", state: " + JSON.stringify(event.originalEvent.state));
        //
        //     app().log(new URL(document.location).pathname);
        // });
        //
        // // Capture event when a link is clicked.
        // $('body').on('click', 'a[href]', function(event) {
        //     event.preventDefault();
        //
        //     let pathname = new URL($(event.target).attr('href')).pathname;
        //     // app().log('pathname: ' + pathname);
        //
        //     // component.findPageByMatchedRoute(pathname);
        //     let matchedPage2 = component.findPageByMatchedRoute3(pathname);
        //
        //     return;
        //
        //
        //
        //     // let parsedRouteRule = component._parseRouteRule(pathname);
        //     // app().log('parsedRouteRule: ' + parsedRouteRule);
        //     //
        //     // let parsedRouteRule2 = component._parseRouteRule("/listings/{sku}");
        //     // app().log('parsedRouteRule2: ' + parsedRouteRule2);
        //     //
        //     // let parsedRouteRuleCheck1 = component._parseRouteRule("/hello/world");
        //     // app().log('parsedRouteRuleCheck1: ' + parsedRouteRuleCheck1);
        //     // let parsedRouteRuleCheck2 = component._parseRouteRule("/hello/:word");
        //     // app().log('parsedRouteRuleCheck2: ' + parsedRouteRuleCheck2);
        //     // let parsedRouteRuleCheck3 = component._parseRouteRule("/hello/(:word)");
        //     // app().log('parsedRouteRuleCheck3: ' + parsedRouteRuleCheck3);
        //     // let parsedRouteRuleCheck4 = component._parseRouteRule("/hello/{name}");
        //     // app().log('parsedRouteRuleCheck4: ' + parsedRouteRuleCheck4);
        //     // let parsedRouteRuleCheck5 = component._parseRouteRule(/^hello\/(\w+)/i);
        //     // app().log('parsedRouteRuleCheck5: ' + parsedRouteRuleCheck5);
        //     //
        //     //
        //     //
        //     // // component.setPathname(pathname);
        //     //
        //     // let matchedPage = component.findPageByMatchedRoute(pathname);
        //     // app().log('matchedPage:');
        //     // app().log(matchedPage);
        //     //
        //     // let fragment = decodeURI(pathname);
        //     // app().log('fragment: ' + fragment);
        //     // // if(this.root !== "/") {
        //     // //     fragment = fragment.replace(this.root, "");
        //     // // }
        //     // let fragment_trimmed_slashes = component._trimSlashes(fragment);
        //     // app().log('fragment_trimmed_slashes: ' + fragment_trimmed_slashes);
        //     //
        //     // if(matchedPage) {
        //     //     matchedPage.handler();
        //     // }
        //
        //     // updatePage(event);
        // });


        // let url = location.href;
        // document.body.addEventListener('click', () => {
        //     requestAnimationFrame(()=>{
        //         url !== location.href && app().log('url changed');
        //         url = location.href;
        //     });
        // }, true);









        // $('body').on('click', '[data-action=CHANGE_PAGE]', function(event) {
        //     app().log('clicked');
        //     event.preventDefault();
        //     let page_identifier = $(this).data('page-identifier');
        //     app().log(page_identifier);
        //
        //     // app().log('CHANGE_PAGE to: ' + page_identifier);
        //
        //     let newPage = component.getPage(page_identifier);
        //     app().log(newPage);
        //     if(newPage) {
        //         component.changePage(newPage);
        //     }
        // });


        // super.setComponentLifecycleHandler("load", function() {
        //     $('body').on('click', '[data-action=CHANGE_PAGE]', function(event) {
        //         app().log('clicked');
        //         event.preventDefault();
        //         let page_identifier = $(this).data('page-identifier');
        //
        //         // app().log('CHANGE_PAGE to: ' + page_identifier);
        //
        //         let page = self.getPage(page_identifier);
        //         app().log(page);
        //         if(page) {
        //             self.changePage(page);
        //         }
        //     });
        // });
        //
        // super.setComponentLifecycleHandler("unload", function() {
        //     $('body').off('click', '[data-action=CHANGE_PAGE]');
        // });



        // window.onpopstate = (event) => {
        //     app().log(event);
        //     app().log("location: " + document.location + ", state: " + JSON.stringify(event.state));
        //
        //     // window.history.pushState(newPage.data, newPage.getPageIdentifier() + " page", newPage.url);
        //     // window.history.replaceState(event.state, '', '');
        //
        //
        //
        //     // app().log("location: " + document.location + ", state: " + JSON.stringify(event.state));
        // };

        // window.addEventListener('popstate', (event) => {
        //     app().log("location: " + document.location + ", state: " + JSON.stringify(event.state));
        // });


        // window.addEventListener('popstate', (event) => {
        //     app().log("location: " + document.location + ", state: " + JSON.stringify(event.state));
        // });
    };


}

export {
    PageRoute,
    PageManager,
};
