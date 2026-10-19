
import React from 'react';
import { Link } from 'react-router-dom';
import { showToast } from './Toast';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111418] text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 text-white">
              <div className="h-10">
                <img src="/images/gpaa_logo.png" alt="GPAA Logo" className="h-full w-auto object-contain" />
              </div>
              <h2 className="text-xl font-black">GPAA</h2>
            </Link>
            <p className="text-primary font-bold text-lg mb-4">Together We Build</p>
            <p className="text-gray-400 leading-relaxed">
              Official professional body for Physician Assistants in Ghana. Advancing clinical excellence and advocating for quality healthcare delivery since 1980.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/GhanaPhysicianAssistantsAssociation" target="_blank" rel="noopener noreferrer" aria-label="GPAA on Facebook" className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.instagram.com/gpaa_official" target="_blank" rel="noopener noreferrer" aria-label="GPAA on Instagram" className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all hover:-translate-y-1">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          <nav aria-label="Quick links">
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Our History</Link></li>
              <li><Link to="/programs" className="text-gray-400 hover:text-white transition-colors">Strategic Pillars</Link></li>
              <li><Link to="/membership" className="text-gray-400 hover:text-white transition-colors">Membership</Link></li>
              <li><Link to="/advocacy" className="text-gray-400 hover:text-white transition-colors">Advocacy Center</Link></li>
              <li><Link to="/donate" className="text-gray-400 hover:text-white transition-colors">Support Us</Link></li>
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h4 className="font-bold text-lg mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><Link to="/news-resources" className="text-gray-400 hover:text-white transition-colors">News & Resources</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/documents" className="text-gray-400 hover:text-white transition-colors">Documents & Reports</Link></li>
              <li><Link to="/welfare" className="text-gray-400 hover:text-white transition-colors">Welfare</Link></li>
              <li><Link to="/get-involved/volunteer" className="text-gray-400 hover:text-white transition-colors">Get Involved</Link></li>
            </ul>
          </nav>

          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <span className="text-gray-400">Headquarters Office, <br /> Ashiyie, Off Adenta-Dodowa Road, Accra North - Ghana</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">phone</span>
                <span className="text-gray-400">
                  <a href="tel:+233302937118"><p className="hover:text-primary">+233 (0) 30 293 7118</p></a>
                  <a href="tel:+233595150737"><p className="hover:text-primary">+233 (0) 59 515 0737</p></a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">mail</span>
                <span className="text-gray-400 hover:text-primary"><a href="mailto:gpaanational@gmail.com">gpaanational@gmail.com</a></span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Ghana Physician Assistants Association. All rights reserved.</p>
          <nav aria-label="Legal" className="flex gap-8">
            <a href="#" onClick={(e) => { e.preventDefault(); showToast('Privacy Policy will be published here soon.', 'info'); }} className="hover:text-white">Privacy Policy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); showToast('Terms of Service will be published here soon.', 'info'); }} className="hover:text-white">Terms of Service</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
