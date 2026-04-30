"use client";

import { useState } from "react";

export default function BookingForm() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState<any>({
    service: null,
    urgency: null,
    format: null,
    callerType: null,
    bookingType: null,
    selectedSlot: null,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [ref, setRef] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  // -------------------------
  // VALIDATION
  // -------------------------
  const validateStep = (s: number) => {
    let err: string[] = [];

    if (s === 1 && !form.service) err.push("service");

    if (s === 2) {
      if (!form.firstName) err.push("firstName");
      if (!form.lastName) err.push("lastName");
      if (!form.phone) err.push("phone");
      if (!form.email) err.push("email");
      if (!form.location) err.push("location");
      if (!form.callerType) err.push("callerType");
    }

    if (s === 3 && !form.bookingType) err.push("bookingType");

    setErrors(err);
    return err.length === 0;
  };

  const goToStep = (s: number) => {
    if (loading) return;
    if (s > step && !validateStep(step)) return;
    setStep(s);
  };

  // -------------------------
  // SUBMIT (PROPER)
  // -------------------------
  const submit = async () => {
    if (loading) return;

    setLoading(true);
    setErrors([]);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setRef(data.ref);
      setConfirmed(true);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // SUMMARY
  // -------------------------
  const summary = {
    service:
      form.service === "maintenance"
        ? "🔧 Equipment Maintenance & Repair"
        : form.service === "consultation"
        ? "💬 Supply Consultation"
        : "—",

    type:
      form.service === "maintenance"
        ? form.issueType
        : form.consultType || "—",

    name: `${form.firstName || ""} ${form.lastName || ""}${
      form.orgName ? " — " + form.orgName : ""
    }`,

    contact: `${form.phone || ""} · ${form.email || ""}`,
    location: form.location || "—",

    timing:
      form.bookingType === "slot"
        ? `${form.prefDate || ""} at ${form.selectedSlot || ""}`
        : form.bookingType === "callback"
        ? `Callback: ${form.callbackDate || ""}, ${form.callWindow || ""}`
        : "—",

    notes: form.notes || "None",
  };

  // -------------------------
  // SLOT
  // -------------------------
  const selectSlot = (slot: string, unavailable?: boolean) => {
    if (loading || unavailable) return;
    setForm({ ...form, selectedSlot: slot });
  };

  // -------------------------
  // CONFIRMATION
  // -------------------------
  if (confirmed) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl">✅</div>
        <h2 className="font-serif text-2xl mt-4">Booking Received</h2>
        <div className="mt-3 text-blue font-semibold">Ref: {ref}</div>
      </div>
    );
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="bg-white border border-border rounded-2xl">
      {/* STEP BAR */}
      <div className="flex border-b bg-off px-6">
        {["Service", "Details", "Time", "Confirm"].map((label, i) => {
          const s = i + 1;
          return (
            <div key={s} className="flex-1 flex items-center py-4 relative">
              <div
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold
                ${
                  step > s
                    ? "bg-green text-white"
                    : step === s
                    ? "bg-blue text-white"
                    : "bg-border text-muted"
                }`}
              >
                {step > s ? "✓" : s}
              </div>

              <span
                className={`ml-2 text-sm ${
                  step === s
                    ? "text-blue font-semibold"
                    : step > s
                    ? "text-green"
                    : "text-muted"
                }`}
              >
                {label}
              </span>

              {i < 3 && (
                <div className="absolute right-0 w-5 h-[1px] bg-border top-1/2" />
              )}
            </div>
          );
        })}
      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-6">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="font-serif text-xl">What do you need?</h2>

            <div className="grid md:grid-cols-2 gap-3">
              {[
                ["maintenance", "🔧", "Equipment Maintenance & Repair"],
                ["consultation", "💬", "Supply Consultation"],
              ].map(([id, icon, title]) => (
                <div
                  key={id}
                  onClick={() =>
                    !loading && setForm({ ...form, service: id })
                  }
                  className={`border rounded-lg p-4 cursor-pointer transition
                  ${
                    form.service === id
                      ? "border-blue bg-blue-light"
                      : "border-border hover:border-blue hover:bg-blue-light"
                  }
                  ${loading && "opacity-50 pointer-events-none"}
                  `}
                >
                  <div className="text-xl">{icon}</div>
                  <h4 className="text-sm font-semibold">{title}</h4>
                </div>
              ))}
            </div>

            {errors.includes("service") && (
              <p className="text-red text-sm">Please select a service</p>
            )}

            <button
              disabled={loading}
              onClick={() => goToStep(2)}
              className="bg-blue text-white px-6 py-2 rounded-md disabled:opacity-50"
            >
              Continue →
            </button>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h2 className="font-serif text-xl">Review</h2>

            <div className="bg-off border p-4 rounded">
              {Object.entries(summary).map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between border-b py-2 text-sm"
                >
                  <span className="text-muted capitalize">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="bg-green text-white px-6 py-2 rounded flex items-center gap-2 disabled:opacity-50"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? "Submitting..." : "Confirm Booking"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}