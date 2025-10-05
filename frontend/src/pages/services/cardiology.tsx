import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Heart, 
  Activity, 
  Shield, 
  Users,
  Clock,
  Award,
  CheckCircle,
  Stethoscope,
  Zap,
  Monitor
} from 'lucide-react';

export default function CardiologyService() {
  const { t } = useTranslation();

  const services = [
    {
      title: 'Cardiac Surgery',
      description: 'Advanced heart surgery procedures',
      icon: <Heart className="w-8 h-8 text-red-500" />,
      features: [
        'Coronary artery bypass surgery',
        'Heart valve replacement',
        'Heart transplant',
        'Aortic surgery'
      ]
    },
    {
      title: 'Interventional Cardiology',
      description: 'Minimally invasive heart procedures',
      icon: <Activity className="w-8 h-8 text-blue-500" />,
      features: [
        'Angioplasty and stenting',
        'Cardiac catheterization',
        'Pacemaker implantation',
        'Defibrillator placement'
      ]
    },
    {
      title: 'Heart Monitoring',
      description: 'Advanced cardiac monitoring and diagnostics',
      icon: <Monitor className="w-8 h-8 text-green-500" />,
      features: [
        '24/7 cardiac monitoring',
        'ECG and stress testing',
        'Echocardiography',
        'Cardiac MRI and CT'
      ]
    },
    {
      title: 'Cardiac Rehabilitation',
      description: 'Comprehensive heart health recovery programs',
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      features: [
        'Exercise therapy',
        'Lifestyle counseling',
        'Medication management',
        'Psychological support'
      ]
    }
  ];

  const conditions = [
    {
      title: 'Coronary Artery Disease',
      description: 'Treatment for blocked or narrowed coronary arteries'
    },
    {
      title: 'Heart Failure',
      description: 'Comprehensive management of heart failure conditions'
    },
    {
      title: 'Arrhythmias',
      description: 'Treatment for irregular heart rhythms and palpitations'
    },
    {
      title: 'Valvular Heart Disease',
      description: 'Management of heart valve disorders and defects'
    },
    {
      title: 'Congenital Heart Disease',
      description: 'Care for heart conditions present from birth'
    },
    {
      title: 'Hypertension',
      description: 'Management of high blood pressure and related complications'
    }
  ];

  const facilities = [
    {
      title: 'Cardiac Catheterization Lab',
      description: 'State-of-the-art lab for minimally invasive heart procedures'
    },
    {
      title: 'Cardiac Surgery Suite',
      description: 'Advanced operating rooms equipped for complex heart surgeries'
    },
    {
      title: 'Cardiac ICU',
      description: 'Specialized intensive care unit for heart patients'
    },
    {
      title: 'Cardiac Rehabilitation Center',
      description: 'Comprehensive rehabilitation facility for heart recovery'
    }
  ];

  const team = [
    {
      role: 'Cardiologists',
      count: '30+',
      description: 'Board-certified cardiologists with specialized expertise'
    },
    {
      role: 'Cardiac Surgeons',
      count: '15+',
      description: 'Expert cardiac surgeons with advanced training'
    },
    {
      role: 'Interventional Cardiologists',
      count: '20+',
      description: 'Specialists in minimally invasive heart procedures'
    },
    {
      role: 'Cardiac Nurses',
      count: '60+',
      description: 'Specialized nurses with cardiac care expertise'
    }
  ];

  const procedures = [
    {
      title: 'Diagnostic Procedures',
      procedures: [
        'Echocardiogram',
        'Stress Test',
        'Cardiac Catheterization',
        'Cardiac MRI',
        'CT Angiography'
      ]
    },
    {
      title: 'Interventional Procedures',
      procedures: [
        'Angioplasty',
        'Stent Placement',
        'Pacemaker Implantation',
        'Defibrillator Placement',
        'Ablation Therapy'
      ]
    },
    {
      title: 'Surgical Procedures',
      procedures: [
        'Bypass Surgery',
        'Valve Replacement',
        'Heart Transplant',
        'Aortic Surgery',
        'Minimally Invasive Surgery'
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Cardiology Services - Siloam Hospitals</title>
        <meta name="description" content="Advanced cardiology services including cardiac surgery, interventional cardiology, heart monitoring, and cardiac rehabilitation" />
      </Head>

      {/* Hero Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cardiology Services
            </h1>
            <p className="text-xl mb-8 text-red-100">
              Advanced heart care and cardiovascular treatments with cutting-edge technology
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
                <Stethoscope className="mr-2 h-5 w-5" />
                Schedule Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                <Users className="mr-2 h-5 w-5" />
                Meet Our Cardiologists
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Cardiology Services
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

      {/* Conditions Treated */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Conditions We Treat
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conditions.map((condition, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-red-600">{condition.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{condition.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Advanced Cardiac Facilities
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {facilities.map((facility, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-red-600">{facility.title}</CardTitle>
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Cardiac Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-3xl font-bold text-red-600 mb-2">{member.count}</div>
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

      {/* Procedures */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Cardiac Procedures
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {procedures.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-red-600">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.procedures.map((procedure, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {procedure}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Heart Health Tips */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Heart Health Tips
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-red-600">Prevention</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Maintain a healthy diet</li>
                    <li>• Exercise regularly</li>
                    <li>• Avoid smoking and excessive alcohol</li>
                    <li>• Manage stress effectively</li>
                    <li>• Regular health check-ups</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-red-600">Warning Signs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Chest pain or discomfort</li>
                    <li>• Shortness of breath</li>
                    <li>• Irregular heartbeat</li>
                    <li>• Fatigue and weakness</li>
                    <li>• Swelling in legs or ankles</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Take Care of Your Heart</h2>
          <p className="text-xl mb-8 text-red-100">
            Our cardiac team is dedicated to providing the best heart care and treatment
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              Schedule Heart Check-up
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              Emergency: Call 119
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
