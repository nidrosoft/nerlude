import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/dashboard/", "/projects/", "/settings/", "/onboarding/"],
        },
        sitemap: "https://nerlude.io/sitemap.xml",
    };
}
