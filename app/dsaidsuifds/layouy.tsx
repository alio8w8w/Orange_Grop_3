// app/(admin)/layout.tsx
import '../globals.css'; // Importă CSS-ul global

export const metadata = {
  title: 'Admin Panel - Orange Group 3',
  description: 'Zona de administrare',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro"> {/* Sau limba fixă a adminului */}
      <body className="antialiased bg-gray-100 text-gray-900">
        <div className="flex min-h-screen">
          {/* Aici poți adăuga un Sidebar simplu de Admin */}
          <aside className="w-64 bg-brand-black text-brand-white p-6">
            <h2 className="text-xl font-bold mb-6">Admin OG3</h2>
            <nav>
              <ul>
                <li><a href="/admin" className="block py-2 hover:text-brand-orange">Dashboard</a></li>
                <li><a href="/" className="block py-2 hover:text-brand-orange">Inapoi la Site</a></li>
              </ul>
            </nav>
          </aside>
          
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}