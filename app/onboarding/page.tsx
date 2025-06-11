"use client"

import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { ProfileTypeSelector } from "@/components/profile-type-selector"
import { InterestsSelector } from "@/components/interests-selector"
import { OnboardingComplete } from "@/components/onboarding-complete"

const steps = [
  {
    id: 1,
    title: "Tipo de Perfil",
    description: "Selecciona qué tipo de usuario eres",
  },
  {
    id: 2,
    title: "Tus Intereses",
    description: "Cuéntanos qué te gusta para personalizar tu experiencia",
  },
  {
    id: 3,
    title: "¡Listo!",
    description: "Tu cuenta está configurada",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([])
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedProfiles.length > 0
      case 2:
        return selectedInterests.length > 0
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 p-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">3D</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Configuración de Cuenta</h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-white">
              Paso {currentStep} de {steps.length}
            </h2>
            <div className="text-cyan-400 font-medium">{Math.round(progress)}% completado</div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    currentStep > step.id
                      ? "bg-green-500 border-green-500 text-white"
                      : currentStep === step.id
                        ? "bg-cyan-500 border-cyan-500 text-white"
                        : "border-white/30 text-white/50"
                  }`}
                >
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                      currentStep > step.id ? "bg-green-500" : "bg-white/30"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current step content */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white">{steps[currentStep - 1].title}</CardTitle>
            <CardDescription className="text-xl text-gray-300">{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {currentStep === 1 && (
              <ProfileTypeSelector selectedProfiles={selectedProfiles} onSelectionChange={setSelectedProfiles} />
            )}
            {currentStep === 2 && (
              <InterestsSelector
                selectedInterests={selectedInterests}
                onSelectionChange={setSelectedInterests}
                userProfiles={selectedProfiles}
              />
            )}
            {currentStep === 3 && (
              <OnboardingComplete selectedProfiles={selectedProfiles} selectedInterests={selectedInterests} />
            )}
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Link href="/perfil">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                Completar Configuración
                <Check className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
