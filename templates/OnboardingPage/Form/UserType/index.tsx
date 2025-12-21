import Icon from "@/components/Icon";

const types = [
    {
        id: "solo-founder",
        title: "Solo Founder",
        icon: "profile",
    },
    {
        id: "agency",
        title: "Agency",
        icon: "post",
    },
    {
        id: "startup",
        title: "Startup",
        icon: "cube",
    },
    {
        id: "freelancer",
        title: "Freelancer",
        icon: "magic-pencil",
    },
];

type Props = {
    value: string;
    onChange: (value: string) => void;
};

const UserType = ({ value, onChange }: Props) => {
    return (
        <div className="flex flex-wrap -mt-4 -mx-2 max-md:-mt-3 max-md:-mx-1.5">
            {types.map((type) => (
                <div
                    className={`w-[calc(50%-1rem)] mt-4 mx-2 px-6 py-5.5 border-[1.5px] border-stroke1 rounded-[1.25rem] text-heading font-medium! text-t-secondary fill-t-secondary hover:border-transparent hover:bg-b-surface2 hover:shadow-hover hover:text-t-primary hover:fill-t-primary cursor-pointer transition-all max-md:w-[calc(50%-0.75rem)] max-md:mt-3 max-md:mx-1.5 ${
                        value === type.id
                            ? "border-stroke-focus! text-t-primary! fill-t-primary!"
                            : ""
                    }`}
                    key={type.id}
                    onClick={() => onChange(type.id)}
                >
                    <Icon
                        className="mb-8 fill-inherit max-3xl:mb-5"
                        name={type.icon}
                    />
                    <div className="">{type.title}</div>
                </div>
            ))}
        </div>
    );
};

export default UserType;
