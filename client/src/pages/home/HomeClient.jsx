import React from "react";
import IntroClient from "../../components/intro/IntroClient";
import Devider from "../../components/devider/Devider";
import Slide from "../../components/slide/Slide";
import CatCard from "../../components/cat-card/CatCard";
import { categories } from "../../data";
import Testimonials from "../../components/testimonials/Testimonials";
import AcordionClient from "../../components/acordion/AcordionClient";
import ContactUs from "../../components/contact-us/ContactUs";
import NewFeatureBanner from "../../components/new-feature-banner/NewFeatureBanner";
import getCurrentUser from "../../utils/getCurrentUser";
import "./HomeClient.scss";

function HomeClient() {
    const currentUser = getCurrentUser();

    return (
        <div>
            <IntroClient />
            <Devider />
            <NewFeatureBanner user={currentUser} />
            <Slide slidesToShow={5} slidesToScroll={5}>
                {categories().map((card) => (
                    <CatCard key={card.id} card={card} />
                ))}
            </Slide>
            <Testimonials />
            <AcordionClient />
            <ContactUs />
        </div>
    );
}

export default HomeClient;