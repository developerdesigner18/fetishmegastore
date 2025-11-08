import __ from "@/Functions/Translate";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Head, Link, useForm, usePage } from "@inertiajs/inertia-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { useState } from "react";
import TextInput from "@/Components/TextInput";
import AccountNavi from "../Channel/Partials/AccountNavi";

export default function CommissionPage({ commissions = [], totalCommission = 0 }) {
    const { auth } = usePage().props;

    const tableHeaderClass = "text-left font-semibold border-b py-2 px-4";
    const tableCellClass = "py-2 px-4 border-b";

    return (
        <AuthenticatedLayout>
            <Head title={__("My Commission")} />

            <div className="lg:flex lg:space-x-10">
                <AccountNavi active={"commission"} />

                <div className="ml-0 w-full">
                    <div className="mb-5 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            {__("Commission History")}
                        </h2>
                        <div className="text-lg font-semibold text-green-700 dark:text-green-400">
                            {__("Total Commission")}: ₹{Number(totalCommission).toFixed(2)}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 shadow rounded-lg overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className={tableHeaderClass}>{__("Amount (₹)")}</th>
                                    <th className={tableHeaderClass}>{__("Date")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commissions.length > 0 ? (
                                    commissions.map((item, index) => (
                                        <tr key={index}>
                                            <td className={tableCellClass}>₹{item.amount}</td>
                                            <td className={tableCellClass}>{item.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="py-4 text-center text-gray-500">
                                            {__("No commission records found.")}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

