import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Mail, CheckCircle2 } from 'lucide-react';

export type LegalModalType = 'privacy' | 'terms' | 'contact' | null;

interface LegalModalsProps {
  activeModal: LegalModalType;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  if (!activeModal) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
      onClose();
    }, 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            {activeModal === 'privacy' && <ShieldCheck className="w-5 h-5 text-sky-600" />}
            {activeModal === 'terms' && <FileText className="w-5 h-5 text-sky-600" />}
            {activeModal === 'contact' && <Mail className="w-5 h-5 text-sky-600" />}
            <h3 className="font-bold text-neutral-900 text-base">
              {activeModal === 'privacy' && 'Privacy Policy'}
              {activeModal === 'terms' && 'Terms of Service'}
              {activeModal === 'contact' && 'Contact Support'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto text-xs sm:text-sm text-neutral-600 leading-relaxed space-y-4">
          {activeModal === 'privacy' && (
            <>
              <p className="font-medium text-neutral-900">Last updated: November 2026</p>
              <h4 className="font-bold text-neutral-900 text-sm">1. Zero Server Image Storage</h4>
              <p>
                At ReColor Image, we believe your images are your private property. All photo editing,
                color shifts, and preset rendering occur locally inside your web browser via the HTML5
                Canvas API. We do not upload, transmit, store, or view your source photos on remote servers.
              </p>
              <h4 className="font-bold text-neutral-900 text-sm">2. Data We Do Not Collect</h4>
              <p>
                We do not collect names, email addresses, passwords, facial biometric data, EXIF coordinates,
                or personal identification. You are not required to create an account or provide billing details.
              </p>
              <h4 className="font-bold text-neutral-900 text-sm">3. Local Browser Storage</h4>
              <p>
                We may store basic UI preferences (such as your cookie consent choices) in your browser's
                localStorage strictly to remember your preferences between sessions.
              </p>
              <h4 className="font-bold text-neutral-900 text-sm">4. Third-Party Advertising</h4>
              <p>
                Our site includes placeholder integration slots for future non-intrusive display advertising
                (such as Adsterra). Third-party advertising partners may use cookies to serve relevant contextual
                advertisements compliant with GDPR and CCPA guidelines.
              </p>
            </>
          )}

          {activeModal === 'terms' && (
            <>
              <p className="font-medium text-neutral-900">Effective Date: November 2026</p>
              <h4 className="font-bold text-neutral-900 text-sm">1. Acceptance of Terms</h4>
              <p>
                By accessing and using ReColor Image, you agree to comply with and be bound by these Terms of
                Service. If you do not agree, please do not use the application.
              </p>
              <h4 className="font-bold text-neutral-900 text-sm">2. Permitted Use & Ownership</h4>
              <p>
                You retain full copyright and intellectual property rights to all images you process with
                ReColor Image. You may use exported images for personal, editorial, and commercial purposes
                without royalties or attribution to ReColor Image.
              </p>
              <h4 className="font-bold text-neutral-900 text-sm">3. Disclaimer of Warranties</h4>
              <p>
                The service is provided on an "as-is" and "as-available" basis without warranties of any kind.
                We do not guarantee uninterrupted availability or that exports will meet specific print lab
                specifications.
              </p>
              <h4 className="font-bold text-neutral-900 text-sm">4. Limitation of Liability</h4>
              <p>
                In no event shall ReColor Image or its contributors be liable for any incidental, indirect,
                or consequential damages resulting from the use or inability to use this web utility.
              </p>
            </>
          )}

          {activeModal === 'contact' && (
            <>
              {contactSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="text-base font-bold text-neutral-900">Message Received</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Thank you for contacting ReColor Image. Our development team will review your inquiry.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <p className="text-xs text-neutral-500">
                    Have feedback, feature requests, or business inquiries? Send us a message below.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs focus:outline-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs focus:outline-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Message</label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Describe your question or feedback..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs focus:outline-neutral-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                  >
                    Send Inquiry
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
