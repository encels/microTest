/**
 * Policy card component for displaying policy information
 */

'use client';

import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { toAbsoluteUrl } from '@/lib/helpers';
import useTranslation from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PolicyCardProps } from '../../types';

/**
 * Policy card component that displays policy information in a card format
 * @param props - Component props
 */
export function PolicyCard({
  description,
  logo,
  title,
  total,
  star,
  label,
}: PolicyCardProps) {
  const { t } = useTranslation('pages');
  const router = useRouter();

  /**
   * Navigate to policy details page
   * @param productId - The product ID to navigate to
   */
  const handleShowProductDetails = (productId: string) => {
    router.push(`${ROUTES.POLICIES.children.CREATE_POLICY.path}/${productId}`);
  };

  return (
    <Card>
      <CardContent className="flex flex-col justify-between p-2.5 gap-4">
        <div className="mb-2.5">
          {/* Policy image */}
          <Card className="flex items-center justify-center relative bg-accent/50 w-full h-[180px] mb-4 shadow-none overflow-hidden">
            <img
              onClick={() => handleShowProductDetails('productid')}
              src={toAbsoluteUrl(`/media/images/placeholder.svg`)}
              className="h-full w-full object-cover shrink-0 cursor-pointer"
              alt="Policy image placeholder"
            />
          </Card>

          {/* Policy title */}
          <h2
            onClick={() => handleShowProductDetails('productid')}
            className="hover:text-primary font-medium text-mono px-2.5 leading-5.5 block cursor-pointer"
          >
            {t(title)}
          </h2>
          
          {/* Policy description */}
          <p className="text-xs px-2.5 text-gray-300 mt-2">
            {t(description || '')}
          </p>
        </div>

        {/* Policy footer with rating, price, and action button */}
        <div className="flex items-center flex-wrap justify-between gap-5 px-2.5 pb-1">
          {/* Rating badge */}
          <Badge
            size="sm"
            variant="warning"
            shape="circle"
            className="rounded-full gap-1"
          >
            <Star
              className="text-white -mt-0.5"
              style={{ fill: 'currentColor' }}
            />
            {star}
          </Badge>

          {/* Price and action section */}
          <div className="flex flex-1 items-center justify-between gap-1.5">
            {/* Original price (if discounted) */}
            {label && (
              <span className="text-xs font-normal text-secondary-foreground line-through pt-px">
                {t(label)}
              </span>
            )}
            
            {/* Current price */}
            <span className="text-sm font-medium text-mono">${total}</span>

            {/* Edit policy button */}
            <Button
              size="sm"
              variant="outline"
              className="ms-1"
              onClick={() => handleShowProductDetails('productid')}
            >
              {t('policies.cta_labels.edit_policy')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
