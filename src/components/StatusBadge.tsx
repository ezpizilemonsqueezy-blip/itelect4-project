// src/components/StatusBadge.tsx
import React from "react";
import { ComplaintStatus } from "../types/index"; 

interface StatusBadgeProps {
    statusType: ComplaintStatus; 
    children?: React.ReactNode;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ statusType, children }) => {
    const badgeStyles: Record<string, string> = {
        pending: "border border-amber-200 bg-amber-100 text-amber-800",
        resolved: "border border-emerald-200 bg-emerald-100 text-emerald-800",
        rejected: "border border-rose-200 bg-rose-100 text-rose-800"
    };

    const badgeClass = badgeStyles[statusType.toLowerCase()] ?? "border border-slate-200 bg-slate-100 text-slate-700";

    return (
        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${badgeClass}`}>
            <span className="h-2 w-2 rounded-full bg-current" />
            <span>Status: {statusType}</span>
            {children}
        </div>
    );
};

export default StatusBadge;