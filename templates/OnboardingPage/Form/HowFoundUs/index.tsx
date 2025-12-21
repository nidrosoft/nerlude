import Icon from "@/components/Icon";

const sources = [
    {
        id: "twitter",
        title: "Twitter / X",
        icon: "share",
    },
    {
        id: "producthunt",
        title: "Product Hunt",
        icon: "star",
    },
    {
        id: "google",
        title: "Google Search",
        icon: "external-link",
    },
    {
        id: "friend",
        title: "Friend / Colleague",
        icon: "profile",
    },
    {
        id: "linkedin",
        title: "LinkedIn",
        icon: "post",
    },
    {
        id: "other",
        title: "Other",
        icon: "bulb",
    },
];

type Props = {
    value: string;
    onChange: (value: string) => void;
};

const HowFoundUs = ({ value, onChange }: Props) => {
    return (
        <div className="flex flex-wrap -mt-4 -mx-2 max-md:-mt-3 max-md:-mx-1.5">
            {sources.map((source) => (
                <div
                    className={`w-[calc(50%-1rem)] mt-4 mx-2 px-6 py-5.5 border-[1.5px] border-stroke1 rounded-[1.25rem] text-heading font-medium! text-t-secondary fill-t-secondary hover:border-transparent hover:bg-b-surface2 hover:shadow-hover hover:text-t-primary hover:fill-t-primary cursor-pointer transition-all max-md:w-[calc(50%-0.75rem)] max-md:mt-3 max-md:mx-1.5 ${
                        value === source.id
                            ? "border-stroke-focus! text-t-primary! fill-t-primary!"
                            : ""
                    }`}
                    key={source.id}
                    onClick={() => onChange(source.id)}
                >
                    <Icon
                        className="mb-8 fill-inherit max-3xl:mb-5"
                        name={source.icon}
                    />
                    <div className="">{source.title}</div>
                </div>
            ))}
        </div>
    );
};

export default HowFoundUs;
