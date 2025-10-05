import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Baby, 
  Heart, 
  Users, 
  Shield,
  Clock,
  Award,
  CheckCircle,
  Activity,
  Calendar,
  Stethoscope
} from 'lucide-react';

export default function MaternityService() {
  const { t } = useTranslation();

  const services = [
    {
      title: 'Prenatal Care',
      description: 'Comprehensive care during pregnancy',
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      features: [
        'Regular check-ups and monitoring',
        'Ultrasound examinations',
        'Genetic testing and counseling',
        'Nutritional guidance'
      ]
    },
    {
      title: 'Delivery Services',
      description: 'Safe and comfortable birthing experience',
      icon: <Baby className="w-8 h-8 text-blue-500" />,
      features: [
        'Natural delivery',
        'Cesarean section',
        'Water birth options',
        'Pain management options'
      ]
    },
    {
      title: 'Postnatal Care',
      description: 'Care for mother and baby after delivery',
      icon: <Shield className="w-8 h-8 text-green-500" />,
      features: [
        'Postpartum recovery care',
        'Breastfeeding support',
        'Newborn care education',
        'Mental health support'
      ]
    },
    {
      title: 'Neonatal ICU',
      description: 'Specialized care for newborns',
      icon: <Activity className="w-8 h-8 text-purple-500" />,
      features: [
        '24/7 neonatal monitoring',
        'Premature baby care',
        'Respiratory support',
        'Developmental care'
      ]
    }
  ];

  const facilities = [
    {
      title: 'Labor & Delivery Suites',
      description: 'Comfortable and well-equipped birthing rooms with modern amenities'
    },
    {
      title: 'Neonatal Intensive Care Unit',
      description: 'Advanced NICU with specialized equipment for premature and sick newborns'
    },
    {
      title: 'Maternity Ward',
      description: 'Private and semi-private rooms for postpartum recovery'
    },
    {
      title: 'Family-Centered Care',
      description: 'Rooms designed to accommodate family members during the birthing process'
    }
  ];

  const team = [
    {
      role: 'Obstetricians',
      count: '25+',
      description: 'Board-certified obstetricians with specialized training'
    },
    {
      role: 'Midwives',
      count: '30+',
      description: 'Certified midwives providing personalized care'
    },
    {
      role: 'Neonatologists',
      count: '15+',
      description: 'Specialists in newborn and premature baby care'
    },
    {
      role: 'Nurses',
      count: '80+',
      description: 'Specialized maternity and neonatal nurses'
    }
  ];

  const programs = [
    {
      title: 'Prenatal Classes',
      description: 'Educational programs for expecting parents covering childbirth, breastfeeding, and newborn care'
    },
    {
      title: 'High-Risk Pregnancy Care',
      description: 'Specialized care for pregnancies with complications or high-risk factors'
    },
    {
      title: 'Fertility Services',
      description: 'Comprehensive fertility evaluation and treatment options'
    },
    {
      title: 'Postpartum Support',
      description: 'Mental health support and counseling for new mothers'
    }
  ];

  return (
    <>
      <Head>
        <title>Maternity Services - Siloam Hospitals</title>
        <meta name="description" content="Comprehensive maternity services including prenatal care, delivery services, postnatal care, and neonatal ICU" />
      </Head>

      {/* Hero Section */}
      <section className="bg-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Maternity Services
            </h1>
            <p className="text-xl mb-8 text-pink-100">
              Comprehensive maternal and newborn care services with compassion and expertise
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-pink-600 hover:bg-gray-100">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Prenatal Visit
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
                <Users className="mr-2 h-5 w-5" />
                Meet Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Maternity Services
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex justify-center">
                      {service.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Maternity Facilities
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {facilities.map((facility, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-pink-600">{facility.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{facility.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Maternity Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-3xl font-bold text-pink-600 mb-2">{member.count}</div>
                  <CardTitle className="text-lg">{member.role}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{member.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Special Programs
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {programs.map((program, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-pink-600">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pregnancy Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Your Pregnancy Journey
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="text-4xl font-bold text-pink-600 mb-2">1st</div>
                  <CardTitle className="text-lg">Trimester</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Initial consultation</li>
                    <li>• First ultrasound</li>
                    <li>• Genetic testing</li>
                    <li>• Prenatal vitamins</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="text-4xl font-bold text-pink-600 mb-2">2nd</div>
                  <CardTitle className="text-lg">Trimester</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Anatomy scan</li>
                    <li>• Glucose testing</li>
                    <li>• Prenatal classes</li>
                    <li>• Regular check-ups</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="text-4xl font-bold text-pink-600 mb-2">3rd</div>
                  <CardTitle className="text-lg">Trimester</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Delivery planning</li>
                    <li>• Final preparations</li>
                    <li>• Labor preparation</li>
                    <li>• Postpartum planning</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-pink-100">
            Our maternity team is here to support you through every step of your pregnancy
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              Schedule Prenatal Visit
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
              Join Prenatal Classes
            </Button>
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
