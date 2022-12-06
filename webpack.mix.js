let mix = require('laravel-mix');

require('laravel-mix-polyfill');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */


mix.js('resources/js/ApplicationLoader.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .polyfill({
        enabled: true,
        useBuiltIns: "usage",
        targets: "firefox 50, IE 11"
    })
    .sourceMaps()
    .version()
;



// // JavaScript:
// mix.js([
//     "resources/js/ApplicationLoader.js"
// ], "public/js/ApplicationLoader.js")
//     .sourceMaps()
//     .version();
//
// // CSS:
// mix.sass("resources/sass/app.scss", "public/css/app.css")
//     .sourceMaps()
//     .version();
