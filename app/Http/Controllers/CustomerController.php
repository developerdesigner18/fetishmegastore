<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Video;

class CustomerController extends Controller
{
    protected $existingUsers = [];
    protected $totalRows = 0;

    public function createGif(Request $request)
    {
        Log::info('STARTED');

        $getNotConvertedVideos = Video::where('is_gif', 0)->orderBy('id','desc')->get();

        $getNotConvertedVideos->map(function ($videoDetails) {
            Log::info('Processing video: ' . $videoDetails->video);
            
            try {
                // Fix 1: Use the actual file path, not asset() for local files
                $input_video = public_path($videoDetails->video);
                
                // Fix 2: Better path handling
                $videoPathInfo = pathinfo($videoDetails->video);
                $output_gif = public_path('videos/GIF/') . $videoPathInfo['filename'] . '.gif';
                
                // Fix 3: Create GIF directory if it doesn't exist
                $gifDir = public_path('videos/GIF/');
                if (!file_exists($gifDir)) {
                    mkdir($gifDir, 0755, true);
                }

                Log::info("Input video path: " . $input_video);
                Log::info("Output GIF path: " . $output_gif);

                // Fix 4: Check if input file exists
                if (!file_exists($input_video)) {
                    Log::warning("Input video file not found: " . $input_video);
                    
                    // Try using videoUrl if local file doesn't exist
                    if (!empty($videoDetails->videoUrl)) {
                        $input_video = $videoDetails->videoUrl;
                        Log::info("Using videoUrl instead: " . $input_video);
                    } else {
                        Log::error("No valid video source found for video ID: " . $videoDetails->id);
                        return;
                    }
                }

                $segments = [
                    ['start' => 10, 'duration' => 2],
                    ['start' => 45, 'duration' => 2],
                    ['start' => 61, 'duration' => 1]
                ];

                $tempFiles = [];

                // Fix 5: Create segments with better error handling
                foreach ($segments as $index => $segment) {
                    $segment_file = "segment{$index}.mp4";
                    $tempFiles[] = $segment_file;
                    
                    $command = sprintf(
                        'ffmpeg -ss %d -t %d -i %s -c copy -an %s 2>&1',
                        $segment['start'],
                        $segment['duration'],
                        escapeshellarg($input_video),
                        escapeshellarg($segment_file)
                    );
                    
                    Log::info("Executing segment command: " . $command);
                    $output = [];
                    exec($command, $output, $returnCode);
                    
                    if ($returnCode !== 0) {
                        Log::error("FFmpeg segment creation failed: " . implode("\n", $output));
                        throw new \Exception("Failed to create segment {$index}");
                    }
                    
                    // Check if segment file was created
                    if (!file_exists($segment_file)) {
                        throw new \Exception("Segment file not created: {$segment_file}");
                    }
                }

                // Fix 6: Create concat list
                $concat_list = "concat_list.txt";
                $tempFiles[] = $concat_list;
                
                $concat_content = implode("\n", array_map(function ($index) {
                    return "file 'segment{$index}.mp4'";
                }, array_keys($segments)));
                
                file_put_contents($concat_list, $concat_content);

                // Fix 7: Concatenate segments
                $concatenated_file = 'concatenated.mp4';
                $tempFiles[] = $concatenated_file;
                
                $command = sprintf(
                    'ffmpeg -f concat -safe 0 -i %s -c copy %s 2>&1',
                    escapeshellarg($concat_list),
                    escapeshellarg($concatenated_file)
                );
                
                Log::info("Executing concat command: " . $command);
                $output = [];
                exec($command, $output, $returnCode);
                
                if ($returnCode !== 0) {
                    Log::error("FFmpeg concatenation failed: " . implode("\n", $output));
                    throw new \Exception("Failed to concatenate segments");
                }

                // Fix 8: Create GIF with better parameters
                $command = sprintf(
                    'ffmpeg -i %s -vf "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 -y %s 2>&1',
                    escapeshellarg($concatenated_file),
                    escapeshellarg($output_gif)
                );
                
                Log::info("Executing GIF command: " . $command);
                $output = [];
                exec($command, $output, $returnCode);
                
                if ($returnCode !== 0) {
                    Log::error("FFmpeg GIF creation failed: " . implode("\n", $output));
                    throw new \Exception("Failed to create GIF");
                }

                // Fix 9: Verify GIF was created
                if (!file_exists($output_gif)) {
                    throw new \Exception("GIF file was not created: " . $output_gif);
                }

                $gifSize = filesize($output_gif);
                if ($gifSize === 0) {
                    throw new \Exception("GIF file is empty: " . $output_gif);
                }

                Log::info("GIF created successfully! Size: " . $gifSize . " bytes");

                // Fix 10: Clean up temporary files
                foreach ($tempFiles as $tempFile) {
                    if (file_exists($tempFile)) {
                        unlink($tempFile);
                    }
                }

                $videoDetails->update(['is_gif' => 1]);
                Log::info('GIF created and database updated successfully!');

            } catch (\Exception $exception) {
                Log::error('ERROR processing video ID ' . $videoDetails->id . ': ' . $exception->getMessage());
                
                // Clean up any temporary files that might have been created
                $tempFiles = ['segment0.mp4', 'segment1.mp4', 'segment2.mp4', 'concat_list.txt', 'concatenated.mp4'];
                foreach ($tempFiles as $tempFile) {
                    if (file_exists($tempFile)) {
                        unlink($tempFile);
                    }
                }
            }
        });
        
        Log::info('FINISHED');
        
        return response()->json([
            'message' => 'GIF creation process completed',
            'processed_count' => $getNotConvertedVideos->count()
        ]);
    }

    public function createGifManual(Request $request){
        //prd($request->id);
        createGif($request->id);
        prd('success');
    }
}