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
            "title_must_contain": "",
            "title_must_not_contain": "",
            "system_group": "",
            "automatic_searching_enabled": true,
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

        if(config.hasOwnProperty('pageData') && UtilTypes.isObject(config.pageData)) {
            console.log('SET CUSTOM PAGE DATA');
            console.log(config);

            if(config.pageData.hasOwnProperty('saved_search') && UtilTypes.isObject(config.pageData.saved_search))
            this.setData('saved_search', config.pageData.saved_search);
        }



        // if(config.hasOwnProperty('saved_search')) {
        //
        // }



        let _this = this;


        $("#page_content").on('click', '[data-event-action=toggle_advanced_search_options]', async function(event) {
            event.preventDefault();
            console.log('toggle advanced search');

            $('#find_matched_listings_form').slideToggle('fast');
        });



        $("#page_content").on('click', '[data-event-action=create_or_update_saved_search]', async function(event) {
            event.preventDefault();
            console.log('create or update saved search');

            let $clickedButtonElement = $(this);
            console.log($clickedButtonElement);

            _this.storeFormDataLocally();

            await axios({
                "method": (_this.getData('saved_search').exists ? 'PUT' : 'POST'),
                "url": app().url("search" + (_this.getData('saved_search').exists ? '/' + _this.getData('saved_search').id : '') ),
                "data": {
                    "mercadolibre_site_id": String(_this.getData('saved_search').mercadolibre_site_id),
                    "mercadolibre_category_id": String(_this.getData('saved_search').mercadolibre_category_id),
                    "keywords": String(_this.getData('saved_search').keywords),
                    "title_must_contain": String(_this.getData('saved_search').title_must_contain),
                    "title_must_not_contain": String(_this.getData('saved_search').title_must_not_contain),
                    "system_group": String(_this.getData('saved_search').system_group),
                    "automatic_searching_enabled": Boolean(_this.getData('saved_search').automatic_searching_enabled),
                    "notifications_enabled": Boolean(_this.getData('saved_search').notifications_enabled),
                },
            })
                .then((response) => {
                    console.log(response);
                    console.log(response.data);

                    // TODO

                    // Newly created saved search needs to refresh the page.
                    if(response.data.status_code == 201) {
                        $.notify("Saved Search Has Been Successfully Created!");

                        window.location.href = app().url('search/' + response.data.resource.id);
                    }
                    else {
                        $.notify("Saved Search Has Been Successfully Updated!");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    console.log(error.response);
                    console.log(error.response.data);

                    // TODO

                    $.notify(error.response.data.message + ' Cannot Save Search', {
                        "className": "danger",
                    });

                })
                .finally(() => {
                    // TODO
                })
            ;
        });

        $("#page_content").on('click', '[data-event-action=delete_saved_search]', async function(event) {
            event.preventDefault();
            console.log('delete saved search...');

            let $clickedButtonElement = $(this);
            console.log($clickedButtonElement);

            $clickedButtonElement.html('<i class="icon-spin1 animate-spin"></i>Deleting Saved Search...');
            let clicked_button_element_original_html = $clickedButtonElement.html();
            $clickedButtonElement.addClass('disabled').prop('disabled', true);

            if(confirm("Really delete this saved search?")) {

                let delete_asynchronously = false;

                if(!delete_asynchronously) {

                    // let $formElement = $(document.createElement('form'));
                    // $($formElement).attr("action", app().url('search/' + _this.getData('saved_search').id));
                    // $(form).attr("method", "POST");

                    let $formElement = $('<form/>')
                        .addClass('d-none')
                        .attr('action', app().url('search/' + _this.getData('saved_search').id))
                        .attr('method', "POST")
                        .append(
                            $('<input/>')
                                .attr('type', "hidden")
                                .attr('name', "_token")
                                .val($('html head meta[name=csrf-token]').attr('content'))
                        )
                        .append(
                            $('<input/>')
                                .attr('type', "hidden")
                                .attr('name', "_method")
                                .val("DELETE")
                        )
                    ;
                    $formElement.appendTo(document.body)
                    $formElement.submit();

                    // let $inputElement = $("<input>")
                    //     .attr("type", "hidden")
                    //     .attr("name", "_token")
                    //     .val("");
                    //
                    // $formElement.append($($inputElement));

                }
                else {

                    await axios({
                        "method": 'DELETE',
                        "url": app().url("search/" + _this.getData('saved_search').id ),
                    })
                        .then((response) => {
                            console.log(response);
                            console.log(response.data);

                            // $clickedButtonElement.html("Successfully Deleted. Redirecting...");

                            $.notify("Saved Search Has Been Successfully Deleted. Redirecting...");
                            setTimeout(() => {
                                window.location.href = app().url('account/saved_searches');
                            }, 2 * 1000); // number of seconds
                        })
                        .catch((error) => {
                            console.log(error.response);
                            console.log(error.response.data);

                            $.notify("An error occurred deleting the saved search.", {
                                "className": "danger",
                            });

                            $clickedButtonElement.html(clicked_button_element_original_html);
                            $clickedButtonElement.removeClass('disabled').prop('disabled', false);
                        })
                        .finally(() => {
                            // Nothing To Do
                        })
                    ;

                }


            }
        });


        $("#find_matched_listings_form").on('click', 'button[data-event-action=find_matched_listings]', function(event) {
            event.preventDefault();
            console.log('find matched ml listings');

            _this.storeFormDataLocally();

            // Reset the form to start again.
            $('#matched_listings_list').empty();
            _this.setData('matched_listings', []);
            $('#matched_listings_fieldset').attr('data-is-started', false);
            $('#matched_listings_fieldset').attr('data-is-finished', false);
            $('#matched_listings_fieldset').attr('data-is-loading', false);
            $('#matched_listings_fieldset').attr('data-total-results', '');
            $('#matched_listings_fieldset').attr('data-offset', 0);

            $('#results_counter__total').text("0");
            $('#results_counter__matched').text("0");
            $('#results_counter__container').hide();

            $("#find_matched_listings_form").trigger('submit');
        });


        $("#find_matched_listings_form").on('submit', async function(event) {
            event.preventDefault();
            console.log('find matched listings');

            let $submittedFormElement = $(this);

            // _this.storeFormDataLocally();

            let $clickedButtonElement = $(this).find('button[data-event-action=find_matched_listings]');
            let clicked_button_element_original_html = $clickedButtonElement.html();
            $clickedButtonElement.html('<i class="icon-spin1 animate-spin"></i>Finding Mercado Libre Listings...')
            $clickedButtonElement.addClass('disabled').prop('disabled', true);



            $('#matched_listings_fieldset').attr('data-is-started', true);
            $('#matched_listings_fieldset').attr('data-is-loading', true);



            let limit = 50;
            let offset = parseInt($('#matched_listings_fieldset').attr('data-offset'));

            await axios({
                "method": "POST",
                "url": app().url("search/find_matched_listings"),
                "data": {
                    "id": _this.getData('saved_search').id,
                    "exists": Boolean(_this.getData('saved_search').exists),
                    "mercadolibre_site_id": String(_this.getData('saved_search').mercadolibre_site_id),
                    "mercadolibre_category_id": String(_this.getData('saved_search').mercadolibre_category_id),
                    "keywords": String(_this.getData('saved_search').keywords),
                    "title_must_contain": String(_this.getData('saved_search').title_must_contain),
                    "title_must_not_contain": String(_this.getData('saved_search').title_must_not_contain),
                    "limit": limit,
                    "offset": offset,
                },
            })
                .then((response) => {
                    console.log(response);
                    console.log(response.data);

                    // Update total and matched count values in the DOM that is displayed to the user:
                    $('#results_counter__container').show();
                    $('#results_counter__total').text(response.data.resource.paging.total);
                    let current_matched_count = parseInt($('#results_counter__matched').text());
                    current_matched_count = (parseInt(current_matched_count) + parseInt(response.data.resource.results_filtered.length));
                    $('#results_counter__matched').text(current_matched_count);

                    // $('#results_counter__matched').text(response.data.resource.paging.total);

                    // $.notify("Success");

                    let current_matched_listings = _this.getData('matched_listings');

                    for(let i = 0; i < response.data.resource.results_filtered.length; i++) {
                        $('#matched_listings_list').append(_this.generateMatchedListingElement(response.data.resource.results_filtered[i]));

                        current_matched_listings.push(response.data.resource.results_filtered[i]);
                    }

                    _this.setData('matched_listings', current_matched_listings);

                    let new_offset = (offset + limit);

                    $('#matched_listings_fieldset').attr('data-is-loading', false);
                    $('#matched_listings_fieldset').attr('data-offset', new_offset);
                    $('#matched_listings_fieldset').attr('data-total-results', response.data.resource.paging.total);

                    // Remove the load more
                    if(new_offset >= response.data.resource.paging.total) {
                        $('#matched_listings_fieldset').attr('data-is-finished', true);
                    }

                    // $('#matched_listings_fieldset').attr('data-current-page', ++current_page);
                    // $('#matched_listings_fieldset').attr('data-total-results', response.data.resource.paging.total);

                    $("img").unveil();
                })
                .catch((error) => {
                    console.log(error);
                    console.log(error.response);
                    console.log(error.response.data);

                    // $clickedButtonElement.html(clicked_button_element_original_html);
                    // $clickedButtonElement.removeClass('disabled').prop('disabled', false);

                    $.notify("An error occurred finding matched listings from Mercado Libre.", {
                        "autoHide": false,
                        "className": "danger",
                        "clickToHide": true,
                    });
                })
                .finally(() => {
                    $clickedButtonElement.html(clicked_button_element_original_html);
                    $clickedButtonElement.removeClass('disabled').prop('disabled', false);
                })
            ;
        });


        // If the saved search already exists, then automatically load the first page of results when the page loads.
        if(_this.getData('saved_search').exists) {
            $("#find_matched_listings_form").trigger('submit');
        }


        $('#matched_listings_loadmore__loadmore').appear();
        $("#matched_listings_loadmore__loadmore").on('appear', function(event, $all_appeared_elements) {
            event.preventDefault();
            console.log('appeared ...');
            // this element is now inside browser viewport
            // console.log($all_appeared_elements);

            $("#find_matched_listings_form").trigger('submit');
        });

        // $("#matched_listings_loadmore__loadmore").on('appear', app().throttle(function(event, $all_appeared_elements) {
        //     event.preventDefault();
        //     console.log('appeared ...');
        //     // this element is now inside browser viewport
        //     // console.log($all_appeared_elements);
        //
        //     $("#find_matched_listings_form").trigger('submit');
        // }, 1000));

    };

    storeFormDataLocally = () => {
        //alert(String($("#find_matched_listings_form").find('select[name=mercadolibre_site_id]').val()));
        // alert(String($("#find_matched_listings_form").find('select[name=mercadolibre_category_id]').val()));

        let saved_search = this.getData('saved_search');
        saved_search.mercadolibre_site_id = String($("#find_matched_listings_form").find('select[name=mercadolibre_site_id]').val());
        saved_search.mercadolibre_category_id = String($("#find_matched_listings_form").find('select[name=mercadolibre_category_id]').val());
        saved_search.keywords = String($("#find_matched_listings_form").find('input[name=keywords]').val());
        saved_search.title_must_contain = String($("#find_matched_listings_form").find('input[name=title_must_contain]').val());
        saved_search.title_must_not_contain = String($("#find_matched_listings_form").find('input[name=title_must_not_contain]').val());
        this.setData('saved_search', saved_search);
    };

    generateMatchedListingElement = (matched_listing_data) => {
        //console.log(matched_listing_data);

        let $matchedListingElement = $('<li/>')
            .addClass('matched_listing')
            .append(
                $('<div/>')
                    .addClass('ms-0')
                    .append(
                        $('<a/>')
                            .addClass('bg-white matched_listing_thumbnail hover_up d-block')
                            .attr('href', matched_listing_data.hasOwnProperty('permalink') ? matched_listing_data.permalink : '#')
                            .attr('target', '_blank')
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
                    .append(
                        $('<ul/>')
                            .addClass('list-unstyled mb-0 lh-sm smaller')
                            .append(
                                $('<li/>')
                                    // .html('Price: R$ ' + (matched_listing_data.hasOwnProperty('price') ? matched_listing_data.price : 'Price Unknown') )
                                    // .html('<strong>Price:</strong> ' + (matched_listing_data.hasOwnProperty('prices') ? matched_listing_data.prices.prices[0].amount + " " + matched_listing_data.prices.prices[0].currency_id : 'Price Unknown') )
                                    .html('<strong>Price:</strong> R$ ' + (matched_listing_data.hasOwnProperty('price') ? matched_listing_data.price : 'Price Unknown') )
                            )
                            .append(
                                $('<li/>')
                                    .html('<strong>Quantity:</strong> ' + (matched_listing_data.hasOwnProperty('available_quantity') ? matched_listing_data.available_quantity : 'Available Qty Unknown') + ' Available, (Sold: ' + (matched_listing_data.hasOwnProperty('sold_quantity') ? matched_listing_data.sold_quantity : 'Sold Qty Unknown') + ')' )
                            )
                    )
            )
        ;
        return $matchedListingElement;
    };

}

export {
    Search,
};
