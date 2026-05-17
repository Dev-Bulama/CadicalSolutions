"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, ExternalLink, ChevronDown, ChevronUp, ArrowRight, Copy } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Step {
  number: number
  title: string
  description: string
  content: React.ReactNode
}

function StepCard({ step, defaultOpen = false }: { step: Step; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
          {step.number}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{step.title}</p>
          <p className="text-xs text-muted-foreground">{step.description}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="pt-4 space-y-4">{step.content}</div>
        </div>
      )}
    </Card>
  )
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
        {n}
      </span>
      <p className="text-sm text-foreground leading-relaxed">{text}</p>
    </div>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
      <strong>Note:</strong> {children}
    </div>
  )
}

function CodeBox({ value }: { value: string }) {
  return (
    <div className="flex gap-2 items-center">
      <code className="flex-1 text-xs bg-muted px-3 py-2 rounded border border-border font-mono">{value}</code>
      <Button
        variant="outline"
        size="sm"
        onClick={() => { navigator.clipboard.writeText(value); toast.success("Copied!") }}
      >
        <Copy size={12} />
      </Button>
    </div>
  )
}

export default function SetupWizardPage() {
  const redirectUri =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/admin/crm/zoho/callback`
      : "https://yourdomain.com/api/admin/crm/zoho/callback"

  const steps: Step[] = [
    {
      number: 1,
      title: "Create a Zoho Account",
      description: "Sign up for Zoho CRM if you don't have an account",
      content: (
        <div className="space-y-3">
          <Step n={1} text="Open your browser and navigate to https://www.zoho.com/crm/" />
          <Step n={2} text='Click the "Get Started For Free" or "Sign Up" button in the top-right corner.' />
          <Step n={3} text="Enter your work email address and create a password. Use your organization's email domain for professional setup." />
          <Step n={4} text='Choose your country/region and accept the Terms of Service. Click "Sign Up".' />
          <Step n={5} text="Check your email inbox for a verification email from Zoho. Click the verification link." />
          <Step n={6} text='After verification, you will be taken to the Zoho CRM setup screen. Complete the initial setup by entering your company name, industry (select "Healthcare"), and organization size.' />
          <Step n={7} text='Select the "Free" plan to start, or choose a paid plan for advanced features (Standard/Professional recommended for enterprise use).' />
          <Step n={8} text="Your Zoho CRM dashboard is now active. Keep this tab open — you will need it in the next steps." />
          <a
            href="https://www.zoho.com/crm/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
          >
            Open Zoho CRM <ExternalLink size={13} />
          </a>
        </div>
      ),
    },
    {
      number: 2,
      title: "Open the Zoho API Developer Console",
      description: "Create a server-based OAuth application for Cadical",
      content: (
        <div className="space-y-3">
          <Step n={1} text="Make sure you are logged into your Zoho account in this browser." />
          <Step n={2} text="In a new tab, go to: https://api-console.zoho.com" />
          <Step n={3} text='You will see the Zoho API Console. Click "Add Client" (or "GET STARTED" if it is your first time).' />
          <Step n={4} text='A dialog will appear asking you to choose the client type. Select "Server-based Applications" — this is correct for Cadical since it runs on a server.' />
          <Step n={5} text='Click "Create" to proceed to the application configuration screen.' />
          <a
            href="https://api-console.zoho.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
          >
            Open API Console <ExternalLink size={13} />
          </a>
        </div>
      ),
    },
    {
      number: 3,
      title: "Configure Your OAuth Application",
      description: "Fill in the application details and set the redirect URI",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <Step n={1} text='In the "Client Name" field, enter: Cadical CRM Integration' />
            <Step n={2} text='In the "Homepage URL" field, enter your Cadical website URL (e.g. https://cadical.com).' />
            <Step n={3} text="In the Authorized Redirect URIs field, paste EXACTLY the following URL:" />
          </div>
          <CodeBox value={redirectUri} />
          <Note>
            This redirect URI must match exactly. Do not add trailing slashes or change any part of it.
            If your domain changes, you must update this in Zoho as well.
          </Note>
          <div className="space-y-3">
            <Step n={4} text='In the "Description" field, enter: Cadical Medical Equipment Platform CRM Integration' />
            <Step n={5} text='Click "Create" to generate your application.' />
            <Step n={6} text="You will be taken to the application detail page. You will see your Client ID and Client Secret — keep this page open for the next step." />
          </div>
        </div>
      ),
    },
    {
      number: 4,
      title: "Copy Your Credentials",
      description: "Get Client ID, Client Secret, and Organization ID",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <Step n={1} text='On your Zoho API Console app page, locate the "Client ID" field. It will look like: 1000.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' />
            <Step n={2} text="Copy the Client ID and keep it in a safe place (like a password manager). You will paste it into Cadical shortly." />
            <Step n={3} text='Click "Show Secret" or the eye icon next to the Client Secret field. Copy this value too — it is only shown once in some Zoho versions.' />
            <Step n={4} text='To find your Organization ID: Go to your Zoho CRM dashboard → Click your profile icon (top-right) → Select "Setup" → Under "Developer Space", click "APIs" → Your Organization ID (also called CRM ID) appears there.' />
            <Step n={5} text="Note your data center. Zoho has multiple data centers (zoho.com, zoho.eu, zoho.in, zoho.com.au). Use whichever region your account is registered in." />
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 space-y-1">
            <p className="font-semibold">What you should have now:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-1">
              <li>Client ID (starts with 1000.)</li>
              <li>Client Secret (long random string)</li>
              <li>Organization ID (numeric)</li>
              <li>Your data center region (zoho.com / zoho.eu / etc.)</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      number: 5,
      title: "Enter Credentials in Cadical",
      description: "Save your Zoho credentials to start the authorization flow",
      content: (
        <div className="space-y-3">
          <Step n={1} text="In the Cadical admin panel, click Integrations → CRM → Connect CRM in the left sidebar." />
          <Step n={2} text='On the Connect CRM page, ensure "Zoho CRM" is selected (it should be highlighted in blue).' />
          <Step n={3} text='In the "Client ID" field, paste your Zoho Client ID.' />
          <Step n={4} text='In the "Client Secret" field, paste your Zoho Client Secret.' />
          <Step n={5} text='In the "Organization ID" field, paste your Zoho Organization ID (optional but recommended).' />
          <Step n={6} text='Verify the Redirect URI shown matches what you entered in Zoho exactly. It should be the same URL you copied in Step 3.' />
          <Step n={7} text='Click "Save Credentials". You will see a success message.' />
          <div className="pt-2">
            <Button asChild>
              <Link href="/admin/integrations/crm/connect">
                Go to Connect CRM <ArrowRight size={15} />
              </Link>
            </Button>
          </div>
        </div>
      ),
    },
    {
      number: 6,
      title: "Authorize Cadical with Zoho",
      description: "Complete the OAuth flow to grant Cadical access to your CRM",
      content: (
        <div className="space-y-3">
          <Step n={1} text='On the Connect CRM page, after saving your credentials, click the blue "Authorize with Zoho" button.' />
          <Step n={2} text="You will be redirected to Zoho's login/authorization page. If not already logged in, enter your Zoho credentials." />
          <Step n={3} text='Zoho will show a permissions screen listing what Cadical is requesting access to (Contacts, Accounts, Deals, Leads, Cases). Review and click "Accept".' />
          <Step n={4} text="Zoho will redirect you back to Cadical automatically. You should see a green success banner: CRM connected successfully!" />
          <Step n={5} text='Go to Integrations → CRM in the sidebar. You will see the connection status badge change to "Connected" with a health score of 100.' />
          <Note>
            If you see an error, check that your Redirect URI in Zoho exactly matches the one in Cadical.
            The most common issue is a trailing slash or http vs https mismatch.
          </Note>
        </div>
      ),
    },
    {
      number: 7,
      title: "Test the Connection",
      description: "Verify Cadical can communicate with your Zoho CRM",
      content: (
        <div className="space-y-3">
          <Step n={1} text='Navigate to Integrations → CRM in the admin panel.' />
          <Step n={2} text='Click the "Test Connection" button in the top-right of the CRM dashboard.' />
          <Step n={3} text='Wait 2–5 seconds. If successful, you will see a green toast: "CRM connected successfully".' />
          <Step n={4} text="If the test fails, check the error message displayed. Common errors:" />
          <div className="ml-9 space-y-1 text-xs text-muted-foreground">
            <p>• <strong>Token expired:</strong> Re-authorize using the Connect CRM page</p>
            <p>• <strong>Invalid client:</strong> Check your Client ID and Secret are correct</p>
            <p>• <strong>401 Unauthorized:</strong> Token needs refresh — disconnect and reconnect</p>
            <p>• <strong>403 Forbidden:</strong> Check OAuth scopes in your Zoho app settings</p>
          </div>
          <div className="pt-2">
            <Button asChild variant="outline">
              <Link href="/admin/integrations/crm">
                Go to CRM Dashboard <ArrowRight size={15} />
              </Link>
            </Button>
          </div>
        </div>
      ),
    },
    {
      number: 8,
      title: "Configure Field Mappings",
      description: "Map Cadical data fields to your Zoho CRM fields",
      content: (
        <div className="space-y-3">
          <Step n={1} text='Go to Integrations → CRM → Field Mapping.' />
          <Step n={2} text="Select the entity you want to map (Contact, Account, Deal, Lead, or Ticket)." />
          <Step n={3} text="For each field you want to sync, select the Cadical field on the left and the corresponding Zoho field on the right." />
          <Step n={4} text="Set the sync direction: Both Ways, Cadical → Zoho, or Zoho → Cadical." />
          <Step n={5} text='Click "Add Mapping" to save each field mapping.' />
          <div className="p-3 bg-muted rounded-lg text-xs">
            <p className="font-medium mb-2">Recommended default mappings:</p>
            <div className="space-y-1 text-muted-foreground font-mono">
              <p>email → Email</p>
              <p>name → First_Name + Last_Name</p>
              <p>phone → Phone</p>
              <p>instName → Account_Name</p>
              <p>totalAmount → Amount</p>
              <p>trackingCode → Deal_Name</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: 9,
      title: "Set Up Automation Rules",
      description: "Automatically push records to Zoho when events happen",
      content: (
        <div className="space-y-3">
          <Step n={1} text='Go to Integrations → CRM → Automations.' />
          <Step n={2} text="Click into the Name field and give your rule a descriptive name, e.g. New Order → CRM Deal." />
          <Step n={3} text='Select a Trigger from the "When" dropdown, e.g. "Order Completed".' />
          <Step n={4} text='Select an Action from the "Then" dropdown, e.g. "Create CRM Deal".' />
          <Step n={5} text='Click "Create Rule". The rule will appear in the list below with Active status.' />
          <Step n={6} text="You can toggle rules on/off using the switch button without deleting them." />
          <div className="p-3 bg-muted rounded-lg text-xs">
            <p className="font-medium mb-2">Recommended automation rules:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Order Completed → Create CRM Deal</li>
              <li>• RFQ Submitted → Create CRM Lead</li>
              <li>• Service Booking Created → Create CRM Ticket</li>
              <li>• User Registered → Create CRM Contact</li>
              <li>• Institution Registered → Create CRM Account</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      number: 10,
      title: "Run Your First Sync",
      description: "Push existing Cadical data into Zoho CRM",
      content: (
        <div className="space-y-3">
          <Step n={1} text='Go to Integrations → CRM Overview (the main dashboard).' />
          <Step n={2} text='Click the "Sync All" button in the top-right corner.' />
          <Step n={3} text="Cadical will sync all Customers → Contacts, Institutions → Accounts, Orders → Deals, Referrals → Leads, and Bookings → Tickets." />
          <Step n={4} text='Monitor progress in Integrations → Sync Logs. Each entity will show a log entry with status (Success / Partial / Failed) and counts.' />
          <Step n={5} text="If any records failed, view them in Failed Jobs and retry individually." />
          <Step n={6} text="In your Zoho CRM dashboard, navigate to Contacts, Accounts, and Deals to verify the data appeared correctly." />
          <Note>
            The first sync may take a few minutes depending on your data volume.
            Subsequent syncs will be incremental and faster.
          </Note>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold">Zoho CRM Setup Wizard</h1>
          <Badge variant="outline" className="text-xs">Step-by-step</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Follow each step carefully to connect Cadical to Zoho CRM. This guide covers everything
          from creating a Zoho account to running your first sync.
        </p>
      </div>

      {/* Progress overview */}
      <div className="grid grid-cols-5 gap-1">
        {steps.map((s) => (
          <div key={s.number} className="flex flex-col items-center gap-1">
            <div className="w-full h-1.5 rounded-full bg-primary/20">
              <div className="h-full w-full rounded-full bg-primary opacity-60" />
            </div>
            <span className="text-[10px] text-muted-foreground">Step {s.number}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <StepCard key={step.number} step={step} defaultOpen={i === 0} />
        ))}
      </div>

      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
        <CheckCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm text-emerald-900">Ready to connect?</p>
          <p className="text-xs text-emerald-700 mt-0.5">
            Once you have completed Steps 1–4 and gathered your credentials, head to the Connect CRM
            page to complete the authorization.
          </p>
          <Button asChild size="sm" className="mt-3">
            <Link href="/admin/integrations/crm/connect">
              Connect Zoho CRM <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
