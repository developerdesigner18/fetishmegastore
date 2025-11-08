import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/inertia-react";
import TextInput from "@/Components/TextInput";
import Spinner from "@/Components/Spinner";
import { Inertia } from "@inertiajs/inertia";
import Front from "@/Layouts/Front";
import { Pagination } from "antd";

export default function Faqs({ faq }) {
    const { props } = usePage();
    const [search, setSearch] = useState(props?.search || "");
    const [isLoading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(faq.current_page || 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.visit(route("web.faq.index", { search, page: 1 }), {
            only: ["faq"],
            preserveState: true,
            onBefore: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        Inertia.visit(route("web.faq.index", { search, page }), {
            only: ["faq"],
            preserveState: true,
            onBefore: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };

    return (
        <Front extraHeader={true} extraHeaderTitle="FAQs">
            <Head title="FAQs" />

            <div className="max-w-4xl mx-auto px-4 py-10">
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex items-center gap-4">
                        <TextInput
                            type="text"
                            className="w-full"
                            placeholder="Search FAQs..."
                            value={search}
                            handleChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {isLoading ? (
                    <div className="text-center my-10">
                        <Spinner />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {faq.data.length > 0 ? (
                            faq.data.map((item) => (
                                <div key={item.id} className="bg-white dark:bg-zinc-800 shadow rounded-lg">
                                    <details className="group p-4">
                                        <summary className="font-semibold cursor-pointer text-lg text-indigo-700 dark:text-indigo-300">
                                            {item.question}
                                        </summary>
                                        <p className="mt-2 text-gray-700 dark:text-gray-200 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </details>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-300 mt-10 text-lg">
                                No FAQs found.
                            </div>
                        )}
                    </div>
                )}

                {faq.total > faq.per_page && (
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            current={currentPage}
                            total={faq.total}
                            pageSize={faq.per_page}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            className="dark:text-white"
                        />
                    </div>
                )}
            </div>
        </Front>
    );
}
