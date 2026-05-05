import Link from "next/link";

export default function CTA() {
  return (
    <section id="contact" className="bg-[#0d47a1] text-white py-20 px-5 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-4xl mb-4">
          Ready to work <span className="italic text-teal-soft">with Cadical?</span>
        </h2>

        <p className="mb-6 text-white/70">
          Open an account or talk to a specialist.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link href={'/auth/register'} className="bg-white text-[#0d47a1] px-6 py-3 rounded-full">
            Open account
          </Link>
          <a href="https://wa.me/2347076175550" className="border px-6 py-3 rounded-full">
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}