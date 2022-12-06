import {
    Page,
} from './Page';
import {UtilTypes} from "../Utils";

// import {
//     MushroomHouseListing,
// } from '../models/MushroomHouseListing';

class Search extends Page
{
    // Default data to use for when creating a new Inventory page.
    static #default_page_data = {
        "saved_search": {
            "id": null,
            "exists": false,
            "mercadolibre_site_id": "",
            "mercadolibre_category_id": "",
            "keywords": "",
            "is_enabled": true,
            "notifications_enabled": true,
        },
        "matched_listings": [],
    };

    /**
     * Create a new Search page instance.
     * @param config
     */
    constructor(config = {}) {
        super();
        console.log('INSIDE Search CONSTRUCTOR!!');

        this.setData(Search.#default_page_data);



        let _this = this;

        $("#page_content").on('click', '[data-event-action=save_saved_search]', function(event) {
            event.preventDefault();
            console.log('save saved search');
        });

        $("#page_content").on('click', '[data-event-action=delete_saved_search]', function(event) {
            event.preventDefault();
            console.log('delete saved search...');
            if(confirm("Really delete this saved search?")) {

                console.log('TODO...');

            }
        });



        $("#find_matched_listings_form").on('submit', async function(event) {
            event.preventDefault();
            console.log('find matched listings');

            let $submittedFormElement = $(this);

            _this.setData('mercadolibre_site_id', $submittedFormElement.find('select[name=mercadolibre_site_id]').val());
            _this.setData('mercadolibre_category_id', $submittedFormElement.find('select[name=mercadolibre_category_id]').val());
            _this.setData('keywords', $submittedFormElement.find('input[name=keywords]').val());

            let $clickedButtonElement = $(this).find('button[type=submit]');
            let clicked_button_element_original_html = $clickedButtonElement.html();
            $clickedButtonElement.html('<i class="icon-spin1 animate-spin"></i>Finding Matched Listings...')
            $clickedButtonElement.addClass('disabled').prop('disabled', true);

            await axios({
                "method": "POST",
                "url": app().url("search/find_listings"),
                "data": {
                    "id": _this.getData('id'),
                    "exists": _this.getData('exists'),
                    "mercadolibre_site_id": _this.getData('mercadolibre_site_id'),
                    "mercadolibre_category_id": _this.getData('mercadolibre_category_id'),
                    "keywords": _this.getData('keywords'),
                },
            })
                .then((response) => {
                    console.log(response);
                    console.log(response.data);

                    // $.notify("Success");

                    let current_matched_listings = _this.getData('matched_listings');

                    for(let i = 0; i < response.data.resource.results.length; i++) {
                        $('#matched_listings_list').append(_this.generateMatchedListingElement(response.data.resource.results[i]));

                        current_matched_listings.push(response.data.resource.results[i]);
                    }

                    _this.setData('matched_listings', current_matched_listings);

                    $("img").unveil();
                })
                .catch((error) => {
                    console.log(error.response);
                    console.log(error.response.data);

                    $.notify("An error occurred finding matched listings from Mercado Libre.", {
                        "autoHide": false,
                        "className": "danger",
                        "clickToHide": true,
                    });
                })
                .finally(() => {
                    $clickedButtonElement.html(clicked_button_element_original_html);
                    $clickedButtonElement.html('Find Matched Listings')
                    $clickedButtonElement.removeClass('disabled').prop('disabled', false);
                })
            ;
        });



    };

    generateMatchedListingElement = (matched_listing_data) => {
        let $matchedListingElement = $('<li/>')
            .addClass('matched_listing')
            .append(
                $('<div/>')
                    .addClass('ms-0')
                    .append(
                        $('<div/>')
                            .addClass('bg-white matched_listing_thumbnail hover_up')
                            .append(
                                $('<img/>')
                                    .attr('src', app().url('images/loading.gif'))
                                    .attr('data-src', matched_listing_data.hasOwnProperty('thumbnail') ? matched_listing_data.thumbnail : app().url('images/NoPhoto_512x512.png'))
                            )
                    )
            )
            .append(
                $('<div/>')
                    .addClass('ms-3 me-3')
                    .append(
                        $('<a/>')
                            .addClass('hover_up text-decoration-none')
                            .attr('href', matched_listing_data.hasOwnProperty('permalink') ? matched_listing_data.permalink : '#')
                            .attr('target', '_blank')
                            .text(matched_listing_data.hasOwnProperty('title') ? matched_listing_data.title : 'Title Unknown')
                    )
            )
        ;
        return $matchedListingElement;
    };

}

export {
    Search,
};
