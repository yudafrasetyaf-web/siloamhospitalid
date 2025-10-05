import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Siloam Hospitals</h3>
            <p className="text-sm mb-4">
              {t('footer.about') || 'Leading healthcare provider with international standards, dedicated to providing excellent medical services.'}
            </p>
            <div className="flex space-x-4">
              <a aria-label="Facebook" href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <Facebook size={20} />
              </a>
              <a aria-label="Twitter" href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <Twitter size={20} />
              </a>
              <a aria-label="Instagram" href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <Instagram size={20} />
              </a>
              <a aria-label="YouTube" href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('footer.quickLinks') || 'Quick Links'}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/doctors" className="hover:text-white">Find a Doctor</Link></li>
              <li><Link href="/specializations" className="hover:text-white">Specializations</Link></li>
              <li><Link href="/hospitals" className="hover:text-white">Our Hospitals</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('footer.services') || 'Services'}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services/emergency" className="hover:text-white">Emergency Care</Link></li>
              <li><Link href="/services/surgery" className="hover:text-white">Surgery</Link></li>
              <li><Link href="/services/maternity" className="hover:text-white">Maternity</Link></li>
              <li><Link href="/services/cardiology" className="hover:text-white">Cardiology</Link></li>
              <li><Link href="/services/oncology" className="hover:text-white">Oncology</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('footer.contact') || 'Contact Us'}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                <span>Jl. Siloam No. 6, Lippo Village, Tangerang 15811</span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 flex-shrink-0" />
                <span>+62 21 546 0055</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 flex-shrink-0" />
                <span>info@siloamhospitals.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Siloam Hospitals. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
