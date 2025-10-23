'use client';

import { useParams } from 'next/navigation';

export default function ProductPage() {
  const params = useParams();
  const { id } = params;

  return (
    <div>
      <h1>Detalle de la póliza</h1>
      <p>ID de la póliza: {id}</p>
    </div>
  );
}
