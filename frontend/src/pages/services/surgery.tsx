import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Stethoscope, 
  Shield, 
  Clock, 
  Users,
  Award,
  CheckCircle,
  Activity,
  Heart,
  Brain,
  Bone
} from 'lucide-react';

export default function SurgeryService() {
  const { t } = useTranslation();

  const surgeryTypes = [
    {
      title: 'General Surgery',
      description: 'Comprehensive surgical procedures for various conditions',
      icon: <Stethoscope className="w-8 h-8 text-blue-500" />,
      procedures: ['Appendectomy', 'Gallbladder Surgery', 'Hernia Repair', 'Colon Surgery']
    },
    {
      title: 'Minimally Invasive Surgery',
      description: 'Advanced laparoscopic and robotic procedures',
      icon: <Activity className="w-8 h-8 text-green-500" />,
      procedures: ['Laparoscopic Surgery', 'Robotic Surgery', 'Endoscopic Procedures', 'Keyhole Surgery']
    },
    {
      title: 'Cardiac Surgery',
      description: 'Heart and cardiovascular surgical procedures',
      icon: <Heart className="w-8 h-8 text-red-500" />,
      procedures: ['Bypass Surgery', 'Valve Replacement', 'Heart Transplant', 'Aortic Surgery']
    },
    {
      title: 'Neurosurgery',
      description: 'Brain and nervous system surgical treatments',
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      procedures: ['Brain Tumor Surgery', 'Spinal Surgery', 'Neurovascular Surgery', 'Epilepsy Surgery']
    },
    {
      title: 'Orthopedic Surgery',
      description: 'Bone, joint, and musculoskeletal procedures',
      icon: <Bone className="w-8 h-8 text-orange-500" />,
      procedures: ['Joint Replacement', 'Fracture Repair', 'Spinal Fusion', 'Sports Medicine']
    },
    {
      title: 'Plastic Surgery',
      description: 'Reconstructive and cosmetic surgical procedures',
      icon: <Shield className="w-8 h-8 text-pink-500" />,
      procedures: ['Reconstructive Surgery', 'Cosmetic Surgery', 'Burn Treatment', 'Hand Surgery']
    }
  ];

  const facilities = [
    {
      title: 'Advanced Operating Rooms',
      description: 'State-of-the-art surgical suites with cutting-edge technology'
    },
    {
      title: 'Robotic Surgery Systems',
      description: 'Da Vinci robotic systems for precision minimally invasive surgery'
    },
    {
      title: 'Hybrid Operating Rooms',
      description: 'Combined surgical and imaging capabilities for complex procedures'
    },
    {
      title: 'Recovery Units',
      description: 'Specialized post-surgical care units with 24/7 monitoring'
    }
  ];

  const team = [
    {
      role: 'Surgeons',
      count: '50+',
      description: 'Board-certified surgeons with specialized expertise'
    },
    {
      role: 'Anesthesiologists',
      count: '20+',
      description: 'Expert anesthesiologists ensuring patient safety'
    },
    {
      role: 'Nurses',
      count: '100+',
      description: 'Specialized surgical nurses and technicians'
    },
    {
      role: 'Support Staff',
      count: '30+',
      description: 'Dedicated support staff for comprehensive care'
    }
  ];

  return (
    <>
      <Head>
        <title>Surgery Services - Siloam Hospitals</title>
        <meta name="description" content="Advanced surgical services including general surgery, minimally invasive surgery, cardiac surgery, and more" />
      </Head>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Surgery Services
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Advanced surgical procedures with state-of-the-art equipment and expert medical teams
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <Users className="mr-2 h-5 w-5" />
                Meet Our Surgeons
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Clock className="mr-2 h-5 w-5" />
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Surgery Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Surgical Specialties
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surgeryTypes.map((surgery, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {surgery.icon}
                  </div>
                  <CardTitle className="text-xl">{surgery.title}</CardTitle>
                  <CardDescription>{surgery.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {surgery.procedures.map((procedure, idx) => (
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

      {/* Facilities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Advanced Surgical Facilities
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {facilities.map((facility, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">{facility.title}</CardTitle>
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
            Our Surgical Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{member.count}</div>
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

      {/* Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Our Surgical Process
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">Pre-Surgical Consultation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Comprehensive medical evaluation</li>
                    <li>Pre-surgical testing and imaging</li>
                    <li>Anesthesia consultation</li>
                    <li>Pre-surgical instructions and preparation</li>
                  </ol>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">Post-Surgical Care</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Immediate post-operative monitoring</li>
                    <li>Pain management and recovery support</li>
                    <li>Physical therapy and rehabilitation</li>
                    <li>Follow-up appointments and care</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Surgical Consultation?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Our expert surgical team is ready to provide you with the best possible care
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Meet Our Surgeons
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
