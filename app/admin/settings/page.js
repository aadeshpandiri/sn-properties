import { supabaseServer } from '@/lib/supabase';
import SettingsForm from '@/components/admin/SettingsForm';
import { saveSettings } from '@/app/actions/settings';

export const metadata = { title: 'Site Settings — SN Properties Admin' };

const DEFAULTS = {
  phone:          '',
  email:          '',
  address:        '',
  hours_weekday:  '',
  hours_saturday: '',
  hours_sunday:   '',
  whatsapp:       '',
};

async function getSettings() {
  if (!supabaseServer) return DEFAULTS;
  const { data } = await supabaseServer.from('site_settings').select('key, value');
  if (!data?.length) return DEFAULTS;
  return data.reduce((acc, row) => ({ ...acc, [row.key]: row.value ?? '' }), { ...DEFAULTS });
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Site Settings</h1>
        <p className="text-muted text-sm mt-1">
          Manage contact info and business hours shown on the public contact page
        </p>
      </div>

      <div className="card p-8 max-w-3xl">
        <SettingsForm settings={settings} action={saveSettings} />
      </div>
    </div>
  );
}
