import { ClinicianAuthWrapper } from "@/components/clinician/auth-wrapper"

export const dynamic = "force-dynamic"

export default function ClinicianLayout({ children }: { children: React.ReactNode }) {
  return <ClinicianAuthWrapper>{children}</ClinicianAuthWrapper>
}
