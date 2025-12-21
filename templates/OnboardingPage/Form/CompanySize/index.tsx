import Icon from "@/components/Icon";

const sizes = [
    {
        id: "just-me",
        title: "Just me",
        icon: "profile",
    },
    {
        id: "2-5",
        title: "2-5 people",
        icon: "post",
    },
    {
        id: "6-15",
        title: "6-15 people",
        icon: "post",
    },
    {
        id: "16-50",
        title: "16-50 people",
        icon: "documents",
    },
    {
        id: "50+",
        title: "50+ people",
        icon: "documents",
    },
];

type Props = {
    value: string;
    onChange: (value: string) => void;
};

const CompanySize = ({ value, onChange }: Props) => {
    return (
        <div className="flex flex-wrap -mt-4 -mx-2 max-md:-mt-3 max-md:-mx-1.5">
            {sizes.map((size) => (
                <div
                    className={`w-[calc(50%-1rem)] mt-4 mx-2 px-6 py-5.5 border-[1.5px] border-stroke1 rounded-[1.25rem] text-heading font-medium! text-t-secondary fill-t-secondary hover:border-transparent hover:bg-b-surface2 hover:shadow-hover hover:text-t-primary hover:fill-t-primary cursor-pointer transition-all max-md:w-[calc(50%-0.75rem)] max-md:mt-3 max-md:mx-1.5 ${
                        value === size.id
                            ? "border-stroke-focus! text-t-primary! fill-t-primary!"
                            : ""
                    }`}
                    key={size.id}
                    onClick={() => onChange(size.id)}
                >
                    <Icon
                        className="mb-8 fill-inherit max-3xl:mb-5"
                        name={size.icon}
                    />
                    <div className="">{size.title}</div>
                </div>
            ))}
        </div>
    );
};

export default CompanySize;
