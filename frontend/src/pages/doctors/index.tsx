import { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import Link from 'next/link';
import { Search, Star, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Head from 'next/head';

interface Doctor {
  id: number;
  specialization: string;
  consultationFee: number;
  rating: number;
  totalReviews: number;
  yearsOfExperience: number;
  user: {
    firstName: string;
    lastName: string;
  };
}

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data.data.doctors);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Find Doctors - Siloam Hospitals</title>
      </Head>
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Find Your Doctor</h1>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading...</p>
            ) : (
              doctors.map((doctor) => (
                <Card key={doctor.id}>
                  <CardHeader>
                    <CardTitle>
                      Dr. {doctor.user.firstName} {doctor.user.lastName}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>{doctor.rating} ({doctor.totalReviews} reviews)</span>
                      </div>
                      <p className="text-sm">{doctor.yearsOfExperience} years experience</p>
                      <p className="font-semibold">{formatCurrency(Number(doctor.consultationFee))}</p>
                      <Button asChild className="w-full mt-4">
                        <Link href={`/doctors/${doctor.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
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
