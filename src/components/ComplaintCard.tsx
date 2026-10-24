// src/components/ComplaintCard.tsx
import React from "react";
import type { Complaint } from "../types/index";

interface ComplaintCardProps {
    complaint: Complaint;
    onSelect: (complaint: Complaint) => void;
}

function ComplaintCard({ complaint, onSelect }: ComplaintCardProps) {
    
    const handleClick = (_e: React.MouseEvent<HTMLButtonElement>): void => {
        onSelect(complaint);
    };

    // Typed change event for inline logging / notes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        console.log("Admin note update:", e.target.value);
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Complaint #{complaint.id}</h3>
                    <p className="mt-1 text-sm text-slate-500">{complaint.issueDescription}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {complaint.status}
                </span>
            </div>

            <div className="mt-3 space-y-1 text-sm text-slate-600">
                <p><span className="font-medium text-slate-700">Complainant:</span> {complaint.complainantName}</p>
                <p><span className="font-medium text-slate-700">Status:</span> {complaint.status}</p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                <button
                    type="button"
                    onClick={handleClick}
                    className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                >
                    View Details
                </button>
                <input
                    onChange={handleChange}
                    placeholder="Add rapid note..."
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none ring-0 transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
            </div>
        </div>
    );
}

export default ComplaintCard;