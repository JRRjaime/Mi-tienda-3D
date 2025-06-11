import { PrintRequestSystem } from "@/components/printing/print-request-system"
import { GlobalHeader } from "@/components/global-header"

interface PrintPageProps {
  params: {
    id: string
  }
}

export default function PrintPage({ params }: PrintPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader title="World 3D - Solicitar Impresión" showBackButton backHref="/modelos" />
      <PrintRequestSystem
        modelId={params.id}
        modelTitle="Figura de Goku Super Saiyan"
        modelImage="/images/goku-figure.png"
      />
    </div>
  )
}
