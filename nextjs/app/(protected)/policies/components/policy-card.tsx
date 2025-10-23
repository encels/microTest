'use client';

import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { ROUTES } from '@/config/routes';
import { toAbsoluteUrl } from '@/lib/helpers';
import useTranslation from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface IPolicyCardProps {
  description?: string;
  logo: string;
  title: string;
  total: string;
  star: string;
  label?: string;
}

export function PolicyCard({
  description,
  logo,
  title,
  total,
  star,
  label,
}: IPolicyCardProps) {
  const { t } = useTranslation('pages');
  const router = useRouter();

  const showProductDetailsSheet = (productId: string) => {
    router.push(`${ROUTES.POLICIES.children.BUY_POLICY.path}/${productId}`);
  };

  return (
    <Card>
      <CardContent className="flex flex-col justify-between p-2.5 gap-4">
        <div className="mb-2.5">
          <Card className="flex items-center justify-center relative bg-accent/50 w-full h-[180px] mb-4  shadow-none overflow-hidden">
            <img
              onClick={() => showProductDetailsSheet('productid')}
              src={toAbsoluteUrl(`/media/images/placeholder.svg`)}
              className="h-full w-full object-cover shrink-0 cursor-pointer"
              alt="Image placeholder"
            />
          </Card>

          <h2
            onClick={() => showProductDetailsSheet('productid')}
            className="hover:text-primary font-medium text-mono px-2.5 leading-5.5 block cursor-pointer"
          >
            {t(title)}
          </h2>
          <p className="text-xs px-2.5 text-gray-300 mt-2">
            {t(description || '')}
          </p>
        </div>

        <div className="flex items-center flex-wrap justify-between gap-5 px-2.5 pb-1">
          <Badge
            size="sm"
            variant="warning"
            shape="circle"
            className="rounded-full gap-1"
          >
            <Star
              className="text-white -mt-0.5"
              style={{ fill: 'currentColor' }}
            />{' '}
            {star}
          </Badge>

          <div className="flex flex-1 items-center justify-between gap-1.5">
            {label && (
              <span className="text-xs font-normal text-secondary-foreground line-through pt-px">
                {t(label)}
              </span>
            )}
            <span className="text-sm font-medium text-mono">${total}</span>

            <Button
              size="sm"
              variant="outline"
              className="ms-1"
              onClick={() => showProductDetailsSheet('productid')}
            >
              {t('policies.cta_labels.edit_policy')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
