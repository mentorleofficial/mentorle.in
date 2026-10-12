type ScrollRevealTextProps = {
  lead?: string;
  text: string;
  className?: string;
};

export function ScrollRevealText({ lead, text, className = "" }: ScrollRevealTextProps) {
  const words = text.split(" ");

  return (
    <p data-animate="words" className={className}>
      {lead && <span className="text-ink">{lead} </span>}
      {words.map((word, index) => (
        <span key={index} data-word className="text-subtle motion-reduce:text-ink">
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
