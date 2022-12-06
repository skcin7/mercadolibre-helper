import {
    Device,
} from '../Utils';

class Application
{
    /**
     * Reference to the element in the DOM that this application is mounted to.
     * @type {null}
     */
    #$appDomElement = null;

    /**
     * Set the application in the DOM that this application is mounted to.
     * @param $appDomElement
     */
    setAppDomElement = ($appDomElement) => {
        this.#$appDomElement = $appDomElement;
    };

    /**
     * Get the element in the DOM that this application is mounted to.
     * @returns {null}
     */
    getAppDomElement = () => {
        return this.#$appDomElement;
    };

    /**
     * Mount the application.
     * @param mount_to_element
     * @returns {boolean}
     */
    #mountApplication = (mount_to_element) => {
        app().log('ℹ️ Mounting The Application To: ' + mount_to_element + '....', 'info');

        let $appDomElement = $(mount_to_element);
        if($appDomElement.length > 0) {
            this.setAppDomElement($appDomElement);

            // Also set the device type so that we know what device type is using the application.
            $appDomElement.attr('data-device-type', Device.getDeviceType());
            return true;
        }
        return false;
    };


    /**
     * Create a new Application instance.
     * @param config
     */
    constructor(config = {}) {
        if(config.hasOwnProperty('mountTo')) {
            if(this.#mountApplication(config.mountTo)) {
                app().log('✅ Application Successfully Mounted To: ' + config.mountTo + '.', 'info');
            }
            else {
                app().log('⛔️ Could Not Mount The Application.', 'error');
            }
        }

        // // Load the application components by making an instance of each one.
        // if(config.hasOwnProperty('components') && UtilTypes.isArray(config.components)) {
        //     for(let i = 0; i < config.components.length; i++) {
        //
        //         let componentName = '';
        //         let componentEnabled = true;
        //         let componentConfig = {};
        //
        //         if(UtilTypes.isString(config.components[i])) {
        //             componentName = config.components[i];
        //         }
        //         else if(UtilTypes.isObject(config.components[i])) {
        //             componentName = config.components[i].name;
        //             componentEnabled = Boolean(config.components[i].hasOwnProperty("enabled") && UtilTypes.isBoolean(config.components[i].enabled) ? config.components[i].enabled : true);
        //             componentConfig = (config.components[i].hasOwnProperty("config") && UtilTypes.isObject(config.components[i].config) ? config.components[i].config : {});
        //         }
        //
        //         if(!componentEnabled) {
        //             continue;
        //         }
        //
        //         app().log('Loading Component: ' + componentName + ' ...');
        //         getComponent(componentName, componentConfig);
        //         // app().log(' -- Loaded Component: ' + componentName);
        //     }
        // }


        // // Initialize the current page upon the Application creation.
        // if(config.hasOwnProperty('initCurrentPage') && UtilTypes.isBoolean(config.initCurrentPage) && config.initCurrentPage) {
        //     app().log('initCurrentPage', 'debug');
        //     let currentPageData = (config.hasOwnProperty('currentPageData') && UtilTypes.isObject(config.currentPageData) ? config.currentPageData : {});
        //     app().log('currentPageData', 'debug');
        //     app().log(currentPageData, 'debug');
        //
        //     let current_pathname = new URL(document.location).pathname;
        //     let currentPageMatchedPageRoute = getComponent('PageManager').getMatchedPageRoute(current_pathname);
        //     if(UtilTypes.isObject(currentPageMatchedPageRoute)) {
        //         let newCurrentPage = currentPageMatchedPageRoute.getHandlerFn().call(this);
        //         newCurrentPage.setPageData(currentPageData);
        //
        //
        //
        //         console.log('newCurrentPage.getPageData()');
        //         console.log(newCurrentPage.getPageData());
        //
        //
        //         getComponent('PageManager').setCurrentPage(newCurrentPage);
        //
        //         getComponent('PageManager').getCurrentPage().loadPage();
        //     }
        //     if(UtilTypes.isNull(currentPageMatchedPageRoute)) {
        //         // Not Found.
        //         app().log(' -- 🚫 No Matched PageRoute Was Found. No JavaScript Page instance is being used to manage the current page.');
        //     }
        // }
    };

}

export {
    Application,
};
