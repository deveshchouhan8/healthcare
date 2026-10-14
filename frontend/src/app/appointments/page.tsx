"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { doctors } from "@/data/doctors";

export default function AppointmentsPage() {
    
    const [patientName, setPatientName] = useState("");
    const [email, setEmail] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");

    
async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setMessage("");
  if (!selectedDoctor) {
    setMessage("Please select a valid doctor.");
    return;
  }

  if (!patientName.trim() || !email.trim() || !appointmentDate || !appointmentTime) {
    setMessage("Please fill in all required fields.");
    return;
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayString = `${year}-${month}-${day}`;

  if (appointmentDate < todayString) {
    setMessage("Please select today or a future date.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/appointments", {  
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doctor_id: selectedDoctor.id,
        patient_name: patientName.trim(),
        email: email.trim(),
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reason: reason.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Appointment booking failed.");
    }

    setMessage(data.message);
  } catch (error) {
    setMessage(
      error instanceof Error
        ? error.message
        : "Unable to book appointment. Please try again."
    );
  }
}

    const searchParams = useSearchParams();
    const doctorId = searchParams.get("doctorId");
    const selectedDoctor = doctors.find(
        (doctor) => doctor.id === Number(doctorId)
    );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-slate-900">
            Book an Appointment
          </h1>

          <p className="mt-2 text-slate-600">
            Select your doctor and provide your appointment details.
          </p>

          {selectedDoctor ? (
            <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">
                {selectedDoctor.name}
              </h2>

              <p className="mt-1 text-slate-600">
                {selectedDoctor.specialty}
              </p>

              <p className="mt-2 font-medium">
                Consultation Fee: ₹{selectedDoctor.fee}
              </p>
            </div>
          ) : (
            <p className="mt-6 rounded-lg bg-amber-50 p-4 text-amber-800">
              Please select a doctor from the Find Doctors page.
            </p>
          )}

    <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
            Patient Details
        </h2>
        <div>
            <label htmlFor="patientName" className="mb-1 block text-sm font-medium">
            Patient Name
            </label>
            <input
                id="patientName"
                name="patientName"
                type="text"
                placeholder="Enter your full name"
                value={patientName}
                onChange={(event) => setPatientName(event.target.value)}
                
                className="w-full rounded-lg border px-4 py-3"
            />
        </div>
        <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email Address
            </label>
            <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                
                className="w-full rounded-lg border px-4 py-3"
            />
        </div>
        <div>
            <label htmlFor="appointmentDate" className="mb-1 block text-sm font-medium">
            Appointment Date
            </label>
            <input
                id="appointmentDate"
                name="appointmentDate"
                type="date"
                value={appointmentDate}
                onChange={(event) => setAppointmentDate(event.target.value)}
                
                className="w-full rounded-lg border px-4 py-3"
            />
        </div>
        <div>
            <label htmlFor="appointmentTime" className="mb-1 block text-sm font-medium">
                Appointment Time
            </label>
            <input
                id="appointmentTime"
                name="appointmentTime"
                type="time"
                value={appointmentTime}
                onChange={(event) => setAppointmentTime(event.target.value)}
                
                className="w-full rounded-lg border px-4 py-3"
            />
        </div>
        <div>
            <label htmlFor="reason" className="mb-1 block text-sm font-medium">Reason for Visit</label>
            <textarea
                id="reason"
                name="reason"
                placeholder="Briefly describe your concern"
                rows={3}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="w-full rounded-lg border px-4 py-3"
            />
        </div>
        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700" >
            Book Appointment
        </button>
        {message && (
            <p className="mt-4 rounded-lg bg-green-50 p-3 text-green-700">
                {message}
            </p>
        )}
    </form>

        </div>        
    
      </main>
    </>
  );
}