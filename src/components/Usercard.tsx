// src/components/UserCard.tsx
import React from "react";
import type { User } from "../types/index";

interface UserCardProps {
    user: User;
    onSelect: (user: User) => void;
    variant?: "default" | "compact";
}

function UserCard({ user, onSelect, variant = "default" }: UserCardProps) {
    const handleClick = (): void => {
        onSelect(user);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        console.log("Search:", e.target.value);
    };

    const isCompact = variant === "compact";

    return (
        <div className={`rounded-2xl border ${isCompact ? "border-slate-200 bg-white p-2" : "border-slate-200 bg-white p-4"} shadow-sm transition hover:shadow-md dark:bg-gray-800`}>
            <div className={`flex items-start justify-between gap-3 ${isCompact ? "" : "mb-2"}`}>
                <div>
                    <h3 className={`text-lg font-semibold ${isCompact ? "text-sm" : "text-lg"} text-slate-800 dark:text-gray-100`}>{user.name}</h3>
                    {!isCompact ? <p className="mt-1 text-sm text-slate-500 dark:text-gray-300">{user.email}</p> : null}
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {user.isActive ? "Active" : "Inactive"}
                </span>
            </div>

            <div className={`flex ${isCompact ? "items-center gap-2" : "flex-col gap-2"}`}>
                <button
                    type="button"
                    onClick={handleClick}
                    className={`rounded-lg ${isCompact ? "bg-indigo-600 px-2 py-1 text-xs" : "bg-indigo-600 px-3 py-2 text-sm"} font-medium text-white transition hover:bg-indigo-700`}
                >
                    Select
                </button>

                {!isCompact ? (
                    <input
                        onChange={handleChange}
                        placeholder="Search..."
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                    />
                ) : null}
            </div>
        </div>
    );
}

export default UserCard;