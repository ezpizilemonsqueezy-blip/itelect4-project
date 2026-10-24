// ===== ENUMS =====
export enum ComplaintStatus {
    PENDING = "PENDING",
    RESOLVED = "RESOLVED",
    REJECTED = "REJECTED"
}

export const enum Role {
    Admin = "admin",
    Officer = "officer"
}


export interface User {
    id: number;
    name: string;
    email: string;
    role: Role; 
    isActive: boolean;
}

export interface Tricycle {
    id: number;
    plateNumber: string;
    operatorName: string;
    phoneNumber: string; 
}

export interface Complaint {
    id: number;
    tricycleId: number;
    complainantName: string;
    issueDescription: string;
    status: ComplaintStatus;
    filedAt: Date;
}

export type ID = number | string;
export type StringOrNumber = string | number;


export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}


export type ComplaintUpdate = Partial<Complaint>;


export type PublicTricycleView = Omit<Tricycle, "phoneNumber">;


export type StatusCounts = Record<ComplaintStatus, number>;

export type AiReadiness = "ready" | "almost" | "not-yet";

export interface AiReview {
    summary: string;
    strengths: string[];
    improvements: string[];
    readiness: AiReadiness;
}
