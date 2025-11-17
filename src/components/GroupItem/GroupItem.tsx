import type { GroupType } from "../../types/types";
import { useTotemColor } from "../../utils/useTotemColor";

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
  const { primary } = useTotemColor();

  return (
    <button onClick={() => onSelect(id)}>
      <p
        className={`h-15 mb-3 text-2xl flex items-center justify-center transition-all ${
          selected ? "font-bold" : "font-semibold text-gray-500"
        }`}
        style={{
          borderBottom: selected
            ? `5px solid ${primary}`
            : "5px solid transparent",
        }}
      >
        {name}
      </p>
    </button>
  );
}
