import React, { useState } from 'react';
import { HelpCircle, AlertCircle, Check } from 'lucide-react';

interface SprInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  onEnterSubmit?: () => void;
}

export default function SprInput({
  value,
  onChange,
  disabled = false,
  onEnterSubmit
}: SprInputProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let text = e.target.value;

    // Reject invalid characters (commas, spaces, percents, letters, etc.)
    // Allowed characters: digits 0-9, decimal point ., slash /, negative sign -
    if (/[^0-9./\-]/.test(text)) {
      setWarning('Only digits (0-9), decimal point (.), and fraction slash (/) are allowed.');
      return;
    }

    // Limit length: 5 chars max, or 6 if starts with '-'
    const maxLen = text.startsWith('-') ? 6 : 5;
    if (text.length > maxLen) {
      setWarning(`Maximum ${maxLen} characters allowed in student-produced responses.`);
      return;
    }

    // Check for mixed numbers (multiple slashes or numbers with space)
    const slashCount = (text.match(/\//g) || []).length;
    if (slashCount > 1) {
      setWarning('Mixed numbers are not supported. Enter as an improper fraction or decimal.');
      return;
    }

    setWarning(null);
    onChange(text);
  };

  return (
    <div className="space-y-4 max-w-md">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
          Student-Produced Response (Grid-in)
        </label>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Formatting Guide
        </button>
      </div>

      {showHelp && (
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-2 animate-in fade-in duration-150">
          <p className="font-bold">Official SPR Guidelines:</p>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-blue-800">
            <li>Enter numbers using digits (0–9), decimal points (.), and fraction bars (/).</li>
            <li>For fractions, enter as improper fractions (e.g. <strong>7/2</strong> not 3 1/2).</li>
            <li>Repeating decimals like 2/3 can be entered as <strong>.666</strong> or <strong>.667</strong> or <strong>2/3</strong>.</li>
            <li>Do not include commas, dollar signs, or percent signs.</li>
          </ul>
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="e.g. 0.75 or 3/4"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onEnterSubmit) {
              onEnterSubmit();
            }
          }}
          className="w-full text-center text-2xl font-mono font-bold tracking-widest py-4 px-6 rounded-2xl border-2 border-neutral-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all disabled:bg-neutral-100 disabled:text-neutral-400 uppercase"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">
          {value.length}/{value.startsWith('-') ? 6 : 5}
        </div>
      </div>

      {warning && (
        <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{warning}</span>
        </div>
      )}
    </div>
  );
}
