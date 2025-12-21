import Icon from "@/components/Icon";

const counts = [
    {
        id: "1-2",
        title: "1-2 products",
        icon: "cube",
    },
    {
        id: "3-5",
        title: "3-5 products",
        icon: "cube",
    },
    {
        id: "6-10",
        title: "6-10 products",
        icon: "cube",
    },
    {
        id: "10+",
        title: "10+ products",
        icon: "cube",
    },
];

type Props = {
    value: string;
    onChange: (value: string) => void;
};

const ProductCount = ({ value, onChange }: Props) => {
    return (
        <div className="flex flex-wrap -mt-4 -mx-2 max-md:-mt-3 max-md:-mx-1.5">
            {counts.map((count) => (
                <div
                    className={`w-[calc(50%-1rem)] mt-4 mx-2 px-6 py-5.5 border-[1.5px] border-stroke1 rounded-[1.25rem] text-heading font-medium! text-t-secondary fill-t-secondary hover:border-transparent hover:bg-b-surface2 hover:shadow-hover hover:text-t-primary hover:fill-t-primary cursor-pointer transition-all max-md:w-[calc(50%-0.75rem)] max-md:mt-3 max-md:mx-1.5 ${
                        value === count.id
                            ? "border-stroke-focus! text-t-primary! fill-t-primary!"
                            : ""
                    }`}
                    key={count.id}
                    onClick={() => onChange(count.id)}
                >
                    <Icon
                        className="mb-8 fill-inherit max-3xl:mb-5"
                        name={count.icon}
                    />
                    <div className="">{count.title}</div>
                </div>
            ))}
        </div>
    );
};

export default ProductCount;
