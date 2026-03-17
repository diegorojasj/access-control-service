import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

// ─── Z-index manager ────────────────────────────────────────────────────────
const BASE_Z = 1400;
const MAX_Z  = 1500;

type ModalEntry = { getZ: () => number; setZ: (z: number) => void };
const modalRegistry = new Set<ModalEntry>();
let highestModalZ = BASE_Z;

const normalizeZIndices = () => {
  modalRegistry.forEach(entry => entry.setZ(BASE_Z + 1));
  highestModalZ = BASE_Z + 1;
};

const claimNextZ = (): number => {
  if (highestModalZ >= MAX_Z) normalizeZIndices();
  return ++highestModalZ;
};

// ─── Types ──────────────────────────────────────────────────────────────────
interface DraggableModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  backdrop?: boolean;
  width?: number;
  bottomBar?: ReactNode;
  loading?: boolean;
  dismissible?: boolean;
}

interface DraggablePaperProps {
  position: { x: number; y: number };
  onDrag: (pos: { x: number; y: number }) => void;
  onBringToFront: () => void;
  topbar: ReactNode;
  bottombar?: ReactNode;
  content: ReactNode;
  maxWidth: number;
  actualWidth: number;
  actualHeight: number;
  zIndex: number;
}

// ─── Responsive width helper ────────────────────────────────────────────────
const getResponsiveWidth = (maxWidth: number, vw: number): number => {
  if (vw < 640) return Math.min(maxWidth, vw - 16);
  if (vw < 768) return Math.min(maxWidth, vw - 32);
  if (vw < 1024) return Math.min(maxWidth, vw - 48);
  return Math.min(maxWidth, vw - 64);
};

// ─── Hook: responsive dimensions ────────────────────────────────────────────
const useResponsiveDimensions = (maxWidth: number) => {
  const [dimensions, setDimensions] = useState(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    return {
      width: getResponsiveWidth(maxWidth, vw),
      height: Math.min(vh * 0.9, 900),
      viewportWidth: vw,
      viewportHeight: vh,
    };
  });

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        setDimensions({
          width: getResponsiveWidth(maxWidth, vw),
          height: Math.min(vh * 0.9, 900),
          viewportWidth: vw,
          viewportHeight: vh,
        });
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [maxWidth]);

  return dimensions;
};

// ─── Hook: modal position management ────────────────────────────────────────
const useModalPosition = (open: boolean, width: number, height: number) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prevViewport = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if (open) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const viewportChanged =
        Math.abs(prevViewport.current.width - vw) > 100 ||
        Math.abs(prevViewport.current.height - vh) > 100;

      if (viewportChanged || position.x === 0) {
        const x = Math.max(0, (vw - width) / 2);
        const topPadding = Math.max(16, Math.min(72, Math.round(vh * 0.08)));
        setPosition({ x, y: topPadding });
        prevViewport.current = { width: vw, height: vh };
      }
    }
  }, [open, width, height]);

  useEffect(() => {
    if (!open) return;
    const debounced = setTimeout(() => {
      setPosition((prev) => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let newX = prev.x;
        let newY = prev.y;
        if (prev.x + width > vw) newX = Math.max(0, vw - width - 20);
        if (prev.y + height > vh) newY = Math.max(0, vh - height - 20);
        if (prev.x < 0) newX = 20;
        if (prev.y < 0) newY = 20;
        return newX !== prev.x || newY !== prev.y
          ? { x: newX, y: newY }
          : prev;
      });
    }, 300);
    return () => clearTimeout(debounced);
  }, [open, width, height]);

  return [position, setPosition] as const;
};

// ─── DraggablePaper (using shadcn Card) ─────────────────────────────────────
const DraggablePaper = memo(
  ({
    position,
    onDrag,
    onBringToFront,
    topbar,
    bottombar,
    content,
    maxWidth,
    actualWidth,
    actualHeight,
    zIndex,
  }: DraggablePaperProps) => {
    const isDragging = useRef(false);

    const clampPosition = useCallback(
      (x: number, y: number) => {
        const maxX = window.innerWidth - Math.min(200, actualWidth / 2);
        const maxY = window.innerHeight - Math.min(70, actualHeight / 2);
        const minX = -actualWidth + Math.min(200, actualWidth / 2);
        const minY = -30;
        return {
          x: Math.min(maxX, Math.max(minX, x)),
          y: Math.min(maxY, Math.max(minY, y)),
        };
      },
      [actualWidth, actualHeight]
    );

    const handleMouseDown = useCallback(
      (event: React.MouseEvent) => {
        onBringToFront();
        isDragging.current = true;
        const startX = event.clientX - position.x;
        const startY = event.clientY - position.y;

        const onMouseMove = (e: MouseEvent) => {
          if (!isDragging.current) return;
          onDrag(clampPosition(e.clientX - startX, e.clientY - startY));
        };

        const onMouseUp = () => {
          isDragging.current = false;
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      },
      [position, onDrag, clampPosition, onBringToFront]
    );

    const handleTouchStart = useCallback(
      (event: React.TouchEvent) => {
        onBringToFront();
        const touch = event.touches[0];
        if (!touch) return;
        isDragging.current = true;
        const startX = touch.clientX - position.x;
        const startY = touch.clientY - position.y;

        const onTouchMove = (e: TouchEvent) => {
          if (!isDragging.current) return;
          e.preventDefault();
          const t = e.touches[0];
          if (!t) return;
          onDrag(clampPosition(t.clientX - startX, t.clientY - startY));
        };

        const onTouchEnd = () => {
          isDragging.current = false;
          document.removeEventListener("touchmove", onTouchMove);
          document.removeEventListener("touchend", onTouchEnd);
        };

        document.addEventListener("touchmove", onTouchMove, { passive: false });
        document.addEventListener("touchend", onTouchEnd);
      },
      [position, onDrag, clampPosition, onBringToFront]
    );

    const cardStyle = useMemo<CSSProperties>(
      () => ({
        top: position.y,
        left: position.x,
        minWidth: 300,
        maxWidth,
        width: "auto",
        maxHeight: "90vh",
        zIndex,
      }),
      [position, maxWidth, zIndex]
    );

    return (
      <Card
        className="fixed flex flex-col overflow-hidden rounded-lg shadow-xl border border-border !py-0 !gap-0"
        style={cardStyle}
      >
        {/* Header — drag handle */}
        <CardHeader
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          role="toolbar"
          aria-label="Draggable modal header"
          className="cursor-move select-none flex flex-row items-center justify-between space-y-0 border-b px-3 !py-1.5"
        >
          {topbar}
        </CardHeader>

        {/* Content */}
        <CardContent
          className="flex-1 overflow-y-auto overflow-x-hidden p-3"
          style={{ maxWidth }}
        >
          {content}
        </CardContent>

        {/* Footer */}
        {bottombar && (
          <CardFooter className="select-none border-t px-3 py-2">
            {bottombar}
          </CardFooter>
        )}
      </Card>
    );
  }
);

DraggablePaper.displayName = "DraggablePaper";

// ─── Main component ─────────────────────────────────────────────────────────
const DraggableModal: React.FC<DraggableModalProps> = ({
  open,
  onClose,
  title,
  children,
  backdrop = true,
  width = 600,
  bottomBar,
  loading,
  dismissible = true,
}) => {
  const [minimized, setMinimized] = useState(false);
  const zIndexRef = useRef(0);
  const [zIndex, setZIndex] = useState(() => {
    const z = claimNextZ();
    zIndexRef.current = z;
    return z;
  });

  useEffect(() => {
    const entry: ModalEntry = {
      getZ: () => zIndexRef.current,
      setZ: (z) => { zIndexRef.current = z; setZIndex(z); },
    };
    modalRegistry.add(entry);
    return () => { modalRegistry.delete(entry); };
  }, []);

  const dimensions = useResponsiveDimensions(width);
  const [position, setPosition] = useModalPosition(
    open,
    dimensions.width,
    dimensions.height
  );

  // Reset minimized state on open
  useEffect(() => {
    if (open) setMinimized(false);
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (!dismissible || loading) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, dismissible, onClose]);

  const handleDrag = useCallback(
    (pos: { x: number; y: number }) => setPosition(pos),
    [setPosition]
  );

  const handleBringToFront = useCallback(() => {
    const z = claimNextZ();
    zIndexRef.current = z;
    setZIndex(z);
  }, []);

  const handleMinimize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setMinimized((prev) => !prev);
  }, []);

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClose();
    },
    [onClose]
  );

  // ── Topbar ──────────────────────────────────────────────────────────────
  const topbarContent = useMemo(
    () => (
      <div className="flex items-center justify-between w-full px-3 py-1.5">
        <span className="text-sm font-semibold truncate">{title || ""}</span>
        {dismissible && (
          <div className="flex items-center gap-0.5 shrink-0 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleMinimize}
              aria-label={minimized ? "maximize" : "minimize"}
            >
              {minimized ? (
                <Maximize2 className="h-3.5 w-3.5" />
              ) : (
                <Minimize2 className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              disabled={loading}
              onClick={handleClose}
              aria-label="close"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    ),
    [title, loading, dismissible, handleMinimize, handleClose, minimized]
  );

  // ── Content wrapper (hidden when minimized to preserve state) ───────────
  const contentWrapper = useMemo(
    () => (
      <div className={`w-full ${minimized ? "hidden" : "block"}`}>
        {children}
      </div>
    ),
    [minimized, children]
  );

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      {backdrop && (
        <div
          className="fixed inset-0 bg-black/50 z-[1300]"
          onClick={dismissible ? onClose : undefined}
          aria-hidden="true"
        />
      )}

      <DraggablePaper
        maxWidth={dimensions.width}
        actualWidth={dimensions.width}
        actualHeight={minimized ? 50 : dimensions.height}
        position={position}
        onDrag={handleDrag}
        onBringToFront={handleBringToFront}
        topbar={topbarContent}
        content={contentWrapper}
        bottombar={!minimized ? bottomBar : undefined}
        zIndex={zIndex}
      />
    </>
  );
};

export default memo(DraggableModal);