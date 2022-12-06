import {
    Model,
} from './Model';

import {
    UtilTypes,
} from '../Utils';

class User extends Model
{
    /**
     * Create a new User instance.
     * @param config
     */
    constructor(config = {})
    {
        // console.log('Create User instance');
        // console.log(config);

        super(config);

        let model_attributes = this.#attributes_default;
        for(let [attribute_key, attribute_value] of Object.entries(config)) {
            console.log('attribute_key: ' + attribute_key);
            console.log('attribute_value: ' + attribute_value);
            if( model_attributes.hasOwnProperty(attribute_key) ) {
                model_attributes[attribute_key] = attribute_value;
            }
        }

        // console.log('model_attributes');
        // console.log(model_attributes);
        this.setAttribute(model_attributes);



        // for(let [default_key, default_value] of Object.entries(this.#attributes_default)) {
        //     if( config.hasOwnProperty(default_key) ) {
        //         // Before setting, cast it to the native type
        //         if( this.hasOwnProperty('_attributes_casts') && this._attributes_casts.hasOwnProperty(default_key) ) {
        //             switch(this._attributes_casts[default_key].toLowerCase()) {
        //                 case 'boolean':
        //                 case 'bool':
        //                     default_value = Boolean(default_value);
        //                     break;
        //                 case 'integer':
        //                 case 'int':
        //                     default_value = parseInt(default_value);
        //                     break;
        //                 case 'float':
        //                     default_value = parseFloat(default_value);
        //                     break;
        //                 case 'string':
        //                     default_value = String(default_value);
        //                     break;
        //             }
        //         }
        //         this.setAttribute(default_key, default_value);
        //     }
        // }

        // this.setAttribute({
        //     ...this.#attributes_default,
        //     ...(config.hasOwnProperty('attributes') && UtilTypes.isObject(config.attributes) ? config.attributes : {}),
        // });

        // if( config.hasOwnProperty('attributes') && UtilTypes.isObject(config.attributes) ) {
        //     let _this = this;
        //     ['name', 'email', 'is_admin', 'is_boolean'].forEach((this_attribute_name, this_index) => {
        //         if(config.attributes.hasOwnProperty(this_attribute_name)) {
        //             _this.setAttribute(this_attribute_name, config.attributes[this_attribute_name]);
        //         }
        //     });
        // }
    }

    /**
     * Default values of attributes.
     * @type {{is_admin: boolean, is_mastermind: boolean, name: string, email: string}}
     */
    #attributes_default = {
        'name': '',
        'email': '',
        'is_admin': false,
        'is_mastermind': false,
    };

    // /**
    //  * List of attribute values and types they should automatically be cast to.
    //  * @type {{is_admin: string, is_mastermind: string, name: string, email: string}}
    //  */
    // _attributes_casts = {
    //     'name': 'string',
    //     'email': 'string',
    //     'is_admin': 'boolean',
    //     'is_mastermind': 'boolean',
    // };

    /**
     * Determine if the user is admin.
     * @returns {boolean}
     */
    isAdmin() {
        return Boolean(this.getAttribute('is_admin'));
    }

    /**
     * Determine if the user is mastermind.
     * @returns {boolean}
     */
    isMastermind() {
        return Boolean(this.getAttribute('is_mastermind'));
    }

}

export {User};
