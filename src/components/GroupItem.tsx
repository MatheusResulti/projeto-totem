import type { GroupType } from "../types/types";

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
    <button onClick={() => onSelect(id)}>
      <p
        className={`h-10 mb-3 w-full flex items-center justify-center transition-all
              ${
                selected
                  ? "font-semibold border-b-4 border-green-700"
                  : "font-medium text-gray-500"
              }
          `}
      >
        {name}
      </p>
    </button>
  );
}
