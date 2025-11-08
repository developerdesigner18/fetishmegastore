import __ from "@/Functions/Translate";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function AffiliateGuide({ affiliate_guide }) {
    if (!affiliate_guide) {
        return (
            <div className="text-red-500">
                {__("Affiliate Guide content not found.")}
            </div>
        );
    }

    return (
        <div className="prose dark:prose-invert max-w-none">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {affiliate_guide.page_title}
            </h1>
            <div
                className="text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: affiliate_guide.page_content }}
            />
        </div>
    );
}
