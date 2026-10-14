
import Link from "next/link";
import Header from "@/components/Header";

const specialties = [
  { icon: "🫀", name: "Cardiology", description: "Heart health" },
  { icon: "🧠", name: "Neurology", description: "Brain and nerves" },
  { icon: "🦴", name: "Orthopedics", description: "Bones and joints" },
  { icon: "🩺", name: "General Medicine", description: "Everyday healthcare" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="bg-gradient-to-br from-teal-50 via-white to-sky-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-4 font-semibold uppercase tracking-widest text-teal-700">
              Your health, our priority
            </p>

            <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
              Find the right doctor for your health
            </h1>

            <p className="mt-6 max-w-lg leading-7 text-slate-600">
              Connect with trusted healthcare professionals and book
              appointments with ease.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/doctors"
                className="rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white hover:bg-teal-800"
              >
                Find a Doctor
              </Link>

              <Link
                href="/register"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Get Started
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">
              <span>✓ Easy appointment booking</span>
              <span>✓ Responsive experience</span>
            </div>
          </div>

          <div className="flex min-h-72 items-center justify-center rounded-3xl bg-teal-100 p-8 md:min-h-96">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-lg">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-teal-50 text-5xl">
                🩺
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                Care that puts you first
              </h2>
              <p className="mt-3 text-slate-600">
                Your journey to better health starts here.
              </p>
              <div className="mt-6 rounded-lg bg-teal-50 p-3 text-sm font-medium text-teal-800">
                Your health matters every day
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-semibold text-teal-700">OUR SPECIALTIES</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Healthcare for every need
            </h2>
            <p className="mt-3 text-slate-600">
              Explore our medical specialties.
            </p>
          </div>

          <Link
            href="/doctors"
            className="font-semibold text-teal-700 hover:text-teal-900"
          >
            View all doctors →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {specialties.map((specialty) => (
            <article
              key={specialty.name}
              className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50 text-3xl">
                {specialty.icon}
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {specialty.name}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {specialty.description}
              </p>

              <Link
                href="/doctors"
                className="mt-5 inline-block font-medium text-teal-700"
              >
                Find a specialist →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 px-5 py-6 text-sm text-slate-600">
          <p>© 2026 MediCare+. Portfolio project.</p>
          <p>Healthcare made simpler.</p>
        </div>
      </footer>
    </main>
  );
}
