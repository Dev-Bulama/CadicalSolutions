import BookingPage from "@/components/booking/BookingPage";
import PageHeader from "@/components/PageHeader";



export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      
      <PageHeader />
      <BookingPage />

    </main>
  )
}
