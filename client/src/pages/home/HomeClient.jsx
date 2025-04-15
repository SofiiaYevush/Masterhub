import React from "react";
import IntroClient from "../../components/intro/IntroClient";
import Devider from "../../components/devider/Devider";
import Slide from "../../components/slide/Slide";
import CatCard from "../../components/cat-card/CatCard";
import { categories } from "../../data";
import Testimonials from "../../components/testimonials/Testimonials";
import AcordionClient from "../../components/acordion/AcordionClient";
import "./HomeClient.scss";

function HomeClient() {
    return (
        <div>
            <IntroClient />
            <Devider />
            <Slide slidesToShow={5} arrowsScroll={5}>
                {categories().map((card) => (
                <CatCard key={card.id} card={card} />
            ))}
            </Slide>
            <Testimonials />
            <AcordionClient />
        </div>
    );
}

export default HomeClient;