<?php

namespace App\Console\Commands;

use App\Models\Video;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;


class CheckAndRemove extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check-and-remove';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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

        $this->performAction(public_path('videos'), '/videos/');
        $this->performAction(public_path('videos/360'), '/videos/360/');
//        NO MORE WITH BUNNY WE USE DIRECT FROM THE SERVER
//        $this->performAction(public_path('videos/GIF'),'/videos/GIF/');
        $this->performAction(public_path('thumbnails'), '/thumbnails/');
        $this->performAction(public_path('models'), '/models/');
        $this->performAction(public_path('categories'), '/categories/');

        return Command::SUCCESS;
    }


    public function performAction($systemPath, $bunnyPath)
    {
//        $tempArray = [];
        $this->info("====================$bunnyPath===============================");
        $checkOnBunnyCategories = collect($this->client->listFiles($bunnyPath))->map(function ($file) {
            return $file->ObjectName;
        });

//        $getTableVideos = Video::where('is_converted',1)->where('is_gif',1)->get()->pluck('video')->toArray();
        $getVideoFiles = collect(File::files($systemPath))->map(function ($file) {
            return $file->getFileName();
        });

        foreach ($getVideoFiles as $videoName) {
            if ($checkOnBunnyCategories->contains($videoName)) {
                $this->info('bunny exist');
                try {
                    unlink(public_path($bunnyPath . $videoName));
                    $this->warn("UNLINKED " . $bunnyPath . $videoName);
                } catch (\Exception $exception) {
                    $this->error("ERRORRR " . $exception->getMessage());
                }
            } else {
//                $tempArray[] = '"videos/'.$videoName.'"';
                $this->info("NOT EXIST => $videoName");
            }

        }
//        echo(implode(',',$tempArray));
    }
}
