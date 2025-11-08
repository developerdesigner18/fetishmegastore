import { Head, Link } from "@inertiajs/inertia-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useState } from "react";

import Affiliate from "@/Pages/Videos/Affiliate/Affiliate";
import PromoBanner from "@/Pages/Videos/PromoTools/PromoBanner";
import PromoVideos from "@/Pages/Videos/PromoTools/PromoVideos";
import PromoGallery from "@/Pages/Videos/PromoTools/PromoGallery";
import AffiliateTrackTable from "@/Pages/Videos/PromoTools/AffiliateTrackTable";
import AffiliateGuide from "@/Pages/Videos/PromoTools/AffiliateGuide";
import AffiliateAccount from "@/Pages/Videos/PromoTools/AffiliateAccount";
import WithdrawalCommission from "@/Pages/Videos/PromoTools/WithdrawalCommission";

export default function AffiliateDashboard({
    activeTab = "commission",
    commissions,
    currency,
    totalCommission,
    affiliateCode,
    pagination,
    promo_banners,
    promo_videos,
    promo_gallery,
    affiliate_tracks,
    affiliate_guide,
    affiliate_account,
    withdrawal_commission,
    withdrawal_history,
}) {
    const tabClass = (tab) =>
        `text-lg font-semibold px-4 py-2 border-b-2 ${
            activeTab === tab
                ? "border-indigo-600 text-indigo-800 dark:text-indigo-400"
                : "border-transparent text-gray-600 hover:text-indigo-600 dark:text-white"
        }`;

    return (
        <AuthenticatedLayout>
            <Head title="Affiliate Dashboard" />

            <div className="p-6 bg-white dark:bg-zinc-900 min-h-screen">
                <div className="mb-6 border-b flex space-x-6">
                    <Link
                        href={route("affiliateDashboard")}
                        className={tabClass("commission")}
                    >
                        Affiliate Commission
                    </Link>
                    <Link
                        href={route("affiliate.dashboard.tracking")}
                        className={tabClass("affiliateTracking")}
                    >
                        Visit Tracking
                    </Link>
                    <Link
                        href={route("affiliate.dashboard.banner")}
                        className={tabClass("promoBanner")}
                    >
                        Promo Banner
                    </Link>
                    <Link
                        href={route("affiliate.dashboard.videos")}
                        className={tabClass("promoVideos")}
                    >
                        Promo Videos
                    </Link>
                    <Link
                        href={route("affiliate.dashboard.gallery")}
                        className={tabClass("promoGallery")}
                    >
                        Pictures
                    </Link>
                    <Link
                        href={route("affiliateGuide")}
                        className={tabClass("affiliateGuide")}
                    >
                        Affiliate Guide
                    </Link>

                    <Link
                        href={route("affiliateAccount")}
                        className={tabClass("affiliateAccount")}
                    >
                        Affiliate Accounts
                    </Link>

                    <Link
                        href={route("withdrawalCommission")}
                        className={tabClass("withdrawalCommission")}
                    >
                        Withdrawal
                    </Link>

                </div>

                <div className="mt-4">
                    {activeTab === "commission" && commissions && (
                        <Affiliate
                            commissions={commissions}
                            totalCommission={totalCommission}
                            currency={currency}
                            affiliateCode={affiliateCode}
                            pagination={pagination}
                        />
                    )}

                    {activeTab === "affiliateTracking" && affiliate_tracks && (
                        <AffiliateTrackTable affiliate_tracks={affiliate_tracks} />
                    )}

                    {activeTab === "promoBanner" && promo_banners && (
                        <PromoBanner promo_banners={promo_banners} />
                    )}

                    {activeTab === "promoVideos" && promo_videos && (
                        <PromoVideos
                            promo_videos={promo_videos}
                            affiliateCode={affiliateCode}
                        />
                    )}

                    {activeTab === "promoGallery" && promo_gallery && (
                        <PromoGallery
                            promo_gallery={promo_gallery}
                            affiliate_code={affiliateCode}
                        />
                    )}
                    {activeTab === "affiliateGuide" && affiliate_guide && (
                        <AffiliateGuide affiliate_guide={affiliate_guide} />
                    )}

                    {activeTab === "affiliateAccount" && (
                        <AffiliateAccount affiliate_account={affiliate_account} />
                    )}

                    {activeTab === "withdrawalCommission" && (
                        <WithdrawalCommission 
                            withdrawal_commission={withdrawal_commission}
                            currency={currency}
                            withdrawal_history={withdrawal_history}
                         />
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
