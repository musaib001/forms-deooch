// Standard portal page container. The portal layout intentionally imposes no
// width or padding so full-bleed pages (e.g. the submissions grid) can own the
// whole viewport; every other page opts into this.
export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">{children}</div>
  );
}
