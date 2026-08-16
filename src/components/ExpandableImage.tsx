import React, { useState, useEffect } from "react";

export type ExpandableImageProps = React.ComponentPropsWithoutRef<"img"> & {
  containerClassName?: string;
  expandedClassName?: string;
  caption?: string;
  disableExpand?: boolean;
  itemProp?: string;
};

export default function ExpandableImage({
  src,
  alt = "",
  className = "",
  containerClassName = "",
  expandedClassName = "",
  caption,
  disableExpand = false,
  onClick,
  ...props
}: ExpandableImageProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  if (disableExpand || !src) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onClick={onClick}
        {...props}
      />
    );
  }

  const handleToggle = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (onClick) onClick(e);
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      {/* Normal Image */}
      <img
        src={src}
        alt={alt}
        className={`${className} cursor-zoom-in transition-transform duration-200 active:scale-[0.98] select-none`}
        onClick={handleToggle}
        title={props.title || "Toca la imagen para expandirla"}
        {...props}
      />

      {/* Expanded state: ONLY the image itself, without any black box or background container */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 z-[99999] bg-transparent flex items-center justify-center p-2 sm:p-6 cursor-zoom-out select-none"
          role="dialog"
          aria-modal="true"
          aria-label={alt || "Imagen expandida"}
        >
          <img
            src={src}
            alt={alt}
            onClick={() => setIsExpanded(false)}
            className={`max-h-[88vh] max-w-[92vw] w-auto h-auto object-contain rounded-2xl shadow-2xl drop-shadow-[0_20px_45px_rgba(0,0,0,0.5)] transition-transform duration-300 transform scale-100 cursor-zoom-out ring-1 ring-black/10 ${expandedClassName}`}
            title="Toca para volver al tamaño original"
          />
        </div>
      )}
    </>
  );
}
