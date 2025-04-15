import React from "react";
import HomeClient from "./HomeClient";
import HomeTasker from "./HomeTasker";
import getCurrentUser from "../../utils/getCurrentUser";

function HomeRegistered() {
    const currentUser = getCurrentUser();

    return (
        <div>
            {currentUser.isSeller && (
                <HomeTasker />
            )}
            {!currentUser.isSeller && (
                <HomeClient />
            )}
        </div>
    );
}

export default HomeRegistered;