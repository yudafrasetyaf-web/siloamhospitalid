import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Head from 'next/head';

const DATA = ['Cardiology', 'Neurology', 'Pediatrics', 'Oncology', 'Dermatology', 'Orthopedics'];

export default function Specializations() {
  const { t } = useTranslation('common');
  const [q, setQ] = useState('');
  const list = DATA.filter(s => s.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <Head>
        <title>{t('specializations.title')}</title>
      </Head>
      <section className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">{t('specializations.title')}</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('specializations.searchPlaceholder')}
          className="w-full md:w-1/2 border rounded px-3 py-2 mb-6"
        />
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((s) => (
            <li key={s} className="p-4 rounded border bg-white shadow-sm">{s}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'id', ['common']))
  }
});
