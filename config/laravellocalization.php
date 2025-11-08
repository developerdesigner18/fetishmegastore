<?php

return [ 

    'supportedLocales' => [
        'en' => ['name' => 'English'],
        'de' => ['name' => 'German'],
        'it' => ['name' => 'Italian'],
        'fr' => ['name' => 'French'],
        'es' => ['name' => 'Spanish'],
        'ru' => ['name' => 'Russian'],
        'zh' => ['name' => 'Chinese'],
        'jp' => ['name' => 'Japanese'],
        'pt' => ['name' => 'Portuguese'],
        'pl' => ['name' => 'Polish'],
        'tr' => ['name' => 'Turkish'],
    ],
    /*
    |--------------------------------------------------------------------------
    | Supported Locales
    |--------------------------------------------------------------------------
    | यहाँ वो locales define करो जो app support करेगी।
    | Key => URL prefix
    */
    // 'supportedLocales' => [
    //     // 'en' => ['name' => 'English'],
    //     // 'de' => ['name' => 'German'],
    //     // 'it' => ['name' => 'Italian'],
    //     // 'fr' => ['name' => 'French'],
    //     // 'es' => ['name' => 'Spanish'],
    //     // 'ru' => ['name' => 'Russian'],
    //     // 'zh' => ['name' => 'Chinese'],
    //     // 'jp' => ['name' => 'Japanese'],
    //     // 'pt' => ['name' => 'Portuguese'],
    //     // 'pl' => ['name' => 'Polish'],
    //     // 'tr' => ['name' => 'Turkish'],
        
    // ],


   
    
        

    /*
    |--------------------------------------------------------------------------
    | Use Accept-Language Header
    |--------------------------------------------------------------------------
    */
    'useAcceptLanguageHeader' => true,

    /*
    |--------------------------------------------------------------------------
    | Hide Default Locale
    |--------------------------------------------------------------------------
    | अगर true किया तो defaultLocale URL में show नहीं होगा।
    */
    'hideDefaultLocaleInURL' => false,

    /*
    |--------------------------------------------------------------------------
    | Default Locale
    |--------------------------------------------------------------------------
    */
    'defaultLocale' => 'en',
];
