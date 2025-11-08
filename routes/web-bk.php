<?php

use App\Events\ChatMessageEvent;
use App\Events\LiveStreamStarted;
use App\Events\LiveStreamStopped;
use App\Http\Controllers\Admin;
use App\Http\Controllers\ChannelSubscriptionController;
use App\Http\Controllers\BankTransferController;
use App\Http\Controllers\BannedController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\PayPalWebhookController;
use App\Http\Controllers\ReccuringPaymentController;
use App\Http\Controllers\ShortVideoController;
use App\Http\Controllers\StoryController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\GlossarController;
use App\Http\Controllers\BrowseChannelsController;
use App\Http\Controllers\CryptoController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\BrowseCategoriesController;
use App\Http\Controllers\BrowseTagsController;
use App\Http\Controllers\CCBillController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InstallController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\PayoutController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TokensController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PayPalController;
use App\Http\Controllers\StreamerVerificationController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\TipsController;
use App\Http\Controllers\VideosController;
use App\Http\Controllers\TextFileController;
use App\Http\Middleware\BanMiddleware;
use App\Http\Middleware\HandleInertiaRequests;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('clear-cache',function(){
    \Log::info('TEST');
//    dd(App::getLocale());
    \Illuminate\Support\Facades\Artisan::call('optimize:clear');
    return 'Cache Cleared Successfully!';
});
Route::get('check-locale',function(){
//    return view('gg');
//    $imageDirectory = public_path('videos');
////        $directories = File::directories($imageDirectory);
//    $availableCategories = collect(File::files($imageDirectory))->map(function ($file) {
//        // Perform your logic here
//        return ['full_path' => public_path('videos/'.$file->getFilename()) , 'name' => $file->getFilename()]; // Example: Get the file name
//    });
//    dd(count($availableCategories));
    dd(App::currentLocale(),config('app.locales'));
});



//Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/', [VideosController::class, 'browse'])->name('home');
//Route::redirect('/','/browse-videos');

Route::post('/change-lang/{lang}', [HomeController::class, 'changeLang'])->name('change.lang');

//Route::get('/{videocategory?}{slug?}', [VideosController::class, 'browse'])->name('home');

Route::get('blog',[BlogController::class,'index'])->name('web.blogs.index');
Route::get('blog/{slug}',[BlogController::class,'indexInfo'])->name('web.blog.info');

Route::get('glossar',[GlossarController::class,'index'])->name('web.glossar.index');
Route::get('glossar/{slug}',[GlossarController::class,'indexInfo'])->name('web.glossar.info');

Route::get('story',[StoryController::class,'index'])->name('web.story.index');
Route::get('story/{slug}',[StoryController::class,'indexInfo'])->name('web.story.info');





// Live Streaming Controller    
Route::get('/channel/{user}', [ChannelController::class, 'userProfile'])->name('channel');
Route::get('/category/{id}', [BrowseCategoriesController::class, 'categoryProfile'])->name('category');
Route::get('/tag/{id}', [BrowseTagsController::class, 'tagProfile'])->name('tag');
Route::get('/channel/live-stream/{user}', [ChannelController::class, 'liveStream'])->name('channel.livestream');
Route::get('/settings/channel', [ChannelController::class, 'channelSettings'])->name('channel.settings');
Route::post('/settings/channel/update', [ChannelController::class, 'updateChannelSettings'])->name('channel.update-settings');
Route::get('/channel/{user}/followers', [ChannelController::class, 'followers'])->name('channel.followers');
Route::get('/channel/{user}/subscribers', [ChannelController::class, 'subscribers'])->name('channel.subscribers');
Route::get('/channel/{user}/videos', [ChannelController::class, 'channelVideos'])->name('channel.videos');
Route::get('/channel/{user}/models', [ChannelController::class, 'channelModels'])->name('channel.models');
Route::get('/category/{id}/videos', [BrowseCategoriesController::class, 'categoryVideos'])->name('category.videos');
Route::get('/live-channels', [BrowseChannelsController::class, 'liveNow'])->name('channels.live');
Route::get('/live-channel', [BrowseChannelsController::class, 'liveChannel'])->name('channels.liveNow');
Route::post('/channel/ban-user-from-room/{user}', [ChannelController::class, 'banUserFromRoom'])->name('channel.banUserFromRoom');
Route::get('/channel/banned-from-room/{user}', [ChannelController::class, 'bannedFromRoom'])->name('channel.bannedFromRoom');
Route::get('/channel/settings/banned-users', [ChannelController::class, 'bannedUsers'])->name('channel.bannedUsers');
Route::get('/channel/lif-user-ban/{roomban}', [ChannelController::class, 'liftUserBan'])->name('channel.liftUserBan');

// Streamer Verification
Route::get('/streamer/verify', [StreamerVerificationController::class, 'verifyForm'])->name('streamer.verify');
Route::get('/streamer/pending-verification', [StreamerVerificationController::class, 'pendingVerification'])->name('streamer.pendingVerification');
Route::post('/streamer/submit-verification', [StreamerVerificationController::class, 'submitVerification'])->name('streamer.submitVerification');
Route::post('/streamer/update-verification',[StreamerVerificationController::class,'updateVerification'])->name('streamer.updateVerification');


// Tips
Route::post('tip/send', [TipsController::class, 'sendTip'])->name('tips.send');

// Tier Settings
Route::get('/membership/channel/set-membership-tiers', [MembershipController::class, 'setMembershipTiers'])->name('membership.set-tiers');
Route::post('/membership/channel/add-tier', [MembershipController::class, 'addTier'])->name('membership.add-tier');
Route::get('/membership/channel/edit-tier/{tier}', [MembershipController::class, 'editTier'])->name('membership.edit-tier');
Route::post('/membership/channel/update-tier/{tier}', [MembershipController::class, 'updateTier'])->name('membership.update-tier');
Route::post('/membership/channel/delete-tier', [MembershipController::class, 'deleteTier'])->name('membership.delete-tier');
Route::post('/membership/save-thanks-message', [MembershipController::class, 'saveThanks'])->name('membership.save-thanks');

// Tokens
Route::any('/get-tokens', [TokensController::class, 'getTokens'])->name('token.packages');
Route::get('/tokens/select-gateway/{tokenPack}', [TokensController::class, 'selectGateway'])->name('token.selectGateway');





Route::post('submit-voucher',[TokensController::class,'submitVoucher'])->name('submit.voucher');

// PayPal
Route::get('paypal/purchase/{tokenPack}', [PayPalController::class, 'purchase'])->name('paypal.purchaseTokens');
Route::get('paypal/processing', [PayPalController::class, 'processing'])->name('paypal.processing');

// Stripe
Route::get('stripe/purchase/{tokenPack}', [StripeController::class, 'purchase'])->name('stripe.purchaseTokens');
Route::get('stripe/payment-intent/{tokenPack}', [StripeController::class, 'paymentIntent'])->name('stripe.paymentIntent');
Route::get('stripe/order-complete/{tokenSale}', [StripeController::class, 'processOrder'])->name('stripe.processOrder');

//RECURRING PAYEMENT
Route::post('/payment/setup-intent', [ReccuringPaymentController::class, 'createSetupIntent'])->name('reccur.setup.intent');
Route::post('/payment/save-payment-method', [ReccuringPaymentController::class, 'savePaymentMethod'])->name('reccur.save.method');

// Crypto
Route::get('crypto',[CryptoController::class,'index'])->name('crypto.index');

Route::get('ccbill/purchase/{tokenPack}', [CCBillController::class, 'purchase'])->name('ccbill.purchaseTokens');

// Bank Transfer
Route::get('bank-transfer/purchase/{tokenPack}', [BankTransferController::class, 'purchase'])->name('bank.purchaseTokens');
Route::post('bank-transfer/request/{tokenPack}', [BankTransferController::class, 'confirmPurchase'])->name('bank.confirmPurchase');
Route::get('bank-transfer/request-processing', [BankTransferController::class, 'requestProcessing'])->name('bank.requestProcessing');

Route::get('crypto-transfer/purchase/{tokenPack}', [CryptoController::class, 'purchaseView'])->name('crypto.purchaseTokens');
Route::post('get-wallet-address', [CryptoController::class, 'getWalletAddress'])->name('crypto.get.address');

// Categories
Route::get('/browse-channels/{category?}{slug?}', [BrowseChannelsController::class, 'browse'])->name('channels.browse');

Route::get('/browse-categories', [BrowseCategoriesController::class, 'browse'])->name('categories.browse');
Route::get('/browse-tags', [BrowseTagsController::class, 'browse'])->name('tag.browse');
Route::get('/tag-videos/{id}', [BrowseTagsController::class, 'tagVideos'])->name('tag.videos');

Route::get('/browse-models', [ModelController::class, 'browse'])->name('model.browse');
Route::get('model/{id}', [ModelController::class, 'modelProfile'])->name('model');
Route::get('model/{id}/videos', [ModelController::class, 'modelVideo'])->name('model.videos');

Route::get('/dashboard', [HomeController::class, 'redirectToDashboard'])->middleware(['auth', 'verified'])->name('dashboard');

// Account Settings
Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
Route::get('/followings', [ProfileController::class, 'followings'])->name('profile.followings');
Route::get('/my-tokens', [ProfileController::class, 'myTokens'])->name('profile.myTokens');
Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

// Payout Settings
Route::get('/withdrawals', [PayoutController::class, 'withdraw'])->name('payout.withdraw');
Route::post('/withdrawals/payout-request/save', [PayoutController::class, 'saveRequest'])->name('payout.saveRequest');
Route::post('/withdrawals/payout-request/cancel', [PayoutController::class, 'cancelRequest'])->name('payout.cancelRequest');
Route::post('/payout/save-settings', [PayoutController::class, 'saveSettings'])->name('payout.saveSettings');

// Subscription
Route::get('/my-subscribers', [SubscriptionController::class, 'mySubscribers'])->name('mySubscribers');
Route::get('/my-subscriptions', [SubscriptionController::class, 'mySubscriptions'])->name('mySubscriptions');
Route::get('/subscribe/channel/{channel}/tier/{tier}', [SubscriptionController::class, 'selectGateway'])->name('subscribe');
Route::get('/subscribe/confirm-subscription/channel/{user}/tier/{tier}', [ReccuringPaymentController::class, 'confirmSubscription'])->name('confirm-subscription');
Route::post('/subscribe/cancel-subscription/{id}', [ReccuringPaymentController::class, 'cancelSubscription'])->name('cancel-subscription');

// Videos
Route::get('/browse-videos/{videocategory?}{slug?}', [VideosController::class, 'browse'])->name('videos.browse');
Route::get('/video/{video}-{slug}', [VideosController::class, 'videoPage'])->name('video.page');




Route::get('/browse-short-videos', [ShortVideoController::class, 'browse'])->name('short.videos.browse');

Route::get('/browse-gallery', [GalleryController::class, 'browse'])->name('gallery.browse');
Route::get('/single-gallery/{slug}', [GalleryController::class, 'singleGallery'])->name('single.gallery');

Route::get('/single-video/{id}', [VideosController::class, 'singleVideoPage'])->name('video.single.page')->middleware(['guest']);


Route::get('/short-single-video/{id}', [ShortVideoController::class, 'shortVideoPage'])->name('short.video.single.page');
Route::post('video-download', [VideosController::class, 'videoDownload'])->name('video.download');

Route::post('/request-video', [VideosController::class, 'videoRequest'])->name('request.video');

Route::get('/video/unlock/{video}', [VideosController::class, 'unlockVideo'])->name('video.unlock');
Route::post('/video/purchase/{video}', [VideosController::class, 'purchaseVideo'])->name('video.purchase');
Route::post('increase-views/{video}', [VideosController::class, 'increaseViews'])->name('video.increaseViews');
Route::post('add-to-favorite/{id}', [VideosController::class, 'addToFavorite'])->name('video.addToFavorite');
Route::post('remove-from-favorite/{id}', [VideosController::class, 'removeFromFavorite'])->name('video.removeFromFavorite');
Route::get('/my-videos', [VideosController::class, 'myVideos'])->name('videos.ordered');
Route::get('/my-favorites', [VideosController::class, 'myFavorites'])->name('myFavorites');
Route::get('/videos-manager', [VideosController::class, 'videosManager'])->name('videos.list');

Route::get('/upload-videos', [VideosController::class, 'uploadVideos'])->name('videos.upload');
Route::get('/edit-video/{video}', [VideosController::class, 'editVideo'])->name('videos.edit');
Route::post('/update-video/{video}', [VideosController::class, 'updateVideo'])->name('videos.update');
Route::post('/save', [VideosController::class, 'save'])->name('videos.save');
Route::post('/delete', [VideosController::class, 'delete'])->name('videos.delete');

// start nitesh route



// start Audio nitesh route
Route::get('/browse-audio/{videocategory?}{slug?}', [VideosController::class, 'browseAudio'])->name('audio.browse');
Route::get('/single-audio/{id}', [VideosController::class, 'singleAudioPage'])->name('audio.single.page');
Route::get('/my-audio', [VideosController::class, 'myAudio'])->name('audio.ordered');
Route::get('/audio/{audio}-{slug}', [VideosController::class, 'audioPage'])->name('audio.page');
Route::get('/channel/{user}/audio', [ChannelController::class, 'channelAudio'])->name('channel.audio');
Route::get('/audio/unlock/{audio}', [VideosController::class, 'unlockAudio'])->name('audio.unlock');
// End Audio nitesh route


//Audio Route 
Route::get('/audio-manager', [VideosController::class, 'audioManager'])->name('audio.list');
Route::get('/upload-audio', [VideosController::class, 'uploadAudio'])->name('audio.upload');
Route::get('/edit-audio/{audio}', [VideosController::class, 'editAudio'])->name('audio.edit');
Route::post('/update-audio/{audio}', [VideosController::class, 'updateAudio'])->name('audio.update');
Route::post('/save-audio', [VideosController::class, 'saveAudio'])->name('audio.saveAudio');
Route::post('/delete-audio', [VideosController::class, 'deleteAudio'])->name('audio.deleteAudio');
//Route::get('/upload-audio', [VideosController::class, 'uploadAudio'])->name('audio.upload');


//Text File Route 
Route::get('/textFile-manager', [TextFileController::class, 'textFileManager'])->name('textFile.list');
Route::get('/upload-textFile', [TextFileController::class, 'uploadTextFile'])->name('textFile.upload');
Route::get('/edit-textFile/{textFile}', [TextFileController::class, 'editTextFile'])->name('textFile.edit');
Route::post('/update-textFile/{textFile}', [TextFileController::class, 'updateTextFile'])->name('textFile.update');
Route::post('/save-textFile', [TextFileController::class, 'saveTextFile'])->name('textFile.saveTextFile');
Route::post('/delete-textFile', [TextFileController::class, 'deleteTextFile'])->name('textFile.deleteTextFile');
//Route::get('/upload-textFile', [TextFileController::class, 'uploadTextFile'])->name('textFile.upload');



//End nitesh route




Route::get('/preview-manager', [VideosController::class, 'previewManager'])->name('preview.list');
Route::get('/upload-previews', [VideosController::class, 'uploadPreviews'])->name('preview.upload');
Route::post('/update-preview/{video}', [VideosController::class, 'previewUpdate'])->name('preview.update');
Route::post('/preview-save', [VideosController::class, 'previewSave'])->name('preview.save');
Route::post('/preview-delete', [VideosController::class, 'previewDelete'])->name('preview.delete');

Route::get('/gallery-manager', [VideosController::class, 'galleryManager'])->name('gallery.list');
Route::get('/upload-galleries', [VideosController::class, 'uploadGallery'])->name('gallery.upload');
Route::post('/update-gallery/{video}', [VideosController::class, 'galleryUpdate'])->name('gallery.update');
Route::post('/gallery-save', [VideosController::class, 'gallerySave'])->name('gallery.save');
Route::post('/gallery-delete', [VideosController::class, 'galleryDelete'])->name('gallery.delete');

Route::get('/model-manager', [ModelController::class, 'modelManager'])->name('model.list');
Route::get('/upload-model', [ModelController::class, 'uploadModel'])->name('model.upload');
Route::post('/update-model/{model}', [ModelController::class, 'modelUpdate'])->name('model.update');
Route::post('/model-save', [ModelController::class, 'modelSave'])->name('model.save');
Route::post('/model-delete', [ModelController::class, 'modelDelete'])->name('model.delete');


// Contact
Route::get('/get-in-touch', [ContactController::class, 'form'])->name('contact.form');
Route::post('/get-in-touch/process', [ContactController::class, 'processForm'])->name('contact.process');

// Notifications
Route::get('notifications', [NotificationsController::class, 'inbox'])->name('notifications.inbox');

// Admin login
Route::any('admin/login', [Admin::class, 'login'])->name('admin.login');

// Banned ip
Route::get('banned', [BannedController::class, 'banned'])->name('banned-ip');

// Installer
Route::get('install', [InstallController::class, 'install'])->name('installer')->withoutMiddleware([HandleInertiaRequests::class, BanMiddleware::class]);
Route::get('install/database', [InstallController::class, 'database'])->name('installer.db')->withoutMiddleware([HandleInertiaRequests::class, BanMiddleware::class]);
Route::post('install/save-database', [InstallController::class, 'saveDB'])->name('installer.saveDB')->withoutMiddleware([HandleInertiaRequests::class, BanMiddleware::class]);
Route::get('install/finished', [InstallController::class, 'finished'])->name('installer.finished');

// Pages Routes
Route::get('p/{page}', PageController::class)->name('page');



Route::get('paypal/Subscription/channel/{user}/tier/{tier}', [ChannelSubscriptionController::class, 'purchase'])->name('paypal.purchaseSubscription');
Route::any('paypal/subscription/redirect-to-processing', [ChannelSubscriptionController::class, 'redirect'])->name('paypal.subscription.redirect-to-processing');
Route::post('paypal/subscription/ipn', [ChannelSubscriptionController::class, 'ipn'])->name('paypal.subscription.ipn');
Route::get('paypal/subscription-success', [ChannelSubscriptionController::class, 'redirect'])->name('paypal.subscription.processing');
Route::get('webhook', [PayPalWebhookController::class, 'handleWebhook']);

// Auth Routes (login/register/etc.)
require __DIR__ . '/auth.php';