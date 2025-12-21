import Icon from "@/components/Icon";

const useCases = [
    {
        id: "track-services",
        title: "Track services & renewals",
        icon: "generation",
    },
    {
        id: "manage-credentials",
        title: "Manage credentials",
        icon: "lock",
    },
    {
        id: "cost-tracking",
        title: "Track costs & spending",
        icon: "documents",
    },
    {
        id: "team-collaboration",
        title: "Team collaboration",
        icon: "share",
    },
];

type Props = {
    value: string;
    onChange: (value: string) => void;
};

const UseCase = ({ value, onChange }: Props) => {
    return (
        <div className="flex flex-wrap -mt-4 -mx-2 max-md:-mt-3 max-md:-mx-1.5">
            {useCases.map((useCase) => (
                <div
                    className={`w-[calc(50%-1rem)] mt-4 mx-2 px-6 py-5.5 border-[1.5px] border-stroke1 rounded-[1.25rem] text-heading font-medium! text-t-secondary fill-t-secondary hover:border-transparent hover:bg-b-surface2 hover:shadow-hover hover:text-t-primary hover:fill-t-primary cursor-pointer transition-all max-md:w-[calc(50%-0.75rem)] max-md:mt-3 max-md:mx-1.5 ${
                        value === useCase.id
                            ? "border-stroke-focus! text-t-primary! fill-t-primary!"
                            : ""
                    }`}
                    key={useCase.id}
                    onClick={() => onChange(useCase.id)}
                >
                    <Icon
                        className="mb-8 fill-inherit max-3xl:mb-5"
                        name={useCase.icon}
                    />
                    <div className="">{useCase.title}</div>
                </div>
            ))}
        </div>
    );
};

export default UseCase;
