import React from "react";

type Props = {
  className: string;
  value: string;
  selectedColor: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
};

const ColorSelector = ({ className, setColor, value, selectedColor }: Props) => {
  const isSelected = value === selectedColor;

  return (
    <div
      onClick={() => setColor(value)}
      className={`
        border-2 rounded-lg h-8 w-8 grid place-items-center shadow transition cursor-pointer
        ${className}
        ${isSelected ? "border-gray-600 scale-110" : "border-gray-100"}
      `}
    >
      {isSelected && (
        <span className="text-gray-600 font-bold">✓</span>
        )}
    </div>
  );
};

export default ColorSelector;
