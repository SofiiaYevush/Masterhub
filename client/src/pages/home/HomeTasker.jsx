import React from "react";
import IntroTasker from "../../components/intro/IntroTasker";
import Devider from "../../components/devider/Devider";
import Slide from "../../components/slide/Slide";
import CatCard from "../../components/cat-card/CatCard";
import { categories } from "../../data";
import Testimonials from "../../components/testimonials/Testimonials";
import AcordionTasker from "../../components/acordion/AcordionTasker";
import "./HomeTasker.scss";

function HomeTasker() {
    return (
        <div>
            <IntroTasker />
            <Devider />
            <Slide slidesToShow={5} arrowsScroll={5}>
                {categories().map((card) => (
                <CatCard key={card.id} card={card} />
            ))}
            </Slide>
            <Testimonials />
            <AcordionTasker />
        </div>
    );
}

export default HomeTasker;