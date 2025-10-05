import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  Stethoscope, 
  Heart, 
  Activity, 
  Users,
  Clock,
  Award,
  Shield
} from 'lucide-react';

import Head from 'next/head';
import Hero from '../components/Hero';
import Statistics from '../components/Statistics';
import FeaturedServices from '../components/FeaturedServices';
import MedicalServices from '../components/MedicalServices';
import PatientStories from '../components/PatientStories';
import HealthCalculator from '../components/HealthCalculator';
import Promotions from '../components/Promotions';
import AppDownload from '../components/AppDownload';
import MCUPackages from '../components/MCUPackages';
import SpecialistDirectory from '../components/SpecialistDirectory';
import Affiliations from '../components/Affiliations';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Siloam Hospitals - Rumah Sakit Swasta Terbesar di Indonesia</title>
      </Head>
      <Hero />
      <Statistics />
      <FeaturedServices />
      <MedicalServices />
      <PatientStories />
      <HealthCalculator />
      <Promotions />
      <MCUPackages />
      <SpecialistDirectory />
      <Affiliations />
      <AppDownload />
      <Footer />
    </>
  );
}


export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'id', ['common'])),
    },
  };
};
