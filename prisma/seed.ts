import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcryptjs from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as any)

async function hashPw(pw: string) {
  return bcryptjs.hash(pw, 12)
}

const PASSWORD = "Cadical@2026"

// ─── USERS ───────────────────────────────────────────────────────────────────

const USERS = [
  { email: "superadmin@cadical.com", name: "Super Admin",    role: "superadmin" },
  { email: "admin@cadical.com",      name: "Admin User",     role: "admin"      },
  { email: "supplier@cadical.com",   name: "MedTech Supply", role: "supplier"   },
  { email: "vendor@cadical.com",     name: "Vendor Partner", role: "vendor"     },
  { email: "technician@cadical.com", name: "Field Tech",     role: "technician" },
  { email: "customer@cadical.com",   name: "Jane Hospital",  role: "customer"   },
  { email: "hospital@cadical.com",   name: "Lagos General",  role: "hospital"   },
  { email: "freeuser@cadical.com",   name: "Free User",      role: "user"       },
]

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

const PRODUCTS = [
  // IMAGING (12)
  { name: "GE Voluson E10 Ultrasound", category: "Imaging", price: 45000000, description: "High-end 4D ultrasound system for OB/GYN", stock: 3, unit: "unit", brand: "GE Healthcare" },
  { name: "Siemens Luminos dRF Fluoroscopy", category: "Imaging", price: 72000000, description: "Digital radiography and fluoroscopy system", stock: 2, unit: "unit", brand: "Siemens Healthineers" },
  { name: "Philips Affiniti 70 Ultrasound", category: "Imaging", price: 38000000, description: "Shared-service ultrasound for cardiology and radiology", stock: 4, unit: "unit", brand: "Philips" },
  { name: "Canon Aquilion 64-Slice CT Scanner", category: "Imaging", price: 180000000, description: "64-slice CT scanner for diagnostic imaging", stock: 1, unit: "unit", brand: "Canon Medical" },
  { name: "Mindray DC-70 Pro Ultrasound", category: "Imaging", price: 22000000, description: "Premium diagnostic ultrasound with AI assistance", stock: 5, unit: "unit", brand: "Mindray" },
  { name: "Samsung HM70A Ultrasound", category: "Imaging", price: 8500000, description: "Portable ultrasound for point-of-care use", stock: 8, unit: "unit", brand: "Samsung Medison" },
  { name: "Agfa DR 100 X-Ray System", category: "Imaging", price: 15000000, description: "Direct digital radiography system", stock: 4, unit: "unit", brand: "Agfa" },
  { name: "Carestream DRX-Evolution Plus", category: "Imaging", price: 28000000, description: "Ceiling-suspended digital radiography system", stock: 2, unit: "unit", brand: "Carestream" },
  { name: "Fujifilm FDR D-EVO II Detector", category: "Imaging", price: 9800000, description: "Flat panel detector for DR systems", stock: 6, unit: "unit", brand: "Fujifilm" },
  { name: "Esaote MyLab X8 Ultrasound", category: "Imaging", price: 18500000, description: "Ultrasound for musculoskeletal and vascular imaging", stock: 3, unit: "unit", brand: "Esaote" },
  { name: "Mindray Z60 Portable Ultrasound", category: "Imaging", price: 6200000, description: "Portable color Doppler ultrasound", stock: 10, unit: "unit", brand: "Mindray" },
  { name: "Shimadzu Flexavision Fluoroscopy", category: "Imaging", price: 55000000, description: "Large-format fluoroscopy with flat panel detector", stock: 1, unit: "unit", brand: "Shimadzu" },

  // DIAGNOSTICS (12)
  { name: "Roche Cobas 6000 Analyzer", category: "Diagnostics", price: 35000000, description: "Fully automated clinical chemistry and immunoassay", stock: 2, unit: "unit", brand: "Roche" },
  { name: "Abbott Alinity i Immunoassay", category: "Diagnostics", price: 28000000, description: "Random access immunoassay analyzer", stock: 3, unit: "unit", brand: "Abbott" },
  { name: "Sysmex XN-1000 Hematology Analyzer", category: "Diagnostics", price: 12000000, description: "5-part differential hematology analyzer", stock: 5, unit: "unit", brand: "Sysmex" },
  { name: "BioMerieux Vitek 2 Microbiology", category: "Diagnostics", price: 22000000, description: "Automated microbial identification and AST", stock: 2, unit: "unit", brand: "BioMerieux" },
  { name: "Beckman Coulter AU480 Chemistry", category: "Diagnostics", price: 18500000, description: "Mid-volume clinical chemistry analyzer", stock: 3, unit: "unit", brand: "Beckman Coulter" },
  { name: "Horiba Yumizen H500 Hematology", category: "Diagnostics", price: 8500000, description: "3-part differential hematology analyzer", stock: 8, unit: "unit", brand: "Horiba" },
  { name: "Mindray BC-6800 Hematology", category: "Diagnostics", price: 9800000, description: "5-part differential automated hematology system", stock: 6, unit: "unit", brand: "Mindray" },
  { name: "Diasorin Liaison XL Immunoassay", category: "Diagnostics", price: 24000000, description: "CLIA-based random-access immunoassay system", stock: 2, unit: "unit", brand: "Diasorin" },
  { name: "Stago STA-R Max Coagulation", category: "Diagnostics", price: 16000000, description: "Automated coagulation analyzer", stock: 3, unit: "unit", brand: "Stago" },
  { name: "Roche Accu-Chek Inform II POCT", category: "Diagnostics", price: 450000, description: "Hospital glucose meter system", stock: 25, unit: "unit", brand: "Roche" },
  { name: "Abaxis Piccolo Xpress Chemistry", category: "Diagnostics", price: 2800000, description: "Point-of-care comprehensive metabolic panel", stock: 12, unit: "unit", brand: "Abaxis" },
  { name: "Biosite Triage MeterPro Cardiac", category: "Diagnostics", price: 3500000, description: "POC cardiac marker analyzer (troponin, BNP)", stock: 8, unit: "unit", brand: "Biosite" },

  // ICU (10)
  { name: "Dräger Evita V300 Ventilator", category: "ICU", price: 18000000, description: "Advanced ICU ventilator with neonatology modes", stock: 5, unit: "unit", brand: "Dräger" },
  { name: "Hamilton G5 ICU Ventilator", category: "ICU", price: 22000000, description: "Adaptive support ventilation for critical care", stock: 3, unit: "unit", brand: "Hamilton Medical" },
  { name: "Philips IntelliVue MX800 Monitor", category: "ICU", price: 8500000, description: "High-acuity patient monitor for ICU", stock: 8, unit: "unit", brand: "Philips" },
  { name: "Edwards Vigileo Hemodynamic Monitor", category: "ICU", price: 6200000, description: "Minimally invasive cardiac output monitoring", stock: 5, unit: "unit", brand: "Edwards Lifesciences" },
  { name: "Fresenius Kabi Agilia VP Infusion Pump", category: "ICU", price: 850000, description: "Volumetric infusion pump with TCI module", stock: 30, unit: "unit", brand: "Fresenius Kabi" },
  { name: "Mindray WATO EX-65 Anesthesia", category: "ICU", price: 14000000, description: "Anesthesia machine with advanced ventilation", stock: 4, unit: "unit", brand: "Mindray" },
  { name: "Zoll E Series Defibrillator", category: "ICU", price: 3500000, description: "Biphasic defibrillator/monitor with CPR feedback", stock: 8, unit: "unit", brand: "Zoll Medical" },
  { name: "Natus Neurology NicView Camera", category: "ICU", price: 1200000, description: "NICU bedside camera for remote viewing", stock: 12, unit: "unit", brand: "Natus" },
  { name: "Medtronic INVOS Cerebral Oximeter", category: "ICU", price: 4500000, description: "Noninvasive regional cerebral oxygen monitoring", stock: 5, unit: "unit", brand: "Medtronic" },
  { name: "GE Giraffe Warmer Incubator", category: "ICU", price: 7800000, description: "Neonatal warmer/incubator combination", stock: 4, unit: "unit", brand: "GE Healthcare" },

  // SURGERY (10)
  { name: "Karl Storz Hopkins II Laparoscope", category: "Surgery", price: 12000000, description: "30° 10mm laparoscope with HD optics", stock: 6, unit: "unit", brand: "Karl Storz" },
  { name: "Olympus VISERA 4K UHD System", category: "Surgery", price: 38000000, description: "4K endoscopy system with fluorescence imaging", stock: 2, unit: "unit", brand: "Olympus" },
  { name: "Ethicon Harmonic Ace+ Shears", category: "Surgery", price: 850000, description: "Ultrasonic vessel sealing and dissection", stock: 20, unit: "unit", brand: "Ethicon" },
  { name: "Steris System 1E Sterilizer", category: "Surgery", price: 4500000, description: "Low-temperature liquid sterilization system", stock: 3, unit: "unit", brand: "Steris" },
  { name: "Medtronic O-arm Surgical Imaging", category: "Surgery", price: 95000000, description: "Intraoperative 3D/2D imaging system", stock: 1, unit: "unit", brand: "Medtronic" },
  { name: "Stryker 1688 4K Camera System", category: "Surgery", price: 22000000, description: "AIM 4K camera with fluorescence capability", stock: 3, unit: "unit", brand: "Stryker" },
  { name: "Erbe VIO 300 D Electrosurgery", category: "Surgery", price: 6800000, description: "Advanced HF electrosurgery system", stock: 5, unit: "unit", brand: "Erbe" },
  { name: "Getinge HS66 Sterilizer", category: "Surgery", price: 8500000, description: "Steam sterilizer for surgical instruments", stock: 3, unit: "unit", brand: "Getinge" },
  { name: "Zimmer Biomet PowerPro Drill System", category: "Surgery", price: 2200000, description: "Surgical power tool system for orthopedics", stock: 8, unit: "unit", brand: "Zimmer Biomet" },
  { name: "DePuy Synthes Carbon Fiber Retractor", category: "Surgery", price: 1500000, description: "Radiolucent spine retractor system", stock: 5, unit: "unit", brand: "DePuy Synthes" },

  // LABORATORY (10)
  { name: "Eppendorf Mastercycler X50a PCR", category: "Laboratory", price: 4500000, description: "Gradient thermal cycler for molecular diagnostics", stock: 6, unit: "unit", brand: "Eppendorf" },
  { name: "Thermo Fisher Sorvall Legend X1R Centrifuge", category: "Laboratory", price: 2800000, description: "Refrigerated benchtop centrifuge", stock: 8, unit: "unit", brand: "Thermo Fisher" },
  { name: "Hettich ROTINA 380R Centrifuge", category: "Laboratory", price: 1850000, description: "Benchtop refrigerated centrifuge for blood processing", stock: 10, unit: "unit", brand: "Hettich" },
  { name: "Memmert INCOmed CO2 Incubator", category: "Laboratory", price: 3200000, description: "CO2 incubator with IR sensor and direct heat", stock: 5, unit: "unit", brand: "Memmert" },
  { name: "BioRad T100 Thermal Cycler", category: "Laboratory", price: 2400000, description: "Dual-block PCR thermal cycler", stock: 8, unit: "unit", brand: "Bio-Rad" },
  { name: "Kern ABT 220-4M Analytical Balance", category: "Laboratory", price: 480000, description: "0.1mg resolution analytical balance", stock: 15, unit: "unit", brand: "Kern" },
  { name: "Mettler Toledo ML204T Precision Balance", category: "Laboratory", price: 620000, description: "1mg precision balance with draft shield", stock: 12, unit: "unit", brand: "Mettler Toledo" },
  { name: "Grant SUB Aqua Pro Water Bath", category: "Laboratory", price: 380000, description: "Stable temperature water bath for sample prep", stock: 18, unit: "unit", brand: "Grant" },
  { name: "Esco Airstream Class II BSC", category: "Laboratory", price: 2900000, description: "Class II Type A2 biological safety cabinet", stock: 4, unit: "unit", brand: "Esco" },
  { name: "Thermo Fisher 7000 Series Freezer -80°C", category: "Laboratory", price: 4200000, description: "Ultra-low temperature freezer for sample storage", stock: 3, unit: "unit", brand: "Thermo Fisher" },

  // CONSUMABLES (15)
  { name: "BD Vacutainer EDTA Tubes 3mL", category: "Consumables", price: 8500, description: "EDTA anticoagulant blood collection tubes", stock: 5000, unit: "box of 100", brand: "BD" },
  { name: "Becton Dickinson Syringe 5mL Luer Lock", category: "Consumables", price: 4200, description: "5mL disposable syringe with Luer lock tip", stock: 8000, unit: "box of 100", brand: "BD" },
  { name: "3M Tegaderm Transparent Dressing 10x12cm", category: "Consumables", price: 85000, description: "Transparent film dressing for IV sites", stock: 500, unit: "box of 100", brand: "3M" },
  { name: "Kimberly-Clark Surgical Gloves Size 7.5", category: "Consumables", price: 38000, description: "Sterile latex surgical gloves", stock: 2000, unit: "box of 50 pairs", brand: "Kimberly-Clark" },
  { name: "Cardinal Health Nitrile Exam Gloves Medium", category: "Consumables", price: 22000, description: "Powder-free nitrile examination gloves", stock: 5000, unit: "box of 100", brand: "Cardinal Health" },
  { name: "Smiths Medical Portex Suction Catheter 14Fr", category: "Consumables", price: 12000, description: "Sterile flexible suction catheter", stock: 3000, unit: "box of 50", brand: "Smiths Medical" },
  { name: "Covidien Kendall SCD Compression Sleeves", category: "Consumables", price: 35000, description: "Sequential compression device sleeves for DVT prevention", stock: 800, unit: "pack of 10", brand: "Covidien" },
  { name: "Braun Sterican Needle 21G x 1.5 inch", category: "Consumables", price: 6500, description: "Single-use hypodermic needle", stock: 6000, unit: "box of 100", brand: "B. Braun" },
  { name: "Hospira 0.9% Normal Saline 500mL", category: "Consumables", price: 2500, description: "Normal saline for IV infusion", stock: 3000, unit: "each", brand: "Hospira" },
  { name: "Baxter Lactated Ringer 1000mL", category: "Consumables", price: 3200, description: "Balanced crystalloid IV solution", stock: 2500, unit: "each", brand: "Baxter" },
  { name: "Molnlycke Mepilex Border Foam Dressing", category: "Consumables", price: 95000, description: "Self-adherent foam dressing for pressure ulcers", stock: 400, unit: "box of 10", brand: "Molnlycke" },
  { name: "Smith & Nephew Allevyn Gentle Border", category: "Consumables", price: 88000, description: "Silicone-bordered foam dressing", stock: 350, unit: "box of 10", brand: "Smith & Nephew" },
  { name: "Natus Hearing Screen Disposable Probe Tips", category: "Consumables", price: 45000, description: "Disposable probe tips for OAE screeners", stock: 1000, unit: "box of 100", brand: "Natus" },
  { name: "Welch Allyn Specula for Otoscope 4mm", category: "Consumables", price: 18000, description: "Disposable specula for reusable otoscope handles", stock: 1500, unit: "box of 850", brand: "Welch Allyn" },
  { name: "ConvaTec Sur-Fit Natura Flange 45mm", category: "Consumables", price: 55000, description: "Ostomy flange for two-piece systems", stock: 600, unit: "box of 10", brand: "ConvaTec" },

  // MONITORING (10)
  { name: "Philips MX40 Wearable Patient Monitor", category: "Monitoring", price: 4200000, description: "Wireless ambulatory patient monitor", stock: 15, unit: "unit", brand: "Philips" },
  { name: "Masimo Root Patient Monitoring Platform", category: "Monitoring", price: 3800000, description: "Multifunctional patient monitoring hub", stock: 10, unit: "unit", brand: "Masimo" },
  { name: "Mindray BeneVision N19 Monitor", category: "Monitoring", price: 2900000, description: "19-inch touchscreen patient monitor", stock: 12, unit: "unit", brand: "Mindray" },
  { name: "GE CARESCAPE B650 Monitor", category: "Monitoring", price: 5500000, description: "Patient data module with advanced analytics", stock: 8, unit: "unit", brand: "GE Healthcare" },
  { name: "Welch Allyn Connex Vital Signs Monitor", category: "Monitoring", price: 1200000, description: "Automated vital signs spot-check station", stock: 20, unit: "unit", brand: "Welch Allyn" },
  { name: "Nellcor PM10N Pulse Oximeter", category: "Monitoring", price: 380000, description: "Handheld pulse oximeter with SpO2/PR", stock: 40, unit: "unit", brand: "Nellcor" },
  { name: "Mortara ELI 380 ECG Machine", category: "Monitoring", price: 2100000, description: "12-lead resting ECG system with interpretation", stock: 8, unit: "unit", brand: "Mortara" },
  { name: "Spacelabs Qube Ambulatory BP Monitor", category: "Monitoring", price: 950000, description: "24-hour ambulatory blood pressure monitor", stock: 15, unit: "unit", brand: "Spacelabs" },
  { name: "Nonin 3100 WristOx Pulse Oximeter", category: "Monitoring", price: 280000, description: "Wrist-worn pulse oximeter for continuous monitoring", stock: 30, unit: "unit", brand: "Nonin" },
  { name: "Draeger Infinity Delta Monitor", category: "Monitoring", price: 3200000, description: "Modular bedside monitor for acute care", stock: 6, unit: "unit", brand: "Dräger" },

  // DENTAL (10)
  { name: "Planmeca ProMax 3D CBCT", category: "Dental", price: 48000000, description: "Cone beam CT for dental and maxillofacial imaging", stock: 2, unit: "unit", brand: "Planmeca" },
  { name: "Dentsply Sirona Cerec Primescan Scanner", category: "Dental", price: 28000000, description: "Intraoral scanner for chairside CAD/CAM", stock: 3, unit: "unit", brand: "Dentsply Sirona" },
  { name: "Acteon Satelec P5 Newtron Scaler", category: "Dental", price: 850000, description: "Piezoelectric ultrasonic scaler with 5 presets", stock: 15, unit: "unit", brand: "Acteon" },
  { name: "Bien Air CA 1:5L Contra-angle Handpiece", category: "Dental", price: 620000, description: "Contra-angle 1:5 speed-increasing handpiece", stock: 20, unit: "unit", brand: "Bien-Air" },
  { name: "Mectron Piezosurgery Touch", category: "Dental", price: 4200000, description: "Piezoelectric bone surgery unit", stock: 4, unit: "unit", brand: "Mectron" },
  { name: "SDI Riva Self Cure GIC Powder/Liquid", category: "Dental", price: 38000, description: "Self-curing glass ionomer cement", stock: 200, unit: "pack", brand: "SDI" },
  { name: "3M ESPE Filtek Supreme Ultra Composite", category: "Dental", price: 45000, description: "Universal nanofilled composite restorative", stock: 300, unit: "syringe", brand: "3M" },
  { name: "Heraeus Kulzer Venus Pearl Composite", category: "Dental", price: 35000, description: "Nano-hybrid composite for anterior/posterior", stock: 250, unit: "syringe", brand: "Heraeus Kulzer" },
  { name: "Kerr Total Etch Etchant Gel 37%", category: "Dental", price: 22000, description: "Phosphoric acid etching gel", stock: 400, unit: "pack of 10 syringes", brand: "Kerr" },
  { name: "Dentsply ProTaper Gold Rotary Files", category: "Dental", price: 85000, description: "Endodontic rotary file system", stock: 150, unit: "pack of 6", brand: "Dentsply" },

  // REHABILITATION (11)
  { name: "Biodex System 4 Pro Dynamometer", category: "Rehabilitation", price: 18000000, description: "Isokinetic dynamometer for muscle testing", stock: 3, unit: "unit", brand: "Biodex" },
  { name: "BTL-6000 HIFU Physiotherapy", category: "Rehabilitation", price: 8500000, description: "High intensity ultrasound for deep tissue therapy", stock: 4, unit: "unit", brand: "BTL" },
  { name: "Enraf Nonius Sonopuls 492 Ultrasound", category: "Rehabilitation", price: 1200000, description: "Therapeutic ultrasound with combo therapy", stock: 8, unit: "unit", brand: "Enraf-Nonius" },
  { name: "Medelec Synergy EMG/NCS Machine", category: "Rehabilitation", price: 12000000, description: "Electromyography and nerve conduction system", stock: 2, unit: "unit", brand: "Medelec" },
  { name: "DJO DonJoy Reaction Web Knee Brace", category: "Rehabilitation", price: 85000, description: "Lightweight open patella knee brace", stock: 100, unit: "unit", brand: "DJO" },
  { name: "Patterson Medical Standard Parallel Bars", category: "Rehabilitation", price: 650000, description: "Height-adjustable parallel walking bars", stock: 10, unit: "unit", brand: "Patterson Medical" },
  { name: "Permobil M3 Power Wheelchair", category: "Rehabilitation", price: 5800000, description: "Power wheelchair with tilt-in-space and power seat elevation", stock: 5, unit: "unit", brand: "Permobil" },
  { name: "Invacare Platinum Mobile Oxygen", category: "Rehabilitation", price: 380000, description: "Portable oxygen concentrator 3L/min continuous", stock: 20, unit: "unit", brand: "Invacare" },
  { name: "Stryker Medical-Surgical Stretcher 1550", category: "Rehabilitation", price: 1800000, description: "Transport stretcher with power head section", stock: 8, unit: "unit", brand: "Stryker" },
  { name: "Hausmann Adjustable Treatment Table", category: "Rehabilitation", price: 420000, description: "Height-adjustable physical therapy table", stock: 12, unit: "unit", brand: "Hausmann" },
  { name: "Natus Tympstar Pro Tympanometer", category: "Rehabilitation", price: 2100000, description: "Clinical middle ear analyzer and audiometer", stock: 5, unit: "unit", brand: "Natus" },
]

// ─── SEED ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding Cadical database…")

  // ── Users ─────────────────────────────────────────────────────────────────
  const createdUsers: Record<string, string> = {}
  const passwordHash = await hashPw(PASSWORD)

  for (const u of USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        role: u.role,
        emailVerified: true,
        phone: "+234" + Math.floor(8000000000 + Math.random() * 999999999),
        city: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan"][Math.floor(Math.random() * 5)],
        state: ["Lagos", "FCT", "Rivers", "Kano", "Oyo"][Math.floor(Math.random() * 5)],
        country: "Nigeria",
        accounts: {
          create: {
            accountId: u.email,
            providerId: "credential",
            password: passwordHash,
          },
        },
      },
    })
    createdUsers[u.role] = user.id
    console.log(`  ✓ User: ${u.email} (${u.role})`)
  }

  // ── Products ──────────────────────────────────────────────────────────────
  let productCount = 0
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: `seed-${p.name.replace(/\s+/g, "-").toLowerCase().slice(0, 40)}` },
      update: {},
      create: {
        id: `seed-${p.name.replace(/\s+/g, "-").toLowerCase().slice(0, 40)}`,
        name: p.name,
        category: p.category,
        price: p.price,
        description: p.description,
        stock: p.stock,
        unit: p.unit,
        brand: p.brand ?? p.name.split(" ")[0],
        images: [],
        isActive: true,
      },
    })
    productCount++
  }
  console.log(`  ✓ Products: ${productCount} seeded`)

  // ── Technician Profile ────────────────────────────────────────────────────
  const techUserId = createdUsers["technician"]
  const existingProfile = await prisma.technicianProfile.findUnique({ where: { userId: techUserId } })
  if (!existingProfile) {
    await prisma.technicianProfile.create({
      data: {
        userId: techUserId,
        firstName: "Emeka",
        lastName: "Okafor",
        phone: "+2348023456789",
        specializations: ["ULTRASOUND", "X_RAY", "ICU_EQUIPMENT", "VENTILATORS"],
        state: "Lagos",
        city: "Ikeja",
        address: "14 Allen Avenue, Ikeja",
        status: "ACTIVE",
        isAvailable: true,
        isOnJob: false,
        rating: 4.7,
        totalJobs: 142,
        completedJobs: 138,
        certifications: ["CBET", "ISO_13485", "MDCE"],
        yearsOfExperience: 8,
      },
    })
    console.log("  ✓ Technician profile created")
  }

  // ── Supplier ──────────────────────────────────────────────────────────────
  const supplierUserId = createdUsers["supplier"]
  const existingSupplier = await prisma.supplier.findFirst({ where: { userId: supplierUserId } })
  if (!existingSupplier) {
    await prisma.supplier.create({
      data: {
        userId: supplierUserId,
        companyName: "MedTech Supply Nigeria Ltd",
        registrationNumber: "RC-1234567",
        taxId: "TIN-987654321",
        phone: "+2348012345678",
        email: "supplier@cadical.com",
        website: "https://medtechsupply.ng",
        address: "7 Broad Street",
        city: "Lagos Island",
        state: "Lagos",
        country: "Nigeria",
        categories: ["Imaging", "Diagnostics", "ICU", "Monitoring"],
        description: "Leading supplier of diagnostic and imaging equipment across West Africa",
        status: "APPROVED",
        kycVerified: true,
        rating: 4.5,
        totalOrders: 87,
        completedOrders: 83,
      },
    })
    console.log("  ✓ Supplier profile created")
  }

  // ── Institution ───────────────────────────────────────────────────────────
  const hospitalUserId = createdUsers["hospital"]
  const existingInstitution = await prisma.institution.findFirst({ where: { name: "Lagos General Hospital" } })
  let institutionId: string | undefined

  if (!existingInstitution) {
    const inst = await prisma.institution.create({
      data: {
        name: "Lagos General Hospital",
        type: "PUBLIC_HOSPITAL",
        registrationNumber: "LGH-2001-0042",
        phone: "+2341234567890",
        email: "hospital@cadical.com",
        website: "https://lagosgeneralhospital.gov.ng",
        address: "1 Hospital Road, Lagos Island",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
        beds: 350,
        isVerified: true,
      },
    })
    institutionId = inst.id
    console.log("  ✓ Institution created")
  } else {
    institutionId = existingInstitution.id
  }

  // ── Sample Orders ─────────────────────────────────────────────────────────
  const products = await prisma.product.findMany({ take: 5 })
  const customerUserId = createdUsers["customer"]

  if (products.length > 0) {
    for (let i = 0; i < 3; i++) {
      const product = products[i % products.length]
      const qty = Math.floor(Math.random() * 3) + 1
      const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"]
      await prisma.order.create({
        data: {
          userId: customerUserId,
          totalAmount: product.price * qty,
          status: statuses[i] as any,
          paymentStatus: i < 2 ? "PAID" : "PENDING",
          deliveryAddress: "15 Victoria Island, Lagos",
          deliveryCity: "Lagos",
          deliveryState: "Lagos",
          deliveryCountry: "Nigeria",
          items: {
            create: {
              productId: product.id,
              quantity: qty,
              unitPrice: product.price,
              totalPrice: product.price * qty,
            },
          },
        },
      })
    }
    console.log("  ✓ Sample orders created")
  }

  // ── Maintenance Schedule ──────────────────────────────────────────────────
  if (institutionId) {
    const existing = await prisma.maintenanceSchedule.findFirst({ where: { institutionId } })
    if (!existing) {
      await prisma.maintenanceSchedule.create({
        data: {
          userId: hospitalUserId,
          institutionId,
          equipmentName: "GE Voluson E10 Ultrasound",
          equipmentModel: "Voluson E10",
          serialNumber: "GE-ULT-2024-001",
          manufacturer: "GE Healthcare",
          frequency: "QUARTERLY",
          lastMaintenanceDate: new Date("2026-02-15"),
          nextDueDate: new Date("2026-05-15"),
          isOverdue: true,
          notes: "Quarterly preventive maintenance per manufacturer spec",
        },
      })
      console.log("  ✓ Maintenance schedule created")
    }
  }

  // ── Service Booking ───────────────────────────────────────────────────────
  const techProfile = await prisma.technicianProfile.findUnique({ where: { userId: techUserId } })
  const existingBooking = await prisma.serviceBooking.findFirst({ where: { userId: customerUserId } })
  if (!existingBooking && techProfile) {
    await prisma.serviceBooking.create({
      data: {
        userId: customerUserId,
        serviceType: "REPAIR",
        urgency: "URGENT",
        equipmentName: "Philips IntelliVue MX800 Monitor",
        equipmentModel: "MX800",
        serialNumber: "PH-MON-2023-445",
        manufacturer: "Philips",
        faultDescription: "Screen flickering and intermittent alarm failure",
        facilityName: "Victoria Island Medical Centre",
        facilityAddress: "24 Adeola Odeku Street, Victoria Island, Lagos",
        contactPerson: "Dr. Amaka Eze",
        contactPhone: "+2348023456001",
        preferredDate: new Date("2026-05-28"),
        status: "TECHNICIAN_ASSIGNED",
        technicianId: techProfile.id,
        statusEvents: {
          create: [
            { status: "BOOKED", note: "Service request submitted online" },
            { status: "APPROVED", note: "Request reviewed and approved" },
            { status: "TECHNICIAN_ASSIGNED", note: "Technician Emeka Okafor assigned" },
          ],
        },
      },
    })
    console.log("  ✓ Service booking created")
  }

  // ── Notification samples ──────────────────────────────────────────────────
  const notifUserId = createdUsers["admin"]
  await prisma.notification.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: notifUserId,
        type: "SYSTEM",
        title: "New Supplier Registration",
        message: "MedTech Supply Nigeria Ltd has submitted KYC documents for review.",
        actionUrl: "/admin/suppliers/pending",
        isRead: false,
      },
      {
        userId: notifUserId,
        type: "JOB_UPDATE",
        title: "Service Job Completed",
        message: "Technician Emeka Okafor has completed the repair on Philips MX800.",
        actionUrl: "/admin/service-jobs",
        isRead: true,
      },
      {
        userId: notifUserId,
        type: "SYSTEM",
        title: "Maintenance Overdue Alert",
        message: "GE Voluson E10 at Lagos General Hospital is overdue for quarterly maintenance.",
        actionUrl: "/admin/maintenance",
        isRead: false,
      },
    ],
  })
  console.log("  ✓ Sample notifications created")

  // ── Audit Logs ────────────────────────────────────────────────────────────
  await prisma.auditLog.createMany({
    data: [
      { userId: createdUsers["superadmin"], userEmail: "superadmin@cadical.com", userRole: "superadmin", action: "login", entity: "user", entityId: createdUsers["superadmin"], ipAddress: "197.210.55.1" },
      { userId: createdUsers["admin"], userEmail: "admin@cadical.com", userRole: "admin", action: "approve", entity: "supplier", entityId: "seed-medtech-supplier", ipAddress: "105.113.22.8" },
      { userId: createdUsers["admin"], userEmail: "admin@cadical.com", userRole: "admin", action: "update", entity: "product", entityId: products[0]?.id, ipAddress: "105.113.22.8" },
    ],
  })
  console.log("  ✓ Audit logs created")

  console.log("\n✅ Seed complete!")
  console.log("\n🔑 Demo credentials (password for all: Cadical@2026):")
  for (const u of USERS) {
    console.log(`   ${u.role.padEnd(12)} → ${u.email}`)
  }
}

main()
  .catch((e) => { console.error("Seed error:", e); process.exit(1) })
  .finally(() => prisma.$disconnect())
