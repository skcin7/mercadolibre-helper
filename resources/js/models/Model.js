// import {Component} from '../Component';
// import {Utils} from '../Utils';

// import {AxiosError} from '../errors/AxiosError';
import {UtilTypes} from "../Utils";

import {DataAndPropsClass} from "../DataAndPropsClass";

class Model extends DataAndPropsClass
{

    // /**
    //  * The namespace/table where the model entities are stored.
    //  * @type {string}
    //  */
    // #table = '';
    //
    // /**
    //  * The property name to uniquely look up and reference the model.
    //  * @type {string}
    //  */
    // #lookupKey = 'id';
    //
    // /**
    //  * Relationships of the model to include when fetching resources.
    //  * @type {Array|[]}
    //  */
    // #includeRelationships = [];
    //
    // /**
    //  * Number of resources to show per page when fetching many resources.
    //  * @type {number}
    //  */
    // #perPage = 15;
    //
    // /**
    //  * Model data.
    //  * @type {{}}
    //  */
    // _data = {};

    // /**
    //  * Create a new Model instance.
    //  * @param {string|String} modelComponentIdentifier
    //  * @param {int|string|String} [id] - Can optionally set the ID.
    //  * @param {object} [data] - Can optionally set the data.
    //  */
    // constructor(modelComponentIdentifier, id, data) {
    //     super(String(modelComponentIdentifier));
    //     if(id) {
    //         this.setId(id);
    //     }
    //     if(data) {
    //         this.setData(data);
    //     }
    // }

    // #modelClass = null;

    // static getInstance() {
    //     if(! Model.instance) {
    //         Model.instance = new Model();
    //     }
    //     return Model.instance;
    // }


    // /**
    //  * Create a new Model instance.
    //  * @param attributes
    //  */
    // constructor(...attributes) {
    //     console.log('Create Model instance');
    //     console.log(attributes);
    // }

    /**
     * Create a new Model instance.
     * @param config
     */
    constructor(config)
    {
        super();

        console.log('Create Model instance');
        console.log(config);

        // let model_attributes = this._attributes_default;
        // for(let [attribute_key, attribute_value] of Object.entries(config)) {
        //     console.log('attribute_key: ' + attribute_key);
        //     console.log('attribute_value: ' + attribute_value);
        //     if( model_attributes.hasOwnProperty(attribute_key) ) {
        //         model_attributes[attribute_key] = attribute_value;
        //     }
        // }
        // // console.log('model_attributes');
        // // console.log(model_attributes);
        // this.setAttribute(model_attributes);

        // this.setAttribute({
        //     ...this._attributes_default,
        //     ...(config.hasOwnProperty('attributes') && UtilTypes.isObject(config.attributes) ? config.attributes : {}),
        // });

        // super(String(modelClass.modelComponentIdentifier));
        //
        // this.#modelClass = modelClass;
        //
        // if(modelClass._table) {
        //     this.#table = modelClass._table;
        // }
        //
        // if(modelClass._lookupKey) {
        //     this.#lookupKey = modelClass._lookupKey;
        // }
        //
        // if(modelClass.includeRelationships) {
        //     this.#includeRelationships = modelClass.includeRelationships;
        // }
        //
        // if(modelClass.perPage) {
        //     this.#perPage = modelClass.perPage;
        // }
    }

    /**
     * Attributes of the model.
     * @type {{}}
     */
    #attributes = {};

    // /**
    //  * Default values of attributes.
    //  * @type {{}}
    //  * @private
    //  */
    // _attributes_default = {};

    /**
     * List of attribute values and types they should automatically be cast to.
     * @type {{}}
     * @private
     */
    _attributes_casts = {};

    /**
     * Get all attributes of the model.
     * @returns {{}}
     */
    attributes() {
        return this.#attributes;
    }

    /**
     * Get model attribute(s).
     * @param attribute_name
     * @returns {*}
     */
    getAttribute(attribute_name = null) {
        if( UtilTypes.isNull(attribute_name) ) {
            return this.attributes();
        }
        return this.#attributes[attribute_name];
    }

    /**
     * Set model attribute(s).
     * @param attribute_name
     * @param attribute_value
     */
    setAttribute(attribute_name, attribute_value = null) {

        // console.log('setAttribute');
        // console.log(attribute_name);
        // console.log(attribute_value);

        if( UtilTypes.isObject(attribute_name) ) {

            for(let [key, value] of Object.entries(attribute_name)) {

                // console.log('key value');
                // console.log(key);
                // console.log(value);

                this.setAttribute(key, value);
                // console.log(`${key} -> ${value}`);
            }

            // // Recursively call setAttribute to set each individual key.
            // let _this = this;
            // Object.keys(attribute_name).map(key => {
            //     _this.setAttribute(key, attribute_name[key]);
            // });
        }
        else if( UtilTypes.isString(attribute_name) ) {
            // console.log('isString');
            // console.log(this._attributes_casts); // Uses the attributes cast from the child model, if one is present, then reverts to this model.


            // Set the attribute value. First cast it to the correct type, if the attribute has a cast to value.
            if( this._attributes_casts.hasOwnProperty(attribute_name) ) {
                if(this._attributes_casts[attribute_name] == 'boolean' || this._attributes_casts[attribute_name] == 'bool') {
                    attribute_value = Boolean(attribute_value);
                }
                else if(this._attributes_casts[attribute_name] == 'integer' || this._attributes_casts[attribute_name] == 'int') {
                    attribute_value = parseInt(attribute_value);
                }
                else if(this._attributes_casts[attribute_name] == 'float') {
                    attribute_value = parseFloat(attribute_value);
                }
                else if(this._attributes_casts[attribute_name] == 'string') {
                    attribute_value = String(attribute_value);
                }
            }
            this.#attributes[attribute_name] = attribute_value;
        }

    }

    // /**
    //  * Unset model attribute(s).
    //  * @param args
    //  */
    // unsetAttribute(...args)
    // {
    //     // Arguments to be unset may be passed in as a variable amount of arguments.
    //     // Arguments may be strings, or array of strings. Each string found will have that attribute unset.
    //     for(let i = 0; i < args.length; i++) {
    //         if( UtilTypes.isString(args[i]) ) {
    //             // This argument is a string.
    //             delete this._attributes[args[i]];
    //         }
    //         else if( UtilTypes.isArray(args[i]) ) {
    //             // This argument is an array of strings.
    //             for(let j = 0; j < args[i].length; j++) {
    //                 if( UtilTypes.isString(args[i][j]) ) {
    //                     delete this._attributes[args[i][j]];
    //                 }
    //             }
    //         }
    //     }
    // }



    // /**
    //  * Create a new Model instance.
    //  * @param {mixed} modelClass
    //  * @param {string|String} modelClass.modelComponentIdentifier
    //  * @param {string|String} [modelClass._table]
    //  * @param {string|String} [modelClass._lookupKey]
    //  * @param {string|String|Array|[]} [modelClass.includeRelationships]
    //  * @param {int} [modelClass.perPage]
    //  */
    // constructor(modelClass) {
    //     super(String(modelClass.modelComponentIdentifier));
    //
    //     this.#modelClass = modelClass;
    //
    //     if(modelClass._table) {
    //         this.#table = modelClass._table;
    //     }
    //
    //     if(modelClass._lookupKey) {
    //         this.#lookupKey = modelClass._lookupKey;
    //     }
    //
    //     if(modelClass.includeRelationships) {
    //         this.#includeRelationships = modelClass.includeRelationships;
    //     }
    //
    //     if(modelClass.perPage) {
    //         this.#perPage = modelClass.perPage;
    //     }
    // }

    // /**
    //  * Set table value.
    //  * @param {string|String} table
    //  * @returns {Model}
    //  */
    // setTable(table) {
    //     this.#table = String(table);
    //     return this;
    // }
    //
    // /**
    //  * Get table value.
    //  * @returns {string|String}
    //  */
    // getTable() {
    //     return this.#table;
    // }
    //
    // /**
    //  * Set lookup key value.
    //  * @param {string|String} lookupKey
    //  */
    // setLookupKey(lookupKey) {
    //     this.#lookupKey = String(lookupKey);
    //     return this;
    // }
    //
    // /**
    //  * Get lookup key value.
    //  * @returns {string|String}
    //  */
    // getLookupKey() {
    //     return this.#lookupKey;
    // }
    //
    // /**
    //  * Set include relationships value.
    //  * @param {Array|[]|string|String} includeRelationships
    //  */
    // setIncludeRelationships(includeRelationships) {
    //     // String include relationships must be parsed first into array format.
    //     if(Utils.isString(includeRelationships)) {
    //         if(includeRelationships.length == 0) {
    //             // Empty strings have no values in them.
    //             includeRelationships = [];
    //         }
    //         else {
    //             // Split CSV string into array.
    //             includeRelationships = includeRelationships.split(",");
    //         }
    //     }
    //
    //     this.#includeRelationships = includeRelationships;
    //     return this;
    // }
    //
    // /**
    //  * Get include relationships value.
    //  * @returns {Array|[]}
    //  */
    // getIncludeRelationships() {
    //     return this.#includeRelationships;
    // }
    //
    // /**
    //  * Set per page value.
    //  * @param perPage
    //  */
    // setPerPage(perPage) {
    //     if([5, 10, 15, 25, 50, 100, 150, 200, 250].includes(perPage)) {
    //         this.#perPage = perPage;
    //     }
    //     return this;
    // }
    //
    // /**
    //  * Get per page value.
    //  * @returns {number}
    //  */
    // getPerPage() {
    //     return this.#perPage;
    // }



    // /**
    //  * Set the ID of the model.
    //  * @param id
    //  */
    // setId(id) {
    //     this.id = id;
    //     this.setData("id", id);
    // }
    //
    // /**
    //  * Get the model's unique ID.
    //  * @returns {string}
    //  */
    // getId() {
    //     return this.id;
    // }

    // /**
    //  * Set data.
    //  * @param data
    //  * @param {mixed} value
    //  */
    // _setData(data, value = null) {
    //     if(Utils.isString(data)) {
    //         this.setDataAttribute(data, value);
    //         return;
    //     }
    //
    //     for(let attribute in data) {
    //         this.setDataAttribute(attribute, data[attribute]);
    //     }
    // }
    //
    // // /**
    // //  * Set data value.
    // //  * @param {object|string|String} dataOrProperty - Data object to set, or property name.
    // //  * @param {string|String|int|object|{}|Array|[]|boolean|mixed} [dataPropertyValue] - Value of the property name to be set.
    // //  */
    // // _setData(dataOrProperty, dataPropertyValue) {
    // //     if(Utils.isObject(dataOrProperty)) {
    // //         this._data = dataOrProperty;
    // //         // console.log('set data');
    // //     }
    // //     else if(Utils.isString(dataOrProperty) && dataPropertyValue) {
    // //         this._data[dataOrProperty] = dataPropertyValue;
    // //         // console.log('set data prop');
    // //     }
    // //     // else {
    // //     //     // throw 'Could not set data.';
    // //     // }
    // //     // return this;
    // // }

    // /**
    //  * Unset Model data.
    //  * @param {string|String} [dataProperty] - The data property to unset. If none passed, unset all data.
    //  */
    // unsetData(dataProperty) {
    //     if(dataProperty) {
    //         delete this._data[dataProperty];
    //         return;
    //     }
    //     this._data = {};
    // }

    // /**
    //  * Get Model data.
    //  * @param {string|String} [dataProperty] - The data property to get. If none passed, get all data.
    //  * @returns {}|mixed
    //  */
    // _getData(dataProperty) {
    //     if(dataProperty) {
    //         return this._data[dataProperty];
    //     }
    //     return this._data;
    // }

    // getData(attribute = null) {
    //     if(attribute) {
    //         return this.data[attribute];
    //     }
    //     return this.data;
    // }
    //
    //
    // static async fetchFromServer(id, include) {
    //
    //     // console.log('fetchFromServer');
    //     // console.log(id);
    //     // console.log(this._table);
    //     // console.log(Component.app());
    //     // console.log(Component.url('api/catalog_items'));
    //
    //     let modelClass = this;
    //
    //     let table = modelClass._table;
    //
    //     return await axios({
    //         "method": 'GET',
    //         // "url": app.url('api/catalog_items/' + id),
    //         "url": Component.url('api/' + table + '/' + id),
    //         "params": {
    //             'include': (include ? String(include) : null),
    //         },
    //     })
    //         .then((response) => {
    //             // console.log(response);
    //             // console.log(response.data);
    //             // console.log(response.data.resource);
    //
    //
    //             let modelInstance = new modelClass();
    //             modelInstance.setData(response.data.resource);
    //             // console.log('modelInstance');
    //             // console.log(modelInstance);
    //             return modelInstance;
    //
    //             // console.log(response.data.resource);
    //             // let api_resource_data = response.data.resource;
    //             // model.setData(api_resource_data);
    //             // return model;
    //         })
    //         .catch((error) => {
    //             // console.log(error);
    //             // console.log(error.message);
    //             // console.log(error.config);
    //             // console.log(error.code);
    //             // console.log(error.request);
    //             // console.log(error.response);
    //
    //             // Handle any shared error behavior here.
    //
    //             // console.log(error);
    //             // console.log(error.response);
    //             // console.log(error.response.status);
    //             // console.log(error.response.data);
    //             // console.log(error.response.data.status_code);
    //
    //             // if(error.response.status == 404) {
    //             //     // $.notify(error.response.data.message, {
    //             //     //     'autoHideDelay': 10000,
    //             //     //     'className': "danger",
    //             //     // });
    //             //     // return;
    //             //     throw new AxiosError(error.response);
    //             // }
    //
    //             throw new AxiosError(error.response);
    //         });
    //
    //
    //     // return await axios({
    //     //     "method": 'GET',
    //     //     "url": app.url('api/listings/' + id),
    //     //     "params": {
    //     //         "id": id,
    //     //         "include": include.join(","), // Ensures it's passed as a CSV string.
    //     //     },
    //     // })
    //     //     .then(async(response) => {
    //     //         // let api_resource_data = response.data.resource;
    //     //         // model.setData(api_resource_data);
    //     //         // return model;
    //     //         return response;
    //     //     })
    //     //     .catch((error) => {
    //     //         throw 'Could not fetch model.';
    //     //     });
    // }




    // setData(data) {
    //     this.data = data;
    // }
    //
    // getData() {
    //     return this.data;
    // }



    // /**
    //  * Unset a property of the Model's data.
    //  * @param propertyKey
    //  */
    // unsetProperty(propertyKey) {
    //     delete this.data[propertyKey];
    // }
    //
    // /**
    //  * Get the value of a property of the Model's data.
    //  * @param propertyKey:string|String
    //  * @returns {{}|null|*}
    //  */
    // getProperty(propertyKey) {
    //     return this.data[propertyKey];
    //
    //     // if(typeof propertyKey !== 'undefined') {
    //     //     if(propertyKey in this.data) {
    //     //         return this.data[propertyKey];
    //     //     }
    //     //     else {
    //     //         return null;
    //     //     }
    //     // }
    //     // // If no key is passed, then just return all the data.
    //     // return this.getData();
    // }

}

export {Model};
