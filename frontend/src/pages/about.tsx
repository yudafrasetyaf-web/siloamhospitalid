import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Heart, 
  Award, 
  Users, 
  Shield, 
  Globe, 
  Activity,
  CheckCircle,
  Star
} from 'lucide-react';

export default function About() {
  const { t } = useTranslation('common');
  
  const values = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: 'Compassionate Care',
      description: 'We treat every patient with empathy, respect, and dignity'
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-500" />,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality healthcare services'
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: 'Teamwork',
      description: 'Collaborative approach to patient care and treatment'
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: 'Safety',
      description: 'Patient safety is our top priority in all procedures'
    }
  ];

  const achievements = [
    { label: 'Years of Service', value: '25+', icon: <Activity /> },
    { label: 'Hospitals', value: '40+', icon: <Globe /> },
    { label: 'Doctors', value: '2,500+', icon: <Users /> },
    { label: 'Patients Served', value: '1M+', icon: <Heart /> }
  ];

  const certifications = [
    'Joint Commission International (JCI) Accreditation',
    'ISO 9001:2015 Quality Management System',
    'ISO 14001:2015 Environmental Management',
    'OHSAS 18001:2007 Occupational Health & Safety'
  ];

  return (
    <>
      <Head>
        <title>About Us - Siloam Hospitals</title>
        <meta name="description" content="Learn about Siloam Hospitals - Leading healthcare provider with international standards" />
      </Head>

      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Siloam Hospitals
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Leading healthcare provider committed to delivering world-class medical services 
              with compassion, excellence, and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  To provide comprehensive, high-quality healthcare services that meet international 
                  standards, while maintaining compassion and respect for all patients. We are committed 
                  to advancing medical knowledge through research and education, and to serving our 
                  communities with excellence and integrity.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  To be the leading healthcare provider in Indonesia and Southeast Asia, recognized 
                  for our clinical excellence, innovative treatments, and patient-centered care. We 
                  strive to set the standard for healthcare delivery and to improve the health and 
                  well-being of the communities we serve.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Achievements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {achievements.map((achievement, index) => (
              <div key={index}>
                <div className="flex justify-center mb-4 text-primary">
                  {achievement.icon}
                </div>
                <div className="text-4xl font-bold mb-2 text-primary">{achievement.value}</div>
                <div className="text-gray-600">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Certifications & Accreditations
            </h2>
            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience Our Care</h2>
          <p className="text-xl mb-8 text-gray-200">
            Join thousands of patients who trust Siloam Hospitals for their healthcare needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/doctors">
                Find a Doctor
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link href="/register">
                Book Appointment
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'id', ['common']))
  }
});
