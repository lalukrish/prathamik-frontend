"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AuthModal, { type AuthMode } from "@/components/authentication/Authmodal";
import Navbar from "@/components/landing/Navbar";
import UpdatesPanel from "@/components/landing/UpdatesPanel";
import ExploreExams from "@/components/landing/ExploreExams";
import ExamQuestionCard from "@/components/landing/ExamQuestionCard";
import HowItWorks from "@/components/landing/HowItWorks";

// ─── Data ─────────────────────────────────────────────────────────────────────

const TESTS = [
  { id: "1", title: "UPSC Prelims Full Mock", subject: "General Studies", tag: "UPSC",
    questions: 100, duration: 120, attempts: 48200, free: true,
    color: "from-blue-600 to-indigo-500",
    img: "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?w=400&q=80" },
  { id: "2", title: "SSC CGL Tier I Complete", subject: "Quant + Reasoning", tag: "SSC",
    questions: 100, duration: 60, attempts: 61300, free: true,
    color: "from-cyan-400 to-teal-500",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80" },
  { id: "3", title: "IBPS PO Mains Simulator", subject: "Reasoning Ability", tag: "IBPS",
    questions: 35, duration: 20, attempts: 29800, free: false,
    color: "from-emerald-400 to-green-500",
    img: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&q=80" },
  { id: "4", title: "Kerala PSC Degree Level", subject: "General Knowledge", tag: "PSC",
    questions: 100, duration: 75, attempts: 37600, free: true,
    color: "from-violet-400 to-indigo-500",
    img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80" },
  { id: "5", title: "RRB NTPC Stage 1 Mock", subject: "General Awareness", tag: "RRB",
    questions: 40, duration: 45, attempts: 52100, free: false,
    color: "from-orange-400 to-amber-500",
    img: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&q=80" },
  { id: "6", title: "NEET Biology Full Test", subject: "Biology", tag: "NEET",
    questions: 90, duration: 90, attempts: 44500, free: false,
    color: "from-rose-400 to-pink-500",
    img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80" },
  { id: "7", title: "TNPSC Group 2 Mock", subject: "Tamil Nadu GK", tag: "TNPSC",
    questions: 200, duration: 180, attempts: 22100, free: true,
    color: "from-teal-400 to-cyan-500",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80" },
];

const TOPPERS = [
  { rank: 1, name: "Arjun Sharma", score: 98.4, tests: 312, exam: "UPSC CSE", avatar: "AS", color: "bg-blue-500" },
  { rank: 2, name: "Meera Krishnan", score: 97.1, tests: 289, exam: "IBPS PO", avatar: "MK", color: "bg-cyan-400" },
  { rank: 3, name: "Ravi Teja", score: 96.8, tests: 341, exam: "SSC CGL", avatar: "RT", color: "bg-emerald-400" },
  { rank: 4, name: "Deepa Nair", score: 95.3, tests: 198, exam: "Kerala PSC", avatar: "DN", color: "bg-teal-400" },
  { rank: 5, name: "Kiran Patel", score: 94.7, tests: 267, exam: "RRB NTPC", avatar: "KP", color: "bg-blue-400" },
  { rank: 6, name: "Sneha Rao", score: 93.9, tests: 221, exam: "NEET", avatar: "SR", color: "bg-indigo-400" },
  { rank: 7, name: "Anil Kumar", score: 93.2, tests: 175, exam: "UPSC CSE", avatar: "AK", color: "bg-violet-400" },
  { rank: 8, name: "Priya Menon", score: 92.6, tests: 203, exam: "IBPS Clerk", avatar: "PM", color: "bg-pink-400" },
];

const TESTIMONIALS = [
  { name: "Arjun Sharma", exam: "Cleared UPSC CSE 2024 · AIR 47", avatar: "AS", color: "bg-blue-500",
    text: "I attempted over 200 mock tests here. The question quality and detailed analytics showed me exactly where I was losing marks. This platform made the difference." },
  { name: "Priya Nair", exam: "Selected – IBPS PO 2024 · Score 89.4", avatar: "PN", color: "bg-cyan-400",
    text: "Subject-wise breakdown after every test helped me identify weak areas fast. Cleared in my second attempt after three months of practice here." },
  { name: "Rahul Menon", exam: "SSC CGL Cleared · Score 178/200", avatar: "RM", color: "bg-emerald-400",
    text: "Timed mock tests with the real exam interface removed my anxiety completely. On exam day it felt like just another mock test on TestStudio." },
  { name: "Sneha Patel", exam: "Kerala PSC Sub Inspector · Rank 12", avatar: "SP", color: "bg-teal-400",
    text: "GK and current affairs updated every month. The leaderboard kept me motivated and competitive throughout my preparation." },
];

const FEATURES = [
  { icon: "⏱", title: "Real Exam Interface", desc: "Identical layout, timer, and negative marking to the actual exam day.", color: "bg-blue-50 text-blue-600" },
  { icon: "📊", title: "Deep Analytics", desc: "Positive score, negative score, accuracy per subject after every test.", color: "bg-cyan-50 text-cyan-500" },
  { icon: "🏆", title: "Live Leaderboards", desc: "Compare your percentile with thousands of serious aspirants.", color: "bg-emerald-50 text-emerald-500" },
  { icon: "🔄", title: "200K+ Questions", desc: "Adaptive question bank that gets harder as your score improves.", color: "bg-teal-50 text-teal-500" },
  { icon: "📱", title: "Works Everywhere", desc: "Full experience on mobile, tablet and desktop. Resume anytime.", color: "bg-indigo-50 text-indigo-500" },
  { icon: "🧠", title: "Smart Review", desc: "See correct answer, explanation, and peer choice distribution.", color: "bg-violet-50 text-violet-500" },
];

const STATS = [
  { value: "2.4M+", label: "Tests Taken", color: "text-blue-600" },
  { value: "180K+", label: "Students", color: "text-indigo-500" },
  { value: "50+", label: "Exams", color: "text-emerald-500" },
  { value: "94%", label: "Success Rate", color: "text-teal-500" },
];

const WHY_US = [
  { icon: "🎯", title: "Built for Real Results", desc: "Every test mirrors the actual exam pattern, marking scheme, and difficulty curve.", corner: "top-left" },
  { icon: "⚡", title: "Instant Feedback", desc: "See your score, rank, and weak topics the moment you submit — no waiting.", corner: "top-right" },
  { icon: "🧭", title: "Guided Preparation", desc: "Personalized recommendations on what to practice next, based on your gaps.", corner: "bottom-left" },
  { icon: "🌐", title: "Learn Your Way", desc: "Available in 8 Indian languages, on any device, whenever you have time.", corner: "bottom-right" },
];

const FAQS = [
  { q: "Is TestStudio really free to start?", a: "Yes. You can take several full-length mock tests for free with no credit card required. Premium tests unlock deeper analytics and the complete question bank." },
  { q: "Which exams does TestStudio cover?", a: "UPSC, SSC CGL, IBPS PO/Clerk, RRB NTPC, State PSCs including Kerala PSC and TNPSC, NEET, and 45+ other competitive exams across India." },
  { q: "How closely do mock tests match the real exam?", a: "Every test replicates the actual interface, timer, question pattern, and negative marking scheme so exam day feels familiar." },
  { q: "Can I track my improvement over time?", a: "Yes. Your dashboard shows subject-wise accuracy trends, percentile history, and exactly which topics are costing you the most marks." },
  { q: "Do I need to install an app?", a: "No installation needed. TestStudio works fully in your browser on mobile, tablet, or desktop, and you can resume a test where you left off." },
];

// ─── Horizontal Scroll Test Cards ─────────────────────────────────────────────

function TestScrollCards() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-slate-50 to-transparent" />
      <div
        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {TESTS.map((test) => (
          <div
            key={test.id}
            className="group flex w-[78vw] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[340px]"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${test.color}`}>
              <img src={test.img} alt={test.title} className="h-full w-full object-cover opacity-40 mix-blend-multiply" />
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">{test.tag}</span>
                  {test.free ? (
                    <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-white shadow-sm">Free</span>
                  ) : (
                    <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-white shadow-sm">Premium</span>
                  )}
                </div>
                <h3 className="text-base font-bold leading-snug text-white">{test.title}</h3>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="mb-3 text-xs font-medium text-slate-500">{test.subject}</p>
              <div className="mb-4 flex gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span>📝</span>{test.questions} questions</span>
                <span className="flex items-center gap-1"><span>⏱</span>{test.duration} min</span>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-slate-400">{(test.attempts / 1000).toFixed(1)}k attempts</span>
                <Link href="/login" className={`rounded-xl bg-gradient-to-r ${test.color} px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90`}>
                  Start Test →
                </Link>
              </div>
            </div>
          </div>
        ))}
        <div className="flex w-[200px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-600">→</div>
          <p className="text-sm font-semibold text-slate-700">500+ more tests</p>
          <Link href="/login" className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">Browse All</Link>
        </div>
      </div>
    </div>
  );
}

// ─── Why TestStudio ─────────────────────────────────────────────────────────

function WhyTestStudioSection() {
  return (
    <section id="why-us" className="relative overflow-hidden bg-white px-5 py-16 sm:py-24">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">Why TestStudio</p>
          <h2 className="mb-4 text-2xl font-light tracking-tight text-slate-900 sm:text-4xl">
            Preparation that actually
            <span className="block font-semibold text-slate-900">moves your score</span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-500">
            1.8 crore+ students and one of the best selection rates among Indian test-prep platforms. Four reasons aspirants stick with us.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
          <div className="flex flex-col gap-5 lg:order-1">
            {[WHY_US[0], WHY_US[2]].map((item) => <WhyCard key={item.title} item={item} align="right" />)}
          </div>
          <div className="order-first flex flex-col items-center gap-4 px-2 py-4 text-center lg:order-2 lg:px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-2xl text-white shadow-lg shadow-blue-100">✓</div>
            <p className="max-w-[180px] text-sm font-semibold text-slate-700">Everything you need, in one place</p>
            <Link href="/register" className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90">
              Get Started Free
            </Link>
          </div>
          <div className="flex flex-col gap-5 lg:order-3">
            {[WHY_US[1], WHY_US[3]].map((item) => <WhyCard key={item.title} item={item} align="left" />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyCard({ item, align }: { item: typeof WHY_US[number]; align: "left" | "right" }) {
  return (
    <div className={`flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${align === "right" ? "lg:flex-row-reverse lg:text-right" : ""}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-xl ring-1 ring-slate-100">{item.icon}</div>
      <div className="min-w-0">
        <h3 className="mb-1 text-sm font-bold text-slate-800">{item.title}</h3>
        <p className="text-xs leading-relaxed text-slate-500">{item.desc}</p>
      </div>
    </div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-slate-50 px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-blue-600">FAQ</p>
          <h2 className="text-2xl font-light tracking-tight text-slate-900 sm:text-4xl">Questions, <span className="font-semibold">answered</span></h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const open = openIdx === i;
            return (
              <div key={faq.q} className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${open ? "border-blue-200" : "border-slate-100"}`}>
                <button onClick={() => setOpenIdx(open ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-sm font-semibold text-slate-800">{faq.q}</span>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${open ? "rotate-45 bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>+</span>
                </button>
                <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`} style={{ display: "grid" }}>
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-xs leading-relaxed text-slate-500 sm:text-sm">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");

  const openAuthModal = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Navbar onAuthOpen={openAuthModal} />
      <UpdatesPanel />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white px-5 pb-10 pt-12 sm:pb-0 sm:pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
                180,000+ students preparing right now
              </div>
              <h1 className="mb-4 text-4xl font-light leading-tight tracking-tight text-slate-900 sm:text-5xl xl:text-6xl">
                Crack any
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 bg-clip-text font-semibold text-transparent">
                  competitive exam
                </span>
                with real mock tests
              </h1>
              <p className="mb-7 max-w-lg text-base leading-relaxed text-slate-500">
                UPSC, SSC, IBPS, RRB, PSC, NEET and more. Full-length tests with instant analytics, negative marking, and live leaderboards.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:opacity-90">
                  Start Preparing Free →
                </Link>
                <a href="#tests" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50">
                  Browse Tests
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-5">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center pb-0 lg:justify-end">
              <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/40 blur-3xl" />
              <ExamQuestionCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── Explore Exams (new) ──────────────────────────────────── */}
      <ExploreExams />

      {/* ── How It Works (new) ───────────────────────────────────── */}
      <HowItWorks />

      {/* ── Horizontal Scroll Tests ──────────────────────────────── */}
      <section id="tests" className="bg-slate-50 px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-blue-600">Test Library</p>
              <h2 className="text-xl font-extrabold text-slate-900 sm:text-3xl">Pick your exam, start today</h2>
            </div>
            <Link href="/signin" className="shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-700">View all →</Link>
          </div>
          <TestScrollCards />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="bg-white px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-indigo-500">Why TestStudio</p>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-4xl">Built for serious aspirants</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
              Not just a question bank — a complete preparation system designed around how toppers actually prepare.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${f.color}`}>{f.icon}</div>
                <h3 className="mb-2 text-base font-bold text-slate-800">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyTestStudioSection />

      {/* ── Toppers Leaderboard ───────────────────────────────────── */}
      <section id="toppers" className="bg-slate-50 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-500">Leaderboard</p>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-4xl">This month's top performers</h2>
            <p className="mt-2 text-sm text-slate-500">Updated daily. Your name could be here.</p>
          </div>
          <div className="mb-6 flex items-end justify-center gap-4">
            {[TOPPERS[1], TOPPERS[0], TOPPERS[2]].map((t, i) => {
              const heights = ["h-24 sm:h-28", "h-32 sm:h-36", "h-20 sm:h-24"];
              const podiumColors = [
                "bg-gradient-to-b from-slate-200 to-slate-100 border-slate-200",
                "bg-gradient-to-b from-amber-100 to-amber-50 border-amber-300",
                "bg-gradient-to-b from-orange-100 to-orange-50 border-orange-200",
              ];
              const medals = ["🥈", "🥇", "🥉"];
              return (
                <div key={t.rank} className="flex flex-col items-center gap-1.5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${t.color}`}>{t.avatar}</div>
                  <p className="text-xs font-semibold text-slate-700">{t.name.split(" ")[0]}</p>
                  <p className="text-xs font-bold text-emerald-500">{t.score}%</p>
                  <div className={`flex w-16 items-center justify-center rounded-t-xl border ${heights[i]} ${podiumColors[i]} sm:w-24`}>
                    <span className="text-2xl">{medals[i]}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            {TOPPERS.slice(3).map((t, i) => (
              <div key={t.rank} className={`flex items-center gap-4 px-5 py-3.5 ${i < TOPPERS.slice(3).length - 1 ? "border-b border-slate-50" : ""}`}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">#{t.rank}</span>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${t.color}`}>{t.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.exam}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{t.score}%</p>
                  <p className="text-xs text-slate-400">{t.tests} tests</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/signin" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:shadow-md">
              Join the leaderboard →
            </Link>
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────── */}
      <section id="about" className="bg-white px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">About</p>
              <h2 className="mb-5 text-2xl font-extrabold leading-tight text-slate-900 sm:text-4xl">We built the platform we wished existed</h2>
              <p className="mb-4 text-sm leading-relaxed text-slate-500">
                TestStudio started when a group of exam aspirants got frustrated with platforms that had outdated questions, no real analytics, and zero feedback on why they were losing marks.
              </p>
              <p className="mb-6 text-sm leading-relaxed text-slate-500">
                Today it covers every major competitive exam in India — UPSC, SSC, IBPS, RRB, State PSCs, NEET, and more. Every test mirrors the real exam with negative marking, subject scoring, and live leaderboards.
              </p>
              <div className="flex flex-wrap gap-2">
                {["UPSC","SSC","IBPS","RRB","NEET","Kerala PSC","TNPSC","MPPSC","BPSC","UPPSC"].map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">{tag}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Questions in bank", value: "200K+", icon: "📝", color: "bg-blue-50 border-blue-100" },
                { label: "Exams covered", value: "50+", icon: "🎯", color: "bg-indigo-50 border-indigo-100" },
                { label: "Tests attempted today", value: "12,400", icon: "⚡", color: "bg-emerald-50 border-emerald-100" },
                { label: "Avg accuracy improvement", value: "+23%", icon: "📈", color: "bg-teal-50 border-teal-100" },
              ].map((item) => (
                <div key={item.label} className={`rounded-2xl border p-5 text-center ${item.color}`}>
                  <div className="mb-2 text-2xl">{item.icon}</div>
                  <p className="text-2xl font-extrabold text-slate-800">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="bg-slate-50 px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-indigo-500">Results</p>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-4xl">From students who cleared</h2>
          </div>
          <div className="mb-5 overflow-hidden rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100 sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${TESTIMONIALS[testimonialIdx].color}`}>
                {TESTIMONIALS[testimonialIdx].avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800">{TESTIMONIALS[testimonialIdx].name}</p>
                <p className="truncate text-xs text-blue-600">{TESTIMONIALS[testimonialIdx].exam}</p>
              </div>
              <span className="shrink-0 text-xl">⭐</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">"{TESTIMONIALS[testimonialIdx].text}"</p>
            <div className="mt-5 flex gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)} className={`h-1.5 rounded-full transition-all ${i === testimonialIdx ? "w-6 bg-blue-600" : "w-1.5 bg-slate-200"}`} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {TESTIMONIALS.filter((_, i) => i !== testimonialIdx).slice(0, 3).map((t) => (
              <button key={t.name} onClick={() => setTestimonialIdx(TESTIMONIALS.indexOf(t))} className="rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition-all hover:shadow-md">
                <div className="mb-2 flex items-center gap-2">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${t.color}`}>{t.avatar}</div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.exam.split("·")[0]}</p>
                  </div>
                </div>
                <p className="line-clamp-2 text-xs text-slate-500">"{t.text}"</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-white px-5 py-16 sm:py-24">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-500 to-emerald-500 px-8 py-14 text-center shadow-2xl shadow-blue-200 sm:py-20">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative">
            <h2 className="mb-3 text-2xl font-extrabold text-white sm:text-4xl">Your exam date is closer than you think</h2>
            <p className="mb-8 text-sm text-white/80 sm:text-base">Start with a free test today. No credit card, no commitment.</p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/register" className="w-full rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition-all hover:shadow-xl sm:w-auto">
                Create Free Account →
              </Link>
              <Link href="/signin" className="w-full rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/20 sm:w-auto">
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-white px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
                  <span className="text-xs font-black text-white">T</span>
                </div>
                <span className="text-sm font-extrabold text-slate-900">TestStudio</span>
              </div>
              <p className="max-w-xs text-xs leading-relaxed text-slate-400">
                Real mock tests for real exams. Built for India's competitive exam aspirants.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8 text-xs">
              {[
                ["Exams", ["UPSC","SSC CGL","IBPS PO","RRB NTPC","NEET"]],
                ["Platform", ["Browse Tests","Leaderboard","Analytics","Pricing"]],
                ["Company", ["About","Blog","Privacy","Terms"]],
              ].map(([heading, items]) => (
                <div key={heading as string}>
                  <p className="mb-3 font-bold text-slate-700">{heading as string}</p>
                  {(items as string[]).map((e) => (
                    <p key={e} className="mb-1.5 cursor-pointer text-slate-400 hover:text-slate-600">{e}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} TestStudio. All rights reserved.
          </div>
        </div>
      </footer>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />
    </div>
  );
}