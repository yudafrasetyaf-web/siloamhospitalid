import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

const hospitals = [
  { name: 'Siloam Hospitals Jakarta', location: 'Jakarta', specialties: 'General' },
  { name: 'Siloam Hospitals Manado', location: 'Manado', specialties: 'Cardiology' },
];

export default function Hospitals() {
  const { t } = useTranslation('common');
  return (
    <>
      <Head>
        <title>{t('hospitals.title')}</title>
      </Head>
      <section className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">{t('hospitals.title')}</h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hospitals.map((h) => (
            <li key={h.name} className="p-4 rounded border bg-white shadow-sm">
              <h2 className="text-xl font-semibold">{h.name}</h2>
              <p>{t('hospitals.location')}: {h.location}</p>
              <p>{t('hospitals.specialties')}: {h.specialties}</p>
            </li>
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
