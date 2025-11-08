<?php

namespace App\Console\Commands;

use App\Models\Video;
use Illuminate\Console\Command;
use Illuminate\Http\File;

class CreateGIF extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create-gif';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'creating video to GIF';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('STARTED');
//                ffmpeg -ss 30 -t 3 -i input.mp4 \
//            -vf "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
//            -loop 0 output.gif

//        ffmpeg -y -i inputfile.mp4 -ss 00:00:10 -filter_complex "[0:v]select='lt(mod(t,${duration}/10),1)',setpts=N/(FRAME_RATE*TB),scale=320:-2" -an outputfile.mp4

        $getNotConvertedVideos = Video::where('is_gif', 0)->orderBy('id','desc')->get();
//        $getNotConvertedVideos = Video::where('slug','lisa-marie-privat-teenie-girls-lezdom')->where('is_gif', 0)->orderBy('id','desc')->get();
//        dd($getNotConvertedVideos);
        $getNotConvertedVideos->map(function ($videoDetails) {
            $this->info('video: ' . $videoDetails->video);
            try {
                /* $ffmpeg_path = 'ffmpeg ';

                 $inputfile = asset('videos/DETECTIVECONAN.mp4');


                 $export = explode("/", 'videos/DETECTIVECONAN.mp4');

     //            $outputPath_GIF = public_path('videos/GIF/') . $export[1];
                 $outputPath_GIF = public_path('videos/GIF/') . 'GGWP.gif';


     //            $command = "$ffmpeg_path -i $inputfile -vf scale=854:360 -c:v libx264 -preset veryfast -crf 24 -c:a aac -b:a 128k $outputPath_360";

     //            $code = "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse";
     //            $command = "$ffmpeg_path -ss 30 -t 3 -i $inputfile \ -vf $code \ -loop 0 $outputPath_GIF";

     //            $code = "[0:v]select='lt(mod(t,15/10),1)',setpts=N/(FRAME_RATE*TB),scale=320:-2";
     //            $command = `$ffmpeg_path. '-y -i $inputfile -ss 00:00:10 -filter_complex "[0:v]select='lt(mod(t,15/10),1)',setpts=N/(FRAME_RATE*TB),scale=320:-2" -an $outputPath_GIF`;

     //            $command = "$ffmpeg_path -i $inputfile -ss 00:00:03 -t 00:00:08 -async 1 $outputPath_GIF";

                 $command = "$ffmpeg_path -ss 25.0 -t 5 -i $inputfile -f gif $outputPath_GIF";


                 $this->info("COMMAND: ".$command);


                 $return_status = null;
                 exec($command, $outputPath_GIF, $return_status);*/


                $input_video = asset($videoDetails->video);
                $export = explode("/", $videoDetails->video);
                $output_gif = public_path('videos/GIF/') . explode('.', $export[1])[0] . '.gif';

                $checkIfExist = file_exists(public_path('videos/'.explode('.', $export[1])[0]));

                if(!$checkIfExist){
                    $input_video = $videoDetails->videoUrl;
                }
//                dd($input_video);

                $segments = [
                    ['start' => 10, 'duration' => 2],
                    ['start' => 45, 'duration' => 2],
                    ['start' => 61, 'duration' => 1]
                ];

                foreach ($segments as $index => $segment) {
                    $segment_file = "segment{$index}.mp4";
                    $command = sprintf(
                        'ffmpeg -ss %d -t %d -i %s -c copy -an %s',
                        $segment['start'],
                        $segment['duration'],
                        escapeshellarg($input_video),
                        escapeshellarg($segment_file)
                    );
                    exec($command);
                }

                $concat_list = "concat_list.txt";
                file_put_contents($concat_list, implode("\n", array_map(function ($index) {
                    return "file 'segment{$index}.mp4'";
                }, array_keys($segments))));

                $concatenated_file = 'concatenated.mp4';
                $command = sprintf(
                    'ffmpeg -f concat -safe 0 -i %s -c copy %s',
                    escapeshellarg($concat_list),
                    escapeshellarg($concatenated_file)
                );
                exec($command);

                $command = sprintf(
                    'ffmpeg -i %s -vf "fps=15,scale=360:-1:flags=lanczos" -gifflags +transdiff -y %s',
                    escapeshellarg($concatenated_file),
                    escapeshellarg($output_gif)
                );
                exec($command);


                foreach (array_keys($segments) as $index) {
                    unlink("segment{$index}.mp4");
                }
                unlink($concat_list);
                unlink($concatenated_file);

                $videoDetails->update(['is_gif' => 1]);
                $this->info('GIF created successfully!');

            } catch (\Exception $exception) {
                $this->info('ERROR: ' . $exception->getMessage());
            }
        });
        $this->info('FINISHED');
        return Command::SUCCESS;
    }
}
