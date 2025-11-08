<?php

namespace App\View\Components;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Session;
use Illuminate\View\Component;
use Illuminate\Support\Facades\File;

class Translations extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\Contracts\View\View|\Closure|string
     */
    public function render()
    {

//        dd(session());
        $phpTranslations = [];
        $jsonTranslations = [];

        if (File::exists(lang_path('en'))) {
            $phpTranslations = collect(File::allFiles(lang_path('en')))
                    ->filter(fn ($file) => $file->getExtension() === 'php')
                    ->flatMap(fn ($file) => Arr::dot(File::getRequire($file->getRealPath())))
                    ->toArray();
        }

//        if (File::exists(lang_path('en.json'))) {
//            $jsonTranslations = json_decode(File::get(lang_path('en.json')), true);
//        }
        if (File::exists(lang_path(app()->getLocale().'.json'))) {
                    $jsonTranslations = json_decode(File::get(lang_path(app()->getLocale().'.json')), true);
        }



//        if (File::exists(lang_path('de.json'))) {
//            $jsonTranslations = json_decode(File::get(lang_path('de.json')), true);
//        }

        $translations = array_merge($phpTranslations, $jsonTranslations);

        return view('components.Translations', compact('translations'));
    }
}
