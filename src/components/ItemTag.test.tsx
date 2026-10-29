import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { ItemRecord } from "../api/client";
import ItemTag from "./ItemTag";

// Typed like a real GET /api/items response, so a change to ItemRecord breaks this test at compile time.
const sampleItem: ItemRecord = {
  id: "6ae34f6278af4dd8e3f6d8af",
  userId: "6ae34f6278af4dd8e3d51858",
  name: "Silver USB-C Cable",
  category: "Electronics",
  status: "Awaiting Pickup",
  location: "Library counter",
  description: "30W USB-C charging cable, white and silver finish.",
  estimatedValue: 0,
  foundAt: "2026-08-21T09:30:00.000Z",
  createdAt: "2026-08-21T09:35:00.000Z",
  updatedAt: "2026-08-21T09:35:00.000Z",
};

function renderTag(item: ItemRecord) {
  return render(
    <MemoryRouter>
      <ul>
        <ItemTag item={item} index={0} />
      </ul>
    </MemoryRouter>,
  );
}

describe("ItemTag", () => {
  it("stamps the tag with the item's status from the status prop", () => {
    renderTag(sampleItem);

    expect(screen.getByText("Awaiting Pickup")).toBeInTheDocument();
    expect(screen.queryByText("Claimed")).not.toBeInTheDocument();
  });

  it("changes the stamp to Claimed when the item status is Claimed", () => {
    renderTag({ ...sampleItem, status: "Claimed" });

    expect(screen.getByText("Claimed")).toBeInTheDocument();
    expect(screen.queryByText("Awaiting Pickup")).not.toBeInTheDocument();
  });

  it("links the tag to the item's detail page by id", () => {
    renderTag(sampleItem);

    expect(screen.getByRole("link", { name: /Silver USB-C Cable/ })).toHaveAttribute("href", "/items/6ae34f6278af4dd8e3f6d8af");
  });
});
