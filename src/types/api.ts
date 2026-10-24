export type JsonDateString = string;

export type GeneratedId<T extends string> = T | `${T}-${string}`;

export interface ApiItem {
  id: GeneratedId<"item">;
  name: string;
  category: "Electronics" | "Accessories" | "Documents" | "Personal";
  status: "Recovered" | "Claimed" | "Awaiting Pickup";
  location: string;
  description: string;
  foundAt: JsonDateString;
}

export interface ApiClaim {
  id: GeneratedId<"claim">;
  itemId: GeneratedId<"item">;
  claimantName: string;
  email: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: JsonDateString;
}

export type ItemInput = Omit<ApiItem, "id" | "foundAt"> & {
  id?: GeneratedId<"item">;
  foundAt?: JsonDateString;
};

export type ClaimInput = Omit<ApiClaim, "id" | "createdAt"> & {
  id?: GeneratedId<"claim">;
  createdAt?: JsonDateString;
};
