import React from "react";
import __ from "@/Functions/Translate";
import { Head, usePage } from "@inertiajs/inertia-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AccountNavi from "@/Pages/Channel/Partials/AccountNavi";

export default function Page({ page }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title={page.page_title || __("Page")} />

            <div className="lg:flex lg:space-x-10">
                <AccountNavi active={"fav-videos"} />
               <div className="ml-0 w-full">
                <div className="p-4 sm:p-8 bg-white dark:bg-zinc-900 shadow sm:rounded-lg">
                    
                    <h3 className="text-2xl font-semibold dark:text-white text-center border-b pb-5 mb-5">
                        {page.page_title}
                    </h3>

                    <div
                        className="static-page dark:text-white"
                        dangerouslySetInnerHTML={{
                            __html: page.page_content,
                        }}
                    />
                </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

