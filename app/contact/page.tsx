import type { Metadata } from 'next';
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ContactCharacter } from '@/components/contact-character';

export const metadata: Metadata = {
  title: 'Contact — Kayla Orozco',
  description: 'Get in touch with Kayla Orozco about conversational design, AI products, or thoughtful collaborations.',
};

const contactOptions = [
  {
    eyebrow: 'Start a conversation',
    title: 'Send me an email',
    description: 'Best for project ideas, collaborations, or anything that needs a little context.',
    label: 'kaylamarieorozco@gmail.com',
    href: 'mailto:kaylamarieorozco@gmail.com',
    icon: Mail,
  },
  {
    eyebrow: 'Keep in touch',
    title: 'Find me on LinkedIn',
    description: 'A good place for a quick hello, shared interests, and the occasional career update.',
    label: 'linkedin.com/in/kaylaorozco',
    href: 'https://www.linkedin.com/in/kaylaorozco/',
    icon: MessageCircle,
  },
];

export default function ContactPage() {
  return (
    <main>
      <SiteHeader />
      <section className="contact-hero">
        <div className="contact-intro">
          <p className="eyebrow">You made it to the good part</p>
          <h1>Good conversations don&apos;t start themselves.</h1>
          <p>
            Have a project in mind, a curious question, or just want to say hello? Pick your favorite way to reach me and I&apos;ll take it from there.
          </p>
        </div>

        <ContactCharacter />
      </section>

      <section className="contact-options" aria-label="Ways to contact Kayla">
        {contactOptions.map(({ eyebrow, title, description, label, href, icon: Icon }) => (
          <a
            className="contact-card"
            href={href}
            key={title}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noreferrer' : undefined}
          >
            <span className="contact-card-icon" aria-hidden="true"><Icon size={25} strokeWidth={1.7} /></span>
            <span className="eyebrow">{eyebrow}</span>
            <strong>{title}</strong>
            <span className="contact-card-description">{description}</span>
            <span className="contact-card-link">{label} <ArrowUpRight aria-hidden="true" size={18} /></span>
          </a>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
