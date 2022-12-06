// import {
//     Page,
// } from '../PageManager';

import {
    Page,
} from './Page';
import {UtilTypes} from "../Utils";

// import {
//     MushroomHouseListing,
// } from '../models/MushroomHouseListing';

class Welcome extends Page
{
    // Default data to use for when creating a new Inventory page.
    static #default_page_data = {
        'view_as': 'masonry',
        'showing_advanced_search_filters': false,
        'mushroom_house_listings': [],
        'search_filters': {
            'query': '',
            'type': '',
            'completeness': '',
            'system': '',
        },
    };

    #dom_elements = {
        'MushroomHouseListingsContainer': $('#mushroom_house_listings_container'),
    };

    /**
     * Create a new Welcome page instance.
     * @param config
     */
    constructor(config = {}) {
        super();
        console.log('INSIDE Welcome CONSTRUCTOR!!');

        this.setData(Welcome.#default_page_data);


        // If there is no current page state entry for this page saved to local storage, then set it to the default
        // data, and save it, to create the page state entry in local storage for this page.
        if(localStorage.getItem('WelcomePage') === null) {
            this.persistPageDataToLocalStorage();
        }
        else {
            let persisted_pagedata = JSON.parse(localStorage.getItem('WelcomePage'));
            this.setData(persisted_pagedata);
        }

        // If any page data was loaded from the HTTP request is passed in, then use that page data over any page data that may be currently saved.
        if(config.hasOwnProperty('pageData') && UtilTypes.isObject(config.pageData) && config.pageData.hasOwnProperty('mushroom_house_listings') && UtilTypes.isArray(config.pageData.mushroom_house_listings)) {
            console.log('Setting ' + config.pageData.mushroom_house_listings.length + ' Pre-Loaded Mushroom House Listing(s)...');

            // let current_mushroom_house_listings = this.getData('mushroom_house_listings');

            for(let i = 0; i < config.pageData.mushroom_house_listings.length; i++) {
                // current_mushroom_house_listings.push(config.pageData.mushroom_house_listings[i]);

                this.addMushroomHouseListing(config.pageData.mushroom_house_listings[i]);
            }

            // this.setData('mushroom_house_listings', current_mushroom_house_listings);
            console.log('Set Pre-Loaded Mushroom House Listings.');
        }


        // Initialize...
        if(! ['masonry', 'list'].includes( this.getData('view_as') )) {
            this.setData('view_as', Welcome.#default_page_data['view_as']); // set to default value if invalid.
        }
        this.#dom_elements['MushroomHouseListingsContainer'].attr('data-view-as', this.getData('view_as'));
        $('.change_mushroom_house_listings_view_as_button').removeClass('active');
        $(".change_mushroom_house_listings_view_as_button[value='" + this.getData('view_as') + "']").addClass('active');

        // Initialize Show/Hide Advanced Search Filters...
        if( this.getData('showing_advanced_search_filters') ) {
            // $('.className').css();
            $('#advanced_search_filters').css({'display': ''});
            this.#dom_elements['MushroomHouseListingsContainer'].attr('data-showing-advanced-search-filters', true);
        }
        else {
            $('#advanced_search_filters').css({'display': 'none'});
            // $('#advanced_search_filters').attr('style', 'display: none;');
            this.#dom_elements['MushroomHouseListingsContainer'].attr('data-showing-advanced-search-filters', false);
        }


        let _this = this;



        this.#dom_elements['MushroomHouseListingsContainer'].on('click', '.change_mushroom_house_listings_view_as_button', function(event) {
            event.preventDefault();
            // console.log('change view as');

            let $clickedButtonElement = $(this);
            // console.log('Change View As To: ' + $clickedButtonElement.val());

            _this.changeViewAs($clickedButtonElement.val());
        });




        this.#dom_elements['MushroomHouseListingsContainer'].on('click', '[data-event-action=toggle_advanced_search_filters]', function(event) {
            event.preventDefault();
            console.log('toggle adv search');

            // let $advanced_search_container_element = $('#advanced_search_container');
            // if($advanced_search_container_element.is(':visible')) {
            //     $advanced_search_container_element.find('input[name=query]').blur();
            //     $advanced_search_container_element.hide();
            // }
            // else {
            //     $advanced_search_container_element.show();
            //     $advanced_search_container_element.find('input[name=query]').focus();
            // }

            if( _this.getData('showing_advanced_search_filters') ) {
                $('#advanced_search_filters').slideUp('fast', function() {
                    $('#advanced_search_filters').find('input[name=query]').blur();

                    _this.setData('showing_advanced_search_filters', false);
                    _this.persistPageDataToLocalStorage();
                    _this.#dom_elements['MushroomHouseListingsContainer'].attr('data-showing-advanced-search-filters', false);
                });
            }
            else {
                $('#advanced_search_filters').slideDown('fast', function() {
                    $('#advanced_search_filters').find('input[name=query]').focus();

                    _this.setData('showing_advanced_search_filters', true);
                    _this.persistPageDataToLocalStorage();
                    _this.#dom_elements['MushroomHouseListingsContainer'].attr('data-showing-advanced-search-filters', true);
                });
            }


            // let $advanced_search_container_element = $('#advanced_search_filters');
            // $advanced_search_container_element.slideToggle(function() {
            //     if($advanced_search_container_element.is(':visible')) {
            //         $advanced_search_container_element.find('input[name=query]').focus();
            //         this.setData('showing_advanced_search_filters', true);
            //         this.persistPageDataToLocalStorage();
            //         $('#mushroom_house_listings_container').attr('data-showing-advanced-search-filters', true);
            //     }
            //     else {
            //         $advanced_search_container_element.find('input[name=query]').blur();
            //         this.setData('showing_advanced_search_filters', false);
            //         this.persistPageDataToLocalStorage();
            //         $('#mushroom_house_listings_container').attr('data-showing-advanced-search-filters', false);
            //     }
            // });

        });


        this.#dom_elements['MushroomHouseListingsContainer'].on('click', '[data-event-action=claim_mushroom_house_listing_item]', function(event) {
            event.preventDefault();
            console.log('claim MH listing');

            let $clickedButtonElement = $(this);

            //TODO
        });





        // Due to the pure-CSS masonry layout, the images don't unveil automatically upon initial page load.
        // Wait 1 second and the manually unveil the images.
        setTimeout(() => {
            $("img").unveil();
            console.log('unveiling images manually with timeout');
        }, 1000);

    };

    generateMushroomHouseListingDomElement = (mushroomHouseListingInstance) => {
        let $mushroomHouseListingElement = $('<li/>')
            .addClass('mushroom_house_listing')
            .attr('data-event-action', 'show_mushroom_house_listing_modal')
            .append(
                $('<a/>')
                    .attr('href', mushroomHouseListingInstance.getAttribute('public_url'))
                    .append(
                        $('<div/>')
                            .addClass('mushroom_house_listing_header')
                            .text(mushroomHouseListingInstance.getAttribute('name'))
                    )
                    .append(
                        $('<div/>')
                            .addClass('mushroom_house_listing_thumbnail')
                            .append(
                                $('<img/>')
                                    // .attr('src', mushroomHouseListingInstance.getAttribute('thumbnail').getAttribute('url'))
                                    .attr('src', mushroomHouseListingInstance.getAttribute('photos').length > 0 ? mushroomHouseListingInstance.getAttribute('photos')[0].getAttribute('formatted_urls')['md'] : app().url('images/NoPhoto_512x512.png'))
                                // <img src="{{ asset('images/loading.gif') }}" data-src="{{ asset('images/NoPhoto_512x512.png') }}"/>
                            )
                        // .text(mushroomHouseListingInstance.getAttribute('name'))
                    )
                    .append(
                        $('<div/>')
                            .addClass('mushroom_house_listing_body')
                            .append(
                                $('<ul/>')
                                    .addClass('mushroom_house_listing_props')
                                    .append(
                                        $('<li/>')
                                            .addClass('prop_item')
                                            .append(
                                                $('<strong/>')
                                                    .addClass('me-1')
                                                    .text('Type:')
                                            )
                                            .append(
                                                $('<span/>')
                                                    .text(mushroomHouseListingInstance.getType('formatted'))
                                            )
                                    )
                                    .append(
                                        $('<li/>')
                                            .addClass('prop_item')
                                            .append(
                                                $('<strong/>')
                                                    .addClass('me-1')
                                                    .text('Completeness:')
                                            )
                                            .append(
                                                $('<span/>')
                                                    .text(mushroomHouseListingInstance.getCompleteness('formatted'))
                                            )
                                    )
                                    .append(
                                        $('<li/>')
                                            .addClass('prop_item')
                                            .append(
                                                $('<strong/>')
                                                    .addClass('me-1')
                                                    .text('System:')
                                            )
                                            .append(
                                                $('<span/>')
                                                    .text(mushroomHouseListingInstance.getAttribute('systems').map((this_system) => {
                                                        return this_system.abbreviation;
                                                    }))
                                            )
                                    )
                            )
                            .append(
                                $('<div/>')
                                    .addClass('mushroom_house_listing_seller_info')
                                    .addClass('d-none')
                                    .append(
                                        $('<strong/>')
                                            .addClass('me-1')
                                            .text('Seller:')
                                    )
                                    .append(
                                        $('<span/>')
                                            .text('TODO')
                                    )
                            )
                            .append(
                                $('<div/>')
                                    .addClass('mushroom_house_listing_price_display')
                                    .append(
                                        $('<img/>')
                                            .addClass('me-0')
                                            .attr('src', app().url('images/ani_smb3coin.gif'))
                                    )
                                    .append(
                                        $('<span/>')
                                            .addClass('mushroom_house_listing_price_display__label')
                                            .text('PRICE')
                                    )
                                    .append(
                                        $('<span/>')
                                            .addClass('mx-1')
                                            .text('×')
                                    )
                                    .append(
                                        $('<span/>')
                                            .addClass('mushroom_house_listing_price_display__value')
                                            .text(mushroomHouseListingInstance.getAttribute('price'))
                                    )
                                    .append(
                                        $('<span/>')
                                            .addClass('mushroom_house_listing_price_display__denomination')
                                            .text('(USD)')
                                    )
                            )
                            .append(
                                $('<div/>')
                                    .addClass('mushroom_house_listing_quantity_remaining_display mb-1')
                                    .append(
                                        $('<span/>')
                                            .addClass('mushroom_house_listing_quantity_remaining_display__label me-1')
                                            .text('QTY REMAINING:')
                                    )
                                    .append(
                                        $('<span/>')
                                            .addClass('mushroom_house_listing_quantity_remaining_display__value')
                                            .text(mushroomHouseListingInstance.getAttribute('quantity_remaining'))
                                    )
                            )
                            .append(
                                $('<button/>')
                                    .addClass('btn btn-primary mushroom_house_listing_claim_button bigger')
                                    .attr('data-event-action', 'claim_mushroom_house_listing_item')
                                    // .append(
                                    //     $('<i/>')
                                    //         .addClass('icon-shopping-cart-add me-0')
                                    // )
                                    .append(
                                        $('<span/>')
                                            .text('Claim This Item')
                                    )
                            )
                    )
            )
            ;
        return $mushroomHouseListingElement;
    };

    /**
     * Add the Mushroom House listing to the page.
     * @param mushroom_house_listing_data
     */
    addMushroomHouseListing = (mushroom_house_listing_data) => {
        console.log('Add Mushroom House Listing');
        console.log(mushroom_house_listing_data);

        let newMushroomHouseListing = new MushroomHouseListing(mushroom_house_listing_data);


        let current_mushroom_house_listings = this.getData('mushroom_house_listings');
        current_mushroom_house_listings.push(newMushroomHouseListing);
        this.setData('mushroom_house_listings', current_mushroom_house_listings);

        let $newMushroomHouseListingDomElement = this.generateMushroomHouseListingDomElement(newMushroomHouseListing);
        $('#mushroom_house_listings_list').append(
            $newMushroomHouseListingDomElement,
        );
    };

    /**
     * Change the 'View As' value.
     * @param view_as
     */
    changeViewAs = (view_as) => {
        if(['masonry', 'list'].includes( view_as )) {
            this.setData('view_as', view_as);

            $('.change_mushroom_house_listings_view_as_button').removeClass('active');
            $('.change_mushroom_house_listings_view_as_button[value=\'' + view_as + '\']').addClass('active');
        }
    };

    /**
     * Persist current page data to local storage.
     */
    persistPageDataToLocalStorage = () => {
        let current_pagedata = this.getData();

        let allowed_keys = [
            'view_as',
            'showing_advanced_search_filters',
        ];

        let filtered_pagedata = Object.keys(current_pagedata)
            .filter(key => allowed_keys.includes(key))
            .reduce((obj, key) => {
                obj[key] = current_pagedata[key];
                return obj;
            }, {});

        localStorage.setItem('WelcomePage', JSON.stringify(filtered_pagedata));
    };

    showLoadingMessage = () => {

    };

    // load = () => {
    //     console.log('ℹ️ Page: ' + this.constructor.name + ' - Loading...');
    //
    //     // Unveil images that may be lazy-loaded.
    //     $("img").unveil();
    //
    //     console.log('✅ Page: ' + this.constructor.name + ' - Loaded.');
    // }
    //
    // unload = () => {
    //     console.log('ℹ️ Page: ' + this.constructor.name + ' - Unloading...');
    //
    //     //
    //
    //     console.log('✅ Page: ' + this.constructor.name + ' - Unloaded.');
    // }

    // pageHandler() {
    //     console.log('Handling welcome page');
    // }
    //
    // getRenderedView() {
    //     return $('<div/>')
    //         .addClass('container-fluid')
    //         .append(
    //             $('<h1/>')
    //                 .addClass('text-center mt-0 mb-2')
    //                 .text('Inventory Manager Pro')
    //         )
    // }

}

export {
    Welcome,
};
