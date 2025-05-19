import React from "react";
import IntroUnregistred from "../../components/intro/introUnregistred";
import Devider from "../../components/devider/Devider";
import Slide from "../../components/slide/Slide";
import CatCard from "../../components/cat-card/CatCard";
import HelpfulTips from "../../components/helpful-tips/HelpfulTips";
import Testimonials from "../../components/testimonials/Testimonials";
import Analysis from "../../components/analysis/Analysis";
import ContactUs from "../../components/contact-us/ContactUs";
import ReadyToStart from "../../components/ready-to-start/ReadyToStart";
import AcordionUnregistered from "../../components/acordion/AcordionUnregistered";
import { categories } from "../../data";

function HomeUnregistered() {
    return (
        <div className="home">
            <IntroUnregistred />
            <Devider />
            <Slide slidesToShow={5} arrowsScroll={5}>
                {categories().map((card) => (
                <CatCard key={card.id} card={card} />
            ))}
            </Slide>
            <HelpfulTips />
            <Testimonials />
            <Analysis />
            <ReadyToStart />
            <AcordionUnregistered />
            <ContactUs />
        </div>
    );
}

export default HomeUnregistered;
