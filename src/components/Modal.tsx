"use client";
export default function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 animate-fade-in" style={{ background: "rgba(0,0,0,.7)", backdropFilter: "blur(4px)", padding: "40px 16px", overflowY: "auto" }} onClick={onClose}>
      <div className="w-full max-w-[560px] animate-slide-up" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}
