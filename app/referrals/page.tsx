'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  referrerFullName: string;
  referrerDesignation: string;
  referrerFacility: string;
  referrerFacilityType: string;
  referrerPhone: string;
  referrerEmail: string;
  referrerState: string;
  referrerLGA: string;
  referrerAddress: string;
  clientFacilityName: string;
  clientType: string;
  clientContactPerson: string;
  clientPhone: string;
  clientEmail: string;
  clientState: string;
  clientLGA: string;
  clientAddress: string;
  reasonForRequest: string;
  supplyCategory: string[];
  specificTests: string[];
  urgencyLevel: string;
  quantity: string;
  deliveryMethod: string;
  additionalNotes: string;
  affiliateId: string;
  referredVia: string;
  paymentPreference: string;
  estimatedValue: string;
  consent: boolean;
}

const categoriesData = [
  { icon: '🩸', name: 'Blood Grouping', desc: 'ABO, Rh, Cross-match, Coombs' },
  { icon: '🧫', name: 'Chemistry Kits', desc: 'Liver, Renal, Lipid panels' },
  { icon: '🔬', name: 'Rapid Tests', desc: 'Malaria, HIV, HBsAg, Widal' },
  { icon: '💉', name: 'ELISA Kits', desc: 'HCV, HBsAg, HIV, Syphilis' },
  { icon: '🩺', name: 'Medical Consumables', desc: 'Gloves, syringes, lancets, tubes' },
  { icon: '📦', name: 'Other Supplies', desc: 'Specify in notes below' },
];

const testsData = [
  'ABO + Rh Blood Grouping',
  'Full Cross-matching',
  'Direct Coombs Test (DAT)',
  'Indirect Coombs Test (IAT)',
  'Malaria RDT (P.f/P.v)',
  'HIV Rapid Test',
  'HBsAg Rapid Test',
  'Widal Agglutination',
  'Liver Function Tests (LFT)',
  'Kidney Function Tests (KFT)',
  'Lipid Profile',
  'Blood Glucose (RBS/FBS)',
  'Full Blood Count (FBC)',
  'Urinalysis',
  'Pregnancy Test (hCG)',
  'CRP / ASOT / RF',
];

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT — Abuja', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

function generateId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let id = 'CAD-';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export default function ReferralsPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    referrerFullName: '',
    referrerDesignation: '',
    referrerFacility: '',
    referrerFacilityType: '',
    referrerPhone: '',
    referrerEmail: '',
    referrerState: 'Kaduna',
    referrerLGA: '',
    referrerAddress: '',
    clientFacilityName: '',
    clientType: '',
    clientContactPerson: '',
    clientPhone: '',
    clientEmail: '',
    clientState: 'Kaduna',
    clientLGA: '',
    clientAddress: '',
    reasonForRequest: '',
    supplyCategory: [],
    specificTests: [],
    urgencyLevel: '',
    quantity: '',
    deliveryMethod: '',
    additionalNotes: '',
    affiliateId: generateId(),
    referredVia: '',
    paymentPreference: '',
    estimatedValue: '',
    consent: false,
  });
  const [refId, setRefId] = useState(generateId());
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const steps = [
    { label: 'Referrer', icon: '🏥' },
    { label: 'Client', icon: '👤' },
    { label: 'Supply', icon: '🧪' },
    { label: 'Confirm', icon: '🔗' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryToggle = (categoryName: string) => {
    setFormData(prev => ({
      ...prev,
      supplyCategory: prev.supplyCategory.includes(categoryName)
        ? prev.supplyCategory.filter(c => c !== categoryName)
        : [...prev.supplyCategory, categoryName]
    }));
  };

  const handleTestToggle = (testName: string) => {
    setFormData(prev => ({
      ...prev,
      specificTests: prev.specificTests.includes(testName)
        ? prev.specificTests.filter(t => t !== testName)
        : [...prev.specificTests, testName]
    }));
  };

  const handleUrgencySelect = (level: string) => {
    setFormData(prev => ({ ...prev, urgencyLevel: level }));
  };

  const validateStep = () => {
    const step1Valid = currentStep === 0 && formData.referrerFullName && formData.referrerDesignation && formData.referrerFacility && formData.referrerPhone;
    const step2Valid = currentStep === 1 && formData.clientFacilityName && formData.clientType && formData.clientPhone && formData.reasonForRequest;
    const step3Valid = currentStep === 2 && formData.supplyCategory.length > 0 && formData.urgencyLevel;
    const step4Valid = currentStep === 3 && formData.consent;
    return step1Valid || step2Valid || step3Valid || step4Valid;
  };

  const handleNext = () => {
    if (validateStep() && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      alert('Please confirm the consent declaration before submitting.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, refId }),
      });

      if (response.ok) {
        setSubmitted(true);
        setCurrentStep(0);
        setFormData({
          referrerFullName: '', referrerDesignation: '', referrerFacility: '', referrerFacilityType: '',
          referrerPhone: '', referrerEmail: '', referrerState: 'Kaduna', referrerLGA: '',
          referrerAddress: '', clientFacilityName: '', clientType: '', clientContactPerson: '',
          clientPhone: '', clientEmail: '', clientState: 'Kaduna', clientLGA: '',
          clientAddress: '', reasonForRequest: '', supplyCategory: [], specificTests: [],
          urgencyLevel: '', quantity: '', deliveryMethod: '', additionalNotes: '',
          affiliateId: 'AFF-KD-001', referredVia: '', paymentPreference: '', estimatedValue: '', consent: false,
        });
        setRefId(generateId());
      } else {
        alert('Error submitting form. Please try again.');
      }
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      referrerFullName: '', referrerDesignation: '', referrerFacility: '', referrerFacilityType: '',
      referrerPhone: '', referrerEmail: '', referrerState: 'Kaduna', referrerLGA: '',
      referrerAddress: '', clientFacilityName: '', clientType: '', clientContactPerson: '',
      clientPhone: '', clientEmail: '', clientState: 'Kaduna', clientLGA: '',
      clientAddress: '', reasonForRequest: '', supplyCategory: [], specificTests: [],
      urgencyLevel: '', quantity: '', deliveryMethod: '', additionalNotes: '',
      affiliateId: 'AFF-KD-001', referredVia: '', paymentPreference: '', estimatedValue: '', consent: false,
    });
    setRefId(generateId());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* TOP BANNER */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-t-lg overflow-hidden bg-gradient-to-r from-[#1B3A5C] via-[#1B3A5C] to-[#0f2842] px-6 sm:px-8 py-8 sm:py-10 shadow-lg"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-b from-yellow-300 to-transparent opacity-5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-gradient-to-t from-red-400 to-transparent opacity-8 translate-y-1/2" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
              >
                CS
              </motion.div>
              <div>
                <h1 className="font-cormorant text-2xl sm:text-3xl font-semibold text-white">Cadical Solutions Ltd</h1>
                <p className="text-xs sm:text-sm text-blue-200 opacity-75 tracking-wide mt-1">www.cadical.com • Healthcare Supplies</p>
              </div>
            </div>

            {/* Right section - hidden on mobile */}
            <div className="hidden sm:block text-right">
              <div className="inline-block bg-yellow-500 text-[#1B3A5C] text-xs font-bold px-3 py-1 rounded-full mb-2 tracking-wider">Official Form</div>
              <h2 className="font-cormorant text-2xl font-semibold text-white">Supply & Services Request Form</h2>
              <p className="text-xs sm:text-sm text-blue-200 opacity-75 mt-1">Nigeria's Healthcare Supply Partner</p>
            </div>
          </div>
        </motion.div>

        {/* PROGRESS BAR */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-r from-[#162f4e] to-[#1B3A5C] px-6 sm:px-8 py-6 sm:py-8"
        >
          <div className="relative flex justify-between">
            {/* Connection line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-300 opacity-20 transform -translate-y-1/2" />
            
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                className="relative flex flex-col items-center z-10"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{
                    scale: currentStep === idx ? 1.1 : 1,
                    backgroundColor: currentStep > idx ? '#0F7B55' : currentStep === idx ? '#C9A84C' : 'rgba(255,255,255,0.15)',
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-bold transition-all ${
                    currentStep > idx
                      ? 'border-green-400 text-white'
                      : currentStep === idx
                      ? 'border-yellow-500 text-[#1B3A5C]'
                      : 'border-blue-300 text-blue-200'
                  }`}
                >
                  {currentStep > idx ? '✓' : idx + 1}
                </motion.div>
                <p className={`text-xs sm:text-sm mt-2 text-center font-medium tracking-wider transition-colors ${
                  currentStep >= idx ? 'text-yellow-400' : 'text-blue-300'
                }`}>
                  {step.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FORM CARD */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white px-6 sm:px-8 py-8 sm:py-10 shadow-lg"
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg p-8 sm:p-12 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="text-5xl sm:text-6xl mb-4"
              >
                ✅
              </motion.div>
              <h3 className="font-cormorant text-2xl sm:text-3xl font-semibold text-green-700 mb-2">Supply Request Submitted!</h3>
              <p className="text-green-600 mb-4">Your supply request has been received by Cadical Solutions Ltd. A confirmation will be sent to your email or phone shortly.</p>
              <p className="font-bold text-green-700 mb-6">Order Reference ID: <span className="text-lg text-green-600">{refId}</span></p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSubmitted(false)}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg"
              >
                Submit Another Request
              </motion.button>
            </motion.div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* Notice */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-blue-50 border-l-4 border-[#1B3A5C] rounded-r-lg p-4 sm:p-5"
              >
                <p className="text-sm sm:text-base text-[#1B3A5C] leading-relaxed">
                  <strong>Important:</strong> This form is for healthcare professionals, facilities, and affiliate partners referring clients or institutions to Cadical Solutions Ltd for healthcare supplies and related services. All fields marked <span className="text-red-600">*</span> are required. A unique Order Reference ID will be generated upon submission.
                </p>
              </motion.div>

              {/* STEP 1 - REFERRER DETAILS */}
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">🏥</div>
                      <div>
                        <h3 className="font-cormorant text-xl sm:text-2xl font-semibold text-[#1B3A5C]">Section 1 — Contact / Ordering Party</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Details of the healthcare professional, facility, or affiliate partner placing this supply request</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Full Name" required>
                        <input
                          type="text"
                          name="referrerFullName"
                          value={formData.referrerFullName}
                          onChange={handleInputChange}
                          placeholder="e.g. Mr. Isaac Okondi Yohanna"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                          required
                        />
                      </FormField>

                      <FormField label="Designation / Role" required>
                        <select
                          name="referrerDesignation"
                          value={formData.referrerDesignation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                          required
                        >
                          <option value="">— Select Role —</option>
                          <option>Medical Laboratory Technician</option>
                          <option>Medical Laboratory Scientist</option>
                          <option>Medical Doctor (GP)</option>
                          <option>Pharmacist</option>
                          <option>Nurse / Midwife</option>
                          <option>Community Health Officer (CHO)</option>
                          <option>Community Health Extension Worker (CHEW)</option>
                          <option>Hospital Administrator</option>
                          <option>Affiliate Marketer</option>
                          <option>Other</option>
                        </select>
                      </FormField>

                      <FormField label="Facility / Organisation Name" required>
                        <input
                          type="text"
                          name="referrerFacility"
                          value={formData.referrerFacility}
                          onChange={handleInputChange}
                          placeholder="e.g. Kaduna State PHC Development Agency"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                          required
                        />
                      </FormField>

                      <FormField label="Facility Type" required>
                        <select
                          name="referrerFacilityType"
                          value={formData.referrerFacilityType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                          required
                        >
                          <option value="">— Select Type —</option>
                          <option>Primary Health Centre (PHC)</option>
                          <option>General Hospital</option>
                          <option>Teaching Hospital</option>
                          <option>Private Hospital / Clinic</option>
                          <option>Medical Laboratory</option>
                          <option>Pharmacy</option>
                          <option>NGO / Faith-Based Organisation</option>
                          <option>Individual Practice</option>
                          <option>Other</option>
                        </select>
                      </FormField>

                      <FormField label="Phone Number" required>
                        <input
                          type="tel"
                          name="referrerPhone"
                          value={formData.referrerPhone}
                          onChange={handleInputChange}
                          placeholder="e.g. 08012345678"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                          required
                        />
                      </FormField>

                      <FormField label="Email Address">
                        <input
                          type="email"
                          name="referrerEmail"
                          value={formData.referrerEmail}
                          onChange={handleInputChange}
                          placeholder="e.g. yourname@email.com"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                        />
                      </FormField>

                      <FormField label="State" required>
                        <select
                          name="referrerState"
                          value={formData.referrerState}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                          required
                        >
                          {nigerianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </FormField>

                      <FormField label="LGA" required>
                        <input
                          type="text"
                          name="referrerLGA"
                          value={formData.referrerLGA}
                          onChange={handleInputChange}
                          placeholder="e.g. Kaura LGA"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                          required
                        />
                      </FormField>

                      <FormField label="Full Address" className="sm:col-span-2">
                        <input
                          type="text"
                          name="referrerAddress"
                          value={formData.referrerAddress}
                          onChange={handleInputChange}
                          placeholder="Street, Town / City"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                        />
                      </FormField>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 - CLIENT DETAILS */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">👤</div>
                      <div>
                        <h3 className="font-cormorant text-xl sm:text-2xl font-semibold text-[#1B3A5C]">Section 2 — Client / Facility Details</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Details of the client, facility, or institution requesting Cadical's supplies or services</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Client / Facility Name" required>
                        <input
                          type="text"
                          name="clientFacilityName"
                          value={formData.clientFacilityName}
                          onChange={handleInputChange}
                          placeholder="e.g. Kagoro General Hospital or Mr. John Doe"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                          required
                        />
                      </FormField>

                      <FormField label="Client Type" required>
                        <select
                          name="clientType"
                          value={formData.clientType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                          required
                        >
                          <option value="">— Select —</option>
                          <option>Private Hospital / Clinic</option>
                          <option>Government Hospital</option>
                          <option>Primary Health Centre (PHC)</option>
                          <option>Medical / Diagnostic Laboratory</option>
                          <option>Pharmacy / Drug Store</option>
                          <option>Individual Healthcare Professional</option>
                          <option>NGO / Faith-Based Organisation</option>
                          <option>Research Institution</option>
                          <option>Other</option>
                        </select>
                      </FormField>

                      <FormField label="Contact Person">
                        <input
                          type="text"
                          name="clientContactPerson"
                          value={formData.clientContactPerson}
                          onChange={handleInputChange}
                          placeholder="Name of person to contact at the facility"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                        />
                      </FormField>

                      <FormField label="Contact Phone Number" required>
                        <input
                          type="tel"
                          name="clientPhone"
                          value={formData.clientPhone}
                          onChange={handleInputChange}
                          placeholder="08012345678"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                          required
                        />
                      </FormField>

                      <FormField label="Contact Email">
                        <input
                          type="email"
                          name="clientEmail"
                          value={formData.clientEmail}
                          onChange={handleInputChange}
                          placeholder="facility@email.com"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                        />
                      </FormField>

                      <FormField label="State" required>
                        <select
                          name="clientState"
                          value={formData.clientState}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                          required
                        >
                          {nigerianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </FormField>

                      <FormField label="LGA">
                        <input
                          type="text"
                          name="clientLGA"
                          value={formData.clientLGA}
                          onChange={handleInputChange}
                          placeholder="e.g. Kaura LGA"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                        />
                      </FormField>

                      <FormField label="Client / Facility Address" className="sm:col-span-2">
                        <input
                          type="text"
                          name="clientAddress"
                          value={formData.clientAddress}
                          onChange={handleInputChange}
                          placeholder="Street, Town / City, State"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                        />
                      </FormField>

                      <FormField label="Reason for Supply Request" required className="sm:col-span-2">
                        <textarea
                          name="reasonForRequest"
                          value={formData.reasonForRequest}
                          onChange={handleInputChange}
                          placeholder="Describe what the client or facility needs — e.g. restocking diagnostic kits, setting up a new laboratory, or fulfilling a specific supply requirement..."
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50 resize-none min-h-24"
                          required
                        />
                      </FormField>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 - SUPPLY REQUEST */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">🧪</div>
                      <div>
                        <h3 className="font-cormorant text-xl sm:text-2xl font-semibold text-[#1B3A5C]">Section 3 — Supply & Product Request</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Specify the healthcare supplies, diagnostic products, or services required</p>
                      </div>
                    </div>

                    {/* Supply Category */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#1B3A5C] uppercase tracking-wider mb-4">
                        Supply Category <span className="text-red-600">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {categoriesData.map((cat, idx) => (
                          <motion.button
                            key={idx}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCategoryToggle(cat.name)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              formData.supplyCategory.includes(cat.name)
                                ? 'border-[#1B3A5C] bg-blue-100 shadow-lg'
                                : 'border-gray-200 bg-blue-50 hover:border-[#1B3A5C]'
                            }`}
                          >
                            <div className="text-2xl mb-2">{cat.icon}</div>
                            <div className="font-bold text-sm sm:text-base text-[#1B3A5C]">{cat.name}</div>
                            <div className="text-xs sm:text-sm text-gray-600 mt-1">{cat.desc}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Specific Tests */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#1B3A5C] uppercase tracking-wider mb-4">Specific Tests / Products Required</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {testsData.map((test, idx) => (
                          <motion.label
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.specificTests.includes(test)
                                ? 'border-[#1B3A5C] bg-blue-100'
                                : 'border-gray-200 bg-blue-50 hover:border-[#1B3A5C]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.specificTests.includes(test)}
                              onChange={() => handleTestToggle(test)}
                              className="w-4 h-4 accent-[#1B3A5C] cursor-pointer"
                            />
                            <span className="text-sm">{test}</span>
                          </motion.label>
                        ))}
                      </div>
                    </div>

                    {/* Urgency Level */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#1B3A5C] uppercase tracking-wider mb-4">
                        Urgency Level <span className="text-red-600">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { label: '✅ Routine', value: 'routine', color: 'bg-green-50 border-green-400 hover:border-green-600' },
                          { label: '⚠️ Urgent (24–48hrs)', value: 'urgent', color: 'bg-yellow-50 border-yellow-400 hover:border-yellow-600' },
                          { label: '🚨 Emergency (Same Day)', value: 'emergency', color: 'bg-red-50 border-red-400 hover:border-red-600' },
                        ].map((urgency, idx) => (
                          <motion.button
                            key={idx}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUrgencySelect(urgency.value)}
                            className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                              formData.urgencyLevel === urgency.value
                                ? urgency.color
                                : 'border-gray-200 bg-blue-50 hover:' + urgency.color
                            }`}
                          >
                            {urgency.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity & Delivery */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Quantity / Volume Required">
                        <input
                          type="text"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          placeholder="e.g. 2 kits, 100 tests, 5 boxes"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                        />
                      </FormField>

                      <FormField label="Preferred Delivery Method">
                        <select
                          name="deliveryMethod"
                          value={formData.deliveryMethod}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                        >
                          <option value="">— Select —</option>
                          <option>Pickup from Cadical Office</option>
                          <option>Courier Delivery</option>
                          <option>State Distributor / Agent</option>
                          <option>Dispatch Rider</option>
                        </select>
                      </FormField>

                      <FormField label="Additional Notes / Special Instructions" className="sm:col-span-2">
                        <textarea
                          name="additionalNotes"
                          value={formData.additionalNotes}
                          onChange={handleInputChange}
                          placeholder="Brand preferences, cold chain requirements, delivery instructions, alternative products, or any other supply-related notes..."
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50 resize-none min-h-24"
                        />
                      </FormField>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4 - CONFIRMATION */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">🔗</div>
                      <div>
                        <h3 className="font-cormorant text-xl sm:text-2xl font-semibold text-[#1B3A5C]">Section 4 — Supply Referral & Affiliate Tracking</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">For affiliate partners referring clients to Cadical — commission tracking and order attribution</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Affiliate / Referral ID">
                        <input
                          type="text"
                          name="affiliateId"
                          value={formData.affiliateId}
                          onChange={handleInputChange}
                          placeholder="e.g. AFF-KD-001"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                        />
                        <p className="text-xs text-gray-500 mt-2">Your unique Cadical affiliate link ID</p>
                      </FormField>

                      <FormField label="Referred Via">
                        <select
                          name="referredVia"
                          value={formData.referredVia}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                        >
                          <option value="">— Select Channel —</option>
                          <option>Direct Visit (www.cadical.com)</option>
                          <option>WhatsApp Referral</option>
                          <option>SMS / Phone Call</option>
                          <option>Community Outreach</option>
                          <option>Hospital Network</option>
                          <option>Social Media</option>
                          <option>Word of Mouth</option>
                        </select>
                      </FormField>

                      <FormField label="Payment Preference">
                        <select
                          name="paymentPreference"
                          value={formData.paymentPreference}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                        >
                          <option value="">— Select —</option>
                          <option>Bank Transfer</option>
                          <option>POS / Card Payment</option>
                          <option>USSD Payment</option>
                          <option>Cash on Delivery</option>
                          <option>Institutional Purchase Order</option>
                          <option>Monthly Supply Agreement</option>
                        </select>
                      </FormField>

                      <FormField label="Estimated Order Value (₦)">
                        <input
                          type="text"
                          name="estimatedValue"
                          value={formData.estimatedValue}
                          onChange={handleInputChange}
                          placeholder="e.g. ₦50,000"
                          className="w-full px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:border-[#1B3A5C] focus:outline-none focus:shadow-lg transition-all bg-blue-50"
                        />
                      </FormField>
                    </div>

                    {/* Consent Box */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-5 sm:p-6"
                    >
                      <label className="flex items-start gap-4 cursor-pointer">
                        <input
                          type="checkbox"
                          name="consent"
                          checked={formData.consent}
                          onChange={handleInputChange}
                          className="w-5 h-5 accent-yellow-600 mt-1 cursor-pointer flex-shrink-0"
                          required
                        />
                        <span className="text-sm sm:text-base text-yellow-900 leading-relaxed">
                          I confirm that the information provided in this form is accurate to the best of my knowledge. I consent to Cadical Solutions Ltd processing this supply request and contacting the client or facility on my behalf. I acknowledge that this request is subject to Cadical's <a href="https://www.cadical.com/terms" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-red-600 hover:text-red-700">Terms of Service</a> and <a href="https://www.cadical.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-red-600 hover:text-red-700">Privacy Policy</a>. Data is protected under the Nigeria Data Protection Act (NDPA).
                        </span>
                      </label>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all ${
                    currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#1B3A5C] hover:text-[#1B3A5C]'
                  }`}
                >
                  ← Previous
                </motion.button>

                <div className="flex gap-3 sm:gap-4 flex-1 sm:flex-initial justify-center sm:justify-end">
                  {currentStep === steps.length - 1 ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={resetForm}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-500 transition-all"
                      >
                        Clear Form
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={isLoading}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold bg-[#1B3A5C] text-white hover:bg-[#142e4a] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <span className="animate-spin">⏳</span> Submitting...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Submit Request
                          </>
                        )}
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleNext}
                      className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold bg-[#1B3A5C] text-white hover:bg-[#142e4a] transition-all shadow-lg flex items-center gap-2"
                    >
                      Next →
                    </motion.button>
                  )}
                </div>
              </div>
            </form>
          )}
        </motion.div>

        {/* FOOTER */}
        {/* <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-b-lg bg-gradient-to-r from-[#162f4e] to-[#1B3A5C] text-white px-6 sm:px-8 py-6 shadow-lg flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-center text-center sm:text-left"
        >
          <p className="text-xs sm:text-sm text-blue-200">© 2026 Cadical Solutions Ltd · <a href="https://www.cadical.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">www.cadical.com</a></p>
          <p className="text-xs sm:text-sm text-blue-300 tracking-widest">FORM-REF: {refId}</p>
          <a href="mailto:services@cadical.com" className="text-xs sm:text-sm text-yellow-400 hover:underline">services@cadical.com</a>
        </motion.div> */}
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

function FormField({ label, required = false, children, className = '' }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-xs sm:text-sm font-bold text-[#1B3A5C] uppercase tracking-wider mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}

