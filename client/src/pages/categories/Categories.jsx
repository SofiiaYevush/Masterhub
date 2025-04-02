import React from "react";
import "./Categories.scss";
import CategoriesComponent from "../../components/categories/Categories";
import FindOnPlatform from "../../components/find-on-platform/FindOnPlatform";

function Categories() {
    return (
        <div className="categories">
            <FindOnPlatform />
            <CategoriesComponent />
        </div>

    );
}

export default Categories;