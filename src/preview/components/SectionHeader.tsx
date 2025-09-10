// src/preview/components/SectionHeader.tsx
type Props = {
  title: string;
  align?: "center" | "left";
  onClick?: () => void;
};

export function SectionHeader({ title, align = "center", onClick }: Props) {
  const base =
    (align === "center" ? "section--center" : "section--left") +
    " relative group w-full text-left";

  const content = (
    <>
      {align === "center" ? (
        <>
          <div className="section-line" />
          <div className="section-title">{title}</div>
          <div className="section-line" />
        </>
      ) : (
        <>
          <div className="section-title">{title}</div>
          <div className="section-line" />
        </>
      )}
      {/*onClick && (
        <div className="pointer-events-none absolute right-0 -top-3 text-[11px] rounded border bg-white/90 px-2 py-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
          Edit
        </div>
      )*/}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Edit ${title}`}
        className={base}
      >
        {content}
      </button>
    );
  }

  return <div className={base}>{content}</div>;
}
