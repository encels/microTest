'use client';

import { PolicyCard } from './policy-card';

type Policy = {
  product_name: string;
  description: string;
  starting_price: number | null;
  currency: 'USD' | null;
  price_breakdown?: Record<string, number> | null;
  image_src: string;
  cta_label: string;
};

const toLogo = (path: string) => path.split('/').pop() || path;

const DEFAULT_STAR = '4.8';

const toLabel = (p: Policy) => {
  if (p.starting_price == null) return '';
  if (p.price_breakdown?.AMP) return `$${p.price_breakdown.AMP.toFixed(2)}`;
  return '';
};

const RAW_POLICIES: Policy[] = [
  {
    product_name: 'policies.products.individual_hcm.name',
    description: 'policies.products.individual_hcm.description',
    starting_price: 44.0,
    currency: 'USD',
    price_breakdown: null,
    image_src: 'assets/media/products/Producto-HCM-Optimizado.png',
    cta_label: 'policies.cta_labels.quote_now',
  },
  {
    product_name: 'policies.products.vehicle_civil_liability.name',
    description: 'policies.products.vehicle_civil_liability.description',

    starting_price: null,
    currency: null,
    price_breakdown: null,
    image_src: 'assets/media/products/Producto-RCV-Optimizado.png',
    cta_label: 'policies.cta_labels.edit_policy',
  },
  {
    product_name: 'policies.products.funeral.name',
    description: 'policies.products.funeral.description',
    starting_price: 0.83,
    currency: 'USD',
    price_breakdown: null,
    image_src: 'assets/media/products/Producto-Funerario-Optimizado.png',
    cta_label: 'policies.cta_labels.edit_policy',
  },
  {
    product_name: 'policies.products.personal_combined.name',
    description: 'policies.products.personal_combined.description',
    starting_price: 3.48,
    currency: 'USD',
    price_breakdown: { AMD: 3.48, AMP: 9.26 },
    image_src:
      'assets/media/products/Producto-Accidentes Personales-Optimizado.png',
    cta_label: 'policies.cta_labels.edit_policy',
  },
  {
    product_name: 'policies.products.life.name',
    description: 'policies.products.life.description',
    starting_price: 0.98,
    currency: 'USD',
    price_breakdown: null,
    image_src: 'assets/media/products/Producto-Póliza Mi Vida-Optimizado.png',
    cta_label: 'policies.cta_labels.edit_policy',
  },
  {
    product_name: 'policies.products.female_cancer_prevention.name',
    description: 'policies.products.female_cancer_prevention.description',

    starting_price: 6.42,
    currency: 'USD',

    price_breakdown: null,
    image_src:
      'assets/media/products/Producto-Prevención Cáncer Femenino-Optimizado.png',
    cta_label: 'policies.cta_labels.edit_policy',
  },
  {
    product_name: 'policies.products.male_cancer_prevention.name',
    description: 'policies.products.male_cancer_prevention.description',

    starting_price: 5.75,
    currency: 'USD',

    price_breakdown: null,
    image_src:
      'assets/media/products/Producto-Prevención Cáncer-Optimizado.png',
    cta_label: 'policies.cta_labels.edit_policy',
  },
  {
    product_name: 'policies.products.my_pet.name',
    description: 'policies.products.my_pet.description',
    starting_price: 4.42,
    currency: 'USD',
    price_breakdown: null,
    image_src: 'assets/media/products/Producto-Mi mascota-Optimizado.png',
    cta_label: 'policies.cta_labels.edit_policy',
  },
];

export function PoliciesList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {RAW_POLICIES.map((p, index) => (
        <PolicyCard
          key={index}
          description={p.description}
          logo={toLogo(p.image_src)}
          title={p.product_name}
          total={(p.starting_price ?? 0).toFixed(2)}
          star={DEFAULT_STAR}
          label={toLabel(p)}
        />
      ))}
    </div>
  );
}
