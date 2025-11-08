<?php

namespace App\Console\Commands;

use App\Models\Models;
use App\Models\Tag;
use App\Models\Video;
use App\Models\VideoCategories;
use Illuminate\Console\Command;
use Illuminate\Support\Str;



class createSlug extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create-slug';

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
    public function handle()
    {
        $this->info('STARTED');
//        $video = VideoCategories::all();
//
//        $video->map(function ($videoDetails,$index) {
//           $this->info("$index => $videoDetails->category");
//            try {
//                $videoDetails->update(['slug' => Str::slug($videoDetails->category)]);
//            }catch (\Exception $exception){
//                $this->error($exception->getMessage());
//            }
//
//        });

//        return Command::SUCCESS;
    }
}
