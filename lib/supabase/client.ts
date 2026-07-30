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
  portofoliu: 'portofoliu',  // <--- Adăugat bucket-ul de portofoliu
} as const

/**
 * Încarcă un fișier într-un bucket și întoarce URL-ul public.
 */
export async function incarcaFisier(
  bucket: keyof typeof STORAGE_BUCKETS | string,
  adminId: string,
  fisier: File
): Promise<string> {
  // Verificăm dacă bucket-ul există în obiectul de mapare, altfel folosim direct string-ul primit
  const numeBucket = (STORAGE_BUCKETS as Record<string, string>)[bucket] || bucket;

  const extensie = fisier.name.split('.').pop()
  const caleFisier = `${adminId}/${crypto.randomUUID()}.${extensie}`

  const { error } = await supabase.storage
    .from(numeBucket)
    .upload(caleFisier, fisier, { upsert: false })

  if (error) throw error

  const { data } = supabase.storage
    .from(numeBucket)
    .getPublicUrl(caleFisier)

  return data.publicUrl
}

export async function stergeFisier(
  bucket: keyof typeof STORAGE_BUCKETS | string,
  caleFisier: string
) {
  const numeBucket = (STORAGE_BUCKETS as Record<string, string>)[bucket] || bucket;

  const { error } = await supabase.storage
    .from(numeBucket)
    .remove([caleFisier])

  if (error) throw error
}