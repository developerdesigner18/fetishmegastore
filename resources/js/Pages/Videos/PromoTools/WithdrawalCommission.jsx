import __ from "@/Functions/Translate";
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import { useState } from "react";

export default function WithdrawalCommission({ withdrawal_commission, currency, withdrawal_history }) {
    const { flash } = usePage().props;
    const history = withdrawal_history || { data: [], links: [], meta: {} };

    const [showForm, setShowForm] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState("");
    const [paymentType, setPaymentType] = useState("");
    const [email, setEmail] = useState("");
    const [wallet_address, setWalletAddress] = useState("");
    const [bankOption, setBankOption] = useState(""); // iban_code or swift_code
    const [bankValue, setBankValue] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showPendingMessage, setShowPendingMessage] = useState(false);

    const totalCommission = withdrawal_commission?.total_commission || 0;
    const minLimit = withdrawal_commission?.minimum_withdrawal_limit || 0;
    const hasPending = withdrawal_commission?.has_pending_request || false;

    const handleSubmit = (e) => {
        e.preventDefault();

        // Client-side validation
        if (!paymentType) {
            setError("Please select a payment type.");
            return;
        }
        if (withdrawalAmount < minLimit) {
            setError(`Amount should be at least ${minLimit}`);
            return;
        }
        if (withdrawalAmount > totalCommission) {
            setError(`Amount cannot exceed ${totalCommission}`);
            return;
        }
        if (paymentType === "Paypal" && !email) {
            setError("Please enter your PayPal email.");
            return;
        }
        if (paymentType === "Crypto" && !wallet_address) {
            setError("Please enter your crypto wallet address.");
            return;
        }
        if (paymentType === "Wire" && (!bankOption || !bankValue)) {
            setError("Please select and provide IBAN or SWIFT code.");
            return;
        }

        setError("");
        setLoading(true);

        // Build payload
        const payload = {
            amount: withdrawalAmount,
            payment_type: paymentType,
        };

        if (paymentType === "Paypal") {
            payload.email = email;
        } else if (paymentType === "Crypto") {
            payload.wallet_address = wallet_address;
        } else if (paymentType === "Wire") {
            payload[bankOption] = bankValue; // dynamically set iban_code or swift_code
        }

        Inertia.post(route("withdrawal.request"), payload, {
            onSuccess: () => {
                setLoading(false);
                setShowForm(false);
                setSuccessMessage("Your withdrawal request has been sent successfully.");
                setTimeout(() => setSuccessMessage(""), 3000);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    const handleAddRequestClick = () => {
        if (hasPending) {
            setShowPendingMessage(true);
            setTimeout(() => setShowPendingMessage(false), 3000);
            return;
        }
        setShowForm(true);
    };

    return (
        <>
            <Head title={__("Withdrawal Commission")} />

            <div className="p-6 bg-white dark:bg-zinc-900 shadow rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    {__("Withdrawal Commission")}
                </h2>

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                        {successMessage}
                    </div>
                )}
                {flash.success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                        {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
                        {flash.error}
                    </div>
                )}
                {showPendingMessage && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        You already have a pending withdrawal request. Please wait until it is processed.
                    </div>
                )}

                <div className="mb-6 flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Total Commission:{" "}
                        <span className="text-indigo-700 dark:text-indigo-400">
                            {currency}{totalCommission}
                        </span>
                    </div>
                    <button
                        onClick={handleAddRequestClick}
                        className="px-5 py-3 border border-transparent rounded-lg font-bold text-xs uppercase tracking-widest transition ease-in-out duration-150 bg-indigo-800 text-white hover:bg-indigo-700 active:bg-indigo-900"
                    >
                        Add Request
                    </button>
                </div>

                {/* History Table */}
                <div className="overflow-x-auto mb-6">
                    <table className="min-w-full text-sm text-left border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg overflow-hidden">
                        <thead className="bg-indigo-600 text-white text-xs uppercase font-semibold tracking-wider">
                            <tr>
                                <th className="px-4 py-3">S.No</th>
                                <th className="px-4 py-3">Request Date</th>
                                <th className="px-4 py-3">Amount({currency})</th>
                                <th className="px-4 py-3">Approved Amount</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Approved By</th>
                                <th className="px-4 py-3">Approved At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                            {history.data && history.data.length > 0 ? (
                                history.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                        <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">
                                            {(history.meta?.from ?? 1) + index}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                            {new Date(item.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white">
                                            {item.amount}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                            {item.approved_amount || "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full font-semibold ${
                                                    item.status === "approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : item.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                            {item.approve_by || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                            {item.approved_at ? new Date(item.approved_at).toLocaleString() : "-"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500 dark:text-gray-300">
                                        No withdrawal history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center space-x-2 mt-4">
                    {history.links.map((link, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (link.url) Inertia.get(link.url);
                            }}
                            disabled={!link.url}
                            className={`px-3 py-2 border rounded ${
                                link.active ? "bg-indigo-800 text-white" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                            } ${!link.url ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-100"}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>

                {/* Loading Spinner */}
                {loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                    </div>
                )}

                {/* Add Withdrawal Form */}
                {showForm && !loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-full max-w-md shadow-lg">
                            <h3 className="text-xl font-bold mb-4">Add Withdrawal Request</h3>
                            {error && (
                                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Total Commission ({currency})</label>
                                    <input
                                        type="text"
                                        value={totalCommission}
                                        readOnly
                                        className="w-full border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Withdrawal Amount</label>
                                    <input
                                        type="text"
                                        value={withdrawalAmount}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*\.?\d*$/.test(value)) {
                                                setWithdrawalAmount(value);
                                            }
                                        }}
                                        className="w-full border-gray-300 rounded-lg px-3 py-2"
                                        placeholder={`Minimum ${minLimit}`}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Payment Type</label>
                                    <select
                                        value={paymentType}
                                        onChange={(e) => {
                                            setPaymentType(e.target.value);
                                            setEmail("");
                                            setWalletAddress("");
                                            setBankOption("");
                                            setBankValue("");
                                        }}
                                        className="w-full border-gray-300 rounded-lg px-3 py-2"
                                    >
                                        <option value="">Select Payment Type</option>
                                        <option value="Paypal">PayPal</option>
                                        <option value="Crypto">Crypto</option>
                                        <option value="Wire">Wire</option>
                                    </select>
                                </div>

                                {paymentType === "Paypal" && (
                                    <div className="mb-4">
                                        <label className="block mb-1 font-medium">PayPal Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border-gray-300 rounded-lg px-3 py-2"
                                            placeholder="Enter your PayPal email"
                                        />
                                    </div>
                                )}

                                {paymentType === "Crypto" && (
                                    <div className="mb-4">
                                        <label className="block mb-1 font-medium">Wallet Address</label>
                                        <input
                                            type="text"
                                            value={wallet_address}
                                            onChange={(e) => setWalletAddress(e.target.value)}
                                            className="w-full border-gray-300 rounded-lg px-3 py-2"
                                            placeholder="Enter your crypto wallet address"
                                        />
                                    </div>
                                )}

                                {paymentType === "Wire" && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block mb-1 font-medium">Select Bank Option</label>
                                            <select
                                                value={bankOption}
                                                onChange={(e) => {
                                                    setBankOption(e.target.value);
                                                    setBankValue("");
                                                }}
                                                className="w-full border-gray-300 rounded-lg px-3 py-2"
                                            >
                                                <option value="">Select</option>
                                                <option value="iban_code">IBAN Code</option>
                                                <option value="swift_code">SWIFT Code</option>
                                            </select>
                                        </div>
                                        {bankOption && (
                                            <div className="mb-4">
                                                <label className="block mb-1 font-medium">
                                                    {bankOption
                                                        .replace(/_/g, " ")
                                                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={bankValue}
                                                    onChange={(e) => setBankValue(e.target.value)}
                                                    className="w-full border-gray-300 rounded-lg px-3 py-2"
                                                    placeholder={`Enter ${bankOption
                                                        .replace(/_/g, " ")
                                                        .replace(/\b\w/g, (char) => char.toUpperCase())}`}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 bg-gray-300 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-3 border border-transparent rounded font-black text-xs uppercase tracking-widest transition ease-in-out duration-150 bg-indigo-800 text-white hover:bg-indigo-700 active:bg-indigo-900"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
