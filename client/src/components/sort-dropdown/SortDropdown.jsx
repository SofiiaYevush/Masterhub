import React, { useState } from "react";
import "./SortDropdown.scss";

const SortDropdown = ({ sort, onChange }) => {
  const [open, setOpen] = useState(false);

  const getLabel = () => {
    if (!sort || !sort.field) return "Sort by";

    if (sort.field === "price") {
      return sort.order === "asc" ? "Cheapest" : "Most Expensive";
    }

    if (sort.field === "createdAt") return "Newest";

    return "Sort by";
  };

  return (
    <div className="sort-dropdown">
      <button className="sort-button" onClick={() => setOpen(!open)}>
        <img className="sort-button-icon" src="../../icons/sort-by.png" alt="" />
        <span>{getLabel()}</span>
      </button>

      {open && (
        <div className="sort-options">
          <span onClick={() => onChange("price", "asc")}>Cheapest</span>
          <span onClick={() => onChange("price", "desc")}>Most Expensive</span>
          <span onClick={() => onChange("createdAt", "desc")}>Newest</span>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
