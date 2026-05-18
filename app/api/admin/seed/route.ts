import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcryptjs from "bcryptjs"

const SEED_SECRET = process.env.SEED_SECRET ?? "cadical-seed-2026"
const PASSWORD = "Cadical@2026"

function tc() { return "CAD-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2,6).toUpperCase() }
function sc() { return "SCH-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2,5).toUpperCase() }
function bc() { return "BKG-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2,5).toUpperCase() }

// GET /api/admin/seed?secret=cadical-seed-2026&step=users|products|profiles|all
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const step = searchParams.get("step") ?? "all"

  try {
    const passwordHash = await bcryptjs.hash(PASSWORD, 12)

    // ── STEP: users ──────────────────────────────────────────────────────────
    if (step === "users" || step === "all") {
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
      for (const u of USERS) {
        await prisma.user.upsert({
          where: { email: u.email },
          update: {},
          create: {
            email: u.email, name: u.name, role: u.role, emailVerified: true,
            phone: "+2348012345678", city: "Lagos", state: "Lagos", country: "Nigeria",
            accounts: { create: { accountId: u.email, providerId: "credential", password: passwordHash } },
          },
        })
      }
      if (step === "users") return NextResponse.json({ success: true, step: "users", message: "8 users created. Password: " + PASSWORD })
    }

    // ── STEP: products ───────────────────────────────────────────────────────
    if (step === "products" || step === "all") {
      const PRODUCTS = [
        { sku:"IMG-001", name:"GE Voluson E10 Ultrasound",           category:"Imaging",        price:45000000, stock:3,    description:"High-end 4D ultrasound system for OB/GYN" },
        { sku:"IMG-002", name:"Siemens Luminos dRF Fluoroscopy",     category:"Imaging",        price:72000000, stock:2,    description:"Digital radiography and fluoroscopy system" },
        { sku:"IMG-003", name:"Philips Affiniti 70 Ultrasound",      category:"Imaging",        price:38000000, stock:4,    description:"Shared-service ultrasound for cardiology and radiology" },
        { sku:"IMG-004", name:"Canon Aquilion 64-Slice CT Scanner",  category:"Imaging",        price:180000000,stock:1,    description:"64-slice CT scanner for diagnostic imaging" },
        { sku:"IMG-005", name:"Mindray DC-70 Pro Ultrasound",        category:"Imaging",        price:22000000, stock:5,    description:"Premium diagnostic ultrasound with AI assistance" },
        { sku:"IMG-006", name:"Samsung HM70A Portable Ultrasound",   category:"Imaging",        price:8500000,  stock:8,    description:"Portable ultrasound for point-of-care use" },
        { sku:"IMG-007", name:"Agfa DR 100 X-Ray System",            category:"Imaging",        price:15000000, stock:4,    description:"Direct digital radiography system" },
        { sku:"IMG-008", name:"Carestream DRX-Evolution Plus",       category:"Imaging",        price:28000000, stock:2,    description:"Ceiling-suspended digital radiography system" },
        { sku:"IMG-009", name:"Fujifilm FDR D-EVO II Detector",      category:"Imaging",        price:9800000,  stock:6,    description:"Flat panel detector for DR systems" },
        { sku:"IMG-010", name:"Esaote MyLab X8 Ultrasound",          category:"Imaging",        price:18500000, stock:3,    description:"Ultrasound for musculoskeletal and vascular imaging" },
        { sku:"IMG-011", name:"Mindray Z60 Portable Ultrasound",     category:"Imaging",        price:6200000,  stock:10,   description:"Portable color Doppler ultrasound" },
        { sku:"IMG-012", name:"Shimadzu Flexavision Fluoroscopy",    category:"Imaging",        price:55000000, stock:1,    description:"Large-format fluoroscopy with flat panel detector" },
        { sku:"DX-001",  name:"Roche Cobas 6000 Analyzer",           category:"Diagnostics",    price:35000000, stock:2,    description:"Fully automated clinical chemistry and immunoassay" },
        { sku:"DX-002",  name:"Abbott Alinity i Immunoassay",        category:"Diagnostics",    price:28000000, stock:3,    description:"Random access immunoassay analyzer" },
        { sku:"DX-003",  name:"Sysmex XN-1000 Hematology Analyzer",  category:"Diagnostics",    price:12000000, stock:5,    description:"5-part differential hematology analyzer" },
        { sku:"DX-004",  name:"BioMerieux Vitek 2 Microbiology",     category:"Diagnostics",    price:22000000, stock:2,    description:"Automated microbial identification and AST" },
        { sku:"DX-005",  name:"Beckman Coulter AU480 Chemistry",     category:"Diagnostics",    price:18500000, stock:3,    description:"Mid-volume clinical chemistry analyzer" },
        { sku:"DX-006",  name:"Horiba Yumizen H500 Hematology",      category:"Diagnostics",    price:8500000,  stock:8,    description:"3-part differential hematology analyzer" },
        { sku:"DX-007",  name:"Mindray BC-6800 Hematology",          category:"Diagnostics",    price:9800000,  stock:6,    description:"5-part differential automated hematology system" },
        { sku:"DX-008",  name:"Diasorin Liaison XL Immunoassay",     category:"Diagnostics",    price:24000000, stock:2,    description:"CLIA-based random-access immunoassay system" },
        { sku:"DX-009",  name:"Stago STA-R Max Coagulation",         category:"Diagnostics",    price:16000000, stock:3,    description:"Automated coagulation analyzer" },
        { sku:"DX-010",  name:"Roche Accu-Chek Inform II POCT",      category:"Diagnostics",    price:450000,   stock:25,   description:"Hospital glucose meter system" },
        { sku:"DX-011",  name:"Abaxis Piccolo Xpress Chemistry",     category:"Diagnostics",    price:2800000,  stock:12,   description:"Point-of-care comprehensive metabolic panel" },
        { sku:"DX-012",  name:"Biosite Triage MeterPro Cardiac",     category:"Diagnostics",    price:3500000,  stock:8,    description:"POC cardiac marker analyzer (troponin, BNP)" },
        { sku:"ICU-001", name:"Dräger Evita V300 Ventilator",        category:"ICU",            price:18000000, stock:5,    description:"Advanced ICU ventilator with neonatology modes" },
        { sku:"ICU-002", name:"Hamilton G5 ICU Ventilator",          category:"ICU",            price:22000000, stock:3,    description:"Adaptive support ventilation for critical care" },
        { sku:"ICU-003", name:"Philips IntelliVue MX800 Monitor",    category:"ICU",            price:8500000,  stock:8,    description:"High-acuity patient monitor for ICU" },
        { sku:"ICU-004", name:"Edwards Vigileo Hemodynamic Monitor", category:"ICU",            price:6200000,  stock:5,    description:"Minimally invasive cardiac output monitoring" },
        { sku:"ICU-005", name:"Fresenius Kabi Agilia VP Infusion",   category:"ICU",            price:850000,   stock:30,   description:"Volumetric infusion pump with TCI module" },
        { sku:"ICU-006", name:"Mindray WATO EX-65 Anesthesia",       category:"ICU",            price:14000000, stock:4,    description:"Anesthesia machine with advanced ventilation" },
        { sku:"ICU-007", name:"Zoll E Series Defibrillator",         category:"ICU",            price:3500000,  stock:8,    description:"Biphasic defibrillator/monitor with CPR feedback" },
        { sku:"ICU-008", name:"Natus NicView NICU Camera",           category:"ICU",            price:1200000,  stock:12,   description:"NICU bedside camera for remote viewing" },
        { sku:"ICU-009", name:"Medtronic INVOS Cerebral Oximeter",   category:"ICU",            price:4500000,  stock:5,    description:"Noninvasive regional cerebral oxygen monitoring" },
        { sku:"ICU-010", name:"GE Giraffe Warmer Incubator",         category:"ICU",            price:7800000,  stock:4,    description:"Neonatal warmer/incubator combination" },
        { sku:"SRG-001", name:"Karl Storz Hopkins II Laparoscope",   category:"Surgery",        price:12000000, stock:6,    description:"30° 10mm laparoscope with HD optics" },
        { sku:"SRG-002", name:"Olympus VISERA 4K UHD System",        category:"Surgery",        price:38000000, stock:2,    description:"4K endoscopy system with fluorescence imaging" },
        { sku:"SRG-003", name:"Ethicon Harmonic Ace+ Shears",        category:"Surgery",        price:850000,   stock:20,   description:"Ultrasonic vessel sealing and dissection" },
        { sku:"SRG-004", name:"Steris System 1E Sterilizer",         category:"Surgery",        price:4500000,  stock:3,    description:"Low-temperature liquid sterilization system" },
        { sku:"SRG-005", name:"Medtronic O-arm Surgical Imaging",    category:"Surgery",        price:95000000, stock:1,    description:"Intraoperative 3D/2D imaging system" },
        { sku:"SRG-006", name:"Stryker 1688 4K Camera System",       category:"Surgery",        price:22000000, stock:3,    description:"AIM 4K camera with fluorescence capability" },
        { sku:"SRG-007", name:"Erbe VIO 300 D Electrosurgery",       category:"Surgery",        price:6800000,  stock:5,    description:"Advanced HF electrosurgery system" },
        { sku:"SRG-008", name:"Getinge HS66 Steam Sterilizer",       category:"Surgery",        price:8500000,  stock:3,    description:"Steam sterilizer for surgical instruments" },
        { sku:"SRG-009", name:"Zimmer Biomet PowerPro Drill System", category:"Surgery",        price:2200000,  stock:8,    description:"Surgical power tool system for orthopedics" },
        { sku:"SRG-010", name:"DePuy Synthes Carbon Fiber Retractor",category:"Surgery",        price:1500000,  stock:5,    description:"Radiolucent spine retractor system" },
        { sku:"LAB-001", name:"Eppendorf Mastercycler X50a PCR",     category:"Laboratory",     price:4500000,  stock:6,    description:"Gradient thermal cycler for molecular diagnostics" },
        { sku:"LAB-002", name:"Thermo Fisher Sorvall Legend X1R",    category:"Laboratory",     price:2800000,  stock:8,    description:"Refrigerated benchtop centrifuge" },
        { sku:"LAB-003", name:"Hettich ROTINA 380R Centrifuge",      category:"Laboratory",     price:1850000,  stock:10,   description:"Benchtop refrigerated centrifuge for blood processing" },
        { sku:"LAB-004", name:"Memmert INCOmed CO2 Incubator",       category:"Laboratory",     price:3200000,  stock:5,    description:"CO2 incubator with IR sensor and direct heat" },
        { sku:"LAB-005", name:"BioRad T100 Thermal Cycler",          category:"Laboratory",     price:2400000,  stock:8,    description:"Dual-block PCR thermal cycler" },
        { sku:"LAB-006", name:"Kern ABT 220-4M Analytical Balance",  category:"Laboratory",     price:480000,   stock:15,   description:"0.1mg resolution analytical balance" },
        { sku:"LAB-007", name:"Mettler Toledo ML204T Balance",       category:"Laboratory",     price:620000,   stock:12,   description:"1mg precision balance with draft shield" },
        { sku:"LAB-008", name:"Grant SUB Aqua Pro Water Bath",       category:"Laboratory",     price:380000,   stock:18,   description:"Stable temperature water bath for sample prep" },
        { sku:"LAB-009", name:"Esco Airstream Class II BSC",         category:"Laboratory",     price:2900000,  stock:4,    description:"Class II Type A2 biological safety cabinet" },
        { sku:"LAB-010", name:"Thermo Fisher 7000 Freezer -80C",     category:"Laboratory",     price:4200000,  stock:3,    description:"Ultra-low temperature freezer for sample storage" },
        { sku:"CON-001", name:"BD Vacutainer EDTA Tubes 3mL",        category:"Consumables",    price:8500,     stock:5000, description:"EDTA anticoagulant blood collection tubes (box 100)" },
        { sku:"CON-002", name:"BD Syringe 5mL Luer Lock",            category:"Consumables",    price:4200,     stock:8000, description:"5mL disposable syringe with Luer lock tip (box 100)" },
        { sku:"CON-003", name:"3M Tegaderm Transparent Dressing",    category:"Consumables",    price:85000,    stock:500,  description:"10x12cm transparent film dressing for IV sites (box 100)" },
        { sku:"CON-004", name:"Kimberly-Clark Surgical Gloves 7.5",  category:"Consumables",    price:38000,    stock:2000, description:"Sterile latex surgical gloves (box 50 pairs)" },
        { sku:"CON-005", name:"Cardinal Health Nitrile Exam Gloves", category:"Consumables",    price:22000,    stock:5000, description:"Powder-free nitrile examination gloves medium (box 100)" },
        { sku:"CON-006", name:"Smiths Medical Suction Catheter 14Fr",category:"Consumables",    price:12000,    stock:3000, description:"Sterile flexible suction catheter (box 50)" },
        { sku:"CON-007", name:"Covidien SCD Compression Sleeves",    category:"Consumables",    price:35000,    stock:800,  description:"Sequential compression device sleeves for DVT prevention" },
        { sku:"CON-008", name:"Braun Sterican Needle 21G x 1.5in",   category:"Consumables",    price:6500,     stock:6000, description:"Single-use hypodermic needle (box 100)" },
        { sku:"CON-009", name:"Hospira Normal Saline 0.9% 500mL",    category:"Consumables",    price:2500,     stock:3000, description:"Normal saline for IV infusion" },
        { sku:"CON-010", name:"Baxter Lactated Ringer 1000mL",       category:"Consumables",    price:3200,     stock:2500, description:"Balanced crystalloid IV solution" },
        { sku:"CON-011", name:"Molnlycke Mepilex Border 10x10cm",    category:"Consumables",    price:95000,    stock:400,  description:"Self-adherent foam dressing for pressure ulcers (box 10)" },
        { sku:"CON-012", name:"Smith & Nephew Allevyn Gentle Border",category:"Consumables",    price:88000,    stock:350,  description:"Silicone-bordered foam dressing (box 10)" },
        { sku:"CON-013", name:"Natus OAE Disposable Probe Tips",     category:"Consumables",    price:45000,    stock:1000, description:"Disposable probe tips for OAE screeners (box 100)" },
        { sku:"CON-014", name:"Welch Allyn Otoscope Specula 4mm",    category:"Consumables",    price:18000,    stock:1500, description:"Disposable specula for reusable otoscope handles" },
        { sku:"CON-015", name:"ConvaTec Sur-Fit Natura Flange 45mm", category:"Consumables",    price:55000,    stock:600,  description:"Ostomy flange for two-piece systems (box 10)" },
        { sku:"MON-001", name:"Philips MX40 Wearable Monitor",       category:"Monitoring",     price:4200000,  stock:15,   description:"Wireless ambulatory patient monitor" },
        { sku:"MON-002", name:"Masimo Root Patient Platform",        category:"Monitoring",     price:3800000,  stock:10,   description:"Multifunctional patient monitoring hub" },
        { sku:"MON-003", name:"Mindray BeneVision N19 Monitor",      category:"Monitoring",     price:2900000,  stock:12,   description:"19-inch touchscreen patient monitor" },
        { sku:"MON-004", name:"GE CARESCAPE B650 Monitor",           category:"Monitoring",     price:5500000,  stock:8,    description:"Patient data module with advanced analytics" },
        { sku:"MON-005", name:"Welch Allyn Connex Vital Signs",      category:"Monitoring",     price:1200000,  stock:20,   description:"Automated vital signs spot-check station" },
        { sku:"MON-006", name:"Nellcor PM10N Pulse Oximeter",        category:"Monitoring",     price:380000,   stock:40,   description:"Handheld pulse oximeter with SpO2/PR" },
        { sku:"MON-007", name:"Mortara ELI 380 ECG Machine",         category:"Monitoring",     price:2100000,  stock:8,    description:"12-lead resting ECG system with interpretation" },
        { sku:"MON-008", name:"Spacelabs Qube Ambulatory BP Monitor",category:"Monitoring",     price:950000,   stock:15,   description:"24-hour ambulatory blood pressure monitor" },
        { sku:"MON-009", name:"Nonin 3100 WristOx Pulse Oximeter",   category:"Monitoring",     price:280000,   stock:30,   description:"Wrist-worn pulse oximeter for continuous monitoring" },
        { sku:"MON-010", name:"Draeger Infinity Delta Monitor",       category:"Monitoring",     price:3200000,  stock:6,    description:"Modular bedside monitor for acute care" },
        { sku:"DNT-001", name:"Planmeca ProMax 3D CBCT",             category:"Dental",         price:48000000, stock:2,    description:"Cone beam CT for dental and maxillofacial imaging" },
        { sku:"DNT-002", name:"Dentsply Sirona Cerec Primescan",     category:"Dental",         price:28000000, stock:3,    description:"Intraoral scanner for chairside CAD/CAM" },
        { sku:"DNT-003", name:"Acteon Satelec P5 Newtron Scaler",    category:"Dental",         price:850000,   stock:15,   description:"Piezoelectric ultrasonic scaler with 5 presets" },
        { sku:"DNT-004", name:"Bien Air CA 1:5L Handpiece",          category:"Dental",         price:620000,   stock:20,   description:"Contra-angle 1:5 speed-increasing handpiece" },
        { sku:"DNT-005", name:"Mectron Piezosurgery Touch",          category:"Dental",         price:4200000,  stock:4,    description:"Piezoelectric bone surgery unit" },
        { sku:"DNT-006", name:"SDI Riva Self Cure GIC",              category:"Dental",         price:38000,    stock:200,  description:"Self-curing glass ionomer cement (pack)" },
        { sku:"DNT-007", name:"3M Filtek Supreme Ultra Composite",   category:"Dental",         price:45000,    stock:300,  description:"Universal nanofilled composite restorative (syringe)" },
        { sku:"DNT-008", name:"Heraeus Kulzer Venus Pearl Composite",category:"Dental",         price:35000,    stock:250,  description:"Nano-hybrid composite anterior/posterior (syringe)" },
        { sku:"DNT-009", name:"Kerr Total Etch Etchant Gel 37%",     category:"Dental",         price:22000,    stock:400,  description:"Phosphoric acid etching gel (pack of 10 syringes)" },
        { sku:"DNT-010", name:"Dentsply ProTaper Gold Rotary Files", category:"Dental",         price:85000,    stock:150,  description:"Endodontic rotary file system (pack of 6)" },
        { sku:"RHB-001", name:"Biodex System 4 Pro Dynamometer",     category:"Rehabilitation", price:18000000, stock:3,    description:"Isokinetic dynamometer for muscle testing" },
        { sku:"RHB-002", name:"BTL-6000 HIFU Physiotherapy",         category:"Rehabilitation", price:8500000,  stock:4,    description:"High intensity ultrasound for deep tissue therapy" },
        { sku:"RHB-003", name:"Enraf Nonius Sonopuls 492",           category:"Rehabilitation", price:1200000,  stock:8,    description:"Therapeutic ultrasound with combo therapy" },
        { sku:"RHB-004", name:"Medelec Synergy EMG/NCS Machine",     category:"Rehabilitation", price:12000000, stock:2,    description:"Electromyography and nerve conduction system" },
        { sku:"RHB-005", name:"DJO DonJoy Reaction Web Knee Brace",  category:"Rehabilitation", price:85000,    stock:100,  description:"Lightweight open patella knee brace" },
        { sku:"RHB-006", name:"Patterson Medical Parallel Bars",     category:"Rehabilitation", price:650000,   stock:10,   description:"Height-adjustable parallel walking bars" },
        { sku:"RHB-007", name:"Permobil M3 Power Wheelchair",        category:"Rehabilitation", price:5800000,  stock:5,    description:"Power wheelchair with tilt-in-space and elevation" },
        { sku:"RHB-008", name:"Invacare Platinum Mobile Oxygen 3L",  category:"Rehabilitation", price:380000,   stock:20,   description:"Portable oxygen concentrator 3L/min continuous" },
        { sku:"RHB-009", name:"Stryker Medical-Surgical Stretcher",  category:"Rehabilitation", price:1800000,  stock:8,    description:"Transport stretcher with power head section" },
        { sku:"RHB-010", name:"Hausmann Adjustable Treatment Table", category:"Rehabilitation", price:420000,   stock:12,   description:"Height-adjustable physical therapy table" },
        { sku:"RHB-011", name:"Natus Tympstar Pro Tympanometer",     category:"Rehabilitation", price:2100000,  stock:5,    description:"Clinical middle ear analyzer and audiometer" },
      ]
      // bulk insert — skip any that already exist by sku
      for (const p of PRODUCTS) {
        await prisma.product.upsert({ where: { sku: p.sku }, update: {}, create: p })
      }
      if (step === "products") return NextResponse.json({ success: true, step: "products", message: `${PRODUCTS.length} products seeded` })
    }

    // ── STEP: profiles (technician, supplier, institution, orders, etc.) ─────
    if (step === "profiles" || step === "all") {
      const techUser     = await prisma.user.findUnique({ where: { email: "technician@cadical.com" } })
      const supplierUser = await prisma.user.findUnique({ where: { email: "supplier@cadical.com" } })
      const customerUser = await prisma.user.findUnique({ where: { email: "customer@cadical.com" } })
      const hospitalUser = await prisma.user.findUnique({ where: { email: "hospital@cadical.com" } })
      const adminUser    = await prisma.user.findUnique({ where: { email: "admin@cadical.com" } })
      const superUser    = await prisma.user.findUnique({ where: { email: "superadmin@cadical.com" } })

      if (!techUser || !supplierUser || !customerUser) {
        return NextResponse.json({ success: false, error: "Run ?step=users first" }, { status: 400 })
      }

      // Technician profile
      if (!await prisma.technicianProfile.findUnique({ where: { userId: techUser.id } })) {
        await prisma.technicianProfile.create({ data: {
          userId: techUser.id, firstName: "Emeka", lastName: "Okafor",
          phone: "+2348023456789", specializations: ["ULTRASOUND","X_RAY","ICU_EQUIPMENT","VENTILATORS"],
          state: "Lagos", city: "Ikeja", baseAddress: "14 Allen Avenue, Ikeja",
          status: "ACTIVE", isAvailable: true, isOnJob: false,
          rating: 4.7, totalJobs: 142, completedJobs: 138,
          certifications: ["CBET","ISO_13485","MDCE"], yearsOfExperience: 8,
        }})
      }

      // Supplier
      if (!await prisma.supplier.findFirst({ where: { userId: supplierUser.id } })) {
        await prisma.supplier.create({ data: {
          userId: supplierUser.id, companyName: "MedTech Supply Nigeria Ltd",
          contactName: "Chukwuemeka Obi", cacNumber: "RC-1234567", taxId: "TIN-987654321",
          phone: "+2348012345678", email: "supplier@cadical.com", website: "https://medtechsupply.ng",
          address: "7 Broad Street", city: "Lagos Island", state: "Lagos", country: "Nigeria",
          category: ["Imaging","Diagnostics","ICU","Monitoring"],
          description: "Leading supplier of diagnostic and imaging equipment across West Africa",
          status: "APPROVED", rating: 4.5, totalOrders: 87,
        }})
      }

      // Institution
      let institutionId: string | undefined
      const existingInst = await prisma.institution.findFirst({ where: { instName: "Lagos General Hospital" } })
      if (!existingInst) {
        const inst = await prisma.institution.create({ data: {
          instName: "Lagos General Hospital", instType: "PUBLIC_HOSPITAL", cac: "LGH-2001-0042",
          state: "Lagos", lga: "Lagos Island", address: "1 Hospital Road, Lagos Island, Lagos",
          contactName: "Dr. Adaeze Nwosu", designation: "Medical Director",
          phone: "+2341234567890", email: "hospital@cadical.com",
          accountEmail: "hospital@cadical.com", passwordHash: passwordHash, bedCapacity: 350,
          services: ["Emergency","Surgery","Radiology","Laboratory"],
          specialistOpts: ["Cardiology","Neurology","Oncology"],
          consultOpts: ["Outpatient","Telemedicine"], reagentOpts: ["Chemistry","Hematology"],
          eduOpts: ["Training","Internship"],
        }})
        institutionId = inst.id
      } else {
        institutionId = existingInst.id
      }

      // Sample orders
      const products = await prisma.product.findMany({ take: 5 })
      if (products.length > 0 && !await prisma.order.findFirst({ where: { userId: customerUser.id } })) {
        const statuses = ["PENDING","PROCESSING","DELIVERED"] as const
        for (let i = 0; i < 3; i++) {
          const p = products[i % products.length]
          await prisma.order.create({ data: {
            userId: customerUser.id, totalAmount: p.price * 1, status: statuses[i],
            trackingCode: tc(), shippingAddress: "15 Victoria Island, Lagos, Nigeria",
            orderItems: { create: { productId: p.id, quantity: 1, price: p.price } },
          }})
        }
      }

      // Maintenance schedule
      if (institutionId && hospitalUser && !await prisma.maintenanceSchedule.findFirst({ where: { institutionId } })) {
        await prisma.maintenanceSchedule.create({ data: {
          scheduleCode: sc(), userId: hospitalUser.id, institutionId,
          equipmentName: "GE Voluson E10 Ultrasound", equipmentModel: "Voluson E10",
          equipmentSerial: "GE-ULT-2024-001", serviceType: "PREVENTIVE_MAINTENANCE",
          frequency: "QUARTERLY", siteAddress: "1 Hospital Road, Lagos Island, Lagos",
          siteState: "Lagos", lastCompletedAt: new Date("2026-02-15"), nextDueDate: new Date("2026-05-15"),
          notes: "Quarterly preventive maintenance per manufacturer spec",
        }})
      }

      // Service booking
      const techProfile = await prisma.technicianProfile.findUnique({ where: { userId: techUser.id } })
      if (techProfile && !await prisma.serviceBooking.findFirst({ where: { userId: customerUser.id } })) {
        await prisma.serviceBooking.create({ data: {
          bookingCode: bc(), userId: customerUser.id, serviceType: "REPAIR", urgency: "URGENT",
          equipmentName: "Philips IntelliVue MX800 Monitor", equipmentModel: "MX800",
          equipmentSerial: "PH-MON-2023-445",
          issueDescription: "Screen flickering and intermittent alarm failure during ICU monitoring",
          siteAddress: "24 Adeola Odeku Street, Victoria Island",
          siteCity: "Lagos", siteState: "Lagos", siteContact: "Dr. Amaka Eze",
          sitePhone: "+2348023456001", preferredDate: new Date("2026-05-28"),
          status: "TECHNICIAN_ASSIGNED", assignedTechId: techProfile.id,
          statusEvents: { create: [
            { status: "BOOKED",              message: "Service request submitted online",       notes: "Customer submitted via web portal" },
            { status: "APPROVED",            message: "Request reviewed and approved by admin", notes: "Approved within SLA window" },
            { status: "TECHNICIAN_ASSIGNED", message: "Technician Emeka Okafor assigned",      notes: "Auto-assigned based on specialization" },
          ]},
        }})
      }

      // Notifications
      if (adminUser) {
        await prisma.notification.createMany({ skipDuplicates: true, data: [
          { userId: adminUser.id, type: "SYSTEM",     title: "New Supplier Registration", message: "MedTech Supply Nigeria Ltd has submitted KYC documents.", actionUrl: "/admin/suppliers/pending", isRead: false },
          { userId: adminUser.id, type: "JOB_UPDATE", title: "Service Job Completed",     message: "Technician Emeka Okafor completed the repair on Philips MX800.", actionUrl: "/admin/service-jobs", isRead: true },
          { userId: adminUser.id, type: "SYSTEM",     title: "Maintenance Overdue Alert", message: "GE Voluson E10 at Lagos General Hospital is overdue for quarterly maintenance.", actionUrl: "/admin/maintenance", isRead: false },
        ]})
      }

      // Audit logs
      if (superUser && adminUser) {
        await prisma.auditLog.createMany({ data: [
          { userId: superUser.id, userEmail: "superadmin@cadical.com", userRole: "superadmin", action: "login",   entity: "user",     entityId: superUser.id,   ipAddress: "197.210.55.1" },
          { userId: adminUser.id, userEmail: "admin@cadical.com",      userRole: "admin",      action: "approve", entity: "supplier",                             ipAddress: "105.113.22.8" },
          { userId: adminUser.id, userEmail: "admin@cadical.com",      userRole: "admin",      action: "update",  entity: "product",  entityId: products[0]?.id, ipAddress: "105.113.22.8" },
        ]})
      }

      if (step === "profiles") return NextResponse.json({ success: true, step: "profiles", message: "Profiles, orders, bookings, notifications seeded" })
    }

    return NextResponse.json({
      success: true,
      message: "All steps complete",
      credentials: { password: PASSWORD, users: [
        { role: "superadmin", email: "superadmin@cadical.com" },
        { role: "admin",      email: "admin@cadical.com" },
        { role: "supplier",   email: "supplier@cadical.com" },
        { role: "technician", email: "technician@cadical.com" },
        { role: "customer",   email: "customer@cadical.com" },
        { role: "hospital",   email: "hospital@cadical.com" },
      ]},
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? String(error) }, { status: 500 })
  }
}
