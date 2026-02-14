'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog'

interface ClinicalProfessional {
  id: string
  name: string
  specialty: string
  email: string
  phone: string
  location: string
  experience: string
  availability: string
}

export default function Dashboard() {
  const [professionals, setProfessionals] = useState<ClinicalProfessional[]>([])
  const [filtered, setFiltered] = useState<ClinicalProfessional[]>([])
  const [search, setSearch] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Fetch professionals from API
  useEffect(() => {
    async function fetchProfessionals() {
      const res = await fetch('/api/clinical-professionals')
      const data = await res.json()
      setProfessionals(data)
      setFiltered(data)
    }
    fetchProfessionals()
  }, [])

  // Filter professionals
  useEffect(() => {
    let temp = [...professionals]

    if (filterSpecialty !== 'All') {
      temp = temp.filter(p => p.specialty === filterSpecialty)
    }

    if (search.trim() !== '') {
      temp = temp.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFiltered(temp)
    setCurrentPage(1) // reset page when filters change
  }, [search, filterSpecialty, professionals])

  const specialties = Array.from(new Set(professionals.map(p => p.specialty)))

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const displayed = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Clinical Professionals Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by name or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select onValueChange={(value) => setFilterSpecialty(value)} defaultValue="All">
          <SelectTrigger className="w-48">
            <SelectValue>{filterSpecialty}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Specialties</SelectItem>
            {specialties.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => { setSearch(''); setFilterSpecialty('All') }}>Reset</Button>
      </div>

      {/* Professional cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayed.map((p) => (
          <Dialog key={p.id}>
            <DialogTrigger asChild>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Specialty:</strong> {p.specialty}</p>
                  <p><strong>Location:</strong> {p.location}</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{p.name}</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <p><strong>Specialty:</strong> {p.specialty}</p>
                <p><strong>Email:</strong> {p.email}</p>
                <p><strong>Phone:</strong> {p.phone}</p>
                <p><strong>Location:</strong> {p.location}</p>
                <p><strong>Experience:</strong> {p.experience}</p>
                <p><strong>Availability:</strong> {p.availability}</p>
              </DialogDescription>
              <DialogFooter className="flex justify-between mt-4">
                <Button variant="default">Hire</Button>
                <Button variant="outline">Message</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
        {displayed.length === 0 && <p>No professionals found.</p>}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <Button
              key={num}
              variant={num === currentPage ? 'default' : 'outline'}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </Button>
          ))}
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
