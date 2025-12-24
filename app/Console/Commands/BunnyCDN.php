<?php

namespace App\Console\Commands;

use App\Models\Models;
use App\Models\ShortVideo;
use App\Models\Tag;
use App\Models\Video;
use App\Models\VideoCategories;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;

class BunnyCDN extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'move-to-bunny';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Move objects to Bunny Storage';

    /**
     * Execute the console command.
     *
     * @return int
     */

    public $client;

    public $accessKey = 'adc3e470-1c44-487b-8f938c786a3b-0348-4764';

    public $zone = 'fetishmegastore';

    public function handle()
    {
        $this->client = new \Bunny\Storage\Client($this->accessKey, $this->zone, 'de');

        $this->info('=======================FIND Categories===========================');
        $this->uploadToBunny(VideoCategories::class, 'categories', 'image',1,true);

        $this->info('=================================FIND tags======================================');
        $this->uploadToBunny(Tag::class, 'categories', 'image',1,true);

        $this->info('====================================FIND Model===============================');
        $this->uploadToBunny(Models::class, 'models', 'photo',1,true);

        $this->info('=============================FIND ModelGallery============================');
        $this->uploadToBunny(Models::class, 'models/gallery', 'photos', 2,true);

        $this->info('==================================FIND VideoThumbanil==========================');
        $this->uploadToBunny(Video::class, 'thumbnails', 'thumbnail',4,true);


        $this->info('====================================FIND Videos===========================');
        $this->uploadToBunny(Video::class, 'videos', 'video',1,true);

        $this->info('=====================================FIND Videos 360p=============================');
        $this->uploadToBunny(Video::class, 'videos/360', 'Str360', 2,true);

//        NO MORE WITH BUNNY WE USE DIRECT FROM THE SERVER
       $this->info('=================================FIND Videos GIF=======================================');
       $this->uploadToBunny(Video::class, 'videos/GIF', 'StrGIF', 2,true);

        $this->info('=====================================FIND Previews=============================');
        $this->uploadToBunny(ShortVideo::class, 'short-videos', 'video', 1, true);


        return Command::SUCCESS;
    }


    public function uploadToBunny($modelName, $bunnyFolderName, $columnName, $nameIndex = 1, $unlink = false)
    {
        $categories = $modelName::orderBy('id', 'desc')->get()->map(function ($file) use ($columnName, $nameIndex, $bunnyFolderName) {
            if ($bunnyFolderName == 'models/gallery' || $bunnyFolderName == 'videos/360' || $bunnyFolderName == 'videos/GIF') {
                $explode = explode(',', $file->$columnName);
                foreach ($explode as $item) {
                    if ($item != null && $item != '') {
                        return [
                            'full_path' => public_path($item),
                            'name' => explode('/', $item)[$nameIndex],
                            'remote_path' => $item,
                        ];
                    }
                }
            } else {
                if ($file->$columnName != null && $file->$columnName != '') {
                    return [
                        'full_path' => str_replace('https://storage.fetishmegastore.com/', '', public_path($file->$columnName)),
                        'name' => explode('/', $file->$columnName)[$nameIndex],
                        'remote_path' => str_replace('https://storage.fetishmegastore.com/', '', $file->$columnName),
                    ];
                }
            }
        });


       /* $checkOnBunnyCategories = collect($this->client->listFiles($bunnyFolderName))->map(function ($file) {
            return $file->ObjectName;
        });*/

        $checkOnBunnyCategories = collect($this->client->listFiles($bunnyFolderName))->map(function ($file) {
            return is_array($file) ? ($file['ObjectName'] ?? null) : ($file->ObjectName ?? null);
        });


        $categories->each(function ($video, $index) use ($checkOnBunnyCategories, $unlink) {


            try {
                if ($checkOnBunnyCategories->contains($video['name'])) {
//                    $this->info('DUPLICATION ' . $index . ' => ' . $video['name']);
                } else {
                    try {
                        $this->info("UPLOADED STARTED $index : " . $video['name']);
                        $this->client->upload($video['full_path'], $video['remote_path']);
                        $this->info("UPLOADED SUCCESSFULLY $index : " . $video['name']);
                        if ($unlink) {
//                            $this->info('UNLINKING '.$video['full_path']);
                            unlink($video['full_path']);
                        }
                    } catch (\Exception $e) {
//                        dd($e->getMessage());
                        $this->info("UNABLE TO UPLOAD " . $video['name'] . " : " . $e->getMessage());
                    }
                }
            } catch (\Exception $exception) {
//                dd($exception->getMessage(),$video,$index);
                $this->info("SYSTEM ERROR " . $index . " : " . $exception->getMessage());
            }

        });
    }
}
