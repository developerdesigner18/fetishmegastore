import __ from "@/Functions/Translate";
import SecondaryButton from "@/Components/SecondaryButton";
import { usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import AccountNavi from "../../Channel/Partials/AccountNavi";

const MySwal = withReactContent(Swal);

export default function Affiliate({ commissions = [], totalCommission = 0, affiliateCode = "", pagination = {},currency }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    const tableHeaderClass = "text-left font-semibold border-b py-2 px-4";
    const tableCellClass = "py-2 px-4 border-b";



// Clipboard copy logic with fallback
    const copyToClipboard = (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    MySwal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: "Copied to clipboard",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                })
                .catch(() => fallbackCopyTextToClipboard(text));
        } else {
            fallbackCopyTextToClipboard(text);
        }
    };

    const fallbackCopyTextToClipboard = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand("copy");
            MySwal.fire({
                toast: true,
                position: "top-end",
                icon: successful ? "success" : "error",
                title: successful ? "Copied to clipboard" : "Copy failed",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (err) {
            MySwal.fire({
                icon: "error",
                title: "Copy Failed",
                text: "Please copy manually.",
            });
        }

        document.body.removeChild(textArea);
    };


    const requestAffiliateVendor = () => {
        MySwal.fire({
            title: __("Request Affiliate Vendor"),
            text: __("Do you want to request to become an affiliate vendor?"),
            icon: "question",
            showCancelButton: true,
            confirmButtonText: __("Yes, request it!"),
            cancelButtonText: __("Cancel"),
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.post(route("affiliate.submit"));
            }
        });
    };

    return (
        <div>
            {flash.success && (
                <div className="mb-4 px-4 py-2 rounded text-green-800 bg-green-100 border border-green-300">
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="mb-4 px-4 py-2 rounded text-red-800 bg-red-100 border border-red-300">
                    {flash.error}
                </div>
            )}

            {user.is_affiliate_vendor !== 1 ? (
                <SecondaryButton
                    onClick={requestAffiliateVendor}
                    className="px-5 py-3 bg-indigo-800 border border-transparent rounded font-black text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                >
                    {__("Become an Affiliate Vendor")}
                </SecondaryButton>
            ) : user.affiliate_vendor_verifiy !== 1 ? (
                <span className="text-yellow-600 font-semibold">
                    {__("Wait for affiliate approval")}
                </span>
            ) : (
                <>
                    {/* Affiliate Code Display */}
                    {affiliateCode && (
                        <div className="mb-6 flex items-center space-x-3">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                                {__("Affiliate Code")}:
                            </h2>
                            <span className="bg-gray-100 dark:bg-zinc-800 text-lg px-3 py-1 rounded border border-gray-300 dark:border-zinc-700">
                                {affiliateCode}
                            </span>
                            <button
                                onClick={() => {
                                    const copyText = affiliateCode;

                                    if (navigator.clipboard && navigator.clipboard.writeText) {
                                        navigator.clipboard.writeText(copyText).then(() => {
                                            MySwal.fire({
                                                toast: true,
                                                position: "top-end",
                                                icon: "success",
                                                title: __("Copied to clipboard"),
                                                showConfirmButton: false,
                                                timer: 1500,
                                            });
                                        }).catch(() => {
                                            MySwal.fire({
                                                icon: "error",
                                                title: __("Copy Failed"),
                                                text: __("Clipboard access denied."),
                                            });
                                        });
                                    } else {
                                        const textarea = document.createElement("textarea");
                                        textarea.value = copyText;
                                        textarea.style.position = "fixed";
                                        document.body.appendChild(textarea);
                                        textarea.focus();
                                        textarea.select();

                                        try {
                                            const successful = document.execCommand("copy");
                                            document.body.removeChild(textarea);
                                            if (successful) {
                                                MySwal.fire({
                                                    toast: true,
                                                    position: "top-end",
                                                    icon: "success",
                                                    title: __("Copied to clipboard"),
                                                    showConfirmButton: false,
                                                    timer: 1500,
                                                });
                                            } else {
                                                throw new Error("execCommand failed");
                                            }
                                        } catch (err) {
                                            document.body.removeChild(textarea);
                                            MySwal.fire({
                                                icon: "error",
                                                title: __("Copy Failed"),
                                                text: __("Please copy manually."),
                                            });
                                        }
                                    }
                                }}
                                className="p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                                title={__("Copy")}
                            >
                                <FontAwesomeIcon icon={faCopy} />
                            </button>
                        </div>
                    )}

                    {user.affiliate_vendor_verifiy === 1 && affiliateCode && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                Your Affiliate Sharing Code
                            </h2>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={`${window.location.origin}?affiliate_code=${affiliateCode}`}
                                    readOnly
                                    className="flex-1 px-3 py-2 border rounded bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-white"
                                />
                                <button
                                    onClick={() => copyToClipboard(`${window.location.origin}?affiliate_code=${affiliateCode}`)}
                                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                                    title="Copy"
                                >
                                    <FontAwesomeIcon icon={faCopy} />
                                </button>
                            </div>
                        </div>
                    )}



                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                        {__("Commission History")}
                    </h2>
                    <div className="text-lg font-semibold text-green-700 dark:text-green-400 mb-6">
                        {__("Total Commission")}: {currency}{Number(totalCommission).toFixed(2)}
                    </div>

                    <div className="bg-white dark:bg-zinc-900 shadow rounded-lg overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className={tableHeaderClass}>#</th>
                                    <th className={tableHeaderClass}>{__("User")}</th>
                                    <th className={tableHeaderClass}>{__("Amount")}</th>
                                    <th className={tableHeaderClass}>{__("Date")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commissions.length > 0 ? (
                                    commissions.map((item, index) => (
                                        <tr key={index}>
                                            <td className={tableCellClass}>{index + 1}</td>
                                            <td className={tableCellClass}>{item.username}</td>
                                            <td className={tableCellClass}>{currency}{item.amount}</td>
                                            <td className={tableCellClass}>{item.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-4 text-center text-gray-500">
                                            {__("No commission records found.")}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {pagination?.links && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {pagination.links.map((link, index) => (
                                    <button
                                        key={index}
                                        disabled={!link.url}
                                        onClick={() => link.url && Inertia.visit(link.url)}
                                        className={`px-3 py-1 rounded border text-sm ${
                                            link.active
                                                ? "bg-indigo-600 text-white"
                                                : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200"
                                        } ${!link.url ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-100 dark:hover:bg-zinc-700"}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
