
import Link from "next/link";
import Header from "@/components/Header";
import DoctorSearch from "@/components/DoctorSearch";

export default function DoctorsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <section className="bg-gradient-to-r from-teal-50 to-sky-50">
        <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
          <Link
            href="/"
            className="text-sm font-medium text-teal-700 hover:text-teal-900"
          >
            ← Back to Home
          </Link>

          <p className="mt-6 font-semibold uppercase tracking-widest text-teal-700">
            Find your specialist
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-5xl">
            Find the right doctor for you
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Explore our sample doctor directory, compare specialties,
            and find a healthcare professional for your needs.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 md:py-14">
        <DoctorSearch />
      </div>
    </main>
  );
}
