export default function FaqAccordion({ faqs }) {
  if (!faqs?.length) return null;

  return (
    <section className="py-16 bg-surface">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-10">
          <span className="section-label">Got Questions?</span>
          <h2 className="text-3xl font-bold text-primary mt-3">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group card p-0 overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer select-none list-none">
                <span className="font-semibold text-primary text-sm pr-4">{faq.question}</span>
                <span className="text-accent text-lg flex-shrink-0 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5 text-muted text-sm leading-relaxed border-t border-border pt-4">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
