export default function CTA() {
  return (
    <section id="contact" className="bg-teal-900 text-white py-20 px-5 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl mb-4">
          Ready to work <span className="italic text-teal-soft">with Cadical?</span>
        </h2>

        <p className="mb-6 text-white/70">
          Open an account or talk to a specialist.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-white text-teal-deep px-6 py-3 rounded-full">
            Open account
          </button>
          <a href="https://wa.me/2347076175550" className="border px-6 py-3 rounded-full">
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}