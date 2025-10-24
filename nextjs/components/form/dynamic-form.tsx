'use client';

import * as React from 'react';
import { useMemo } from 'react';
// extras
import { AvatarInput } from '@/partials/common/avatar-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarDays, CalendarIcon } from 'lucide-react';
// react-hook-form
import {
  DefaultValues,
  FieldValues,
  Resolver,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
// zod
import { z, ZodTypeAny } from 'zod';
import { cn } from '@/lib/utils';
// shadcn/ui
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, InputAddon, InputGroup } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export type FormFieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'phone'
  | 'textarea'
  | 'select'
  | 'switch'
  | 'date'
  | 'time'
  | 'avatar'
  | 'custom';

export type FormOption = { label: string; value: string };

export type DynamicFormField = {
  type: FormFieldType;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  defaultValue?: any;
  options?: FormOption[];
  render?: (
    value: any,
    onChange: (v: any) => void,
    field: {
      value: any;
      onChange: (v: any) => void;
      onBlur: () => void;
      name: string;
      ref: React.Ref<any>;
    },
  ) => React.ReactNode;
};

type FormValues = Record<string, any>;

export type DynamicFormProps = {
  title?: string;
  fields: DynamicFormField[];
  submitLabel?: string;
  onSubmit?: SubmitHandler<FormValues>;
  defaultValues?: Partial<FormValues>;
  className?: string;
  schema?: ZodTypeAny;
  disabled?: boolean;
};

function DateButton({
  value,
  placeholder = 'Pick a date',
  disabled,
}: {
  value?: Date;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <Button
      mode="input"
      variant="outline"
      className={cn(
        'w-full data-[state=open]:border-primary',
        !value && 'text-muted-foreground',
      )}
      disabled={disabled}
      type="button"
    >
      <CalendarDays className="-ms-0.5" />
      {value ? format(value, 'LLL dd, y') : <span>{placeholder}</span>}
    </Button>
  );
}

function TimeInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <InputGroup className="w-full">
      <InputAddon mode="icon">
        <CalendarIcon />
      </InputAddon>
      <Input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </InputGroup>
  );
}

const getInitialValue = (
  f: DynamicFormField,
  defaults?: Record<string, any>,
) => {
  if (defaults && f.name in defaults) return defaults[f.name];
  if (typeof f.defaultValue !== 'undefined') return f.defaultValue;
  switch (f.type) {
    case 'switch':
      return false;
    case 'select':
      return '';
    case 'date':
      return undefined as Date | undefined;
    case 'time':
      return '';
    default:
      return '';
  }
};

export function DynamicForm({
  title = 'Form',
  fields,
  submitLabel = 'Save',
  onSubmit,
  defaultValues,
  className,
  schema,
  disabled = false,
}: DynamicFormProps) {
  const computedDefaults = useMemo(() => {
    const obj: Record<string, any> = {};
    for (const f of fields)
      obj[f.name] = getInitialValue(f, defaultValues as Record<string, any>);
    return obj as DefaultValues<FormValues>;
  }, [fields, defaultValues]);

  const form = useForm<FormValues>({
    defaultValues: computedDefaults,
    resolver: schema
      ? (zodResolver(schema) as unknown as Resolver<FormValues>)
      : undefined,
    mode: 'onSubmit',
  });

  return (
    <Card className={cn('pb-2.5', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid gap-5"
            onSubmit={form.handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
          >
            {fields.map((f) => {
              const common = {
                name: f.name as any,
                control: form.control,
              };
              const isDisabled = disabled || f.disabled;

              if (['text', 'number', 'email', 'phone'].includes(f.type)) {
                const inputType =
                  f.type === 'phone'
                    ? 'tel'
                    : (f.type as 'text' | 'number' | 'email');
                return (
                  <FormField
                    key={f.name}
                    {...common}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{f.label}</FormLabel>
                        <FormControl>
                          <Input
                            type={inputType}
                            placeholder={f.placeholder}
                            disabled={isDisabled}
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                inputType === 'number'
                                  ? Number(e.target.value)
                                  : e.target.value,
                              )
                            }
                          />
                        </FormControl>
                        {f.description && (
                          <FormDescription>{f.description}</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              if (f.type === 'textarea') {
                return (
                  <FormField
                    key={f.name}
                    {...common}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{f.label}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={f.placeholder}
                            disabled={isDisabled}
                            {...field}
                          />
                        </FormControl>
                        {f.description && (
                          <FormDescription>{f.description}</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              if (f.type === 'select') {
                return (
                  <FormField
                    key={f.name}
                    {...common}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{f.label}</FormLabel>
                        <FormControl>
                          <Select
                            disabled={isDisabled}
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={f.placeholder || 'Select...'}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {(f.options || []).map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {f.description && (
                          <FormDescription>{f.description}</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              if (f.type === 'switch') {
                return (
                  <FormField
                    key={f.name}
                    {...common}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>{f.label}</FormLabel>
                          {f.description && (
                            <FormDescription>{f.description}</FormDescription>
                          )}
                        </div>
                        <FormControl>
                          <Switch
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                            disabled={isDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              if (f.type === 'date') {
                return (
                  <FormField
                    key={f.name}
                    {...common}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{f.label}</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <div>
                                <DateButton
                                  value={field.value}
                                  placeholder={f.placeholder}
                                  disabled={isDisabled}
                                />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(d) => field.onChange(d)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        {f.description && (
                          <FormDescription>{f.description}</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              if (f.type === 'time') {
                return (
                  <FormField
                    key={f.name}
                    {...common}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{f.label}</FormLabel>
                        <FormControl>
                          <TimeInput
                            value={field.value || ''}
                            onChange={field.onChange}
                            disabled={isDisabled}
                          />
                        </FormControl>
                        {f.description && (
                          <FormDescription>{f.description}</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              if (f.type === 'avatar') {
                return (
                  <FormItem key={f.name}>
                    <FormLabel>{f.label}</FormLabel>
                    <div className="flex items-center justify-between flex-wrap gap-2.5 rounded-lg border p-3">
                      <span className="text-sm text-secondary-foreground">
                        150x150px JPEG, PNG Image
                      </span>
                      <AvatarInput />
                    </div>
                    {f.description && (
                      <FormDescription>{f.description}</FormDescription>
                    )}
                  </FormItem>
                );
              }

              if (f.type === 'custom') {
                return (
                  <FormField
                    key={f.name}
                    {...common}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{f.label}</FormLabel>
                        <FormControl>
                          <div>
                            {f.render
                              ? f.render(field.value, field.onChange, field)
                              : null}
                          </div>
                        </FormControl>
                        {f.description && (
                          <FormDescription>{f.description}</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              return null;
            })}

            <div className="flex justify-end pt-2.5">
              <Button type="submit" disabled={disabled}>
                {submitLabel}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
