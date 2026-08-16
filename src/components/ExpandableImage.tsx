import React, { useState, useEffect } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";

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

  // Prevent background body scrolling when expanded
  useEffect(() => {
    if (isExpanded) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
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

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (onClick) onClick(e);
    setIsExpanded((prev) => !prev);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsExpanded(false);
  };

  return (
    <>
      {/* Normal in-layout image with zoom-in cursor */}
      <div className={`relative inline-flex items-center justify-center ${containerClassName}`}>
        <img
          src={src}
          alt={alt}
          className={`${className} cursor-zoom-in transition duration-300 hover:brightness-105 active:scale-[0.98] select-none`}
          onClick={handleImageClick}
          title={props.title || "Toca la imagen para expandir en este lugar"}
          {...props}
        />
      </div>

      {/* In-place full expansion overlay (Tapping again closes and returns to normal size) */}
      {isExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt || "Imagen ampliada"}
          onClick={handleClose}
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-6 cursor-zoom-out animate-in fade-in duration-200 select-none"
        >
          {/* Top subtle hint and close button */}
          <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 flex items-center gap-2">
            <span className="hidden sm:inline-block px-3 py-1 bg-black/60 text-zinc-300 text-xs font-semibold rounded-full border border-zinc-700/60 backdrop-blur-xs">
              Toca la imagen o presiona Esc para volver
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="p-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700 shadow-2xl transition cursor-pointer active:scale-95 flex items-center justify-center"
              aria-label="Cerrar ampliación"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Expanded Image (Clicking on it directly also collapses it back to original size) */}
          <div
            onClick={handleClose}
            className="relative max-w-[96vw] max-h-[90vh] flex flex-col items-center justify-center cursor-zoom-out"
          >
            <img
              src={src}
              alt={alt}
              className={`max-h-[85vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10 ${expandedClassName}`}
            />
            {caption && (
              <div className="mt-3 px-4 py-2 bg-black/75 backdrop-blur-md rounded-xl border border-white/10 text-center max-w-xl">
                <p className="text-xs sm:text-sm font-semibold text-white">
                  {caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
