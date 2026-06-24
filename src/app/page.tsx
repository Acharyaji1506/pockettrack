import AuthForm from "@/components/AuthForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-16 md:flex-row md:gap-20">
        <div className="max-w-md text-center md:text-left">
          <p className="mb-3 inline-block rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-teal">
            Made for students &amp; bachelors · 100% free
          </p>
          <h1 className="display text-4xl font-semibold leading-tight text-text md:text-5xl">
            Know where your <span className="text-accent">paisa</span> actually goes.
          </h1>
          <p className="mt-4 text-base text-muted">
            Log every expense in two taps, see it on a calendar, and get a daily
            nudge before you forget. No spreadsheet, no card details, ever.
          </p>
          <ul className="mt-6 flex flex-col gap-2 text-sm text-muted">
            <li>· Day-by-day calendar of your spending</li>
            <li>· Monthly totals, automatically</li>
            <li>· Categories built for student life</li>
            <li>· One year of history, then it tidies itself up</li>
          </ul>
        </div>

        <AuthForm />
      </main>
      <Footer />
    </>
  );
}
