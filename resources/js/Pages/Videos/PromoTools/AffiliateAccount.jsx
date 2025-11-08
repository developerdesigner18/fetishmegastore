import __ from "@/Functions/Translate";
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import { useEffect, useState } from "react";

export default function AffiliateAccount({ affiliate_account }) {
    const { auth, errors, flash } = usePage().props;
    const user = auth.user;

    const [type, setType] = useState(affiliate_account?.type || "Individual");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: affiliate_account?.name || "",
        address: affiliate_account?.address || "",
        tax_id: affiliate_account?.tax_id || "",
        company_name: affiliate_account?.company_name || "",
        reg_no: affiliate_account?.reg_no || "",
        status: affiliate_account?.status || "1",
    });

    useEffect(() => {
        if (affiliate_account) {
            setType(affiliate_account.type);
        }
    }, [affiliate_account]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setLoading(true); 
        setTimeout(() => {
            
            Inertia.post(route("affiliateAccount.save"), {
                type,
                ...formData,
            }, {
                onFinish: () => setLoading(false), 
            });
        }, 1000);
    };

    return (
        <>
            <Head title={__("Affiliate Account")} />

            
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                </div>
            )}

            <div className="p-6 bg-white dark:bg-zinc-900 shadow rounded-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    {__("Affiliate Account")}
                </h2>

                {flash.success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
                        {flash.success}
                    </div>
                )}

              
                <div className="flex space-x-6 mb-6">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="type"
                            value="Individual"
                            checked={type === "Individual"}
                            onChange={() => setType("Individual")}
                        />
                        <span>{__("Individual")}</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="type"
                            value="Company"
                            checked={type === "Company"}
                            onChange={() => setType("Company")}
                        />
                        <span>{__("Company")}</span>
                    </label>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                   
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                {__("Name")}
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full border rounded p-2 dark:bg-zinc-800 dark:text-white"
                            />
                            {errors.name && (
                                <p className="text-red-600 text-sm">{errors.name}</p>
                            )}
                        </div>

                       
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                {__("Address")}
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="w-full border rounded p-2 dark:bg-zinc-800 dark:text-white"
                            />
                            {errors.address && (
                                <p className="text-red-600 text-sm">{errors.address}</p>
                            )}
                        </div>

                       
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                {__("Tax ID")}
                            </label>
                            <input
                                type="text"
                                name="tax_id"
                                value={formData.tax_id}
                                onChange={handleChange}
                                className="w-full border rounded p-2 dark:bg-zinc-800 dark:text-white"
                            />
                            {errors.tax_id && (
                                <p className="text-red-600 text-sm">{errors.tax_id}</p>
                            )}
                        </div>
                    </div>

                   
                    {type === "Company" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                    {__("Company Name")}
                                </label>
                                <input
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded p-2 dark:bg-zinc-800 dark:text-white"
                                />
                                {errors.company_name && (
                                    <p className="text-red-600 text-sm">{errors.company_name}</p>
                                )}
                            </div>

                           
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                    {__("Registration No")}
                                </label>
                                <input
                                    type="text"
                                    name="reg_no"
                                    value={formData.reg_no}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2 dark:bg-zinc-800 dark:text-white"
                                />
                                {errors.reg_no && (
                                    <p className="text-red-600 text-sm">{errors.reg_no}</p>
                                )}
                            </div>

                            
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                                    {__("Status")}
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2 dark:bg-zinc-800 dark:text-white"
                                >
                                    <option value="1">{__("Active")}</option>
                                    <option value="0">{__("Inactive")}</option>
                                </select>
                                {errors.status && (
                                    <p className="text-red-600 text-sm">{errors.status}</p>
                                )}
                            </div>
                        </div>
                    )}

                    
                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-5 py-3 border border-transparent rounded font-black text-xs uppercase tracking-widest transition ease-in-out duration-150 ${
                                loading
                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                    : "bg-indigo-800 text-white hover:bg-indigo-700 active:bg-indigo-900"
                            }`}
                        >
                            {affiliate_account
                                ? __("Update Account")
                                : __("Create Account")}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
