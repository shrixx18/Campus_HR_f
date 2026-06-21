import type { FormFieldCreate, FormFieldType } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { FORM_FIELD_TYPES } from '@/types'
import { Plus, Trash2 } from 'lucide-react'

interface FormFieldBuilderProps {
  fields: FormFieldCreate[]
  onChange: (fields: FormFieldCreate[]) => void
}

export function FormFieldBuilder({ fields, onChange }: FormFieldBuilderProps) {
  const addField = () => {
    onChange([
      ...fields,
      { field_type: 'text', label: '', required: false, sort_order: fields.length },
    ])
  }

  const updateField = (index: number, updates: Partial<FormFieldCreate>) => {
    const next = fields.map((field, i) => (i === index ? { ...field, ...updates } : field))
    onChange(next)
  }

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index).map((f, i) => ({ ...f, sort_order: i })))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Form fields</Label>
        <Button type="button" variant="outline" size="sm" onClick={addField}>
          <Plus className="h-4 w-4" />
          Add field
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-[var(--color-muted-foreground)]">No custom fields. Add fields for student registration.</p>
      )}

      {fields.map((field, index) => (
        <div key={index} className="grid gap-3 rounded-lg border border-[var(--color-border)] p-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              value={field.label}
              onChange={(e) => updateField(index, { label: e.target.value })}
              placeholder="Field label"
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={field.field_type}
              onChange={(e) => updateField(index, { field_type: e.target.value as FormFieldType })}
            >
              {FORM_FIELD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          {field.field_type === 'dropdown' && (
            <div className="space-y-2 md:col-span-2">
              <Label>Choices (comma-separated)</Label>
              <Input
                placeholder="Option A, Option B"
                onChange={(e) =>
                  updateField(index, {
                    options: { choices: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) },
                  })
                }
              />
            </div>
          )}
          <div className="flex items-center gap-4 md:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={field.required ?? false}
                onChange={(e) => updateField(index, { required: e.target.checked })}
              />
              Required
            </label>
            <Button type="button" variant="ghost" size="sm" onClick={() => removeField(index)}>
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
