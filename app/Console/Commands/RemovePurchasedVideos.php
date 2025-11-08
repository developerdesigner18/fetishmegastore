<?php

namespace App\Console\Commands;

use App\Models\RemovedSale;
use App\Models\User;
use App\Models\VideoSales;
use Carbon\Carbon;
use Illuminate\Console\Command;

class RemovePurchasedVideos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'removepurchasedvideos';

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
        $users = User::get();
        // $users = User::where('id',21)->get();

        $users->map(function ($userDetails, $index) {
            $this->info("user $index");
            $purchsedVideos = $userDetails->purchasedVideos()->get();
            $purchsedVideos->map(function ($purchaseDetails, $index) use ($userDetails) {

                $this->info("PROCESSING $index");
                $this->info("DATE $purchaseDetails->created_at");

                $created = Carbon::parse($purchaseDetails->created_at);
                $now = Carbon::now();

                $howmanyDays = $created->diffInDays($now);

                $this->warn("howmany days $howmanyDays");

                if ($howmanyDays > 31) {
                    try {
                        $this->alert("DELETING");

                        RemovedSale::create([
                            'video_id' => $purchaseDetails->id,
                            'streamer_id'=> $purchaseDetails->user_id,
                            'user_id'=> $userDetails->id,
                            'price'=> $purchaseDetails->price,
                        ]);

                        VideoSales::where('video_id',$purchaseDetails->id)->where('user_id',$userDetails->id)->delete();
                    } catch (\Exception $exception) {
                        $this->error($exception->getMessage());
                    }

                }

            });

        });
//        return Command::SUCCESS;
    }
}
