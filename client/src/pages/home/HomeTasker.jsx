import React from "react";
import IntroTasker from "../../components/intro/IntroTasker";
import Devider from "../../components/devider/Devider";
import Slide from "../../components/slide/Slide";
import CatCard from "../../components/cat-card/CatCard";
import { categories } from "../../data";
import Testimonials from "../../components/testimonials/Testimonials";
import AcordionTasker from "../../components/acordion/AcordionTasker";
import ContactUs from "../../components/contact-us/ContactUs";
import NewFeatureBanner from "../../components/new-feature-banner/NewFeatureBanner";
import getCurrentUser from "../../utils/getCurrentUser";
import "./HomeTasker.scss";

function HomeTasker() {
    const currentUser = getCurrentUser();

    return (
        <div>
            <IntroTasker />
            <Devider />
            <NewFeatureBanner user={currentUser} />
            <Slide slidesToShow={5} slidesToScroll={5}>
                {categories().map((card) => (
                    <CatCard key={card.id} card={card} />
                ))}
            </Slide>
            <Testimonials />
            <AcordionTasker />
            <ContactUs />
        </div>
    );
}

export default HomeTasker;