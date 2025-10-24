'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { LocalDB } from '@/lib/local-db';
import { useTranslation } from '@/hooks/useTranslation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  PolicyFormData,
  PolicyFormWizard,
} from '../components/policy-form-wizard';

export default function PolicyEditPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const { t } = useTranslation('pages');
  const [policyData, setPolicyData] = useState<Partial<PolicyFormData> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

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

  const handleDelete = async () => {
    try {
      await LocalDB.erase(`policies/${id}`);
      await queryClient.invalidateQueries({ queryKey: ['policies'] });
      router.push('/policies');
    } catch (err) {
      console.error('Error al eliminar la póliza:', err);
      setError('Error al eliminar la póliza');
    }
  };

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

  return (
    <div className="px-4 py-6">
      <div className="flex justify-end mb-4">
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 /> {t('policies.edit_policy.delete_policy.confirm')}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t('policies.edit_policy.delete_policy.title')}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t('policies.edit_policy.delete_policy.description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t('policies.edit_policy.delete_policy.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {t('policies.edit_policy.delete_policy.confirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <PolicyFormWizard initialData={policyData} policyId={id as string} />
    </div>
  );
}
