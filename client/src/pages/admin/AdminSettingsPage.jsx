import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '../../services/adminService';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  useEffect(() => { adminApi.settings().then(setSettings); }, []);
  if (!settings) return <div className="card h-40 animate-pulse" />;

  const submit = async (event) => {
    event.preventDefault();
    const updated = await adminApi.updateSettings({
      ...settings,
      shippingCharge: Number(settings.shippingCharge),
      freeShippingThreshold: Number(settings.freeShippingThreshold),
      minimumOrderAmount: Number(settings.minimumOrderAmount),
      perKilometerCharge: Number(settings.perKilometerCharge),
      maxServiceDistanceKm: Number(settings.maxServiceDistanceKm),
      codCharge: Number(settings.codCharge),
      defaultDispatchDays: Number(settings.defaultDispatchDays),
      defaultEtaMinDays: Number(settings.defaultEtaMinDays),
      defaultEtaMaxDays: Number(settings.defaultEtaMaxDays),
      taxPercentage: Number(settings.taxPercentage),
      deliveryRewardThreshold: Number(settings.deliveryRewardThreshold),
      deliveryRewardCouponValue: Number(settings.deliveryRewardCouponValue)
    });
    setSettings(updated);
    toast.success('Settings saved');
  };

  return (
    <form onSubmit={submit} className="card max-w-4xl p-5">
      <h1 className="mb-4 text-2xl font-black">Site Settings</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          'storeName',
          'supportEmail',
          'supportPhone',
          'shippingCharge',
          'freeShippingThreshold',
          'minimumOrderAmount',
          'perKilometerCharge',
          'maxServiceDistanceKm',
          'codCharge',
          'defaultDispatchDays',
          'defaultEtaMinDays',
          'defaultEtaMaxDays',
          'taxPercentage',
          'deliveryRewardThreshold',
          'deliveryRewardCouponValue',
          'deliveryRewardBonusText'
        ].map((key) => (
          <label key={key} className="text-sm font-semibold">
            {key}
            <input className="input mt-1" value={settings[key]} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} />
          </label>
        ))}
        <label className="text-sm font-semibold">
          deliveryRewardType
          <select className="input mt-1" value={settings.deliveryRewardType} onChange={(e) => setSettings({ ...settings, deliveryRewardType: e.target.value })}>
            <option value="coupon">coupon</option>
            <option value="bonus_text">bonus_text</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={settings.codEnabled} onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })} />
          COD enabled
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={settings.deliveryRewardActive} onChange={(e) => setSettings({ ...settings, deliveryRewardActive: e.target.checked })} />
          Delivery reward active
        </label>
      </div>
      <button className="btn-primary mt-5">Save Settings</button>
    </form>
  );
}
