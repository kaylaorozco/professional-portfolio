import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata = {
  title: 'Privacy — Kayla Orozco',
  description:
    'How Mesquite & Thorn Digital, LLC collects, uses, and protects personal information.',
};

export default function PrivacyPage() {
  return (
    <main id="top">
      <SiteHeader staticLogo />
      <section className="privacy-page">
        <article className="privacy-content">
          <h1>Privacy policy</h1>
          <p className="privacy-effective">Last updated November 4, 2026</p>
          <p className="privacy-intro">
            KaylaOrozco.com is Kayla Orozco&apos;s professional portfolio. Consulting and
            booking services offered through the website are operated by Mesquite &amp; Thorn
            Digital, LLC (&quot;Mesquite &amp; Thorn,&quot; &quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;). Mesquite &amp; Thorn is responsible for the personal information
            described in this policy. This policy explains what information we collect, why
            we use it, and the choices available to you when you visit the website, contact
            us, or book a consulting session.
          </p>

          <section>
            <h2>Information we collect</h2>
            <h3>Information you provide</h3>
            <p>We may receive information you choose to provide, including:</p>
            <ul>
              <li>Your name and email address.</li>
              <li>Booking details, form responses, project context, and relevant links.</li>
              <li>Messages, files, or other information you share before or during a session.</li>
              <li>Appointment details, such as the date, time, and meeting location.</li>
            </ul>
            <p>
              Please do not submit passwords, payment card details, health information, or
              other sensitive personal information through the booking form.
            </p>

            <h3>Payments</h3>
            <p>
              Paid appointments are processed by Stripe through Google Calendar. Stripe
              processes your payment method. We may receive limited transaction information,
              such as payment status, amount, and a transaction identifier, but we do not
              receive or store your full payment card number.
            </p>

            <h3>Information collected automatically</h3>
            <p>
              When you visit the website, hosting and security providers may process basic
              technical information such as your IP address, browser or device type, requested
              pages, and timestamps. Embedded services, including Google Calendar, may also use
              cookies or similar technologies under their own policies.
            </p>
          </section>

          <section>
            <h2>How we use information</h2>
            <p>We use personal information to:</p>
            <ul>
              <li>Operate, maintain, and secure the website.</li>
              <li>Schedule, prepare for, provide, and follow up on consulting sessions.</li>
              <li>Process payments, cancellations, refunds, and related records.</li>
              <li>Respond to questions and other communications.</li>
              <li>Comply with legal, accounting, tax, and fraud-prevention obligations.</li>
            </ul>
            <p>
              We do not sell or rent personal information, and we do not use booking information
              for targeted advertising.
            </p>
          </section>

          <section>
            <h2>Service providers and disclosures</h2>
            <p>
              We share information only when needed to provide the website and requested services,
              including with:
            </p>
            <ul>
              <li>
                <strong>Google</strong> for Calendar appointment scheduling, email, file sharing,
                and Google Meet.
              </li>
              <li><strong>Stripe</strong> for payment processing.</li>
              <li><strong>Vercel</strong> for website hosting and delivery.</li>
              <li>
                Professional advisers, authorities, or other parties when reasonably necessary
                to comply with law, protect rights and safety, or address fraud or security issues.
              </li>
            </ul>
            <p>
              These providers process information under their own terms and privacy policies:
              {' '}<a className="text-link" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google Privacy Policy</a>,
              {' '}<a className="text-link" href="https://stripe.com/privacy" target="_blank" rel="noreferrer">Stripe Privacy Policy</a>, and
              {' '}<a className="text-link" href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">Vercel Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2>Embedded content and external links</h2>
            <p>
              The booking page embeds Google Calendar, which may collect information directly
              from you and set cookies or similar technologies. The website also links to third-party
              services such as Spotify, LinkedIn, GitHub, TikTok, and Instagram. Their privacy
              practices are governed by their own policies, not this one.
            </p>
          </section>

          <section>
            <h2>Data retention</h2>
            <p>
              We retain personal information only for as long as reasonably necessary to provide
              the requested service, maintain business and financial records, resolve disputes,
              enforce agreements, and meet legal obligations. Retention periods may differ based
              on the type of information and why it is needed.
            </p>
          </section>

          <section>
            <h2>Your choices and privacy rights</h2>
            <p>
              Depending on where you live, you may have rights to request access to, correction of,
              or deletion of personal information. You may also ask questions about how your
              information is used. Some information may need to be retained when required by law or
              for legitimate business records.
            </p>
            <p>
              To make a request, email{' '}
              <a className="text-link" href="mailto:kayla@mesquiteandthorn.digital">
                kayla@mesquiteandthorn.digital
              </a>.
            </p>
          </section>

          <section>
            <h2>Security</h2>
            <p>
              We use reasonable administrative and technical measures intended to protect personal
              information. No website, transmission, or storage system can be guaranteed completely
              secure, so please use care when deciding what information to share online.
            </p>
          </section>

          <section>
            <h2>Children&apos;s privacy</h2>
            <p>
              The consulting and booking services are intended for adults. We do not knowingly collect
              personal information from children under 13 through this website. If you believe a child
              has submitted personal information, please contact us so we can review and delete it as
              appropriate.
            </p>
          </section>

          <section>
            <h2>Changes to this policy</h2>
            <p>
              We may update this policy as the website or services change. The last updated date at the
              top of this page will be updated when changes are published.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions or requests about this policy can be sent to Mesquite &amp; Thorn Digital,
              LLC at{' '}
              <a className="text-link" href="mailto:kayla@mesquiteandthorn.digital">
                kayla@mesquiteandthorn.digital
              </a>.
            </p>
          </section>
        </article>
      </section>
      <SiteFooter />
    </main>
  );
}
