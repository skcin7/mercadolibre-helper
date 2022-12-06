import {Application as ApplicationComponent} from './components/Application';
import {Auth as AuthComponent} from './components/Auth';
import {Console as ConsoleComponent} from './components/Console';
import {Keyboard as KeyboardComponent} from './components/Keyboard';
import {PageManager as PageManagerComponent} from './components/PageManager';
import {TextareaCode as TextareaCodeComponent} from './components/TextareaCode';

// All instances of created components are created here.
// This prevents multiple instances of the same component from being needlessly created. Only a single instance of
// each component can be created and stored in this object. If an instance of a component already exists, then
// the instance is retrieved instead of creating a new one, or a new instance is made if it hasn't been created yet.
let componentInstances = {};

/**
 * Get all the components that are currently created and loaded into the application.
 * @returns {{}}
 */
const getComponents = () => {
    return componentInstances;
}

/**
 * Get a single component by its name that is currently created and loaded into the application.
 * If no component instance exists yet based on the component name, then create it real fast and then get it.
 * @param {string} componentName
 * @param {object} componentConfig
 * @param {boolean} forceNewInstance
 * @returns {*}
 */
const getComponent = (componentName, componentConfig = {}, forceNewInstance = false) => {
    // If a new instance is to be forced to be created, or if no instance exists yet for this
    // compontent key, then create the instance first before retrieving it
    if(forceNewInstance || !componentInstances.hasOwnProperty(componentName) ) {
        let newComponentInstance = null;
        switch(componentName) {
            case 'Application':
                newComponentInstance = new ApplicationComponent(componentConfig);
                break;
            case 'Auth':
                newComponentInstance = new AuthComponent(componentConfig);
                break;
            case 'Console':
                newComponentInstance = new ConsoleComponent(componentConfig);
                break;
            case 'Keyboard':
                newComponentInstance = new KeyboardComponent(componentConfig);
                break;
            case 'PageManager':
                newComponentInstance = new PageManagerComponent(componentConfig);
                break;
            case 'TextareaCode':
                newComponentInstance = new TextareaCodeComponent(componentConfig);
                break;
        }
        if(newComponentInstance !== null) {
            componentInstances[componentName] = newComponentInstance;
        }
    }
    return componentInstances[componentName];
}

const Application = (config = {}) => {
    if(! componentInstances.hasOwnProperty('Application')) {
        componentInstances['Application'] = new ApplicationComponent(config);
    }
    return componentInstances['Application'];
}

const Auth = (config = {}) => {
    if(! componentInstances.hasOwnProperty('Auth')) {
        componentInstances['Auth'] = new AuthComponent(config);
    }
    return componentInstances['Auth'];
}

const Console = (config = {}) => {
    if(! componentInstances.hasOwnProperty('Console')) {
        componentInstances['Console'] = new ConsoleComponent(config);
    }
    return componentInstances['Console'];
}

const Keyboard = (config = {}) => {
    if(! componentInstances.hasOwnProperty('Keyboard')) {
        componentInstances['Keyboard'] = new KeyboardComponent(config);
    }
    return componentInstances['Keyboard'];
}

const PageManager = (config = {}) => {
    if(! componentInstances.hasOwnProperty('PageManager')) {
        componentInstances['PageManager'] = new PageManagerComponent(config);
    }
    return componentInstances['PageManager'];
}

const TextareaCode = (config = {}) => {
    if(! componentInstances.hasOwnProperty('TextareaCode')) {
        componentInstances['TextareaCode'] = new TextareaCodeComponent(config);
    }
    return componentInstances['TextareaCode'];
}

export {
    getComponents,
    getComponent,
    Application,
    Auth,
    Console,
    Keyboard,
    PageManager,
    TextareaCode,
}
