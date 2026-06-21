import type { FormField } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

interface DynamicFormFieldsProps {
  fields: FormField[]
  values: Record<string, unknown>
  onChange: (values: Record<string, unknown>) => void
}

export function DynamicFormFields({ fields, values, onChange }: DynamicFormFieldsProps) {
  const updateValue = (fieldId: string, value: unknown) => {
    onChange({ ...values, [fieldId]: value })
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const fieldKey = field.id
        const value = values[fieldKey]

        if (field.field_type === 'checkbox') {
          return (
            <div key={fieldKey} className="flex items-center gap-2">
              <input
                id={fieldKey}
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => updateValue(fieldKey, e.target.checked)}
              />
              <Label htmlFor={fieldKey}>
                {field.label}
                {field.required && ' *'}
              </Label>
            </div>
          )
        }

        if (field.field_type === 'dropdown') {
          const choices = (field.options?.choices as string[]) ?? []
          return (
            <div key={fieldKey} className="space-y-2">
              <Label htmlFor={fieldKey}>
                {field.label}
                {field.required && ' *'}
              </Label>
              <Select
                id={fieldKey}
                value={String(value ?? '')}
                onChange={(e) => updateValue(fieldKey, e.target.value)}
              >
                <option value="">Select...</option>
                {choices.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </Select>
            </div>
          )
        }

        if (field.field_type === 'file') {
          return (
            <div key={fieldKey} className="space-y-2">
              <Label htmlFor={fieldKey}>
                {field.label}
                {field.required && ' *'}
              </Label>
              <Input
                id={fieldKey}
                type="file"
                onChange={(e) => updateValue(fieldKey, e.target.files?.[0]?.name ?? '')}
              />
            </div>
          )
        }

        const inputType =
          field.field_type === 'number'
            ? 'number'
            : field.field_type === 'email'
              ? 'email'
              : field.field_type === 'deadline'
                ? 'datetime-local'
                : 'text'

        return (
          <div key={fieldKey} className="space-y-2">
            <Label htmlFor={fieldKey}>
              {field.label}
              {field.required && ' *'}
            </Label>
            <Input
              id={fieldKey}
              type={inputType}
              value={String(value ?? '')}
              onChange={(e) =>
                updateValue(
                  fieldKey,
                  field.field_type === 'number' ? Number(e.target.value) : e.target.value,
                )
              }
            />
          </div>
        )
      })}
    </div>
  )
}
