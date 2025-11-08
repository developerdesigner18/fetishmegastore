<?php

namespace App\Helpers;

use FFMpeg\FFProbe;

class VideoMetaHelper
{
    /**
     * Extract metadata from video file
     *
     * @param string $absoluteVideoPath
     * @return array
     */
    public static function extractVideoMeta($absoluteVideoPath)
    {   
       
        $ffprobe = FFProbe::create();
        $duration_seconds = $ffprobe->format($absoluteVideoPath)->get('duration');
 
        $duration = gmdate("H:i:s", $duration_seconds);

        $video_stream = $ffprobe->streams($absoluteVideoPath)->videos()->first();
        $width = $video_stream->get('width');
        $height = $video_stream->get('height');
        $resolution = "{$width}x{$height}";

        return [
            'duration' => $duration,
            'duration_seconds' => (int) $duration_seconds,
            'width' => $width,
            'height' => $height,
            'resolution' => $resolution
        ];
    }
}
