import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import SortDropdown from "../../components/sort-dropdown/SortDropdown";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";
import { categories as getCategories } from "../../data";
import { useTranslation } from 'react-i18next';

function Gigs() {
  const { t, i18n } = useTranslation("gigs");
  const [sort, setSort] = useState("sales");
  const [setOpen] = useState(false);
  const [setFiltersVisible] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();
  const { search } = useLocation();
  const categoryKey = new URLSearchParams(search).get("cat");

  const cats = getCategories();
  const category = cats.find((cat) => cat.key === categoryKey);


  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", categoryKey, sort.field, sort.order],
    queryFn: () =>
      newRequest
        .get(
          `/gigs${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort.field}&order=${sort.order}&category=${categoryKey}&language=${i18n.language}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  const reSort = (field, order = "desc") => {
    setSort({ field, order });
    setOpen(false);
    setFiltersVisible(false);
    };
    
    useEffect(() => {
      refetch();
    }, [sort.field, sort.order, categoryKey]);
    
    const apply = () => {
      refetch();
    };
    
    const resetFilters = () => {
      if (minRef.current) minRef.current.value = "";
      if (maxRef.current) maxRef.current.value = "";
      setSort("sales");
      refetch();
    };  
    
    return (
      <div className="services">
        <div className="services-container">
          <h1 className="services-title">{category ? category.title : "All Services"}</h1>
          <p className="services-description">{category ? category.desc : "Browse various gigs and services."}</p> 
          <div className="menu">
            <div className="left">
              <span className="filter-price-title">{t('gigs.price')}</span>
              <div className="filter-price-inputs">
                <input className="filter-price-input" ref={minRef} type="number" placeholder={t('gigs.minPlaceholder')} />
                <input className="filter-price-input" ref={maxRef} type="number" placeholder={t('gigs.maxPlaceholder')} />
              </div>
              <button className="filter-price-button" onClick={apply}>
                <img src="../../icons/filter-search.png" alt="" className="filter-price-icon" />
              </button>
            </div>
            <div className="right">
            <SortDropdown sort={sort} onChange={reSort} />
            <button onClick={resetFilters} className="reset-button">
              <img className="reset-icon" src="../../icons/clear-filter.png" alt="" />
            </button>              
            </div>
          </div>
          <div className="cards">
            {isLoading
              ? "loading"
              : error
              ? "Something went wrong!"
              : data.map((gig) => <GigCard key={gig._id} item={gig} />)}
          </div>
        </div>
      </div>
    );
  }

export default Gigs;
