'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LocalDB } from '@/lib/local-db';
import {
  PolicyFormData,
  PolicyFormWizard,
} from '../components/policy-form-wizard';

export default function PolicyEditPage() {
  const params = useParams();
  const { id } = params;
  const [policyData, setPolicyData] = useState<Partial<PolicyFormData> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        setIsLoading(true);
        const data = await LocalDB.get<PolicyFormData>(`policies/${id}`);

        if (!data) {
          setError('No se encontró la póliza');
          return;
        }

        setPolicyData(data);
      } catch (err) {
        console.error('Error al cargar la póliza:', err);
        setError('Error al cargar la póliza');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPolicyData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando póliza...</p>
      </div>
    );
  }

  if (error || !policyData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error || 'No se encontró la póliza'}</p>
        </div>
      </div>
    );
  }

  return <PolicyFormWizard initialData={policyData} policyId={id as string} />;
}
