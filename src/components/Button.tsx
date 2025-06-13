import type { ButtonHTMLAttributes } from "react";

interface Button extends ButtonHTMLAttributes<HTMLButtonElement> {
  styleType?: "primary" | "secondary" | "danger";
}

export default function Button({ styleType = "primary", ...props }: Button) {
  const styleTypes = {
    primary: "bg-blue-700",
    secondary: "bg-stone-800",
    danger: "bg-red-600",
  };

  return (
    <button
      {...props}
      className={`rounded-md py-2 px-3 flex justify-center items-center ${
        styleTypes[styleType]
      } ${
        props.disabled ? "brightness-50" : undefined
      } cursor-pointer hover:brightness-90 border-2 border-blue-700`}
    ></button>
  );
}
