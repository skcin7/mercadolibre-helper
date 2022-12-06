class Keyboard
{
    // static componentIdentifier = "Keyboard";

    /**
     * Stores a list of all the keys that have been pressed in this Keyboard component instance life.
     * This is used in conjunction with the Mousetrap.
     * @type {[]}
     */
    #keystrokesHistory = [];

    /**
     * Stores a list of all the keys that are currently being pressed down.
     * This allows the application to easily check to see if a key is currently being held, which can provide additional functionality and use cases.
     * @type {[]}
     */
    #currentlyPressedKeys = [];

    // #mousetrap = [
    //
    // ];

    /**
     * Create a new Keyboard component instance.
     * @param config
     */
    constructor(config) {
        this.registerEvents();
    }

    /**
     * Register events that are associated with the Keyboard component.
     */
    registerEvents = () => {
        let _this = this;

        // A key has been pressed on the keyboard, so keep track that it is currently being held down.
        document.addEventListener('keydown', (event) => {
            _this.#currentlyPressedKeys[event.key] = true;
            app().log('KeyDown: ' + event.key, 'debug');
        });

        // A key that was being held down has been released, so keep track that it is no longer being held down.
        document.addEventListener('keyup', (event) => {
            // _this.#currentlyPressedKeys[event.key] = false;
            delete _this.#currentlyPressedKeys[event.key];
            app().log('KeyUp: ' + event.key, 'debug');
        });
    };

    /**
     * Determine if a key is currently being pressed (held down).
     * @param key
     * @returns {boolean}
     */
    isKeyPressed = (key) => {
        return Boolean(this.#currentlyPressedKeys[key]);
    };

}

export {
    Keyboard,
};
