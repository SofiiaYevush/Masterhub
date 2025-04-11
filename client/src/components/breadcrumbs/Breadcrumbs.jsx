import React from 'react';
import { useNavigate } from "react-router-dom";
import "./Breadcrumbs.scss";

const Breadcrumbs = () => {
  const navigate = useNavigate();

  return (
    <button className="back-button" onClick={() => navigate(-1)}>
      ← Back
    </button>
  );
};


export default Breadcrumbs;
