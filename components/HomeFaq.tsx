"use client";

import { trackEvent } from "@/lib/trackEvent";

const faqItems = [
  {
    id: "faq-pricing",
    question: "How much does a commercial interior project cost?",
    answer:
      "Cost depends on space size, business type, and material tier. Use our calculator to get a budget range and then speak with our team for a tailored estimate.",
  },
  {
    id: "faq-duration",
    question: "How long does execution take?",
    answer:
      "Most projects are delivered in 30 to 90 days based on scope. Our factory-led workflow helps us control quality and timeline.",
  },
  {
    id: "faq-warranty",
    question: "Do you provide warranty and post-handover support?",
    answer:
      "Yes. We provide warranty coverage based on materials used and offer post-handover maintenance guidance for long-term durability.",
  },
  {
    id: "faq-cities",
    question: "Which cities do you serve?",
    answer:
      "We execute projects across major South Indian cities and selected pan-India locations for high-value commercial spaces.",
  },
];

export function HomeFaq() {
  return (
    <section className="section-pad bg-surface">
      <div className="container">
        <div className="section-heading">
          <p className="section-eyebrow">FAQ</p>
          <h2>Questions Before You Start?</h2>
          <p>Clear answers that help you decide faster and launch your space with confidence.</p>
        </div>

        <div className="faq-list">
          {faqItems.map((item) => (
            <details
              key={item.id}
              className="faq-item"
              onToggle={(event) => {
                const target = event.currentTarget;
                if (target.open) {
                  trackEvent({
                    path: "/",
                    event: "faq_view",
                    section: "home_faq",
                    target: item.id,
                    label: item.question,
                  });
                }
              }}
            >
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
