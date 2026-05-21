export const getBannerContent = (user) => {
    if (!user) {
        return {
            titleKey: "banner.guest.title",
            textKey: "banner.guest.text",
            ctaKey: "banner.guest.cta",
            link: "/pre-registerer",
        };
    }

    if (user.isSeller) {
        return {
            titleKey: "banner.tasker.title",
            textKey: "banner.tasker.text",
            ctaKey: "banner.tasker.cta",
            link: "/categories",
        };
    }

    return {
        titleKey: "banner.client.title",
        textKey: "banner.client.text",
        ctaKey: "banner.client.cta",
        link: "/create-jobs",
    };
};