import {User} from '../models/User';

import {
    UtilTypes,
} from '../Utils';

class Auth
{
    /**
     * Create a new Auth instance.
     * @param config
     */
    constructor(config = {})
    {
        console.log('Create Auth instance');
        console.log(config);

        if( config.hasOwnProperty('user') ) {
            if( UtilTypes.isInstanceOf(config.user, User) ) {
                this.setAuthenticatedUser(config.user);
            }
            else if( UtilTypes.isObject(config.user) ) {
                this.setAuthenticatedUser(new User(config.user));
            }
        }

        this.registerEvents();
    }

    /**
     * Register all the events related to this component.
     */
    registerEvents = () => {
        // Register the event to handle a user asking to be logged out of the application.
        $('#app').on('click', '[data-event-action=handle_logout]', function(event) {
            event.preventDefault();

            if(confirm("Are you sure you want to log out?")) {
                $('<form/>')
                    .attr('action', app().url('auth/logout'))
                    .attr('method', 'post')
                    .addClass('d-none')
                    .append(
                        $('<input/>')
                            .attr('name', '_token')
                            .attr('type', 'hidden')
                            // .val(app.getComponent('Cookie').getCookie('XSRF-TOKEN'))
                            .val($('head meta[name=csrf-token]').attr('content'))
                    )
                    .appendTo('body')
                    .submit();
            }
        });
    }

    /**
     * Unregister all the events related to this component.
     */
    unregisterEvents = () => {
        // Unregister the event to handle a user asking to be logged out of the application.
        $('#app').off('click', '[data-event-action=handle_logout]');
    }



    /**
     * User that is currently authenticated in the App.
     * @type {null|User}
     */
    #authenticated_user = null;

    /**
     * Set the user that is authenticated in the application.
     * @param {User} authenticated_user
     */
    setAuthenticatedUser(authenticated_user) {
        if(UtilTypes.isInstanceOf(authenticated_user, User)) {
            this.#authenticated_user = authenticated_user;
        }
    }

    /**
     * Unset the user that is authenticated in the application.
     */
    unsetAuthenticatedUser() {
        this.#authenticated_user = null;
    }

    /**
     * Get the user that is authenticated in the application.
     * @returns {User|null}
     */
    getAuthenticatedUser() {
        return this.#authenticated_user;
    }


    /**
     * Shorthand to retrieve the authenticated user.
     *
     * @see Auth#getAuthenticatedUser()
     *
     * @returns {User|null}
     */
    user = () => {
        return this.getAuthenticatedUser();
    };

    /**
     * Determine if a user is currently authenticated in the application.
     * @returns {boolean}
     */
    isAuthenticated() {
        return Boolean(UtilTypes.isInstanceOf(this.#authenticated_user, User));
    }



    /**
     * Determine if there is an authenticated user who happens to be admin.
     * @returns {boolean}
     */
    isAdmin() {
        return this.isAuthenticated() && this.getAuthenticatedUser().isAdmin();
        // return this.isAuthenticated() && (this.#authenticated_user.hasOwnProperty('is_admin') ? this.#authenticated_user.is_admin : false);
        // return this.isAuthenticated() && this.getAuthenticatedUser().isAdmin();
    }

    /**
     * Determine if there is an authenticated user who happens to be a mastermind.
     * @returns {boolean}
     */
    isMastermind() {
        return this.isAuthenticated() && this.getAuthenticatedUser().isMastermind();
    }







}

export {
    Auth,
};
