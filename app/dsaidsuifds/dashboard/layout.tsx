import { AuthProvider } from "@/lib/auth-context";

export default function AdminZoneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}