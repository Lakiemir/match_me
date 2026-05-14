type PillColor = "green" | "yellow" | "purple" | "blue" | "red" | "gray";

type PillProps = {
  children: string;
  color?: PillColor;
};

export function Pill({ children, color = "gray" }: PillProps) {
  return <span className={`pill pill-${color}`}>{children}</span>;
}