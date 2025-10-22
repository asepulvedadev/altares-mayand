import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { MODEL_TYPES } from '@/lib/constants/business-config'
import type { Altar } from '../schemas/altar.schema'

interface AltarCardProps {
  altar: Altar
}

export function AltarCard({ altar }: AltarCardProps) {
  const modelType = MODEL_TYPES[altar.modelo_tipo]

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
          {altar.imagen_principal ? (
            <Image
              src={altar.imagen_principal}
              alt={altar.nombre}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-400">
              <span className="text-6xl">{modelType.icon}</span>
            </div>
          )}
          {altar.destacado && (
            <div className="absolute left-2 top-2">
              <Badge variant="destructive" className="font-semibold">
                Destacado
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="line-clamp-2 flex-1 font-semibold text-neutral-900">
            {altar.nombre}
          </h3>
        </div>

        <Badge variant="secondary" className="mt-2">
          <span className="mr-1">{modelType.icon}</span>
          {modelType.label}
        </Badge>

        {altar.descripcion && (
          <p className="mt-3 line-clamp-2 text-sm text-neutral-600">
            {altar.descripcion}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/producto/${altar.slug}`}>
            Ver detalles
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
