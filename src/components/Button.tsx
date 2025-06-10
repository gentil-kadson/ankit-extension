import type { ButtonHTMLAttributes } from "react";

interface Button extends ButtonHTMLAttributes<HTMLButtonElement> {
  styleType?: "primary" | "secondary" | "danger";
}

export default function Button({ styleType = "primary", ...props }: Button) {
  const styleTypes = {
    primary: "bg-blue-700 hover:bg-blue-800",
    secondary: "bg-stone-700 hover:bg-stone-800",
    danger: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      {...props}
      className={`rounded-md py-2 px-3 flex justify-center items-center ${styleTypes[styleType]} cursor-pointer`}
    ></button>
  );
}
