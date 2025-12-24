<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\AdminEbookController;
use App\Http\Controllers\ShortVideoController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\NewsLetterController;
use App\Http\Controllers\PromoBannerController;
use App\Http\Controllers\PromoPreviewVideosController;
use App\Http\Controllers\StoryController;
use App\Http\Controllers\GlossarController;
use App\Http\Controllers\PaypalMethodsController;
use App\Http\Controllers\StreamerVerificationController;
use App\Http\Controllers\AffiliateVendorController;
use App\Http\Controllers\AffiliateTrackController;
use App\Http\Controllers\WithdrawalController;
use Illuminate\Support\Facades\Route;


// admin panel routes
Route::get('admin', [Admin::class, 'dashboard'])->name('admin.dashboard');
Route::post('generate-sitemap', [Admin::class, 'generateSitemap'])->name('admin.generate.sitemap');


//start nitesh route
Route::get('admin/payment-methods/', [PaypalMethodsController::class, 'index'])->name('paypal-method.index');
Route::get('admin/payment-method/add-view', [PaypalMethodsController::class, 'createPaypalMethod'])->name('payment_method.add.view');
Route::post('admin/payment-method/add', [PaypalMethodsController::class, 'addPaypalMethod'])->name('payment_method.add');
Route::get('admin/payment-method/edit/{id}', [PaypalMethodsController::class, 'editPaypalMethod'])->name('payment_method.edit.view');
Route::post('admin/payment-method/updated/{id}', [PaypalMethodsController::class, 'updatePaypalMethod'])->name('payment_method.update');
Route::get('admin/payment-method/delete/{id}', [PaypalMethodsController::class, 'deletePaypalMethod'])->name('payment_method.delete');
//end nitesh route

// Vendors Related
Route::get('admin/users', [Admin::class, 'users']);


Route::get('admin/user/{user}/add-tokens', [Admin::class, 'adjustTokenForm']);
Route::post('admin/save-token-balance/{user}', [Admin::class, 'saveTokenBalance']);
Route::get('admin/streamers', [Admin::class, 'streamers'])->name('admin.streamers');
Route::post('/admin/streamers/{id}', [StreamerVerificationController::class, 'updateFeaturedVerified'])->name('streamers.updateFeaturedVerified');


Route::get('admin/approve-streamer', [Admin::class, 'approveStreamer'])->name('admin.approveStreamer');
Route::get('admin/loginAs/{vendorId}', [Admin::class, 'loginAsVendor']);
Route::get('admin/add-plan/{vendorId}', [Admin::class, 'addPlanManually']);
Route::post('admin/add-plan/{vendorId}', [Admin::class, 'addPlanManuallyProcess']);
Route::get('admin/users/setadmin/{user}', [Admin::class, 'setAdminRole']);
Route::get('admin/users/unsetadmin/{user}', [Admin::class, 'unsetAdminRole']);
Route::get('admin/users/ban/{user}', [Admin::class, 'banUser']);
Route::get('admin/users/unban/{user}', [Admin::class, 'unbanUser']);
Route::get('admin/edit-user/{user}', [Admin::class, 'editUser']);
Route::post('admin/update-user/{user}', [Admin::class, 'updateUser']);

Route::get('admin/submitted_vouchers', [Admin::class, 'submittedVouchers']);
//start new route
Route::delete('admin/delete-item/{id}', [Admin::class, 'destroy'])->name('item.destroy');
//End new route
Route::post('admin/approve-voucher', [Admin::class, 'approveVoucher'])->name('approve.voucher');

//Models

Route::get('admin/models', [Admin::class, 'models']);
Route::get('admin/model/new', [Admin::class, 'addNewModelView']);
Route::post('admin/model/add', [Admin::class, 'addNewModel'])->name('admin.add.video');
Route::get('admin/model/edit/{id}', [Admin::class, 'editModelView']);
Route::post('admin/model/update', [Admin::class, 'updateModel'])->name('admin.update.video');

Route::post('delete-model-image', [Admin::class, 'deleteModelGalleryImage'])->name('delete.model.image');

Route::get('admin/requested-videos', [Admin::class, 'requestedVideos']);
Route::post('admin/send-request-link', [Admin::class, 'sendRequestLink'])->name('send.request.link');

Route::get('admin/streamer-bans', [Admin::class, 'streamerBans'])->name('admin.streamerBans');

// Payout Requests
Route::get('admin/payout-requests', [Admin::class, 'payoutRequests']);
Route::get('admin/payout/mark-as-paid/{withdrawal}', [Admin::class, 'markPaymentRequestAsPaid']);

// Videos
Route::get('admin/videos', [Admin::class, 'videos']);
Route::get('admin/videos/create', [Admin::class, 'createVideo'])->name('admin.videos.create');
Route::post('admin/videos/store', [Admin::class, 'storeVideo'])->name('admin.videos.store');
Route::get('admin/videos/edit/{video}', [Admin::class, 'editVideo']);
Route::post('admin/videos/save/{video}', [Admin::class, 'saveVideo']);

// Audios
Route::get('admin/audios', [Admin::class, 'audio'])->name('admin.audios');
Route::get('admin/audios/edit/{audio}', [Admin::class, 'editAudio'])->name('admin.audios.edit');
Route::post('admin/audios/save/{audio}', [Admin::class, 'saveAudio']);

// ebooks
Route::get('admin/ebooks', [AdminEbookController::class, 'ebook'])->name('admin.ebooks');
Route::get('admin/ebooks/edit/{ebook}', [AdminEbookController::class, 'editEbook'])->name('admin.ebooks.edit');
Route::post('admin/ebooks/save/{ebook}', [AdminEbookController::class, 'saveEbook']);
Route::get('admin/ebooks/create', [AdminEbookController::class, 'createEbook'])->name('admin.ebooks.create');
Route::post('admin/ebooks', [AdminEbookController::class, 'storeEbook'])->name('admin.ebooks.store');

Route::get('admin/short-videos', [ShortVideoController::class, 'shortVideos'])->name('short.videos.index');
Route::get('admin/add-short-videos', [ShortVideoController::class, 'addVideo'])->name('add.short.videos');
Route::get('admin/edit-short-videos/{id}', [ShortVideoController::class, 'editVideo'])->name('edit.short.videos');
Route::post('admin/save-short-videos', [ShortVideoController::class, 'saveVideo'])->name('save.short.videos');
Route::post('admin/update-short-videos', [ShortVideoController::class, 'updateVideo'])->name('update.short.videos');
Route::get('admin/delete-short-videos/{id}', [ShortVideoController::class, 'deleteVideo'])->name('delete.short.videos');
Route::get('admin/short-videos/search', [ShortVideoController::class, 'searchShortVideos'])->name('search.short.videos');


Route::get('admin/gallery', [GalleryController::class, 'adminGallery'])->name('admin.gallery.index');
Route::get('admin/add-gallery', [GalleryController::class, 'addView'])->name('gallery.add.view');
Route::get('admin/edit-gallery/{id}', [GalleryController::class, 'editView'])->name('gallery.edit.view');
Route::post('admin/save-gallery', [GalleryController::class, 'saveGallery'])->name('save.gallery');
Route::post('admin/update-gallery', [GalleryController::class, 'updateGallery'])->name('update.gallery');
Route::get('admin/delete-gallery/{id}', [GalleryController::class, 'deleteGallery'])->name('delete.gallery');

Route::post('admin/delete-gallery-image', [GalleryController::class, 'deleteGalleryImage'])->name('delete.gallery.image');

Route::get('admin/adBlocks', [Admin::class, 'adBlock']);
Route::post('admin/add_block', [Admin::class, 'add_block']);

// Tokens
Route::get('admin/token-sales', [Admin::class, 'tokenSales']);
Route::get('admin/token-packs', [Admin::class, 'tokenPacks']);
Route::get('admin/add-token-sale', [Admin::class, 'addTokenSale'])->name('admin.addTokenSale');
Route::post('admin/save-token-sale/{user}', [Admin::class, 'saveTokenSale']);
Route::get('admin/create-token-pack', [Admin::class, 'createTokenPack']);
Route::post('admin/add-token-pack', [Admin::class, 'addTokenPack']);
Route::get('admin/edit-token-pack/{tokenPack}', [Admin::class, 'editTokenPack']);
Route::post('admin/update-token-pack/{tokenPack}', [Admin::class, 'updateTokenPack']);


// Subscriptions related
Route::get('admin/subscriptions', [Admin::class, 'subscriptions']);
Route::get('admin/edit-subscription/{subscription}', [Admin::class, 'editSubscription']);
Route::get('admin/delete-subscription/{subscription}', [Admin::class, 'deleteSubscription']);
Route::post('admin/update-subscription/{subscription}', [Admin::class, 'updateSubscription']);

// Tips Related
Route::get('admin/tips', [Admin::class, 'tips']);


// Category Related
Route::get('admin/categories', [Admin::class, 'categories_overview']);
Route::post('admin/add_category', [Admin::class, 'add_category']);
Route::post('admin/update_category', [Admin::class, 'update_category']);
Route::get('admin/video-categories', [Admin::class, 'video_categories']);
Route::post('admin/add_video_category', [Admin::class, 'add_video_category']);
Route::post('admin/update_video_category', [Admin::class, 'update_video_category']);

Route::get('admin/tag', [Admin::class, 'tags']);
Route::post('admin/add_tag', [Admin::class, 'add_tag']);
Route::post('admin/update_tag', [Admin::class, 'update_tag']);

// CMS
Route::get('admin/cms', [Admin::class, 'pages'])->name('admin-cms');
Route::post('admin/cms', [Admin::class, 'create_page']);
Route::get('admin/cms-edit-{page}', [Admin::class, 'showUpdatePage']);
Route::post('admin/cms-edit-{page}', [Admin::class, 'processUpdatePage']);
Route::get('admin/cms-delete/{page}', [Admin::class, 'deletePage']);
Route::post('admin/cms/upload-image', [Admin::class, 'uploadImageFromCMS']);

// Payments Setup
Route::get('admin/configuration/payment', [Admin::class, 'paymentsSetup']);
Route::post('admin/configuration/payment', [Admin::class, 'paymentsSetupProcess']);

// Admin config logins
Route::get('admin/config-logins', [Admin::class, 'configLogins']);
Route::post('admin/save-logins', [Admin::class, 'saveLogins']);

Route::get('admin/configuration', [Admin::class, 'configuration']);
Route::get('admin/configuration/streaming', [Admin::class, 'streamingConfig']);
Route::post('admin/configuration/streaming', [Admin::class, 'saveStreamingConfig']);
Route::get('admin/configuration/chat', [Admin::class, 'chatConfig']);
Route::post('admin/configuration/chat', [Admin::class, 'saveChatConfig']);
Route::post('admin/configuration', [Admin::class, 'configurationProcess']);

Route::get('admin/configuration/video-settings', [Admin::class, 'videoSettingsConfig']);
Route::post('admin/configuration/video-settings', [Admin::class, 'saveVideoSettingsConfig']);

Route::get('admin/configuration/unsubscribe-reasons', [Admin::class, 'unsubscribeReasons']);
Route::post('admin/configuration/unsubscribe-reasons', [Admin::class, 'saveUnsubscribeReasons']);


// Mail Server Configuration
Route::get('admin/mailconfiguration', [Admin::class, 'mailConfiguration']);
Route::post('admin/mailconfiguration', [Admin::class, 'updateMailConfiguration']);
Route::get('admin/mailtest', [Admin::class, 'mailtest']);

// Cloud settings
Route::get('admin/cloud', [Admin::class, 'cloudSettings']);
Route::post('admin/save-cloud-settings', [Admin::class, 'saveCloudSettings']);

//Blog

Route::get('admin/blog/', [BlogController::class, 'adminIndex'])->name('blog.index');
Route::get('admin/blog/add-view', [BlogController::class, 'createBlog'])->name('blog.add.view');
Route::post('admin/blog/add', [BlogController::class, 'addBlog'])->name('blog.add');
Route::get('admin/blog/edit/{id}', [BlogController::class, 'editBlog'])->name('blog.edit.view');
Route::post('admin/blog/updated/{id}', [BlogController::class, 'updateBlog'])->name('blog.update');
Route::get('admin/blog/delete/{id}', [BlogController::class, 'deleteBlog'])->name('blog.delete');



//FAQ
Route::get('admin/faq/', [FaqController::class, 'adminIndex'])->name('faq.index');
Route::get('admin/faq/add-view', [FaqController::class, 'createFaq'])->name('faq.add.view');
Route::post('admin/faq/add', [FaqController::class, 'addFaq'])->name('faq.add');
Route::get('admin/faq/edit/{id}', [FaqController::class, 'editFaq'])->name('faq.edit.view');
Route::post('admin/faq/updated/{id}', [FaqController::class, 'updateFaq'])->name('faq.update');
Route::get('admin/faq/delete/{id}', [FaqController::class, 'deleteFaq'])->name('faq.delete');

Route::post('/admin/faq/update-order', [FaqController::class, 'updateOrder'])->name('faq.update.order');


//newsletter
Route::get('admin/newsletter/', [NewsLetterController::class, 'adminIndex'])->name('newsletter.index');
Route::get('admin/newsletter/add-view', [NewsLetterController::class, 'createNewsletter'])->name('newsletter.add.view');
Route::post('admin/newsletter/add', [NewsLetterController::class, 'addNewsletter'])->name('newsletter.add');
Route::get('admin/newsletter/edit/{id}', [NewsLetterController::class, 'editNewsletter'])->name('newsletter.edit.view');
Route::post('admin/newsletter/updated/{id}', [NewsLetterController::class, 'updateNewsletter'])->name('newsletter.update');
Route::get('admin/newsletter/delete/{id}', [NewsLetterController::class, 'deleteNewsletter'])->name('newsletter.delete');

Route::get('admin/unsubscribe-users', [NewsLetterController::class, 'unsubscribeStatus'])->name('newsletter.unsubscribeStatus');
Route::post('/admin/user-subscription-status', [NewsLetterController::class, 'updateUserSubscriptionStatus'])->name('admin.userSubscriptionStatus');

//Affiliate
Route::get('admin/affiliate/', [AffiliateVendorController::class, 'index'])->name('affiliate.index');

//Route::get('admin/affiliate-pending/', [AffiliateVendorController::class, 'affiliatePending'])->name('affiliate.affiliatePending');
Route::get('admin/affiliate-pending', [AffiliateVendorController::class, 'affiliatePending'])->name('affiliate.affiliatePending');

Route::post('admin/affiliate-pending-status', [AffiliateVendorController::class, 'affiliatePendingStatus'])->name('affiliate.affiliatePendingStatus');


// Route::get('admin/newsletter/add-view', [NewsLetterController::class, 'createNewsletter'])->name('newsletter.add.view');
// Route::post('admin/newsletter/add', [NewsLetterController::class, 'addNewsletter'])->name('newsletter.add');
// Route::get('admin/newsletter/edit/{id}', [NewsLetterController::class, 'editNewsletter'])->name('newsletter.edit.view');
// Route::post('admin/newsletter/updated/{id}', [NewsLetterController::class, 'updateNewsletter'])->name('newsletter.update');
// Route::get('admin/newsletter/delete/{id}', [NewsLetterController::class, 'deleteNewsletter'])->name('newsletter.delete');


Route::get('admin/email-templating/', [NewsLetterController::class, 'adminEmailTemplating'])->name('EmailTemplating.admin');
Route::post('/admin/get-filtered-users', [NewsLetterController::class, 'getFilteredUsers'])->name('admin.getFilteredUsers');
//Route::post('/admin/send-newsletter', [NewsLetterController::class, 'sendNewsletter'])->name('admin.sendNewsletter');
Route::post('/send-newsletter', [NewsletterController::class, 'sendNewsletter'])->name('admin.sendNewsletter');

//Glossar

Route::get('admin/glossar/', [GlossarController::class, 'adminIndex'])->name('glossar.index');
Route::get('admin/glossar/add-view', [GlossarController::class, 'createGlossar'])->name('glossar.add.view');
Route::post('admin/glossar/add', [GlossarController::class, 'addGlossar'])->name('glossar.add');
Route::get('admin/glossar/edit/{id}', [GlossarController::class, 'editGlossar'])->name('glossar.edit.view');
Route::post('admin/glossar/updated/{id}', [GlossarController::class, 'updateGlossar'])->name('glossar.update');
Route::get('admin/glossar/delete/{id}', [GlossarController::class, 'deleteGlossar'])->name('glossar.delete');

//Stories

Route::get('admin/story/', [StoryController::class, 'adminIndex'])->name('story.index');
Route::get('admin/story/add-view', [StoryController::class, 'createStory'])->name('story.add.view');
Route::post('admin/story/add', [StoryController::class, 'addStory'])->name('story.add');
Route::get('admin/story/edit/{id}', [StoryController::class, 'editStory'])->name('story.edit.view');
Route::post('admin/story/updated/{id}', [StoryController::class, 'updateStory'])->name('story.update');
Route::get('admin/story/delete/{id}', [StoryController::class, 'deleteStory'])->name('story.delete');


Route::get('admin/users-purchase-history', [Admin::class, 'userPurchaseHistory'])->name('users.purchase.history');

Route::get('admin/recommended-videos', [Admin::class, 'recommendedVideos']);
Route::post('admin/add_recommended', [Admin::class, 'addRecommended']);


//promo banner Banner
Route::get('admin/promo-tools/', [PromoBannerController::class, 'index'])->name('promoTools.index');
Route::get('admin/promo-tools/add-promo-banner', [PromoBannerController::class, 'createPromoBanner'])->name('promoTools.add.PromoBanner');
Route::post('admin/promo-tools/store-promo-banner', [PromoBannerController::class, 'storePromoBanner'])->name('promoTools.store');
Route::get('admin/promo-tools/edit/{id}', [PromoBannerController::class, 'editPromoBanner'])->name('promoTools.edit.PromoBanner');
Route::post('admin/promo-tools/updated/{id}', [PromoBannerController::class, 'updatePromoBanner'])->name('promoTools.update');
Route::get('admin/promo-tools/delete/{id}', [PromoBannerController::class, 'deletePromoBanner'])->name('promoTools.delete');

Route::get('/admin/promo-banner/status/{id}', [PromoBannerController::class, 'toggleStatus'])->name('promoTools.toggleStatus');


//promo Preview Videos
Route::get('admin/promo-preview-videos/', [PromoPreviewVideosController::class, 'index'])->name('promoPreviewVideos.index');
Route::get('admin/promo-preview-videos/add-promo-videos', [PromoPreviewVideosController::class, 'createPreviewVideos'])->name('add.PreviewVideos');
Route::post('admin/promo-preview-videos/store-promo-videos', [PromoPreviewVideosController::class, 'storePreviewVideos'])->name('PreviewVideos.store');
Route::get('admin/promo-preview-videos/edit/{id}', [PromoPreviewVideosController::class, 'editPreviewVideos'])->name('edit.PreviewVideos');
Route::post('admin/promo-preview-videos/updated/{id}', [PromoPreviewVideosController::class, 'updatePreviewVideos'])->name('PreviewVideos.update');
Route::get('admin/promo-preview-videos/delete/{id}', [PromoPreviewVideosController::class, 'deletePreviewVideos'])->name('PreviewVideos.delete');


Route::get('admin/affiliate-tracks/', [AffiliateTrackController::class, 'index'])->name('tracks.index');


Route::get('/admin/promo-preview-videos/status/{id}', [PromoPreviewVideosController::class, 'toggleStatus'])->name('PreviewVideos.toggleStatus');


//withdrawal
Route::get('withdrawal', [WithdrawalController::class, 'index'])->name('withdrawal.index');
    Route::post('withdrawal/status-update', [WithdrawalController::class, 'withdrawalPendingStatus'])->name('withdrawal.pendingStatus');
    Route::get('withdrawal/approved-list', [WithdrawalController::class, 'approvedIndex'])->name('withdrawal.approved');
    Route::get('withdrawal/reject-list', [WithdrawalController::class, 'rejectIndex'])->name('withdrawal.reject');
    Route::get('admin/withdrawal/{id}/details', [WithdrawalController::class, 'show'])->name('withdrawal.details');
