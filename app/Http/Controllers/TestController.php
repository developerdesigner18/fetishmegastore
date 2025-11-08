<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Audio;
use App\Models\Gallery;
use App\Models\ShortVideo;
use App\Models\Video;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TestController extends Controller
{
    /**
     * Common logic to update views for a given model.
     * यह अब मल्टीपल रैंडम मॉडल्स को अपडेट करेगा।
     */
    private function updateRandomViews($modelCollection, $modelName, $min = 2500, $max = 4000, $updateCount = 5)
    {
        if ($modelCollection->isEmpty()) {
            return "No {$modelName} found to update views.";
        }

        $updatedCount = 0;
        $logMessages = [];

        $modelsToUpdate = $modelCollection->count() > $updateCount ? $modelCollection->random($updateCount) : $modelCollection->shuffle();

        foreach ($modelsToUpdate as $model) {
            $currentViews = $model->views;
            $newRandomViews = mt_rand($min, $max);

            if (strlen((string)$currentViews) < 4 || (strlen((string)$currentViews) >= 4 && strlen((string)$newRandomViews) >= 4 && $newRandomViews > $currentViews)) {
                $model->views = $newRandomViews;
                $model->save();
                $logMessages[] = "Views updated for ID {$model->id} from {$currentViews} to {$newRandomViews}.";
                $updatedCount++;
            } else {
                $logMessages[] = "Views for ID {$model->id} not updated (already 4+ chars or new value not higher). Current: {$currentViews}.";
            }
        }

        return "Updated {$updatedCount} out of {$modelsToUpdate->count()} {$modelName} records. " . implode(' ', $logMessages);
    }

    /**
     * Increase views for multiple random Audios.
    */
    public function updateAudioViews(Request $request)
    {
        try {
            $audios = Audio::get();
            $updateCount = $request->query('count', 5000); 
            $result = $this->updateRandomViews($audios, 'Audio', 2500, 4000, $updateCount);

            Log::info("Test: Audio views update: {$result}");
            return response()->json(['status' => true, 'message' => $result]);

        } catch (\Exception $e) {
            Log::error("Test: Error updating audio views: " . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'Error updating audio views.'], 500);
        }
    }

    /**
     * Increase views for multiple random Galleries.
    */
    public function updateGalleryViews(Request $request)
    {
        try {
            $galleries = Gallery::get();
            $updateCount = $request->query('count', 5000);
            $result = $this->updateRandomViews($galleries, 'Gallery', 2500, 4000, $updateCount);

            Log::info("Test: Gallery views update: {$result}");
            return response()->json(['status' => true, 'message' => $result]);

        } catch (\Exception $e) {
            Log::error("Test: Error updating gallery views: " . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'Error updating gallery views.'], 500);
        }
    }

    /**
     * Increase views for multiple random Short Videos.
    */
    public function updateShortVideoViews(Request $request)
    {
        try {
            $shortVideos = ShortVideo::get();
            $updateCount = $request->query('count', 5000);
            $result = $this->updateRandomViews($shortVideos, 'Short Video', 2500, 4000, $updateCount);

            Log::info("Test: Short Video views update: {$result}");
            return response()->json(['status' => true, 'message' => $result]);

        } catch (\Exception $e) {
            Log::error("Test: Error updating short video views: " . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'Error updating short video views.'], 500);
        }
    }

    /**
     * Increase views for multiple random Videos.
    */
    public function updateVideoViews(Request $request)
    {
        try {
            $videos = Video::get();
            $updateCount = $request->query('count', 5000);
            $result = $this->updateRandomViews($videos, 'Video', 2500, 4000, $updateCount);
  
            Log::info("Test: Video views update: {$result}");
            return response()->json(['status' => true, 'message' => $result]);

        } catch (\Exception $e) {
            Log::error("Test: Error updating video views: " . $e->getMessage());
            return response()->json(['status' => false, 'message' => 'Error updating video views.'], 500);
        }
    }
}