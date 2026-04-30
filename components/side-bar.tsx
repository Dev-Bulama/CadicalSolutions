export default function Sidebar() {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="bg-blue text-white px-5 py-3 font-serif font-bold">
          What to Expect
        </div>

        <div className="p-5">
          {[
            ["⏱️", "24hr Confirmation"],
            ["📍", "We Come to You"],
            ["💻", "Virtual Available"],
          ].map(([icon, text], i) => (
            <div
              key={i}
              className="flex gap-3 py-3 border-b last:border-none"
            >
              <span>{icon}</span>
              <div className="text-sm font-semibold">{text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}