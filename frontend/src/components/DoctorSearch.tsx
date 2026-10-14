
"use client";

import { useMemo, useState } from "react";
import { doctors } from "@/data/doctors";
import type { Doctor } from "@/types/doctor";
import Link from "next/link";

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const initials = doctor.name
    .replace("Dr. ", "")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-xl font-bold text-teal-800">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-slate-900">{doctor.name}</h2>
          <p className="mt-1 text-sm text-teal-700">
            {doctor.specialty}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            ⭐ {doctor.rating} · {doctor.experience} years experience
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs text-slate-500">Consultation fee</p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            ₹{doctor.fee}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            doctor.available
              ? "bg-green-50 text-green-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {doctor.available ? "Available" : "Unavailable"}
        </span>
      </div>

      <Link
        href={`/appointments?doctorId=${doctor.id}`}
        aria-disabled={!doctor.available}
        className={`mt-5 block rounded-lg px-4 py-3 text-center font-semibold ${
          doctor.available
            ? "bg-teal-700 text-white hover:bg-teal-800"
            : "pointer-events-none bg-slate-100 text-slate-400"
        }`}
      >
        Book Appointment
      </Link>
    </article>
  );
}

export default function DoctorSearch() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");

  const specialties = [
    "All Specialties",
    ...new Set(doctors.map((doctor) => doctor.specialty)),
  ];

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
     
      const matchesName = doctor.name.toLowerCase().includes(search.trim().toLowerCase());
       console.log("usememo",matchesName); 
      const matchesSpecialty =  specialty === "All Specialties" ||  doctor.specialty === specialty;
      return matchesName && matchesSpecialty;
    });
  }, [search, specialty]);

  return (
    <section>
      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
        <div>
          <label htmlFor="doctor-search" className="mb-2 block text-sm font-semibold text-slate-700" > Search by doctor name </label>
          <input id="doctor-search"  type="search" value={search}  onChange={(event) => setSearch(event.target.value)} placeholder="e.g. Dr. Ananya Sharma" className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
        </div>
        <div>
          <label htmlFor="specialty-filter" className="mb-2 block text-sm font-semibold text-slate-700">
            Filter by specialization
          </label>
          <select id="specialty-filter"  value={specialty}  onChange={(event) => setSpecialty(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100">
            {specialties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900">
          Available Doctors
        </h2>
        <p className="text-sm text-slate-500" aria-live="polite">
          {filteredDoctors.length} doctor
          {filteredDoctors.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {filteredDoctors.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <h3 className="font-semibold text-slate-800"> No doctors found </h3>
          <p className="mt-2 text-sm text-slate-500"> Try another name or select a different specialty. </p>
          <button type="button" onClick={() => {
            setSearch("");  
            setSpecialty("All Specialties");}}
            className="mt-4 rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800">
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
