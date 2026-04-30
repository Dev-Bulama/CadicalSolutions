export default function StepBar({ step }: { step: number }) {
  return (
    <div className="flex bg-off border-b border-border px-6">
      {[1, 2, 3, 4].map((s, i) => (
        <div key={s} className="flex-1 flex items-center relative py-4">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
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
            {["Service", "Details", "Time", "Confirm"][i]}
          </span>

          {i < 3 && (
            <div className="absolute right-0 top-1/2 w-5 h-[1px] bg-border" />
          )}
        </div>
      ))}
    </div>
  );
}