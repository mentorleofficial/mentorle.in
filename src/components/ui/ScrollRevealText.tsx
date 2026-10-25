type ScrollRevealTextProps = {
  lead?: string;
  text: string;
  className?: string;
};

export function ScrollRevealText({ lead, text, className = "" }: ScrollRevealTextProps) {
  const words = [lead, text].filter(Boolean).join(" ").split(/\s+/).filter(Boolean);

  return (
    <p data-animate="words" className={className}>
      {words.map((word, index) => (
        <span key={index} data-word className="text-subtle motion-reduce:text-brand">
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
