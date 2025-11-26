import type { GroupType } from "../../types/types";

interface GroupItemProps extends GroupType {
  selected: boolean;
  onSelect: (id: number) => void;
}

export default function GroupItem({
  id,
  name,
  selected,
  onSelect,
}: GroupItemProps) {

  return (
    <button className="h-11 flex w-full justify-center items-center transition-all ease-in-out duration-300" onClick={() => onSelect(id)}>
      <p
        className={`text-lg ${
          selected ? "font-bold" : "font-semibold text-gray-500"
        }`}
      >
        {name}
      </p>
    </button>
  );
}
