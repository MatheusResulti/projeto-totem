type SizeSelectorProps = {
  id: number;
  name: string;
  selected: boolean;
  onSelect: (id: number) => void;
  group?: string;
};

export default function SizeSelector({
  id,
  name,
  selected,
  onSelect,
  group = "product-size",
}: SizeSelectorProps) {
  const inputId = `size-${id}`;

  return (
    <label
      htmlFor={inputId}
      className={`w-full h-15 p-3 mb-2 border rounded-lg relative flex items-center touchable
                  ${
                    selected
                      ? "border-border-color ring-2 ring-primary"
                      : "border-gray-300"
                  }`}
    >
      <span>{name}</span>

      <button
        type="button"
        onClick={() => onSelect(id)}
        className="absolute inset-0 opacity-0"
        aria-hidden="true"
        tabIndex={-1}
      />

      <input
        id={inputId}
        type="radio"
        name={group}
        className="absolute right-3"
        checked={selected}
        onChange={() => onSelect(id)}
        value={id}
      />
    </label>
  );
}
