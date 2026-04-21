import { Mail, MapPin, Phone, UserCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const emptyAddress = (user) => ({
  label: 'Home',
  fullName: user?.name || '',
  phone: user?.phone || '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  isDefault: true
});

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    addresses: user?.addresses?.length ? user.addresses : [emptyAddress(user)]
  });

  const address = form.addresses[0] || emptyAddress(user);

  const updateAddress = (key, value) => {
    setForm((state) => {
      const next = state.addresses.length ? [...state.addresses] : [emptyAddress(user)];
      next[0] = { ...next[0], [key]: value, isDefault: true };
      return { ...state, addresses: next };
    });
  };

  const validate = () => {
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters.';
    if (!/^[0-9+\-\s]{8,15}$/.test(form.phone.trim())) return 'Enter a valid phone number.';
    if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.state || !address.postalCode) {
      return 'Complete the required delivery address fields.';
    }
    if (!/^[0-9]{5,6}$/.test(String(address.postalCode).trim())) return 'Enter a valid postal code.';
    return '';
  };

  const submit = async (event) => {
    event.preventDefault();
    const error = validate();
    if (error) return toast.error(error);
    setSaving(true);
    try {
      await updateProfile({
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        addresses: [{ ...address, fullName: address.fullName.trim(), phone: address.phone.trim() }]
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="container-page mt-8">
      <div className="mb-6 rounded-lg bg-slate-950 p-6 text-white shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-white/10">
              {form.avatar ? <img src={form.avatar} alt={form.name} className="h-full w-full object-cover" /> : <UserCircle className="h-10 w-10" />}
            </div>
            <div>
              <h1 className="text-3xl font-black">{form.name || 'My Profile'}</h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-300"><Mail className="h-4 w-4" /> {user?.email}</p>
            </div>
          </div>
          <div className="grid gap-1 text-sm text-slate-300">
            <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> {form.phone || 'Phone not added'}</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {address.city || 'City not added'}</span>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="card p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-950">Personal Details</h2>
          <div className="grid gap-4">
            <label className="text-sm font-semibold text-slate-700">
              Name
              <input className="input mt-1" value={form.name} onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))} required />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Email
              <input className="input mt-1 bg-slate-50" value={user?.email || ''} disabled />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Phone
              <input className="input mt-1" value={form.phone} onChange={(event) => setForm((state) => ({ ...state, phone: event.target.value }))} required />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Avatar URL
              <input className="input mt-1" value={form.avatar} onChange={(event) => setForm((state) => ({ ...state, avatar: event.target.value }))} />
            </label>
          </div>
        </section>
        <section className="card p-5">
          <h2 className="mb-4 text-lg font-bold text-slate-950">Default Delivery Address</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['fullName', 'Full name', true],
              ['phone', 'Phone', true],
              ['line1', 'Address line 1', true],
              ['line2', 'Address line 2', false],
              ['city', 'City', true],
              ['state', 'State', true],
              ['postalCode', 'Postal code', true],
              ['country', 'Country', true]
            ].map(([key, label, required]) => (
              <label key={key} className="text-sm font-semibold text-slate-700">
                {label}
                <input className="input mt-1" required={required} value={address[key] || ''} onChange={(event) => updateAddress(key, event.target.value)} />
              </label>
            ))}
          </div>
        </section>
        <div className="lg:col-span-2">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Profile'}</button>
        </div>
      </form>
    </main>
  );
}
