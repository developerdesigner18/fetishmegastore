<?php

namespace App\Console\Commands;

use App\Models\Video;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class VideoConvert extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'video-convert';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Converting Video';


    public function createFileObject($url)
    {
        $path_parts = pathinfo($url);
        // dd($path_parts);
        $newPath = $path_parts['basename'];
        // if(!is_dir ($newPath)){
        //     mkdir($newPath, 0777);
        // }

        $newUrl = $newPath . "/" . $path_parts['basename'];

        // copy($url, $newUrl);
        // $imgInfo = getvideosize($url);
        // dd($imgInfo);
        $file = new UploadedFile(
            $url,
            $path_parts['basename'],
            mime_content_type($url),
            0,
            filesize($url),
            true,
            TRUE
        );

        return $file;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Cron Started');

        $getNotConvertedVideos = Video::where('is_converted', 0)->get();

        $getNotConvertedVideos->map(function ($videoDetails) {
            $this->info('video: ' . $videoDetails->video);

            try {
                $ffmpeg_path = 'ffmpeg ';

                $inputfile = asset($videoDetails->video);


                $export = explode("/", $videoDetails->video);
                $outputPath_480 = public_path('videos/480/') . $export[1];
                $outputPath_360 = public_path('videos/360/') . $export[1];
                $outputPath_240 = public_path('videos/240/') . $export[1];

                $checkIfExist = file_exists(public_path('videos/'.$export[1]));

                if(!$checkIfExist){
                    $inputfile = $videoDetails->videoUrl;
                }
                $this->info("INPUTFIEL $inputfile");
                $command = "$ffmpeg_path -i $inputfile -vf scale=854:360 -c:v libx264 -preset veryfast -crf 24 -c:a aac -b:a 128k $outputPath_360";
                $return_status = null;
                exec($command, $outputPath_360, $return_status);


                $videoDetails->update(['is_converted' => 1]);
                $this->info('UPDATED');

            } catch (\Exception $exception) {
                $this->info('ERROR: ' . $exception->getMessage());
            }
            
        });

        return Command::SUCCESS;
    }
}
