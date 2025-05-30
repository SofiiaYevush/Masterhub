import React, { useState } from "react";
import "./SortDropdown.scss";
import { useTranslation } from 'react-i18next';

const SortDropdown = ({ sort, onChange }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("sort-dropdown");

  const getLabel = () => {
    if (!sort || !sort.field) return t('sort-dropdown.sortBy');

    if (sort.field === "price") {
      return sort.order === "asc" ? t('sort-dropdown.cheapest') :t('sort-dropdown.mostExpensive');
    }

    if (sort.field === "createdAt") return t('sort-dropdown.newest');

    return t('sort-dropdown.sortBy');
  };

  return (
    <div className="sort-dropdown">
      <button className="sort-button" onClick={() => setOpen(!open)}>
        <img className="sort-button-icon" src="../../icons/sort-by.png" alt="" />
        <span>{getLabel()}</span>
        <img
          className="sort-button-icon-up-down"
          src={`../../icons/sort-${open ? "up" : "down"}.png`}
          alt=""
        />
      </button>

      {open && (
        <div className="sort-options">
          <span onClick={() => onChange("price", "asc")}>{t('sort-dropdown.cheapest')}</span>
          <span onClick={() => onChange("price", "desc")}>{t('sort-dropdown.mostExpensive')}</span>
          <span onClick={() => onChange("createdAt", "desc")}>{t('sort-dropdown.newest')}</span>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
