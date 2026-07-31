import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabase] LIPSESC VARIABILELE DE MEDIU! Verifică configurarea din Vercel sau .env.local.'
  )
}

// Pattern Singleton pentru a preveni avertismentul de instanțe multiple GoTrueClient
let cachedClient: ReturnType<typeof createBrowserClient> | null = null

export const supabase = (() => {
  if (cachedClient) return cachedClient
  cachedClient = createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
  )
  return cachedClient
})()

// --- Bucket-uri de storage folosite în aplicație ---
export const STORAGE_BUCKETS = {
  poze: 'cv-poze',
  documente: 'cv-documente', // diplome + certificate
  portofoliu: 'portofoliu',  // <--- Bucket-ul de portofoliu
} as const

/**
 * Încarcă un fișier într-un bucket și întoarce URL-ul public.
 */
export async function incarcaFisier(
  bucket: keyof typeof STORAGE_BUCKETS | string,
  adminId: string,
  fisier: File
): Promise<string> {
  const numeBucket = (STORAGE_BUCKETS as Record<string, string>)[bucket] || bucket

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

/**
 * Șterge un fișier din bucket.
 */
export async function stergeFisier(
  bucket: keyof typeof STORAGE_BUCKETS | string,
  caleFisier: string
) {
  const numeBucket = (STORAGE_BUCKETS as Record<string, string>)[bucket] || bucket

  const { error } = await supabase.storage
    .from(numeBucket)
    .remove([caleFisier])

  if (error) throw error
}