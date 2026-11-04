import type { Metadata } from 'next';
import Link from 'next/link';

const bookingUrl =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2AUwgh7r_PWNG59vObme7bdG4Bw0THaN4d_c9Lkselrf05lRbyZa7SWCS_F87RYCF2LaHO4Bo7?gv=true';

export const metadata: Metadata = {
  title: 'Book a Product Design Strategy Session — Kayla Orozco',
  description:
    'Book a focused 60-minute product design strategy session for a website, mobile app, or AI-powered experience.',
};

export default function BookPage() {
  return (
    <main className="hi-book-page">
      <div className="hi-book-shell">
        <Link className="hi-book-back" href="/hi" aria-label="Back to Kayla's links">
          <span aria-hidden="true">←</span>
          Back to links
        </Link>

        <header className="hi-book-hero">
          <p className="hi-book-eyebrow">1:1 design session</p>
          <h1>work with me.</h1>
          <p className="hi-book-price">
            $150 <span>/ hour</span>
          </p>
          <p className="hi-book-summary">
            A focused working session for websites, mobile products, or
            thoughtfully integrating AI into a product experience. Choose a
            time that works for you below.
          </p>
        </header>

        <section className="hi-book-calendar" aria-labelledby="booking-calendar-heading">
          <div className="hi-book-calendar-heading">
            <div>
              <p className="hi-book-calendar-label">Select a date and time</p>
              <h2 id="booking-calendar-heading">Product Design Strategy Session</h2>
            </div>
            <span>Secure payment at booking</span>
          </div>

          <iframe
            className="hi-book-iframe"
            src={bookingUrl}
            title="Book a Product Design Strategy Session with Kayla Orozco"
            width="100%"
            height="760"
            allow="payment"
          />
        </section>

        <p className="hi-book-help">
          Have a question before booking?{' '}
          <a href="mailto:kayla@mesquiteandthorn.digital?subject=Strategy%20session%20question">
            Email me
          </a>
          .
        </p>

        <span className="hi-spark hi-book-spark-one" aria-hidden="true">✦</span>
        <span className="hi-spark hi-book-spark-two" aria-hidden="true">✦</span>
      </div>
    </main>
  );
}
