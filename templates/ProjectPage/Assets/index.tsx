"use client";

import Icon from "@/components/Icon";
import Button from "@/components/Button";

type Props = {
    projectId: string;
};

const Assets = ({ projectId }: Props) => {
    const assetCategories = [
        {
            title: "Logos",
            icon: "bezier-curves",
            items: [
                { name: "Logo Icon", type: "PNG", size: "24 KB" },
                { name: "Logo Full", type: "SVG", size: "12 KB" },
                { name: "Logo Dark Mode", type: "SVG", size: "12 KB" },
            ],
        },
        {
            title: "Screenshots",
            icon: "camera",
            items: [
                { name: "App Store Screenshot 1", type: "PNG", size: "245 KB" },
                { name: "App Store Screenshot 2", type: "PNG", size: "312 KB" },
            ],
        },
        {
            title: "Documents",
            icon: "documents",
            items: [
                { name: "Privacy Policy", type: "PDF", size: "156 KB" },
                { name: "Terms of Service", type: "PDF", size: "89 KB" },
            ],
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-h3">Assets</h2>
                <Button isSecondary>
                    <Icon className="mr-2 !w-5 !h-5" name="plus" />
                    Upload Asset
                </Button>
            </div>

            <div className="space-y-6">
                {assetCategories.map((category) => (
                    <div key={category.title}>
                        <div className="flex items-center mb-3 fill-t-secondary">
                            <Icon className="mr-2 !w-5 !h-5" name={category.icon} />
                            <h3 className="text-body-bold">{category.title}</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-3 max-lg:grid-cols-2 max-md:grid-cols-1">
                            {category.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-4xl bg-b-surface2 hover:shadow-hover transition-shadow cursor-pointer"
                                >
                                    <div className="flex items-center justify-center h-24 mb-3 rounded-2xl bg-b-surface1">
                                        <Icon className="!w-8 !h-8 fill-t-tertiary" name="documents" />
                                    </div>
                                    <div className="text-small font-medium truncate">{item.name}</div>
                                    <div className="flex items-center justify-between text-xs text-t-tertiary">
                                        <span>{item.type}</span>
                                        <span>{item.size}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="flex flex-col items-center justify-center p-4 rounded-4xl border-2 border-dashed border-stroke-subtle hover:border-primary1 hover:bg-primary1/5 transition-all cursor-pointer">
                                <Icon className="!w-6 !h-6 mb-2 fill-t-tertiary" name="plus" />
                                <span className="text-small text-t-secondary">Add {category.title.toLowerCase()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Assets;
