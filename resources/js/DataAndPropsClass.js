import {
    UtilTypes,
} from "./Utils";

class DataAndPropsClass
{
    /**
     * Create a new DataAndPropsClass instance.
     * @param {{}} config
     */
    constructor(config = {}) {
        //
    }

    /**
     * The data that is currently stored on the class instance.
     * @type {{}}
     */
    _data = {};

    /**
     * Set data on the class instance.
     * @param {{}|string} keyOrObject
     * @param value
     * @returns {boolean}
     */
    setData = (keyOrObject, value = null) => {

        // console.log('setData:');
        // console.log(this);
        // console.log(this.constructor);
        // console.log(this.constructor.prototype);
        // console.log(this.constructor.prototype._default_dataaa);
        // console.log(this.constructor._default_dataaa);
        // console.log(this.prototype.constructor._default_dataaa);

        // Set an entire set of data at once if an object is passed.
        if(UtilTypes.isObject(keyOrObject)) {
            // Adds the new data to the previous data.
            this._data = {
                ...this._data,
                ...keyOrObject,
            };
            return true;
        }
        // Set a single data key based on the string value.
        if( UtilTypes.isString(keyOrObject) && keyOrObject.length > 0 ) {
            // If the value of this data point being set is null, then instead, unset the data (reset it back to default value).
            if( UtilTypes.isNull(keyOrObject) && this._data.hasOwnProperty(keyOrObject) ) {
                // If default data exists for this key, then set it back to the default value.
                // Otherwise, just delete the key if there is not a default value for this data key.
                if(this.constructor.hasOwnProperty('_default_data')
                    && UtilTypes.isObject(this.constructor._default_data)
                    && this.constructor._default_data.hasOwnProperty(keyOrObject)
                ) {
                    this._data[keyOrObject] = this.constructor._default_data[keyOrObject];
                }
                else {
                    delete this._data[keyOrObject];
                }

                // // Shorthand:
                // (this.constructor.hasOwnProperty('_default_data') && this.constructor._default_data.hasOwnProperty(keyOrObject) ? this._data[keyOrObject] = this.constructor._default_data[keyOrObject] : delete this._data[keyOrObject]);
            }
            else {
                this._data[keyOrObject] = value;
            }
            return true;
        }
        // Failed to set the data.
        return false;
    };

    /**
     * Unset data.
     * @param {string|null} key - The data to unset.
     * @returns {boolean}
     */
    unsetData = (key) => {
        // Unset all data.
        if(UtilTypes.isNull(key)) {
            return this.setData(this.constructor._default_data);
        }
        // A string value is passed to unset the data for.
        if(UtilTypes.isString(key) && key.length > 0 && this._data.hasOwnProperty(key)) {
            return this.setData(key, null);
        }
        // Failed to unset the data.
        return false;
    };

    /**
     * Get the data that is currently stored on a class instance.
     * @param {string|null} key - The data to get, or get all data if null.
     * @returns {{}|null|*}
     */
    getData = (key = null) => {
        if(UtilTypes.isNull(key)) {
            return this._data;
        }
        else if( UtilTypes.isString(key) && key.length > 0 && this._data.hasOwnProperty(key) ) {
            return this._data[key];
        }
        // No data exists for the specified key.
        return null;
    };



    /**
     * The props currently stored on the class instance.
     * @type {{}}
     */
    _props = {};

    /**
     * Set a prop on the class instance.
     * @param {{}|string} keyOrObject
     * @param value
     * @returns {boolean}
     */
    setProps = (keyOrObject, value = null) => {
        // Set an entire set of prop at once if an object is passed.
        if(UtilTypes.isObject(keyOrObject)) {
            // Adds the new prop to the previous prop.
            this._props = {
                ...this._props,
                ...keyOrObject,
            };
            return true;
        }
        // Set a single prop key based on the string value.
        if( UtilTypes.isString(keyOrObject) && keyOrObject.length > 0 ) {
            // If the value of this prop point being set is null, then instead, unset the prop (reset it back to default value).
            if( UtilTypes.isNull(keyOrObject) && this._props.hasOwnProperty(keyOrObject) ) {
                // If default prop exists for this key, then set it back to the default value.
                // Otherwise, just delete the key if there is not a default value for this prop key.
                if(this.constructor.hasOwnProperty('_default_props')
                    && UtilTypes.isObject(this.constructor._default_props)
                    && this.constructor._default_props.hasOwnProperty(keyOrObject)
                ) {
                    this._props[keyOrObject] = this.constructor._default_props[keyOrObject];
                }
                else {
                    delete this._props[keyOrObject];
                }

                // // Shorthand:
                // (this.constructor.hasOwnProperty('_default_props') && this.constructor._default_props.hasOwnProperty(keyOrObject) ? this._props[keyOrObject] = this.constructor._default_props[keyOrObject] : delete this._props[keyOrObject]);
            }
            else {
                this._props[keyOrObject] = value;
            }
            return true;
        }
        // Failed to set the prop.
        return false;
    };

    /**
     * Unset prop.
     * @param {string|null} key - The prop to unset.
     * @returns {boolean}
     */
    unsetProps = (key) => {
        // Unset all prop.
        if(UtilTypes.isNull(key)) {
            return this.setProps(this.constructor._default_props);
        }
        // A string value is passed to unset the prop for.
        if(UtilTypes.isString(key) && key.length > 0 && this._props.hasOwnProperty(key)) {
            return this.setProps(key, null);
        }
        // Failed to unset the prop.
        return false;
    };

    /**
     * Get the prop that is currently stored on a class instance.
     * @param {string|null} key - The prop to get, or get all prop if null.
     * @returns {{}|null|*}
     */
    getProps = (key = null) => {
        if(UtilTypes.isNull(key)) {
            return this._props;
        }
        else if( UtilTypes.isString(key) && key.length > 0 && this._props.hasOwnProperty(key) ) {
            return this._props[key];
        }
        // No prop exists for the specified key.
        return null;
    };

    /**
     * Determine if the class instance currently has a property.
     * @param {string} key
     * @returns {boolean}
     */
    hasProp = (key) => {
        return Boolean(this.getProps(key));
    };


}

export {
    DataAndPropsClass,
};
