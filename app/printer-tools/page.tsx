"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CostCalculator } from "@/components/printer/cost-calculator"
import { FleetManagement } from "@/components/printer/fleet-management"
import { ModelOptimizer } from "@/components/printer/model-optimizer"
import { PrinterIntegration } from "@/components/printer/printer-integration"
import { Calculator, Activity, Zap, Monitor } from "lucide-react"

export default function PrinterToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Herramientas para Impresores</h1>
          <p className="text-gray-300">Suite completa de herramientas profesionales para impresión 3D</p>
        </div>

        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculadora</span>
            </TabsTrigger>
            <TabsTrigger value="fleet" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Flota</span>
            </TabsTrigger>
            <TabsTrigger value="optimizer" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Optimizador</span>
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">Integración</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <CostCalculator />
          </TabsContent>

          <TabsContent value="fleet">
            <FleetManagement />
          </TabsContent>

          <TabsContent value="optimizer">
            <ModelOptimizer />
          </TabsContent>

          <TabsContent value="integration">
            <PrinterIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
