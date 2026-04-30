"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepBar from "./step-bar";


type State = {
  service?: "maintenance" | "consultation";
  urgency?: string;
  format?: string;
  callerType?: string;
  bookingType?: string;
  selectedSlot?: string;
};

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<State>({});
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [ref, setRef] = useState("");

  const goToStep = (s: number) => setStep(s);

  const submit = async () => {
    setLoading(true);

    const res = await fetch("/api/booking", {
      method: "POST",
      body: JSON.stringify(state),
    });

    setLoading(false);

    const ref = "CAD-" + Math.floor(100000 + Math.random() * 900000);
    setRef(ref);
    setConfirmed(true);
  };

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      {!confirmed && <StepBar step={step} />}

      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-serif text-xl font-bold">
                What do you need?
              </h2>

              {/* SERVICE OPTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {[
                  {
                    id: "maintenance",
                    icon: "🔧",
                    title: "Equipment Maintenance & Repair",
                  },
                  {
                    id: "consultation",
                    icon: "💬",
                    title: "Supply Consultation",
                  },
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() =>
                      setState({ ...state, service: s.id as any })
                    }
                    className={`border rounded-lg p-4 cursor-pointer transition
                      ${
                        state.service === s.id
                          ? "border-blue bg-blue-light"
                          : "border-border hover:border-blue hover:bg-blue-light"
                      }`}
                  >
                    <div className="text-xl">{s.icon}</div>
                    <h4 className="font-semibold text-sm mt-2">{s.title}</h4>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => goToStep(2)}
                  className="bg-blue text-white px-6 py-2 rounded-md hover:bg-blue-dark transition"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-serif text-xl font-bold">Your Details</h2>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <input
                  placeholder="First name"
                  className="input"
                />
                <input
                  placeholder="Last name"
                  className="input"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => goToStep(1)}>← Back</button>
                <button onClick={() => goToStep(3)}>Next →</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="3">
              <h2 className="font-serif text-xl font-bold">
                Pick a time
              </h2>

              <div className="grid grid-cols-3 gap-2 mt-4">
                {["8:00 AM", "9:00 AM", "11:00 AM"].map((t) => (
                  <div
                    key={t}
                    onClick={() => setState({ ...state, selectedSlot: t })}
                    className={`border rounded p-2 text-center cursor-pointer
                      ${
                        state.selectedSlot === t
                          ? "bg-blue text-white border-blue"
                          : "hover:border-blue hover:bg-blue-light"
                      }`}
                  >
                    {t}
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => goToStep(2)}>← Back</button>
                <button onClick={() => goToStep(4)}>Review →</button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="4">
              <h2 className="font-serif text-xl font-bold">
                Review & Confirm
              </h2>

              <button
                onClick={submit}
                disabled={loading}
                className="mt-6 bg-green text-white px-6 py-2 rounded-md"
              >
                {loading ? "Submitting..." : "Confirm Booking"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {confirmed && (
          <div className="text-center py-10">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="font-serif text-2xl font-bold">
              Booking Received
            </h2>
            <div className="mt-4 text-blue font-semibold">
              Ref: {ref}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}