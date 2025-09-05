'use client';

import { useParams } from 'next/navigation';
import ClientForm from '@/components/forms/client-form';

export default function EditClientPage() {
  const params = useParams();
  const clientId = parseInt(params.id as string);

  return <ClientForm mode="edit" clientId={clientId} />;
}
