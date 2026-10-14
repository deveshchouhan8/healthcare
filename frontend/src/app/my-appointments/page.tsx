
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

type Appointment = {
  id: number;
  doctor_id: number;
  patient_name: string;
  doctor_name: string;
  email: string;
  appointment_date: string;
  appointment_time: string;
  reason: string | null;
};

export default function MyAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch(
            "http://localhost:5000/api/appointments",
            {
              method: "GET",
              credentials: "include",
              cache: "no-store",
            }
          );

          if (response.status === 401) {
            router.replace("/login");
            return;
          }         

          
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to load appointments");
          }
        setAppointments(data.appointments);
      } 
      catch(err) {
        setError("Unable to load appointments. Please try again.");
      }
      finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);
  console.log("hee",appointments);
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            My Appointments
          </h1>

          <p className="mb-8 text-gray-600">
            View your booked appointments.
          </p>

          {loading && <p>Loading appointments...</p>}

          {error && (
            <p className="text-red-600">{error}</p>
          )}

          {!loading && !error && appointments.length === 0 && (
            <p className="rounded-lg bg-white p-6 shadow">
              No appointments found.
            </p>
          )}

          {!loading && !error && appointments.length > 0 && (
            <div className="overflow-x-auto rounded-lg bg-white shadow">
              <table className="w-full text-left">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-4">Doctor ID</th>
                    <th className="p-4">Doctor Name</th>
                    <th className="p-4">Patient</th>
                    <th className="p-4">Email</th>                
                    <th className="p-4">Date</th>
                    <th className="p-4">Time</th>
                    <th className="p-4">Reason</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-b hover:bg-gray-50"
                    >
                        <td className="p-4">{appointment.id}</td>
                      <td className="p-4">{appointment.doctor_name}</td>
                      <td className="p-4">
                        {appointment.patient_name}
                      </td>
                      <td className="p-4">{appointment.email}</td>
                     
                      <td className="p-4">
                        {String(appointment.appointment_date).slice(0, 10)}
                      </td>
                      <td className="p-4">
                        {String(appointment.appointment_time).slice(0, 5)}
                      </td>
                      <td className="p-4">
                        {appointment.reason || "Not specified"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
