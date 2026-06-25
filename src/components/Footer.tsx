export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted">
          Built by <span className="text-text">Jatin Acharya</span> ·{" "}
          <a href="mailto:Jatinacharyan@gmail.com" className="underline hover:text-accent">
            Jatinacharyan@gmail.com
          </a>
        </p>
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-border bg-surface-2 px-5 py-2 text-sm font-medium text-text transition hover:border-accent hover:text-accent"
        >
          Built for Digital Heroes
        </a>
      </div>
    </footer>
  );
}
