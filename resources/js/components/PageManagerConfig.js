import {MercadoLibreApi as MercadoLibreApiPage} from '../pages/MercadoLibreApi';
import {Search as SearchPage} from '../pages/Search';
import {Welcome as WelcomePage} from '../pages/Welcome';

// Store a copy of all instantiated pages here. This prevents pages from needlessly
// being re-created.  With this, only a single instance of each page should exist.
let pageInstances = {};

/**
 * Helpful function to get a page by its name. If the page was not already created,
 * then it will be created. This ensures at most a single page instance exists.
 * @param name
 * @param config
 * @returns {*}
 * @constructor
 */
const getPage = (name, config = {}) => {
    if(! pageInstances.hasOwnProperty(name)) {
        let newPageInstance = null;
        switch(name) {
            case 'MercadoLibreApi':
                newPageInstance = new MercadoLibreApiPage(config);
                break;
            case 'Search':
                newPageInstance = new SearchPage(config);
                break;
            case 'Welcome':
                newPageInstance = new WelcomePage(config);
                break;
        }
        if(newPageInstance !== null) {
            pageInstances[name] = newPageInstance;
            return pageInstances[name];
        }
        // Page Instance can not be created, because no corresponding page was matched based on the page name provided.
        // In this case, multiple ways can handle this, such as by returning null, or returning a Not Found error page.
        return null;
    }
    // The page was found based on the name, and an instance of it was created previously, so instead of creating a
    // new instance of the page, for the sake of organization, preserving memory, and maximizing speed
    // of the application, return the previously created instance of the page.
    return pageInstances[name];
};

/**
 * Get all the page instances that are currently loaded into the application.
 * @returns {{}}
 */
const getPages = () => {
    return pageInstances;
};

const MercadoLibreApi = (config) => {
    if(! pageInstances.hasOwnProperty('MercadoLibreApi')) {
        pageInstances['MercadoLibreApi'] = new MercadoLibreApiPage(config);
    }
    return pageInstances['MercadoLibreApi'];
}

const Search = (config) => {
    if(! pageInstances.hasOwnProperty('Search')) {
        pageInstances['Search'] = new SearchPage(config);
    }
    return pageInstances['Search'];
}

const Welcome = (config) => {
    if(! pageInstances.hasOwnProperty('Welcome')) {
        pageInstances['Welcome'] = new WelcomePage(config);
    }
    return pageInstances['Welcome'];
}

/**
 * Page manager routes.
 * @type {[{handlerFn: (function(): Welcome), uri: string},{handlerFn: (function(): MercadoLibreApi), uri: string}]}
 */
const pageManagerRoutes = [
    {
        'uri': '/',
        'handlerFn': () => {
            return WelcomePage;
        },
    },
    {
        'uri': '/account/mercadolibre_api',
        'handlerFn': () => {
            return MercadoLibreApiPage;
        },
    },
    {
        'uri': '/search/{saved_search_id?}',
        'handlerFn': () => {
            return SearchPage;
        },
    },
];

export {
    getPage,
    getPages,
    MercadoLibreApi,
    Search,
    Welcome,
    pageManagerRoutes,
}
