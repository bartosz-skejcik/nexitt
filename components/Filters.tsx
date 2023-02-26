import { RadioGroup } from "@headlessui/react";
import {
    AdjustmentsVerticalIcon,
    FireIcon,
    RocketLaunchIcon,
    StarIcon,
} from "@heroicons/react/24/outline";

type Props = {
    filterOption: string;
    setFilterOption: any;
};

let options = [
    { name: "Best", value: "best" },
    { name: "Hot", value: "hot" },
    { name: "New", value: "new" },
];

export default function Filters({ filterOption, setFilterOption }: Props) {
    return (
        <section className="w-full py-4 px-8 bg-neutral-900 rounded-xl">
            <RadioGroup
                value={filterOption}
                onChange={setFilterOption}
                className="flex items-center justify-start gap-4 w-full"
            >
                <RadioGroup.Label>
                    <AdjustmentsVerticalIcon className="w-7 h-7 bg-transparent text-neutral-500" />
                </RadioGroup.Label>
                {options.map((option, index) => (
                    <RadioGroup.Option
                        value={option.value}
                        key={index}
                        className="hover:cursor-pointer"
                    >
                        {({ checked }) => (
                            <div
                                className={`px-3 py-1 flex items-center justify-center rounded-xl ${
                                    checked
                                        ? "bg-blue-300 text-blue-600"
                                        : "bg-neutral-800 text-neutral-500/80"
                                }`}
                            >
                                {option.value == "best" ? (
                                    <RocketLaunchIcon className="w-6 h-6" />
                                ) : option.value == "new" ? (
                                    <StarIcon className="w-6 h-6" />
                                ) : (
                                    <FireIcon className="w-6 h-6" />
                                )}
                                <span className="ml-2 font-medium">
                                    {option.name}
                                </span>
                            </div>
                        )}
                    </RadioGroup.Option>
                ))}
            </RadioGroup>
        </section>
    );
}
