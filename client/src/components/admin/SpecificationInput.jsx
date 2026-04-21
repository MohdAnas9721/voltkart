import { useState, useEffect } from 'react';

export default function SpecificationInput({ value, onChange }) {
  const [specs, setSpecs] = useState([]);

  useEffect(() => {
    if (Array.isArray(value)) {
      setSpecs(value);
    } else if (typeof value === 'object' && value !== null) {
      // Convert object to array format
      const specArray = Object.entries(value).map(([name, val]) => ({
        name,
        value: val || ''
      }));
      setSpecs(specArray);
    } else {
      setSpecs([]);
    }
  }, [value]);

  const handleAddSpec = () => {
    const newSpecs = [...specs, { name: '', value: '' }];
    setSpecs(newSpecs);
    onChange(newSpecs);
  };

  const handleRemoveSpec = (index) => {
    const newSpecs = specs.filter((_, i) => i !== index);
    setSpecs(newSpecs);
    onChange(newSpecs);
  };

  const handleSpecChange = (index, field, fieldValue) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = fieldValue;
    setSpecs(newSpecs);
    onChange(newSpecs);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h2 className="mb-3 text-sm font-black uppercase text-slate-700">Specifications</h2>
      <div className="grid gap-3">
        {specs.map((spec, index) => (
          <div key={index} className="grid grid-cols-[1fr_1fr_40px] gap-2 items-end">
            <input
              className="input"
              placeholder="Specification name"
              value={spec.name}
              onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
            />
            <input
              className="input"
              placeholder="Specification value"
              value={spec.value}
              onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
            />
            <button
              type="button"
              className="btn-secondary h-full px-2 py-2 text-rose-600 font-bold text-lg"
              onClick={() => handleRemoveSpec(index)}
              title="Remove specification"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-secondary mt-2"
          onClick={handleAddSpec}
        >
          + Add Specification
        </button>
      </div>
    </section>
  );
}
