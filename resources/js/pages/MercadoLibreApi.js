import {
    Page,
} from './Page';

import {
    UtilTypes,
} from '../Utils';

class MercadoLibreApi extends Page
{
    static #default_data = {
        'authorization': null,
    };

    constructor(config = {}) {
        super();


        console.log('INSIDE MercadoLibreApi CONSTRUCTOR!!');
        this.setData(MercadoLibreApi.#default_data);

        let _this = this;

        $("#page_content").on('click', '[data-event-action=get_mercadolibre_sites]', async function(event) {
            event.preventDefault();
            console.log('get ml sites');

            await axios({
                method: "GET",
                url: "https://api.mercadolibre.com/sites",
                data: {}
            })
                .then((response) => {
                    console.log(response);
                    console.log(response.data);

                    $.notify("Success");
                })
                .catch((error) => {
                    console.log(error.response);
                    console.log(error.response.data);

                    $.notify("Error", {
                        "className": "danger",
                    });
                });
        });


    }


}

export {
    MercadoLibreApi,
};
