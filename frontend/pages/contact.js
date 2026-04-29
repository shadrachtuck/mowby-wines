import { gql } from '@apollo/client';
import { getNextStaticProps } from '@faustwp/core';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import { MowbySiteGlobalsFragment } from '../fragments/MowbySiteGlobals';
import { NavigationMenuItemFragment } from '../fragments/MenuAndImage';
import { SEO } from '../components/SEO';
import WineLayout from '../components/wine/WineLayout';
import DecorativeFish from '../components/wine/DecorativeFish';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Mail, Send } from 'lucide-react';

function applyEmailTemplate(str, email) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/\{email\}/g, email || '');
}

export default function ContactPage(props) {
  const data = props?.data;
  const { title: siteTitle, description: siteDescription } =
    data?.generalSettings ?? {};

  const acf = data?.contactPage?.mowbyContact;
  const cf = acf?.contactForm;

  const heading = acf?.heading?.trim() || 'Get in Touch';
  const subheading =
    acf?.subheading?.trim() ||
    "We'd love to hear from you. Reach out with any questions or inquiries.";
  const contactEmail = acf?.contactEmail?.trim() || 'hello@mowbywines.com';

  const nameLabel = cf?.nameLabel?.trim() || 'Name *';
  const namePlaceholder = cf?.namePlaceholder?.trim() || 'Your name';
  const emailLabel = cf?.emailLabel?.trim() || 'Email *';
  const emailPlaceholder = cf?.emailPlaceholder?.trim() || 'your@email.com';
  const subjectLabel = cf?.subjectLabel?.trim() || 'Subject *';
  const subjectPlaceholder =
    cf?.subjectPlaceholder?.trim() || 'What is this regarding?';
  const messageLabel = cf?.messageLabel?.trim() || 'Message *';
  const messagePlaceholder =
    cf?.messagePlaceholder?.trim() || 'Tell us more about your inquiry...';
  const submitLabel = cf?.submitLabel?.trim() || 'Send Message';
  const successTitle = cf?.successTitle?.trim() || 'Message Sent!';
  const successBodyRaw =
    cf?.successBody?.trim() ||
    "Thank you for reaching out to us.\n\nWe'll get back to you at {email} as soon as possible.";
  const sendAnotherLabel =
    cf?.sendAnotherLabel?.trim() || 'Send Another Message';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = JSON.parse(
      localStorage.getItem('contactSubmissions') || '[]'
    );
    localStorage.setItem(
      'contactSubmissions',
      JSON.stringify([
        ...existing,
        { ...formData, timestamp: Date.now() },
      ])
    );
    setSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const successBody = applyEmailTemplate(successBodyRaw, formData.email);
  const successParagraphs = successBody.split(/\n\n+/).filter(Boolean);

  return (
    <>
      <SEO title={`Contact - ${siteTitle}`} description={siteDescription} />
      <WineLayout>
        <div className="min-h-screen bg-mowby-cream pt-20">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 relative"
            >
              <h1 className="text-4xl md:text-5xl font-serif mb-4 text-gray-900">
                {heading}
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto whitespace-pre-line">
                {subheading}
              </p>

              <div className="absolute -top-8 right-12">
                <DecorativeFish variant="blue" size="md" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="w-full max-w-[420px] mx-auto flex flex-col gap-2">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label
                          htmlFor="name"
                          className="text-sm font-sans font-medium text-gray-700 mb-2 block"
                        >
                          {nameLabel}
                        </Label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          autoComplete="name"
                          required
                          aria-required="true"
                          className="w-full"
                          placeholder={namePlaceholder}
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="email"
                          className="text-sm font-sans font-medium text-gray-700 mb-2 block"
                        >
                          {emailLabel}
                        </Label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          autoComplete="email"
                          required
                          aria-required="true"
                          className="w-full"
                          placeholder={emailPlaceholder}
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="subject"
                        className="text-sm font-sans font-medium text-gray-700 mb-2 block"
                      >
                        {subjectLabel}
                      </Label>
                      <Input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        className="w-full"
                        placeholder={subjectPlaceholder}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="message"
                        className="text-sm font-sans font-medium text-gray-700 mb-2 block"
                      >
                        {messageLabel}
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        aria-required="true"
                        rows={6}
                        placeholder={messagePlaceholder}
                        className="w-full resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full min-h-11 h-auto rounded-xl px-4 py-2.5 font-sans font-semibold text-base"
                    >
                      {submitLabel}
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-mowby-seaweed/15 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Send className="w-10 h-10 text-mowby-seaweed" />
                    </div>
                    <h3 className="text-3xl font-serif mb-4 text-gray-900">
                      {successTitle}
                    </h3>
                    {successParagraphs.map((para, i) => (
                      <p
                        key={i}
                        className={
                          i === 0
                            ? 'text-gray-700 mb-2'
                            : 'text-gray-600 mb-8'
                        }
                      >
                        {para}
                      </p>
                    ))}
                    <Button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          subject: '',
                          message: '',
                        });
                      }}
                      variant="secondary"
                      className="w-full min-h-11 h-auto rounded-xl px-4 py-2.5 font-sans font-semibold text-base"
                    >
                      {sendAnotherLabel}
                    </Button>
                  </motion.div>
                )}
              </div>

              <div className="absolute -bottom-12 -left-8">
                <DecorativeFish variant="green" size="lg" />
              </div>
              <div className="absolute top-1/2 -right-12">
                <DecorativeFish variant="yellow" size="sm" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Mail className="w-5 h-5" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="hover:text-mowby-blue transition-colors"
                >
                  {contactEmail}
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </WineLayout>
    </>
  );
}

ContactPage.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenuItemFragment}
  ${MowbySiteGlobalsFragment}
  query GetContactPage(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
    $pageUri: ID!
  ) {
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    mowbySite {
      ...MowbySiteGlobalsFields
    }
    contactPage: page(id: $pageUri, idType: URI) {
      title
      content
    }
  }
`;

ContactPage.variables = (context, extra) => ({
  headerLocation: MENUS.PRIMARY_LOCATION,
  footerLocation: MENUS.FOOTER_LOCATION,
  pageUri: '/contact/',
});

export async function getStaticProps(context) {
  return getNextStaticProps(context, {
    Page: ContactPage,
    revalidate: 60,
  });
}
