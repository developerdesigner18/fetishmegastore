<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;

class ImageController extends Controller
{
    public function resize($width, $path)
    {
        // Decode the path
        $path = urldecode($path);
        
        // Security check
        if (strpos($path, '..') !== false) {
            abort(404);
        }

        // Try to find the file in public directory
        $fullPath = public_path($path);
        
        if (!File::exists($fullPath)) {
            // If not in public, try storage/app/public (linked to public/storage)
            // But usually public_path covers it if it's in public folder.
            // If it's in storage/app/public but not linked correctly or we want to access it directly:
            $fullPath = storage_path('app/public/' . $path);
            
            if (!File::exists($fullPath)) {
                abort(404);
            }
        }

        // Define cache path
        $cachePath = public_path('cache/images/' . $width . '/' . $path);
        $cacheDir = dirname($cachePath);

        if (!File::exists($cacheDir)) {
            File::makeDirectory($cacheDir, 0755, true);
        }

        // Return cached file if exists
        if (File::exists($cachePath)) {
            return response()->file($cachePath);
        }

        // Resize and save
        try {
            $img = Image::make($fullPath);
            
            $img->resize($width, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });

            $img->save($cachePath);

            return response()->file($cachePath);
        } catch (\Exception $e) {
            abort(404);
        }
    }
}
