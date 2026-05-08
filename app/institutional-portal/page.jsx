"use client"
import { useState, Fragment } from "react";

/* ═══════════════════════════════════════════════════════════════
   CADICAL SOLUTIONS — Institutional Portal
   Flow: Welcome → Form (5 steps) → Confirmation → Dashboard
═══════════════════════════════════════════════════════════════ */

// ── Static Data ───────────────────────────────────────────────
const NG_STATES = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue",
  "Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT - Abuja","Gombe",
  "Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];

const INST_TYPES = ["General Hospital","Teaching Hospital","Specialist Hospital","Clinic",
  "Community Health Centre","Pharmacy","Laboratory","Diagnostic Centre",
  "Rehabilitation Centre","Research Institution","NGO / Health Organisation","Other"];

const SERVICES = [
  { id:"equipment",      icon:"🩺", name:"Medical Equipment",    desc:"Surgical & diagnostic devices" },
  { id:"consumables",    icon:"🧤", name:"Consumables",          desc:"PPE, syringes & disposables" },
  { id:"pharmaceuticals",icon:"💊", name:"Pharmaceuticals",      desc:"WHO-approved drugs" },
  { id:"specialist",     icon:"🔧", name:"Specialist Services",  desc:"Repair, maintenance & calibration" },
  { id:"consultations",  icon:"💬", name:"Consultations",        desc:"Supply chain advisory & planning" },
  { id:"reagents",       icon:"🧪", name:"Reagents & Chemicals", desc:"Lab reagents & assay kits" },
  { id:"surgical",       icon:"🏥", name:"Surgical Equipment",   desc:"Computer-assisted surgical systems" },
  { id:"educational",    icon:"📚", name:"Educational Materials",desc:"Medical training resources" },
];

const SPECIALIST_OPTS = ["Medical Equipment Repair & Servicing","Preventive Maintenance Contracts",
  "Equipment Calibration & Certification","Spare Parts Sourcing & Replacement",
  "On-site Technical Support","Equipment Refurbishment","Warranty & After-sales Management",
  "Cold Chain Equipment Servicing"];

const CONSULT_OPTS = ["Supply Chain Assessment & Optimisation","Healthcare Facility Equipping Advisory",
  "Product Selection & Formulary Planning","Demand Forecasting & Stock Management",
  "Vendor & Supplier Evaluation","Procurement Planning & Budgeting",
  "Regulatory & Import Compliance Advisory"];

const REAGENT_OPTS = ["Haematology Reagents","Biochemistry Reagents","Microbiology Reagents",
  "Immunology / Serology Kits","Histopathology Chemicals","PCR / Molecular Kits"];

const EDU_OPTS = ["Textbooks & Journals","Clinical Reference Guides","Training Manuals",
  "Anatomical Models","Simulation Equipment","Digital / e-Learning Resources"];

const VOLUMES = ["Under ₦500k/month","₦500k – ₦2M/month","₦2M – ₦5M/month",
  "₦5M – ₦20M/month","Above ₦20M/month"];

const ORDERS = [
  { id:"ORD-2291", item:"Autoclave Steriliser 23L",  qty:2,  status:"Delivered",  date:"28 Apr 2026", amt:"₦1,240,000" },
  { id:"ORD-2187", item:"Surgical Gloves (Box×50)",  qty:20, status:"In Transit", date:"02 May 2026", amt:"₦186,000"   },
  { id:"ORD-2102", item:"Amoxicillin 500mg ×1000",  qty:5,  status:"Processing", date:"05 May 2026", amt:"₦342,000"   },
  { id:"ORD-2044", item:"Haematology Reagent Kit",   qty:10, status:"Delivered",  date:"19 Apr 2026", amt:"₦890,000"   },
];

const TICKETS = [
  { id:"MNT-091", eq:"Ventilator Unit 3",      issue:"Alarm calibration",      status:"Scheduled",   date:"08 May 2026" },
  { id:"MNT-088", eq:"X-Ray Machine (Ward B)", issue:"Image quality degraded", status:"In Progress", date:"05 May 2026" },
  { id:"MNT-074", eq:"ECG Monitor",            issue:"Routine annual service", status:"Completed",   date:"22 Apr 2026" },
];

const CATALOGUE = [
  { id:1, name:"Digital BP Monitor",          cat:"Equipment",       price:"₦48,500",  tag:"New"       },
  { id:2, name:"IV Cannula 18G (×100)",        cat:"Consumables",     price:"₦12,000",  tag:""          },
  { id:3, name:"Metronidazole 200mg ×1000",   cat:"Pharmaceuticals", price:"₦67,000",  tag:"Low Stock" },
  { id:4, name:"Biochemistry Reagent Panel",  cat:"Reagents",        price:"₦124,000", tag:""          },
  { id:5, name:"Pulse Oximeter (Paed)",       cat:"Equipment",       price:"₦31,200",  tag:""          },
  { id:6, name:"Surgical Suture 2-0 (×12)",  cat:"Consumables",     price:"₦9,800",   tag:"New"       },
];

const DOCS = [
  { name:"CAC Certificate",        type:"Compliance", date:"Jan 2024",    status:"Verified" },
  { name:"NAFDAC Licence",         type:"Compliance", date:"Mar 2024",    status:"Verified" },
  { name:"Invoice ORD-2291",       type:"Invoice",    date:"28 Apr 2026", status:"Paid"     },
  { name:"Invoice ORD-2187",       type:"Invoice",    date:"02 May 2026", status:"Pending"  },
  { name:"Delivery Note ORD-2044", type:"Delivery",   date:"19 Apr 2026", status:"Received" },
];

const STATUS_C = {
  Delivered:   { bg:"#d4f1ec", fg:"#0d47a1" }, "In Transit":{ bg:"#fef3c7", fg:"#92400e" },
  Processing:  { bg:"#dbeafe", fg:"#1e40af" }, Scheduled:   { bg:"#dbeafe", fg:"#1e40af" },
  "In Progress":{ bg:"#fef3c7", fg:"#92400e"}, Completed:   { bg:"#d4f1ec", fg:"#0d47a1" },
  Verified:    { bg:"#d4f1ec", fg:"#0d47a1" }, Paid:        { bg:"#d4f1ec", fg:"#0d47a1" },
  Pending:     { bg:"#fef3c7", fg:"#92400e" }, Received:    { bg:"#e8f5e9", fg:"#2e7d32" },
};

const NAV = [
  { id:"overview",   label:"Overview",         icon:"⬡" },
  { id:"catalogue",  label:"Product Catalogue", icon:"⊞" },
  { id:"orders",     label:"My Orders",         icon:"↗" },
  { id:"maintenance",label:"Maintenance",       icon:"⚙" },
  { id:"consult",    label:"Consultations",     icon:"◎" },
  { id:"documents",  label:"Documents",         icon:"⊟" },
  { id:"account",    label:"Account",           icon:"◉" },
];

// ═══════════════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome|form|confirm|dashboard
  const [formData, setFormData] = useState({});
  const ref = "CAD-INST-" + "847291";

  if (screen === "welcome")   return <Welcome    onStart={() => setScreen("form")} />;
  if (screen === "form")      return <OnboardForm onDone={d => { setFormData(d); setScreen("confirm"); }} />;
  if (screen === "confirm")   return <Confirm    data={formData} refNo={ref} onEnter={() => setScreen("dashboard")} />;
  if (screen === "dashboard") return <Dashboard  data={formData} refNo={ref} />;
}

// ═══════════════════════════════════════════════════════════════
//  SCREEN 1 — WELCOME
// ═══════════════════════════════════════════════════════════════
function Welcome({ onStart }) {
  const features = [
    { icon:"🩺", title:"Medical Supply",    desc:"Equipment, consumables & pharmaceuticals at institutional rates" },
    { icon:"🔧", title:"Repair & Maintenance", desc:"Scheduled servicing, calibration & on-site technical support" },
    { icon:"💬", title:"Supply Consultations", desc:"Expert advisory on procurement, formulary & supply chain" },
    { icon:"🧪", title:"Reagents & Lab",    desc:"Full range of reagents, assay kits & lab chemicals" },
  ];
  return (
    <div style={w.wrap} className="max-w-screen">
      <div style={w.bg} />
      {/* <header style={w.header}>
        <Logo />
        <a href="https://www.cadical.com" style={w.backLink}>← Back to Cadical.com</a>
      </header> */}

      <div style={w.hero}>
        <div style={w.heroTag}>Institutional Portal</div>
        <h1 style={w.heroH}>Healthcare Supply,<br /><span style={w.heroAccent}>Simplified for Institutions.</span></h1>
        <p style={w.heroSub}>
          Join hundreds of Nigerian hospitals, clinics, and laboratories sourcing medical supplies,
          scheduling maintenance, and managing procurement through one verified portal.
        </p>
        <button style={w.cta} onClick={onStart}>Get Started — It's Free →</button>
        <p style={w.ctaNote}>2–3 day approval · No setup fees · Dedicated account manager</p>
      </div>

      <div style={w.featureGrid}>
        {features.map(f => (
          <div key={f.title} style={w.featureCard}>
            <span style={w.featureIcon}>{f.icon}</span>
            <div style={w.featureTitle}>{f.title}</div>
            <div style={w.featureDesc}>{f.desc}</div>
          </div>
        ))}
      </div>

      <div style={w.steps}>
        <p style={w.stepsLabel}>How it works</p>
        <div style={w.stepsRow}>
          {["Fill the 5-step form","Submit documents","Get approved in 2–3 days","Access your portal"].map((s,i)=>(
            <div key={i} style={w.step}>
              <div style={w.stepNum}>{i+1}</div>
              <div style={w.stepText}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* <footer style={w.footer}>
        <span>© 2026 Cadical Solutions Ltd · Nigeria</span>
        <span>🔒 SSL Secured · 📋 NAFDAC Aligned · 🇳🇬 CAC Registered</span>
      </footer> */}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SCREEN 2 — ONBOARDING FORM
// ═══════════════════════════════════════════════════════════════
const STEPS_META = [
  { label:"Institution Profile", icon:"🏥" },
  { label:"Location & Contact",  icon:"📍" },
  { label:"Service Needs",       icon:"⚕️" },
  { label:"Compliance",          icon:"🛡️" },
  { label:"Account Setup",       icon:"🔐" },
];

function OnboardForm({ onDone }) {
  const [step, setStep] = useState(0);
  const [fade, setFade] = useState(true);
  const [form, setForm] = useState({
    instName:"", instType:"", cac:"", year:"", staff:"", beds:"",
    state:"", lga:"", address:"", contactName:"", designation:"", phone:"", altPhone:"", email:"",
    services:[], specialistOpts:[], consultOpts:[], reagentOpts:[], eduOpts:[],
    volume:"", notes:"",
    nafdac:"", pcn:"", cacDoc:null, nafdacDoc:null, otherDoc:null, confirmDocs:false,
    accountEmail:"", password:"", confirmPw:"", agreeTerms:false, agreePrivacy:false, newsletter:false,
  });

  const up = (k,v) => setForm(f => ({ ...f, [k]:v }));
  const tog = (k,v) => setForm(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x=>x!==v) : [...f[k],v] }));
  const has = (v) => form.services.includes(v);

  const go = (n) => {
    setFade(false);
    setTimeout(() => { setStep(n); setFade(true); }, 220);
  };
  const uploadFile = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.url;
};

const handleSubmit = async () => {
  try {
    // 1. Upload files first
    const [cacUrl, nafdacUrl, otherUrl] = await Promise.all([
      uploadFile(form.cacDoc),
      uploadFile(form.nafdacDoc),
      uploadFile(form.otherDoc),
    ]);

    // 2. Build payload
    const payload = {
      instName: form.instName,
      instType: form.instType,
      cac: form.cac,
      yearEstablished: Number(form.year),
      staffCount: Number(form.staff),
      bedCapacity: Number(form.beds),

      state: form.state,
      lga: form.lga,
      address: form.address,

      contactName: form.contactName,
      designation: form.designation,
      phone: form.phone,
      altPhone: form.altPhone,
      email: form.email,

      services: form.services,
      specialistOpts: form.specialistOpts,
      consultOpts: form.consultOpts,
      reagentOpts: form.reagentOpts,
      eduOpts: form.eduOpts,

      volume: form.volume,
      notes: form.notes,

      nafdac: form.nafdac,
      pcn: form.pcn,
      confirmDocs: form.confirmDocs,

      accountEmail: form.accountEmail,
      password: form.password,

      documents: [
        cacUrl && { name: "CAC Certificate", type: "CAC", url: cacUrl },
        nafdacUrl && { name: "NAFDAC Licence", type: "NAFDAC", url: nafdacUrl },
        otherUrl && { name: "Other Document", type: "OTHER", url: otherUrl },
      ].filter(Boolean),
    };

    // 3. Send to API
    const res = await fetch("/api/institutions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    onDone(data);
  } catch (err) {
    console.error(err);
    alert("Submission failed");
  }
};

  const stepContent = [
    // ── Step 0: Institution Profile
    <div key="s0">
      <FRow><FCol span={2}><Inp label="Institution Name *" placeholder="e.g. Lagos University Teaching Hospital" value={form.instName} onChange={v=>up("instName",v)} /></FCol></FRow>
      <FRow>
        <FCol><Sel label="Institution Type *" value={form.instType} onChange={v=>up("instType",v)} opts={INST_TYPES} placeholder="Select type…" /></FCol>
        <FCol><Inp label="CAC Registration No. *" placeholder="RC-000000" value={form.cac} onChange={v=>up("cac",v)} /></FCol>
      </FRow>
      <FRow>
        <FCol><Inp label="Year Established" placeholder="e.g. 2005" type="number" value={form.year} onChange={v=>up("year",v)} /></FCol>
        <FCol><Inp label="Total Staff Count" placeholder="e.g. 120" type="number" value={form.staff} onChange={v=>up("staff",v)} /></FCol>
        <FCol><Inp label="Bed Capacity" placeholder="e.g. 50" type="number" value={form.beds} onChange={v=>up("beds",v)} /></FCol>
      </FRow>
    </div>,

    // ── Step 1: Location & Contact
    <div key="s1">
      <FRow>
        <FCol><Sel label="State *" value={form.state} onChange={v=>up("state",v)} opts={NG_STATES} placeholder="Select state…" /></FCol>
        <FCol><Inp label="LGA *" placeholder="Local Government Area" value={form.lga} onChange={v=>up("lga",v)} /></FCol>
      </FRow>
      <FRow><FCol span={2}><Inp label="Full Address *" placeholder="Street, area, city" value={form.address} onChange={v=>up("address",v)} textarea /></FCol></FRow>
      <div style={f.divider} /><p style={f.secNote}>Primary Contact Person</p>
      <FRow>
        <FCol><Inp label="Full Name *" placeholder="e.g. Dr. Chioma Eze" value={form.contactName} onChange={v=>up("contactName",v)} /></FCol>
        <FCol><Inp label="Designation *" placeholder="e.g. Medical Director" value={form.designation} onChange={v=>up("designation",v)} /></FCol>
      </FRow>
      <FRow>
        <FCol><Inp label="Phone Number *" placeholder="+234 800 000 0000" value={form.phone} onChange={v=>up("phone",v)} /></FCol>
        <FCol><Inp label="Alternate Phone" placeholder="+234 800 000 0000" value={form.altPhone} onChange={v=>up("altPhone",v)} /></FCol>
        <FCol><Inp label="Institutional Email *" placeholder="admin@facility.ng" type="email" value={form.email} onChange={v=>up("email",v)} /></FCol>
      </FRow>
    </div>,

    // ── Step 2: Service Needs
    <div key="s2">
      <p style={f.secNote}>Select all services your institution requires. Sub-fields expand per selection.</p>
      <div style={f.svcGrid}>
        {SERVICES.map(sv => (
          <button key={sv.id} onClick={()=>tog("services",sv.id)}
            style={{ ...f.svcCard, ...(has(sv.id)?f.svcOn:{}) }}>
            <span style={f.svcIco}>{sv.icon}</span>
            <span style={f.svcName}>{sv.name}</span>
            <span style={f.svcDesc}>{sv.desc}</span>
            {has(sv.id)&&<div style={f.svcChk}>✓</div>}
          </button>
        ))}
      </div>
      {has("specialist")&&<SubPills label="Repair & Maintenance Areas" note="Select all that apply" opts={SPECIALIST_OPTS} field="specialistOpts" form={form} tog={tog} />}
      {has("consultations")&&<SubPills label="Supply Consultation Focus" note="What supply challenges need advisory?" opts={CONSULT_OPTS} field="consultOpts" form={form} tog={tog} />}
      {has("reagents")&&<SubPills label="Reagent Categories" opts={REAGENT_OPTS} field="reagentOpts" form={form} tog={tog} />}
      {has("educational")&&<SubPills label="Educational Material Formats" opts={EDU_OPTS} field="eduOpts" form={form} tog={tog} />}
      <FRow>
        <FCol><Sel label="Monthly Procurement Volume" value={form.volume} onChange={v=>up("volume",v)} opts={VOLUMES} placeholder="Select range…" /></FCol>
        <FCol><Inp label="Additional Requirements" placeholder="Specific brands, supply frequency…" value={form.notes} onChange={v=>up("notes",v)} /></FCol>
      </FRow>
    </div>,

    // ── Step 3: Compliance
    <div key="s3">
      <p style={f.secNote}>Cadical verifies all institutions before granting portal access. All documents are stored securely.</p>
      <FRow>
        <FCol><Sel label="NAFDAC Compliance Status *" value={form.nafdac} onChange={v=>up("nafdac",v)}
          opts={["Fully licensed","Compliant – renewal in progress","Not applicable to institution type","Licence application in progress"]} placeholder="Select…" /></FCol>
        <FCol><Inp label="PCN / Other Licence No." placeholder="e.g. PCN/LIC/2024/XXXXX" value={form.pcn} onChange={v=>up("pcn",v)} /></FCol>
      </FRow>
      <p style={{ ...f.secNote, marginTop:20 }}>Document Uploads</p>
      <div style={f.uploadGrid}>
        <Upload label="CAC Certificate *" hint="PDF or image · max 5 MB" value={form.cacDoc} onChange={v=>up("cacDoc",v)} />
        <Upload label="NAFDAC / Pharmacy Licence" hint="PDF or image · max 5 MB" value={form.nafdacDoc} onChange={v=>up("nafdacDoc",v)} />
        <Upload label="Other Regulatory Document" hint="PDF or image · max 5 MB" value={form.otherDoc} onChange={v=>up("otherDoc",v)} />
      </div>
      <Check id="confirm-docs" checked={form.confirmDocs} onChange={v=>up("confirmDocs",v)}>
        I confirm all submitted documents and information are accurate. I understand that false submissions will result in rejection from Cadical's institutional programme. *
      </Check>
    </div>,

    // ── Step 4: Account Setup
    <div key="s4">
      <FRow><FCol span={2}><Inp label="Account Email Address *" placeholder="This will be your portal login email" type="email" value={form.accountEmail} onChange={v=>up("accountEmail",v)} /></FCol></FRow>
      <FRow>
        <FCol><Inp label="Password *" placeholder="Minimum 8 characters" type="password" value={form.password} onChange={v=>up("password",v)} /></FCol>
        <FCol><Inp label="Confirm Password *" placeholder="Repeat password" type="password" value={form.confirmPw} onChange={v=>up("confirmPw",v)} /></FCol>
      </FRow>
      <div style={f.summary}>
        <p style={f.summaryTitle}>📋 Application Summary</p>
        <div style={f.summaryGrid}>
          {[["Institution",form.instName||"—"],["Type",form.instType||"—"],["State",form.state||"—"],
            ["Contact",form.contactName||"—"],["Services",form.services.length?`${form.services.length} selected`:"None"],
            ["Volume",form.volume||"Not specified"]].map(([k,v])=>(
            <Fragment key={k}><span style={f.sk}>{k}</span><span style={f.sv}>{v}</span></Fragment>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <Check id="terms" checked={form.agreeTerms} onChange={v=>up("agreeTerms",v)}>
          I agree to Cadical's <a href="https://www.cadical.com/terms" style={f.lnk} target="_blank" rel="noopener noreferrer">Terms of Service</a> and institutional partnership agreement. *
        </Check>
        <Check id="privacy" checked={form.agreePrivacy} onChange={v=>up("agreePrivacy",v)}>
          I accept the <a href="https://www.cadical.com/privacy-policy" style={f.lnk} target="_blank" rel="noopener noreferrer">Privacy Policy</a>. *
        </Check>
        <Check id="news" checked={form.newsletter} onChange={v=>up("newsletter",v)}>
          Receive product updates, regulatory news, and exclusive offers from Cadical.
        </Check>
      </div>
    </div>,
  ];

  const canSubmit = form.agreeTerms && form.agreePrivacy && form.accountEmail && form.password;

  return (
    <div style={f.wrap} className="w-screen">
      <div style={f.bg} />
      <header style={f.header}>
        <Logo />
        <div style={f.headerTag}>Institutional Registration</div>
      </header>

      {/* Progress bar */}
      {/* <div style={f.progressWrap} className="">
        <div style={f.progressInner}>
          {STEPS_META.map((st,i) => (
            <div key={i} style={f.stepRow}>
              <button onClick={()=>i<step&&go(i)}
                style={{ ...f.dot, ...(step===i?f.dotActive:{}), ...(step>i?f.dotDone:{}), cursor:i<step?"pointer":"default" }}>
                {step>i?"✓":st.icon}
              </button>
              <span style={{ ...f.dotLabel, color:step>=i?"#0d47a1":"#b0c8c5", fontWeight:step===i?700:400 }}>{st.label}</span>
              {i<4&&<div style={{ ...f.dotLine, background:step>i?"#0d47a1":"#dde8e6" }} />}
            </div>
          ))}
        </div>
      </div> */}

      {/* Card */}
      <main style={f.main} className="w-screen">
        <div style={{ ...f.card, opacity:fade?1:0, transform:fade?"translateY(0)":"translateY(8px)", transition:"all 0.22s ease" }}>
          <div style={f.cardHead}>
            <h2 style={f.cardTitle}>{STEPS_META[step].label}</h2>
            <p style={f.cardSub}>Step {step+1} of 5</p>
          </div>
          <div style={f.cardBody}>{stepContent[step]}</div>

          <div style={f.navRow}>
            {step>0&&<button style={f.backBtn} onClick={()=>go(step-1)}>← Back</button>}
            <div style={{flex:1}}/>
            {step<4
              ? <button style={f.nextBtn} onClick={()=>go(step+1)}>Save & Continue →</button>
              : <button style={{ ...f.nextBtn, opacity:canSubmit?1:0.45, cursor:canSubmit?"pointer":"not-allowed" }}
                  onClick={()=>canSubmit&&onDone(form)}>Submit Application ✓</button>
            }
          </div>
        </div>

        <div style={f.trustStrip}>
          {["🔒 SSL Secured","📋 NAFDAC Aligned","🇳🇬 CAC Verified","⚡ 2–3 Day Approval"].map(t=>(
            <span key={t} style={f.trustItem}>{t}</span>
          ))}
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SCREEN 3 — CONFIRMATION
// ═══════════════════════════════════════════════════════════════
function Confirm({ data, refNo, onEnter }) {
  const timeline = [
    { label:"Application Submitted",  done:true,  date:"Today, 6 May 2026"  },
    { label:"Document Verification",  done:false, date:"Est. 7 – 8 May 2026" },
    { label:"Account Activation",     done:false, date:"Est. 8 – 9 May 2026" },
    { label:"Portal Access Granted",  done:false, date:"Est. 9 May 2026"     },
  ];
  return (
    <div style={c.wrap}>
      <div style={c.bg} />
      <div style={c.card}>
        <div style={c.cardTop}>
          <Logo />
          <span style={c.badge}>Application Under Review</span>
        </div>

        <div style={c.body}>
          <div style={{ fontSize:52, textAlign:"center", lineHeight:1 }}>🎉</div>
          <h2 style={c.title}>You're in the queue!</h2>
          <p style={c.sub}>
            {data.instName||"Your institution"}'s application has been received.
            We'll contact <strong>{data.accountEmail||data.email}</strong> once verified.
          </p>

          <div style={c.refBox}>
            <div>
              <div style={c.refLabel}>Your Reference Number</div>
              <div style={c.refVal}>{refNo}</div>
            </div>
            <div style={c.refNote}>Save this for follow-ups</div>
          </div>

          {/* Timeline */}
          <div style={c.tlWrap}>
            {timeline.map((t,i)=>(
              <div key={i} style={c.tlRow}>
                <div style={c.tlLeft}>
                  <div style={{ ...c.tlDot, background:t.done?"#0d47a1":"#eaf4f3", borderColor:t.done?"#0d47a1":"#c5ddd9" }}>
                    {t.done&&<span style={{ color:"#fff", fontSize:11, fontWeight:800 }}>✓</span>}
                  </div>
                  {i<3&&<div style={{ ...c.tlLine, background:t.done?"#0d47a1":"#e0eeec" }} />}
                </div>
                <div style={c.tlRight}>
                  <span style={{ fontSize:13, fontWeight:t.done?700:400, color:t.done?"#063b38":"#9db5b2" }}>{t.label}</span>
                  <span style={{ fontSize:11, color:"#b0c8c5" }}>{t.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={c.summary}>
            {[[data.instName||"—","Institution"],[data.instType||"—","Type"],
              [data.state||"—","State"],[data.services?.length?`${data.services.length} services`:"None","Services"]].map(([v,k])=>(
              <div key={k} style={c.sumItem}>
                <div style={c.sumKey}>{k}</div>
                <div style={c.sumVal}>{v}</div>
              </div>
            ))}
          </div>

          {/* What's next box */}
          <div style={c.nextBox}>
            <p style={c.nextTitle}>What happens next?</p>
            <ul style={c.nextList}>
              <li>Our compliance team reviews your CAC & NAFDAC documents</li>
              <li>Your assigned account manager will call within 24 hours</li>
              <li>You receive an activation link to access your dashboard</li>
              <li>Your tailored product catalogue goes live immediately</li>
            </ul>
          </div>

          <div style={c.actions}>
            <a href={`https://wa.me/2347076175550?text=Hi! Ref: ${refNo}. Following up on my institutional application.`}
              style={c.waBtn} target="_blank" rel="noopener noreferrer">💬 WhatsApp Us</a>
            <button style={c.dashBtn} onClick={onEnter}>Preview My Dashboard →</button>
          </div>
          <p style={c.footNote}>Questions? Email <a href="mailto:institutions@cadical.com" style={f.lnk}>institutions@cadical.com</a></p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SCREEN 4 — DASHBOARD
// ═══════════════════════════════════════════════════════════════
function Dashboard({ data, refNo }) {
  const [nav, setNav] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const instName = data.instName || "St. Nicholas Hospital";
  const contactFirst = (data.contactName||"Dr. Chioma").split(" ")[0];

  return (
    <div style={d.shell}>
      {/* Sidebar */}
      <aside style={{ ...d.sidebar, width:collapsed?62:222 }}>
        <div style={d.sTop}>
          <div style={d.logoRow}><div style={d.lMark}>C</div>{!collapsed&&<span style={d.lText}>Cadical</span>}</div>
          <button style={d.colBtn} onClick={()=>setCollapsed(c=>!c)}>{collapsed?"›":"‹"}</button>
        </div>
        {!collapsed&&(
          <div style={d.instChip}>
            <div style={d.instAv}>{instName[0]}</div>
            <div>
              <div style={d.instN}>{instName}</div>
              <div style={d.instT}>{data.instType||"Hospital"}</div>
            </div>
          </div>
        )}
        <nav style={d.nav}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setNav(n.id)}
              style={{ ...d.navBtn, ...(nav===n.id?d.navOn:{}), justifyContent:collapsed?"center":"flex-start", padding:collapsed?"10px":"10px 14px" }}>
              <span style={{ ...d.navIco, ...(nav===n.id?d.navIcoOn:{}) }}>{n.icon}</span>
              {!collapsed&&<span style={d.navLbl}>{n.label}</span>}
            </button>
          ))}
        </nav>
        {!collapsed&&(
          <div style={d.amCard}>
            <p style={d.amLabel}>Account Manager</p>
            <p style={d.amName}>Emeka Okafor</p>
            <a href="https://wa.me/2347076175550" style={d.waChip} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
          </div>
        )}
      </aside>

      {/* Main */}
      <div style={d.main}>
        <div style={d.topbar}>
          <div>
            <h1 style={d.pageH}>{NAV.find(n=>n.id===nav)?.label}</h1>
            <p style={d.pageD}>Wednesday, 6 May 2026</p>
          </div>
          <div style={d.topRight}>
            <span style={d.refTag}>{refNo}</span>
            <div style={d.topAv}>{contactFirst[0]}</div>
          </div>
        </div>

        <div style={d.body}>
          {nav==="overview"   && <DOverview   goTo={setNav} contactFirst={contactFirst} />}
          {nav==="catalogue"  && <DCatalogue />}
          {nav==="orders"     && <DOrders />}
          {nav==="maintenance"&& <DMaintenance />}
          {nav==="consult"    && <DConsult />}
          {nav==="documents"  && <DDocuments />}
          {nav==="account"    && <DAccount data={data} refNo={refNo} />}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Sections ────────────────────────────────────────
function DOverview({ goTo, contactFirst }) {
  const stats = [
    { label:"Total Orders",       val:"14",       sub:"↑ 3 this month", clr:"#0d47a1" },
    { label:"Active Maintenance", val:"2",         sub:"1 in progress",  clr:"#d97706" },
    { label:"Pending Invoice",    val:"₦528k",     sub:"1 due",          clr:"#1e40af" },
    { label:"Account Manager",    val:"Emeka O.",  sub:"Available now",  clr:"#1976d2" },
  ];
  return (
    <div>
      <div style={d.welcomeRow}>
        <div>
          <h2 style={d.welcomeH}>Welcome back, {contactFirst} 👋</h2>
          <p style={d.welcomeS}>Here's your institution's activity snapshot with Cadical.</p>
        </div>
        <GBtn onClick={()=>goTo("catalogue")}>+ New Order</GBtn>
      </div>
      <div style={d.statsRow}>
        {stats.map(st=>(
          <div key={st.label} style={d.statCard}>
            <div style={{ ...d.statBar, background:st.clr }} />
            <div style={d.statV}>{st.val}</div>
            <div style={d.statL}>{st.label}</div>
            <div style={d.statS}>{st.sub}</div>
          </div>
        ))}
      </div>
      <div style={d.twoCols}>
        <Pnl title="Recent Orders" action={<button style={d.linkBtn} onClick={()=>goTo("orders")}>View all →</button>}>
          {ORDERS.slice(0,3).map(o=>(
            <div key={o.id} style={d.listRow}>
              <div><div style={d.listMain}>{o.item}</div><div style={d.listMeta}>{o.id} · {o.date}</div></div>
              <div style={{textAlign:"right"}}><div style={d.listAmt}>{o.amt}</div><Bdg s={o.status}/></div>
            </div>
          ))}
        </Pnl>
        <Pnl title="Maintenance Tickets" action={<button style={d.linkBtn} onClick={()=>goTo("maintenance")}>View all →</button>}>
          {TICKETS.map(t=>(
            <div key={t.id} style={d.listRow}>
              <div><div style={d.listMain}>{t.eq}</div><div style={d.listMeta}>{t.id} · {t.issue}</div></div>
              <Bdg s={t.status}/>
            </div>
          ))}
          <button style={d.dashedBtn} onClick={()=>goTo("maintenance")}>+ Raise Maintenance Request</button>
        </Pnl>
      </div>
      <Pnl title="Your Active Services">
        <div style={d.svcStrip}>
          {["Medical Equipment","Pharmaceuticals","Reagents & Chemicals","Specialist Services"].map(sv=>(
            <span key={sv} style={d.svcChip}>{sv}</span>
          ))}
          <button style={d.addSvc} onClick={()=>goTo("account")}>+ Add Service</button>
        </div>
      </Pnl>
    </div>
  );
}

function DCatalogue() {
  const [filter, setFilter] = useState("All");
  const cats = ["All","Equipment","Consumables","Pharmaceuticals","Reagents"];
  const items = filter==="All" ? CATALOGUE : CATALOGUE.filter(i=>i.cat===filter);
  return (
    <div>
      <div style={d.filterRow}>
        {cats.map(c=><button key={c} onClick={()=>setFilter(c)}
          style={{ ...d.filterBtn, ...(filter===c?d.filterOn:{}) }}>{c}</button>)}
        <input style={d.searchBox} placeholder="Search products…" />
      </div>
      <div style={d.catGrid}>
        {items.map(item=>(
          <div key={item.id} style={d.catCard}>
            <div style={d.catTop}>
              <span style={d.catCat}>{item.cat}</span>
              {item.tag&&<span style={{ ...d.catTag, background:item.tag==="Low Stock"?"#fef3c7":"#d4f1ec", color:item.tag==="Low Stock"?"#92400e":"#0d47a1" }}>{item.tag}</span>}
            </div>
            <div style={d.catName}>{item.name}</div>
            <div style={d.catPrice}>{item.price}</div>
            <div style={d.catBtns}>
              <button style={d.outBtn}>Request Quote</button>
              <GBtn small>Order</GBtn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DOrders() {
  return (
    <Pnl title="All Orders" action={<GBtn small>+ New Order</GBtn>}>
      <Tbl heads={["Order ID","Item","Qty","Date","Amount","Status",""]}
        rows={ORDERS.map(o=>[
          <b style={{color:"#0d47a1"}}>{o.id}</b>, o.item, o.qty, o.date,
          <b>{o.amt}</b>, <Bdg s={o.status}/>, <button style={d.miniBtn}>View</button>
        ])} />
    </Pnl>
  );
}

function DMaintenance() {
  const [open, setOpen] = useState(false);
  return (
    <Pnl title="Maintenance Tickets"
      action={<button style={d.outBtn} onClick={()=>setOpen(o=>!o)}>{open?"✕ Cancel":"+ Raise Request"}</button>}>
      {open&&(
        <div style={d.formBox}>
          <div style={d.formGrid}>
            <Fld label="Equipment Name"><input style={d.inp} placeholder="e.g. Ventilator Unit 2" /></Fld>
            <Fld label="Location / Ward"><input style={d.inp} placeholder="e.g. ICU, Ward B" /></Fld>
            <Fld label="Issue Type">
              <select style={d.inp}>
                {["Select…","Routine Maintenance","Equipment Breakdown","Calibration","Spare Part Replacement","Post-repair Check"].map(o=><option key={o}>{o}</option>)}
              </select>
            </Fld>
            <Fld label="Priority">
              <select style={d.inp}><option>Normal</option><option>Urgent</option><option>Emergency</option></select>
            </Fld>
          </div>
          <Fld label="Description of Issue">
            <textarea style={{ ...d.inp, height:64, resize:"none" }} placeholder="Describe the fault or service required…" />
          </Fld>
          <div style={{marginTop:12}}><GBtn>Submit Request</GBtn></div>
        </div>
      )}
      <Tbl heads={["Ticket ID","Equipment","Issue","Date","Status",""]}
        rows={TICKETS.map(t=>[
          <b style={{color:"#0d47a1"}}>{t.id}</b>, t.eq, t.issue, t.date,
          <Bdg s={t.status}/>, <button style={d.miniBtn}>View</button>
        ])} />
    </Pnl>
  );
}

function DConsult() {
  const topics = ["Supply Chain Assessment & Optimisation","Healthcare Facility Equipping Advisory",
    "Product Selection & Formulary Planning","Demand Forecasting & Stock Management",
    "Vendor & Supplier Evaluation","Procurement Planning & Budgeting",
    "Regulatory & Import Compliance Advisory"];
  const [sel, setSel] = useState("");
  const [done, setDone] = useState(false);
  if (done) return (
    <Pnl title="Consultations">
      <div style={{textAlign:"center",padding:"36px 0"}}>
        <div style={{fontSize:44,marginBottom:10}}>✅</div>
        <h3 style={{fontSize:17,fontWeight:700,color:"#063b38",margin:"0 0 6px"}}>Consultation Booked</h3>
        <p style={{fontSize:13,color:"#5a8a84"}}>Your Cadical advisor will confirm within 24 hours.</p>
        <button style={{...d.outBtn,marginTop:18}} onClick={()=>setDone(false)}>Book Another</button>
      </div>
    </Pnl>
  );
  return (
    <Pnl title="Book a Supply Consultation">
      <p style={{fontSize:13,color:"#5a8a84",margin:"0 0 16px",fontStyle:"italic"}}>Speak with a Cadical supply advisor on any area below.</p>
      <Fld label="Consultation Topic *">
        <div style={d.pillRow}>
          {topics.map(t=><button key={t} onClick={()=>setSel(t)}
            style={{...d.pill,...(sel===t?d.pillOn:{})}}>{t}</button>)}
        </div>
      </Fld>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,margin:"16px 0"}}>
        <Fld label="Preferred Date *"><input type="date" style={d.inp} /></Fld>
        <Fld label="Preferred Time">
          <select style={d.inp}>
            {["9:00 AM","10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM"].map(t=><option key={t}>{t}</option>)}
          </select>
        </Fld>
      </div>
      <Fld label="Additional Notes">
        <textarea style={{...d.inp,height:64,resize:"none"}} placeholder="Specific context or questions for your advisor…" />
      </Fld>
      <div style={{marginTop:14}}><GBtn onClick={()=>sel&&setDone(true)}>Book Consultation</GBtn></div>
    </Pnl>
  );
}

function DDocuments() {
  return (
    <Pnl title="Documents" action={<GBtn small>+ Upload</GBtn>}>
      <Tbl heads={["Document","Type","Date","Status",""]}
        rows={DOCS.map(doc=>[
          <span style={{fontWeight:600}}>📄 {doc.name}</span>,
          doc.type, doc.date, <Bdg s={doc.status}/>,
          <button style={d.miniBtn}>Download</button>
        ])} />
    </Pnl>
  );
}

function DAccount({ data, refNo }) {
  const rows = [
    ["Institution Name", data.instName||"St. Nicholas Hospital"],
    ["Institution Type", data.instType||"General Hospital"],
    ["State",            data.state||"Lagos"],
    ["Contact Person",   data.contactName||"Dr. Chioma Eze"],
    ["Designation",      data.designation||"Medical Director"],
    ["Email",            data.email||"admin@stnicholas.ng"],
    ["Phone",            data.phone||"+234 801 234 5678"],
    ["Reference No.",    refNo],
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Pnl title="Institution Details">
        <div style={d.acctGrid}>
          {rows.map(([k,v])=>(
            <div key={k}><div style={d.acctK}>{k}</div><div style={d.acctV}>{v}</div></div>
          ))}
        </div>
        <div style={{marginTop:14}}><GBtn>Edit Details</GBtn></div>
      </Pnl>
      <Pnl title="Active Services">
        <div style={d.svcStrip}>
          {(data.services||["Medical Equipment","Pharmaceuticals"]).map(sv=>(
            <span key={sv} style={d.svcChip}>{SERVICES.find(s=>s.id===sv)?.name||sv}</span>
          ))}
        </div>
        <div style={{marginTop:12}}><GBtn>Request Additional Services</GBtn></div>
      </Pnl>
      <Pnl title="Account Manager">
        <div style={d.amRow}>
          <div style={d.amAv}>E</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,color:"#063b38"}}>Emeka Okafor</div>
            <div style={{fontSize:12,color:"#5a8a84",margin:"2px 0 4px"}}>Cadical Institutional Representative</div>
            <div style={{fontSize:12,color:"#5a8a84"}}>📧 emeka@cadical.com · 📞 +234 707 617 5550</div>
          </div>
          <a href="https://wa.me/2347076175550" style={d.waChip} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
        </div>
      </Pnl>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SHARED MINI-COMPONENTS
// ═══════════════════════════════════════════════════════════════
function Logo() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:9}}>
      <div style={{width:30,height:30,borderRadius:7,background:"rgba(255,255,255,0.16)",border:"1.5px solid rgba(255,255,255,0.28)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:800}}>C</div>
      <span style={{color:"#fff",fontSize:15,fontWeight:700}}>Cadical <span style={{fontWeight:300,opacity:0.72}}>Solutions</span></span>
    </div>
  );
}

function Inp({ label, placeholder, value, onChange, type="text", textarea }) {
  const style = { ...sh.inp, height:textarea?72:undefined, resize:textarea?"none":undefined };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      <label style={sh.lbl}>{label}</label>
      {textarea
        ? <textarea style={style} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} />
        : <input style={style} type={type} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} />}
    </div>
  );
}

function Sel({ label, value, onChange, opts, placeholder }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      <label style={sh.lbl}>{label}</label>
      <select style={sh.inp} value={value} onChange={e=>onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {opts.map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function FRow({ children }) {
  return <div style={sh.row}>{children}</div>;
}

function FCol({ children, span }) {
  return <div style={{gridColumn:span===2?"1/-1":undefined}}>{children}</div>;
}

function SubPills({ label, note, opts, field, form, tog }) {
  return (
    <div style={sh.subBlock}>
      <p style={sh.subLabel}>{label}</p>
      {note&&<p style={sh.subNote}>{note}</p>}
      <div style={sh.pillRow}>
        {opts.map(o=>(
          <button key={o} onClick={()=>tog(field,o)}
            style={{ ...sh.pill, ...(form[field].includes(o)?sh.pillOn:{}) }}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function Upload({ label, hint, value, onChange }) {
  return (
    <div style={sh.uploadBox}>
      <label style={sh.uploadLabel}>
        <input type="file" style={{display:"none"}} accept=".pdf,.jpg,.jpeg,.png" onChange={e=>onChange(e.target.files[0])} />
        <span style={{fontSize:22}}>{value?"✅":"📎"}</span>
        <span style={{fontSize:12,fontWeight:700,color:"#063b38"}}>{label}</span>
        <span style={{fontSize:11,color:"#7aada8",textAlign:"center"}}>{value?value.name:hint}</span>
        <span style={sh.uploadBtn}>{value?"Change":"Browse"}</span>
      </label>
    </div>
  );
}

function Check({ id, checked, onChange, children }) {
  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:9}}>
      <input type="checkbox" id={id} style={{marginTop:2,accentColor:"#0d47a1",width:15,height:15,flexShrink:0}} checked={checked} onChange={e=>onChange(e.target.checked)} />
      <label htmlFor={id} style={{fontSize:13,color:"#2d4a47",lineHeight:1.55}}>{children}</label>
    </div>
  );
}

function GBtn({ children, onClick, small, style:extra }) {
  return (
    <button onClick={onClick} style={{
      padding:small?"6px 14px":"9px 20px",
      background:"linear-gradient(135deg,#0d47a1,#1976d2)",
      color:"#fff",border:"none",borderRadius:8,
      fontSize:small?11:12,fontWeight:800,cursor:"pointer",
      fontFamily:"inherit",boxShadow:"0 3px 10px rgba(13,71,161,0.2)",...extra
    }}>{children}</button>
  );
}

function Pnl({ title, action, children }) {
  return (
    <div style={d.panel}>
      <div style={d.panelHead}><span style={d.panelT}>{title}</span>{action&&<span>{action}</span>}</div>
      {children}
    </div>
  );
}

function Bdg({ s }) {
  const c = STATUS_C[s]||{bg:"#f3f4f6",fg:"#374151"};
  return <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:c.bg,color:c.fg,whiteSpace:"nowrap"}}>{s}</span>;
}

function Tbl({ heads, rows }) {
  return (
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr>{heads.map(h=><th key={h} style={d.th}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row,i)=>(
        <tr key={i} style={{borderBottom:"1px solid #f0f7f6"}}>
          {row.map((cell,j)=><td key={j} style={d.td}>{cell}</td>)}
        </tr>
      ))}</tbody>
    </table>
  );
}

function Fld({ label, children }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      <label style={d.fldL}>{label}</label>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════════════
const BASE = { fontFamily:"'Georgia','Times New Roman',serif" };
const BG_MESH = { position:"fixed",inset:0,pointerEvents:"none",zIndex:0,
  background:"radial-gradient(ellipse 80% 50% at 10% 0%,rgba(13,71,161,0.08) 0%,transparent 55%),radial-gradient(ellipse 60% 60% at 90% 100%,rgba(22,160,133,0.06) 0%,transparent 55%)" };
const HEADER_STYLE = { position:"relative",zIndex:10,background:"linear-gradient(135deg,#063b38,#0d47a1 60%,#0d7a74)",padding:"15px 32px",boxShadow:"0 4px 20px rgba(6,59,56,0.2)" };

const w = {
  wrap: { minHeight:"100vh",background:"#f0f7f6",...BASE,position:"relative" },
  bg: { ...BG_MESH },
  header: { ...HEADER_STYLE,display:"flex",alignItems:"center",justifyContent:"space-between" },
  backLink: { fontSize:13,color:"rgba(255,255,255,0.7)",textDecoration:"none",fontStyle:"italic" },
  hero: { maxWidth:680,margin:"0 auto",padding:"72px 24px 48px",textAlign:"center",position:"relative",zIndex:2 },
  heroTag: { display:"inline-block",background:"rgba(13,71,161,0.1)",border:"1px solid rgba(13,71,161,0.2)",color:"#0d47a1",fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:20,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:18 },
  heroH: { fontSize:40,fontWeight:800,color:"#0d47a1",margin:"0 0 16px",lineHeight:1.2,letterSpacing:"-1px" },
  heroAccent: { color:"#0d47a1" },
  heroSub: { fontSize:16,color:"#0d47a1",lineHeight:1.7,margin:"0 0 32px" },
  cta: { display:"inline-block",padding:"14px 36px",background:"linear-gradient(135deg,#0d47a1,#1976d2)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 6px 24px rgba(13,71,161,0.3)",letterSpacing:"0.02em" },
  ctaNote: { fontSize:12,color:"#8aafa8",margin:"12px 0 0",fontStyle:"italic" },
  featureGrid: { maxWidth:900,margin:"0 auto 48px",padding:"0 24px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,position:"relative",zIndex:2 },
  featureCard: { background:"#fff",borderRadius:16,padding:"24px 20px",boxShadow:"0 4px 20px rgba(13,71,161,0.08)",border:"1px solid rgba(13,71,161,0.07)" },
  featureIcon: { fontSize:28,display:"block",marginBottom:10 },
  featureTitle: { fontSize:14,fontWeight:700,color:"#063b38",marginBottom:6 },
  featureDesc: { fontSize:13,color:"#5a8a84",lineHeight:1.5 },
  steps: { maxWidth:900,margin:"0 auto 48px",padding:"0 24px",position:"relative",zIndex:2 },
  stepsLabel: { fontSize:11,fontWeight:700,color:"#9db5b2",textTransform:"uppercase",letterSpacing:"0.08em",textAlign:"center",marginBottom:20 },
  stepsRow: { display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16 },
  step: { background:"#fff",borderRadius:12,padding:"20px 16px",textAlign:"center",border:"1px solid rgba(13,71,161,0.07)",boxShadow:"0 2px 10px rgba(13,71,161,0.05)" },
  stepNum: { width:32,height:32,borderRadius:"50%",background:"#0d47a1",color:"#fff",fontSize:14,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px" },
  stepText: { fontSize:13,color:"#2d4a47",fontWeight:600,lineHeight:1.4 },
  footer: { maxWidth:900,margin:"0 auto",padding:"24px",display:"flex",justifyContent:"space-between",fontSize:11,color:"#9db5b2",position:"relative",zIndex:2,flexWrap:"wrap",gap:8 },
};

const f = {
  wrap: { minHeight:"100vh",background:"#f0f7f6",...BASE,position:"relative" },
  bg: { ...BG_MESH },
  header: { ...HEADER_STYLE,display:"flex",alignItems:"center",justifyContent:"space-between" },
  headerTag: { background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",color:"#0d47a1",fontSize:11,fontWeight:600,padding:"5px 13px",borderRadius:20,letterSpacing:"0.04em" },
  progressWrap: { position:"relative",zIndex:10,background:"#fff",borderBottom:"1px solid #dde8e6",padding:"18px 32px",boxShadow:"0 2px 8px rgba(18, 31, 136, 0.05)" },
  progressInner: { maxWidth:880,margin:"0 auto",display:"flex",alignItems:"center" },
  stepRow: { display:"flex",alignItems:"center",flex:1 },
  dot: { width:40,height:40,borderRadius:"50%",background:"#eaf4f3",border:"2px solid #c5ddd9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0,outline:"none",transition:"all 0.2s" },
  dotActive: { background:"#0d47a1",borderColor:"#0d47a1",boxShadow:"0 0 0 4px rgba(13,71,161,0.15)" },
  dotDone: { background:"#1976d2",borderColor:"#1976d2",color:"#fff",fontSize:14,fontWeight:800 },
  dotLabel: { fontSize:11,marginLeft:7,letterSpacing:"0.02em",whiteSpace:"nowrap",fontFamily:"inherit" },
  dotLine: { flex:1,height:2,margin:"0 6px",borderRadius:2,minWidth:16,transition:"background 0.3s" },
  main: { position:"relative",zIndex:5,maxWidth:880,margin:"28px auto",padding:"0 20px 48px" },
  card: { background:"#fff",borderRadius:18,boxShadow:"0 6px 40px rgba(13,71,161,0.09),0 1px 3px rgba(0,0,0,0.04)",border:"1px solid rgba(13,71,161,0.07)" },
  cardHead: { padding:"28px 36px 0",borderBottom:"1px solid #f0f7f6",paddingBottom:20,marginBottom:4 },
  cardTitle: { fontSize:22,fontWeight:700,color:"#063b38",margin:"0 0 4px",letterSpacing:"-0.4px" },
  cardSub: { fontSize:12,color:"#9db5b2",margin:0,fontStyle:"italic" },
  cardBody: { padding:"24px 36px 8px" },
  navRow: { display:"flex",alignItems:"center",padding:"20px 36px",borderTop:"1px solid #eaf4f3",gap:10 },
  backBtn: { padding:"9px 20px",border:"1.5px solid #cee4e1",borderRadius:8,background:"transparent",color:"#0d47a1",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" },
  nextBtn: { padding:"10px 26px",border:"none",borderRadius:8,background:"linear-gradient(135deg,#0d47a1,#1976d2)",color:"#fff",fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 14px rgba(13,71,161,0.22)" },
  trustStrip: { display:"flex",alignItems:"center",justifyContent:"center",gap:24,marginTop:22,flexWrap:"wrap" },
  trustItem: { fontSize:11,color:"#5a8a84",fontWeight:600,letterSpacing:"0.03em" },
  divider: { height:1,background:"#eaf4f3",margin:"18px 0" },
  secNote: { fontSize:12,color:"#0d47a1",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",margin:"4px 0 14px" },
  svcGrid: { display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:10,marginBottom:10 },
  svcCard: { position:"relative",display:"flex",flexDirection:"column",alignItems:"flex-start",padding:"13px 12px",background:"#f8fdfc",border:"1.5px solid #cee4e1",borderRadius:11,cursor:"pointer",textAlign:"left",outline:"none",gap:3,transition:"all 0.15s" },
  svcOn: { background:"linear-gradient(135deg,#e8f9f6,#d4f1ec)",border:"1.5px solid #0d47a1",boxShadow:"0 2px 10px rgba(13,71,161,0.1)" },
  svcIco: { fontSize:19,marginBottom:2 },
  svcName: { fontSize:12,fontWeight:700,color:"#063b38" },
  svcDesc: { fontSize:11,color:"#5a8a84",lineHeight:1.35 },
  svcChk: { position:"absolute",top:9,right:9,width:17,height:17,borderRadius:"50%",background:"#0d47a1",color:"#fff",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center" },
  summary: { background:"linear-gradient(135deg,#f0faf8,#e8f4f3)",border:"1px solid #c5ddd9",borderRadius:12,padding:"16px 20px",marginBottom:20 },
  summaryTitle: { fontSize:11,fontWeight:700,color:"#063b38",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10 },
  summaryGrid: { display:"grid",gridTemplateColumns:"1fr 2fr",gap:"6px 14px" },
  sk: { fontSize:10,color:"#5a8a84",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em" },
  sv: { fontSize:13,color:"#1a3a38",fontWeight:600 },
  uploadGrid: { display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:12,marginBottom:18 },
  lnk: { color:"#0d47a1",fontWeight:700 },
};

const c = {
  wrap: { minHeight:"100vh",background:"#f0f7f6",...BASE,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative" },
  bg: { ...BG_MESH },
  card: { background:"#fff",borderRadius:20,boxShadow:"0 12px 56px rgba(13,71,161,0.12)",maxWidth:520,width:"100%",overflow:"hidden",position:"relative",zIndex:1 },
  cardTop: { background:"linear-gradient(135deg,#063b38,#0d47a1)",padding:"18px 26px",display:"flex",alignItems:"center",justifyContent:"space-between" },
  badge: { background:"rgba(255,255,255,0.14)",border:"1px solid rgba(255,255,255,0.22)",color:"#c8f5f0",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20 },
  body: { padding:"28px 32px" },
  title: { fontSize:22,fontWeight:800,color:"#063b38",margin:"10px 0 8px",textAlign:"center" },
  sub: { fontSize:13,color:"#2d4a47",lineHeight:1.7,textAlign:"center",margin:"0 0 18px" },
  refBox: { background:"#e8f4f3",border:"1px solid #c5ddd9",borderRadius:10,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 },
  refLabel: { fontSize:10,fontWeight:700,color:"#0d47a1",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3 },
  refVal: { fontSize:15,fontWeight:800,color:"#0d47a1",letterSpacing:"0.04em" },
  refNote: { fontSize:11,color:"#9db5b2",fontStyle:"italic" },
  tlWrap: { marginBottom:18 },
  tlRow: { display:"flex",gap:11 },
  tlLeft: { display:"flex",flexDirection:"column",alignItems:"center",width:28 },
  tlDot: { width:26,height:26,borderRadius:"50%",border:"2px solid",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 },
  tlLine: { width:2,flex:1,minHeight:14,margin:"2px 0",borderRadius:2 },
  tlRight: { display:"flex",justifyContent:"space-between",flex:1,paddingBottom:12,borderBottom:"1px solid #f5faf9" },
  summary: { display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,background:"#f8fdfc",border:"1px solid #e0eeec",borderRadius:10,padding:"12px 14px",marginBottom:18 },
  sumItem: {},
  sumKey: { fontSize:10,color:"#9db5b2",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:2 },
  sumVal: { fontSize:12,color:"#1a3a38",fontWeight:600 },
  nextBox: { background:"#f0faf8",border:"1px solid #c5ddd9",borderRadius:10,padding:"14px 16px",marginBottom:18 },
  nextTitle: { fontSize:12,fontWeight:700,color:"#063b38",margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"0.05em" },
  nextList: { margin:0,paddingLeft:16,display:"flex",flexDirection:"column",gap:5 },
  actions: { display:"flex",gap:10,marginBottom:12 },
  waBtn: { flex:1,display:"inline-flex",alignItems:"center",justifyContent:"center",background:"#25D366",color:"#fff",padding:"10px",borderRadius:8,fontSize:12,fontWeight:700,textDecoration:"none" },
  dashBtn: { flex:1,padding:"10px",border:"1.5px solid #c5ddd9",borderRadius:8,background:"transparent",color:"#0d47a1",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" },
  footNote: { fontSize:11,color:"#9db5b2",textAlign:"center",margin:0 },
};

const d = {
  shell: { display:"flex",height:"100vh",background:"#f0f7f6",...BASE,overflow:"hidden" },
  sidebar: { background:"linear-gradient(180deg,#063b38,#0d47a1)",display:"flex",flexDirection:"column",flexShrink:0,transition:"width 0.22s ease",overflow:"hidden" },
  sTop: { display:"flex",alignItems:"center",justifyContent:"space-between",padding:"17px 13px 10px" },
  logoRow: { display:"flex",alignItems:"center",gap:8 },
  lMark: { width:30,height:30,borderRadius:7,background:"rgba(255,255,255,0.17)",border:"1.5px solid rgba(255,255,255,0.27)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,fontWeight:800,flexShrink:0 },
  lText: { color:"#fff",fontSize:14,fontWeight:700,whiteSpace:"nowrap" },
  colBtn: { background:"rgba(255,255,255,0.1)",border:"none",color:"#a7d9d4",fontSize:14,width:26,height:26,borderRadius:6,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 },
  instChip: { margin:"0 10px 12px",background:"rgba(255,255,255,0.08)",borderRadius:9,padding:"9px 10px",display:"flex",alignItems:"center",gap:8 },
  instAv: { width:30,height:30,borderRadius:6,background:"#1976d2",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:800,flexShrink:0 },
  instN: { fontSize:11,fontWeight:700,color:"#fff",lineHeight:1.3 },
  instT: { fontSize:10,color:"#a7d9d4" },
  nav: { flex:1,padding:"0 8px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto" },
  navBtn: { display:"flex",alignItems:"center",gap:8,borderRadius:7,border:"none",background:"transparent",cursor:"pointer",width:"100%",transition:"background 0.14s",fontFamily:"inherit" },
  navOn: { background:"rgba(255,255,255,0.13)" },
  navIco: { fontSize:14,color:"#7ec8c3",flexShrink:0,width:18,textAlign:"center" },
  navIcoOn: { color:"#fff" },
  navLbl: { fontSize:12,color:"#c8eae7",whiteSpace:"nowrap" },
  amCard: { margin:"auto 10px 16px",background:"rgba(255,255,255,0.07)",borderRadius:9,padding:"11px" },
  amLabel: { fontSize:10,color:"#7ec8c3",textTransform:"uppercase",letterSpacing:"0.06em",margin:"0 0 3px" },
  amName: { fontSize:12,fontWeight:700,color:"#fff",margin:"0 0 7px" },
  waChip: { display:"inline-block",background:"#25D366",color:"#fff",fontSize:11,fontWeight:700,padding:"4px 11px",borderRadius:20,textDecoration:"none" },
  main: { flex:1,display:"flex",flexDirection:"column",overflow:"hidden" },
  topbar: { background:"#fff",borderBottom:"1px solid #dde8e6",padding:"13px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 6px rgba(13,71,161,0.05)" },
  pageH: { fontSize:18,fontWeight:700,color:"#063b38",margin:0 },
  pageD: { fontSize:11,color:"#9db5b2",margin:"2px 0 0",fontStyle:"italic" },
  topRight: { display:"flex",alignItems:"center",gap:10 },
  refTag: { background:"#e8f4f3",border:"1px solid #c5ddd9",color:"#0d47a1",fontSize:11,fontWeight:700,padding:"4px 11px",borderRadius:20,letterSpacing:"0.03em" },
  topAv: { width:34,height:34,borderRadius:"50%",background:"#0d47a1",color:"#fff",fontSize:13,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center" },
  body: { flex:1,overflowY:"auto",padding:"20px 24px" },
  welcomeRow: { display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 },
  welcomeH: { fontSize:17,fontWeight:700,color:"#063b38",margin:"0 0 3px" },
  welcomeS: { fontSize:12,color:"#5a8a84",margin:0,fontStyle:"italic" },
  statsRow: { display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16 },
  statCard: { background:"#fff",borderRadius:12,padding:"15px",boxShadow:"0 2px 10px rgba(13,71,161,0.06)",border:"1px solid rgba(13,71,161,0.05)",position:"relative",overflow:"hidden" },
  statBar: { position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"12px 12px 0 0" },
  statV: { fontSize:20,fontWeight:800,color:"#063b38",margin:"6px 0 2px" },
  statL: { fontSize:10,fontWeight:700,color:"#5a8a84",textTransform:"uppercase",letterSpacing:"0.05em" },
  statS: { fontSize:11,color:"#9db5b2",marginTop:2 },
  twoCols: { display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14 },
  panel: { background:"#fff",borderRadius:12,padding:"17px 19px",boxShadow:"0 2px 10px rgba(13,71,161,0.06)",border:"1px solid rgba(13,71,161,0.05)",marginBottom:14 },
  panelHead: { display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:13 },
  panelT: { fontSize:13,fontWeight:700,color:"#063b38" },
  linkBtn: { fontSize:12,color:"#0d47a1",fontWeight:700,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit" },
  listRow: { display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f5faf9" },
  listMain: { fontSize:13,fontWeight:600,color:"#1a3a38" },
  listMeta: { fontSize:11,color:"#9db5b2",marginTop:1 },
  listAmt: { fontSize:12,fontWeight:700,color:"#063b38",marginBottom:2 },
  dashedBtn: { marginTop:11,width:"100%",padding:"8px",border:"1.5px dashed #c5ddd9",borderRadius:8,background:"transparent",color:"#0d47a1",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit" },
  svcStrip: { display:"flex",flexWrap:"wrap",gap:8 },
  svcChip: { padding:"5px 13px",background:"#e8f4f3",border:"1px solid #c5ddd9",borderRadius:20,fontSize:12,fontWeight:600,color:"#0d47a1" },
  addSvc: { padding:"5px 13px",border:"1.5px dashed #c5ddd9",borderRadius:20,background:"transparent",color:"#9db5b2",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit" },
  filterRow: { display:"flex",alignItems:"center",gap:7,marginBottom:14,flexWrap:"wrap" },
  filterBtn: { padding:"5px 13px",border:"1.5px solid #c5ddd9",borderRadius:20,background:"transparent",color:"#5a8a84",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit" },
  filterOn: { background:"#0d47a1",borderColor:"#0d47a1",color:"#fff" },
  searchBox: { padding:"6px 13px",border:"1.5px solid #c5ddd9",borderRadius:20,fontSize:12,background:"#f8fdfc",fontFamily:"inherit",outline:"none",marginLeft:"auto" },
  catGrid: { display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:12 },
  catCard: { background:"#fff",borderRadius:11,padding:"14px",boxShadow:"0 2px 8px rgba(13,71,161,0.06)",border:"1px solid rgba(13,71,161,0.05)" },
  catTop: { display:"flex",justifyContent:"space-between",marginBottom:7 },
  catCat: { fontSize:10,color:"#9db5b2",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em" },
  catTag: { fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10 },
  catName: { fontSize:13,fontWeight:700,color:"#1a3a38",marginBottom:5,lineHeight:1.35 },
  catPrice: { fontSize:15,fontWeight:800,color:"#0d47a1",marginBottom:10 },
  catBtns: { display:"flex",gap:6 },
  outBtn: { padding:"6px 13px",border:"1.5px solid #c5ddd9",borderRadius:7,background:"transparent",color:"#0d47a1",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit" },
  th: { fontSize:10,fontWeight:700,color:"#9db5b2",textTransform:"uppercase",letterSpacing:"0.05em",padding:"7px 9px",borderBottom:"1px solid #e8f4f3",textAlign:"left" },
  td: { fontSize:12,color:"#1a3a38",padding:"10px 9px",verticalAlign:"middle" },
  miniBtn: { padding:"4px 10px",border:"1.5px solid #c5ddd9",borderRadius:6,background:"transparent",color:"#0d47a1",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit" },
  formBox: { background:"#f8fdfc",border:"1px solid #d0e8e5",borderRadius:10,padding:"15px",marginBottom:16 },
  formGrid: { display:"grid",gridTemplateColumns:"1fr 1fr",gap:13,marginBottom:13 },
  fldL: { fontSize:11,fontWeight:700,color:"#2d6b66",textTransform:"uppercase",letterSpacing:"0.06em" },
  inp: { padding:"9px 11px",border:"1.5px solid #cee4e1",borderRadius:8,fontSize:13,color:"#1a3a38",background:"#fff",fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box" },
  pillRow: { display:"flex",flexWrap:"wrap",gap:7,marginTop:7 },
  pill: { padding:"6px 13px",border:"1.5px solid #c5ddd9",borderRadius:20,background:"#f0faf8",color:"#2d6b66",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit" },
  pillOn: { background:"#0d47a1",borderColor:"#0d47a1",color:"#fff" },
  acctGrid: { display:"grid",gridTemplateColumns:"1fr 1fr",gap:"11px 22px" },
  acctK: { fontSize:10,fontWeight:700,color:"#9db5b2",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:2 },
  acctV: { fontSize:13,color:"#1a3a38",fontWeight:600 },
  amRow: { display:"flex",alignItems:"center",gap:13 },
  amAv: { width:44,height:44,borderRadius:10,background:"#0d47a1",color:"#fff",fontSize:16,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 },
};

const sh = {
  row: { display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"13px 16px",marginBottom:14 },
  lbl: { fontSize:11,fontWeight:700,color:"#2d6b66",textTransform:"uppercase",letterSpacing:"0.06em" },
  inp: { padding:"10px 12px",border:"1.5px solid #cee4e1",borderRadius:9,fontSize:13,color:"#1a3a38",background:"#f8fdfc",fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box" },
  subBlock: { background:"#f2faf8",border:"1px solid #cee4e1",borderRadius:10,padding:"13px 15px",marginBottom:13 },
  subLabel: { fontSize:11,fontWeight:700,color:"#0d47a1",textTransform:"uppercase",letterSpacing:"0.05em",margin:"0 0 4px" },
  subNote: { fontSize:12,color:"#5a8a84",fontStyle:"italic",margin:"0 0 9px" },
  pillRow: { display:"flex",flexWrap:"wrap",gap:7 },
  pill: { padding:"6px 12px",border:"1.5px solid #bdd8d4",borderRadius:20,background:"#f0faf8",color:"#2d6b66",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit" },
  pillOn: { background:"#0d47a1",borderColor:"#0d47a1",color:"#fff" },
  uploadBox: { border:"1.5px dashed #9ecbc6",borderRadius:12,background:"#f8fdfc" },
  uploadLabel: { display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 10px",cursor:"pointer",gap:4 },
  uploadBtn: { marginTop:4,background:"#0d47a1",color:"#fff",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20 },
};