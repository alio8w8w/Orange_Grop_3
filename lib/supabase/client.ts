import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabase] LIPSESC VARIABILELE DE MEDIU! Verifică configurarea din Vercel sau .env.local.'
  )
}

// Clientul Supabase pentru browser / componente de client
export const supabase = createBrowserClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// --- Bucket-uri de storage folosite în aplicație ---
export const STORAGE_BUCKETS = {
  poze: 'cv-poze',
  documente: 'cv-documente', // diplome + certificate
} as const

/**
 * Încarcă un fișier într-un bucket și întoarce URL-ul public.
 */
export async function incarcaFisier(
  bucket: keyof typeof STORAGE_BUCKETS,
  adminId: string,
  fisier: File
): Promise<string> {
  const extensie = fisier.name.split('.').pop()
  const caleFisier = `${adminId}/${crypto.randomUUID()}.${extensie}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .upload(caleFisier, fisier, { upsert: false })

  if (error) throw error

  const { data } = supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .getPublicUrl(caleFisier)

  return data.publicUrl
}

export async function stergeFisier(
  bucket: keyof typeof STORAGE_BUCKETS,
  caleFisier: string
) {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .remove([caleFisier])

  if (error) throw error
}