export default function Footer() {
  return (
    <footer className="bg-teal-900 text-white px-5 py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

        <div>
          <h3 className="font-serif text-xl mb-3">Cadical</h3>
          <p className="text-sm text-white/60">
            Nigeria's healthcare supply partner.
          </p>
        </div>

        <div>
          <p className="text-xs mb-3">SHOP</p>
          <ul className="space-y-2 text-sm">
            <li>Pharmacy</li>
            <li>Equipment</li>
          </ul>
        </div>

        <div>
          <p className="text-xs mb-3">COMPANY</p>
          <ul className="space-y-2 text-sm">
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <p className="text-xs mb-3">LEGAL</p>
          <ul className="space-y-2 text-sm">
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </div>

      </div>

      {/* <div className="mt-10 text-xs text-white/50">
        © 2026 Cadical Solutions Ltd
      </div> */}
    </footer>
  );
}