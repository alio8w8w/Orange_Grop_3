import { redirect } from 'next/navigation';

export default function RootPage() {
  // Trimite vizitatorul direct pe versiunea în română
  redirect('/ro');
}