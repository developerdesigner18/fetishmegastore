<?php

namespace App\Console\Commands;

use App\Models\Page;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Stichoza\GoogleTranslate\GoogleTranslate;

class GenerateTranslationJSON extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'translations:json';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scan and generate translations JSON';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        // specify paths
        $paths = [
                'Blade Files' => resource_path('views'),
                'APP Files' => app_path(),
                'JSX Files' => resource_path('js')
        ];

        // build array of translatable files
        $translateFiles = [];

        // push the files in the array
        foreach ($paths as $type => $path) {
            $this->line("--");
            $this->info('Scanning for ' . $type);
            $this->line("--");
            $files = File::allFiles($path);

            foreach ($files as $f) {
                $translateFiles[] = $f;
            }
        }

        // now scan the files in the array
        $strings = [];

        foreach ($translateFiles as $file) {
            $this->info($file->getPathname());
            $found = $this->findTranslateableStrings($file->getContents());
            $this->info("Found: " . count($found));
            $this->line("--");
            $strings[] = $found;
        }

        $pagesName = Page::orderByDesc('show_order')->pluck('page_title')->toArray();
        array_push($strings,$pagesName);

        $strings = collect($strings)
                    ->flatten()
                    ->reject(fn ($value) => Str::startsWith($value, 'navigation.'))
                    ->reject(fn ($value) => Str::startsWith($value, 'auth.'))
                    ->reject(fn ($value) => Str::startsWith($value, 'v16.'))
                    ->reject(fn ($value) => Str::startsWith($value, 'v103.'))
                    ->reject(fn ($value) => Str::startsWith($value, 'post.'))
                    ->reject(fn ($value) => preg_match('/coffee/i', $value))
                    ->reject(fn ($value) => preg_match('/platinum/i', $value))
                    ->unique();


        $jsonStrings = [];
        $jsonStringsGerman = [];
        $jsonStringsItalian = [];
        $jsonStringsFrench = [];
        $jsonStringsSpanish = [];
        $jsonStringsChinese = [];


        foreach ($strings as $s) {
            $jsonStrings[$s] = $s;
            $jsonStringsGerman[$s] = $this->translateToOther($s,'de');
            $jsonStringsItalian[$s] = $this->translateToOther($s,'it');
            $jsonStringsFrench[$s] = $this->translateToOther($s,'fr');
            $jsonStringsSpanish[$s] = $this->translateToOther($s,'es');
            $jsonStringsRussian[$s] = $this->translateToOther($s,'ru');
            $jsonStringsChinese[$s] = $this->translateToOther($s,'zh');
            $jsonStringsJapanese[$s] = $this->translateToOther($s,'ja');
            $jsonStringsPortuguese[$s] = $this->translateToOther($s,'pt');
            $jsonStringsPolish[$s] = $this->translateToOther($s,'pl');
            $jsonStringsTurkish[$s] = $this->translateToOther($s,'tr');
            $this->info('Translating: '.$s);
        }



//        foreach ($strings as $s) {
//            $jsonStringsGerman[$s] = $this->translateToOther($s,'de');
//        }


        $writeTo = lang_path('en.json');

        $writeToGerman = lang_path('de.json');

        $writeToItalian = lang_path('it.json');

        $writeToFrench = lang_path('fr.json');

        $writeToSpanish = lang_path('es.json');

        $writeToRussian = lang_path('ru.json');

        $writeToChinese = lang_path('zh.json');

        $writeToJapanese = lang_path('jp.json');

        $writeToPortugues = lang_path('pt.json');

        $writeToPolish = lang_path('pl.json');

        $writeToTurkish = lang_path('tr.json');



        file_put_contents($writeTo, collect($jsonStrings)->toJson());

        file_put_contents($writeToGerman, collect($jsonStringsGerman)->toJson());

        file_put_contents($writeToItalian, collect($jsonStringsItalian)->toJson());

        file_put_contents($writeToFrench, collect($jsonStringsFrench)->toJson());

        file_put_contents($writeToSpanish, collect($jsonStringsSpanish)->toJson());

        file_put_contents($writeToRussian, collect($jsonStringsRussian)->toJson());

        file_put_contents($writeToChinese, collect($jsonStringsChinese)->toJson());

        file_put_contents($writeToJapanese, collect($jsonStringsJapanese)->toJson());

        file_put_contents($writeToPortugues, collect($jsonStringsPortuguese)->toJson());

        file_put_contents($writeToPolish, collect($jsonStringsPolish)->toJson());

        file_put_contents($writeToPolish, collect($jsonStringsPolish)->toJson());

        file_put_contents($writeToTurkish, collect($jsonStringsTurkish)->toJson());


        $this->info('Written ' . $strings->count() . ' strings to ' . $writeTo);
        $this->info('Written ' . $strings->count() . ' strings to ' . $writeToGerman);
        $this->info('Written ' . $strings->count() . ' strings to ' . $writeToItalian);
        $this->info('Written ' . $strings->count() . ' strings to ' . $writeToFrench);
        $this->info('Written ' . $strings->count() . ' strings to ' . $writeToSpanish);
        $this->info('Written ' . $strings->count() . ' strings to ' . $writeToRussian);
        $this->info('Written ' . $strings->count() . ' strings to ' . $writeToChinese);
        $this->info('Written ' . $strings->count() . ' strings to ' . $writeToJapanese);
        $this->info('Written ' . $strings->count() . ' strings to ' . $writeToPortugues);
        $this->info('Written ' . $strings->count() . ' strings to ' . $writeToPolish);
        $this->info('Written ' . $strings->count() . ' strings to ' . $writeToTurkish);

        return Command::SUCCESS;
    }


    public function findTranslateableStrings($contents)
    {
        $regex = '/[^\w](?<!->)(trans|trans_choice|Lang::get|Lang::choice|Lang::trans|Lang::transChoice|@lang|@choice|__)\s*\([\'|"]([^\'|"]+)/i';
        preg_match_all($regex, $contents, $output_array);

        if (isset($output_array[2])) {
            return $output_array[2];
        }

        return [];
    }


    public function translateToOther($word, $code) {
        try {
            // Split while preserving proper :parameters (must be : followed by word chars, not in middle of other words)
            $parts = preg_split('/((?<!\w):\w+\b(?!\w))/', $word, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);

            $result = '';
            foreach ($parts as $part) {
                if (preg_match('/^:\w+\b$/', $part)) {
                    // This is a proper dynamic parameter (like :handle) - don't translate
                    $result .= $part;
                } else {
                    // This is normal text - translate it
                    $translated = GoogleTranslate::trans($part, $code, 'en');
                    $result .= $translated;
                }
            }

            return $result;
        }catch (\Exception $exception){
            return $result;
        }

    }
}
