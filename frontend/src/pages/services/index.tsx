import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Heart, 
  Stethoscope, 
  Baby, 
  Activity,
  Shield,
  Clock,
  Users,
  Award,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function Services() {
  const { t } = useTranslation();

  const services = [
    {
      id: 'emergency',
      title: 'Emergency Care',
      description: '24/7 emergency medical services with rapid response team',
      icon: <Heart className="w-12 h-12 text-red-500" />,
      features: [
        '24/7 Emergency Response',
        'Trauma Center',
        'Ambulance Service',
        'Critical Care Unit'
      ],
      href: '/services/emergency',
      color: 'bg-red-50 border-red-200 hover:bg-red-100'
    },
    {
      id: 'surgery',
      title: 'Surgery',
      description: 'Advanced surgical procedures with state-of-the-art equipment',
      icon: <Stethoscope className="w-12 h-12 text-blue-500" />,
      features: [
        'General Surgery',
        'Minimally Invasive Surgery',
        'Robotic Surgery',
        'Post-Surgical Care'
      ],
      href: '/services/surgery',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      id: 'maternity',
      title: 'Maternity',
      description: 'Comprehensive maternal and newborn care services',
      icon: <Baby className="w-12 h-12 text-pink-500" />,
      features: [
        'Prenatal Care',
        'Delivery Services',
        'Postnatal Care',
        'Neonatal ICU'
      ],
      href: '/services/maternity',
      color: 'bg-pink-50 border-pink-200 hover:bg-pink-100'
    },
    {
      id: 'cardiology',
      title: 'Cardiology',
      description: 'Advanced heart care and cardiovascular treatments',
      icon: <Activity className="w-12 h-12 text-green-500" />,
      features: [
        'Cardiac Surgery',
        'Interventional Cardiology',
        'Heart Monitoring',
        'Cardiac Rehabilitation'
      ],
      href: '/services/cardiology',
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      id: 'oncology',
      title: 'Oncology',
      description: 'Comprehensive cancer care and treatment services',
      icon: <Shield className="w-12 h-12 text-purple-500" />,
      features: [
        'Medical Oncology',
        'Radiation Therapy',
        'Surgical Oncology',
        'Palliative Care'
      ],
      href: '/services/oncology',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    }
  ];

  const stats = [
    { label: 'Services Available', value: '50+', icon: <Award /> },
    { label: 'Specialists', value: '200+', icon: <Users /> },
    { label: 'Years Experience', value: '25+', icon: <Clock /> },
    { label: 'Success Rate', value: '98%', icon: <CheckCircle /> }
  ];

  return (
    <>
      <Head>
        <title>Medical Services - Siloam Hospitals</title>
        <meta name="description" content="Comprehensive medical services including Emergency Care, Surgery, Maternity, Cardiology, and Oncology" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Medical Services
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Comprehensive healthcare services delivered with excellence, compassion, and cutting-edge technology
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                <Heart className="mr-2 h-5 w-5" />
                Emergency: Call 119
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Users className="mr-2 h-5 w-5" />
                Find Specialist
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Our Medical Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive medical services across multiple specialties, 
              ensuring you receive the best possible care for your health needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className={`${service.color} transition-all duration-300 hover:shadow-lg`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex justify-center">
                      {service.icon}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-gray-700">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full">
                    <Link href={service.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Excellence in Numbers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="flex justify-center mb-4 text-primary">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold mb-2 text-primary">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Why Choose Siloam Hospitals?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Advanced Technology</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    We use state-of-the-art medical equipment and cutting-edge technology 
                    to provide the most accurate diagnoses and effective treatments.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Expert Medical Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Our team consists of highly qualified specialists with extensive 
                    experience in their respective fields, ensuring the best care for our patients.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">24/7 Emergency Care</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Our emergency department operates 24/7 with rapid response teams 
                    ready to handle any medical emergency at any time.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Patient-Centered Care</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    We prioritize patient comfort and well-being, providing personalized 
                    care plans tailored to each individual's unique needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-gray-200">
            Contact us today to schedule an appointment or learn more about our services
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'id', ['common'])),
    },
  };
};
