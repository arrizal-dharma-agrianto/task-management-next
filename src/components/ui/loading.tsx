"use client"

type LoadingProps = {
  variant?: "default" | "black";
};

export function Loading({ variant = "default" }: LoadingProps) {
  const spinnerClass =
    variant === "black"
      ? "border-black border-t-transparent"
      : "border-white border-t-transparent";

  return (
    <div
      className={`loader animate-spin rounded-full border-2 ${spinnerClass} h-4 w-4`}
      aria-label="Loading"
    ></div>
  );
}
