<?php

namespace App\Console\Commands;

use App\Models\ContentWatchHistory;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ClearContentWatchHistory extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clear-past-content-watch-history';

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
        ContentWatchHistory::whereDate('date','<',Carbon::today()->format('Y-m-d'))->delete();

        return Command::SUCCESS;
    }
}
