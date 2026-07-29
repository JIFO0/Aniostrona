import { useEffect, useState } from "react";

type SetupCycleProps = {
  images: string[];
  intervalMs?: number;
  alt?: string;
  className?: string;
};

export function SetupCycle({
  images,
  intervalMs = 800,
  alt = "Domowy setup do nagrania filmiku-wizytówki",
  className = "",
}: SetupCycleProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-cream/40 ${className}`}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === index ? alt : ""}
          aria-hidden={i !== index}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            i === 0 ? "relative" : "absolute inset-0"
          } ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}
