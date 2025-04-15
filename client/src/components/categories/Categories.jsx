import React from "react";
import "./Categories.scss";
import { Link } from "react-router-dom";
import { categories as getCategories } from "../../data";
import { useTranslation } from 'react-i18next';

function Categories() {
    const { t } = useTranslation("categories", "data");
    const cats = getCategories();

    return (
        <div className="categories">
          <div className="explore">
            <div className="categories-container">
              <h1>{t("categories.title")}</h1>
              <div className="items">
                {cats.map((cat) => (
                  <Link to={`/gigs?cat=${cat.key}`} key={cat.key} className="item-link">
                    <div className="item">
                      <img src={cat.icon} alt="Category icon" />
                      <div className="line"></div>
                      <span className="item-title">{cat.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

export default Categories;