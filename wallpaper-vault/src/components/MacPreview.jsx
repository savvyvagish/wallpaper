export default function MacPreview() {
  return (
    <div className="fixed inset-0 z-30 pointer-events-none">
      {/* Menu Bar — pinned to top, full width */}
      <div className="absolute top-0 left-0 w-full">
        <img
          src="/menu-bar.png"
          alt="macOS Menu Bar"
          className="w-full block"
          style={{
            height: 'auto',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          draggable={false}
        />
      </div>

      {/* Dock — pinned to bottom center */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
        {/* Glass background container */}
        <div
          style={{
            borderRadius: '20px',
            padding: '4px 6px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(30px) saturate(180%)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.35), inset 0 0.5px 0 rgba(255, 255, 255, 0.08)',
          }}
        >
          <img
            src="/dock.png"
            alt="macOS Dock"
            style={{
              height: '52px',
              display: 'block',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
