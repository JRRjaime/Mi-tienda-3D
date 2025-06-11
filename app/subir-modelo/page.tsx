import { ModelUploadSystem } from "@/components/upload/model-upload-system"
import { GlobalHeader } from "@/components/global-header"

export default function UploadModelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader title="World 3D - Subir Modelo" showBackButton backHref="/" />
      <ModelUploadSystem />
    </div>
  )
}
