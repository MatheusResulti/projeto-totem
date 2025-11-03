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
        className={`h-15 mb-3 text-2xl flex items-center justify-center transition-all
              ${
                selected
                  ? "font-bold border-b-5 border-green-700"
                  : "font-semibold text-gray-500"
              }
          `}
      >
        {name}
      </p>
    </button>
  );
}
