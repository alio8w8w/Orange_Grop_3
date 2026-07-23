import { AuthProvider } from "@/lib/auth-context"; // Asigură-te că importul corespunde cu calea ta

export default function AdminZoneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Îmbrăcăm toată zona secretă cu Provider-ul pentru ca useAuth să funcționeze oriunde
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}import { AuthProvider } from "@/lib/auth-context"; // Asigură-te că importul corespunde cu calea ta

export default function AdminZoneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Îmbrăcăm toată zona secretă cu Provider-ul pentru ca useAuth să funcționeze oriunde
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}