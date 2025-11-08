import __ from "@/Functions/Translate";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function AffiliateTrackTable({ affiliate_tracks }) {
    const tracks = affiliate_tracks.data || [];

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                {__("Affiliate Visit Tracking History")}
            </h2>

            <div className="bg-white dark:bg-zinc-900 shadow rounded-lg overflow-x-auto">
                <table className="min-w-full border border-gray-200 dark:border-zinc-700 text-sm">
                    <thead className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                        <tr>
                            <th className="p-3 text-left">#</th>
                            <th className="p-3 text-left">{__("User")}</th>
                            <th className="p-3 text-left">{__("IP Address")}</th>
                            <th className="p-3 text-left">{__("Date")}</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 dark:text-gray-200">
                        {tracks.length > 0 ? (
                            tracks.map((track, index) => (
                                <tr key={track.id || index} className="border-t border-gray-200 dark:border-zinc-700">
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3">{track.user ? track.user.name.replace(/_/g, " ") : "-"}</td>
                                    <td className="p-3">{track.ip_address}</td>
                                    <td className="p-3">{new Date(track.created_at).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-3 text-center text-gray-500">
                                    {__("No visit tracking records found.")}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {affiliate_tracks.links && affiliate_tracks.links.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                    {affiliate_tracks.links.map((link, index) => (
                        <button
                            key={index}
                            disabled={!link.url}
                            onClick={() => link.url && Inertia.visit(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1 rounded border text-sm ${
                                link.active
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200"
                            } ${!link.url ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-100 dark:hover:bg-zinc-700"}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
