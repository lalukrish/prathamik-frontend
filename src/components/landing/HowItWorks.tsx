const STEPS = [
  { n: "01", title: "Pick your exam", desc: "Choose from 50+ exams — UPSC, SSC, IBPS, PSC, NEET and more." },
  { n: "02", title: "Take a real mock test", desc: "Same interface, timer, and negative marking as the actual exam." },
  { n: "03", title: "Review your analytics", desc: "See subject-wise accuracy, percentile, and where you lost marks." },
  { n: "04", title: "Practice weak areas", desc: "Get a personalized set of questions targeting your gaps." },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-900 px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-blue-400">How it works</p>
          <h2 className="text-2xl font-light text-white sm:text-4xl">
            From sign-up to <span className="font-semibold">score improvement</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.n} className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="mb-4 block text-3xl font-black text-blue-500/40">{step.n}</span>
              <h3 className="mb-2 text-sm font-bold text-white">{step.title}</h3>
              <p className="text-xs leading-relaxed text-slate-400">{step.desc}</p>
              {i < STEPS.length - 1 && (
                <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-lg text-blue-500/40 lg:block">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}