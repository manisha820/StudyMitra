import React from 'react';

type Props = {
  onGoToLogin: () => void;
};

export default function LandingPage({ onGoToLogin }: Props) {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl no-border shadow-sm shadow-sky-900/5">
        <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-sky-700 dark:text-sky-400 text-3xl">school</span>
            <span className="text-2xl font-extrabold tracking-tight text-sky-800 dark:text-sky-200 font-headline">Study Mitra</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-sky-700 dark:text-sky-300 font-semibold border-b-2 border-sky-700 transition-all duration-300" href="#">Home</a>
            <a className="text-slate-500 dark:text-slate-400 font-medium hover:text-sky-600 dark:hover:text-sky-300 transition-all duration-300" href="#">Curator Dashboard</a>
            <a className="text-slate-500 dark:text-slate-400 font-medium hover:text-sky-600 dark:hover:text-sky-300 transition-all duration-300" href="#">AI Professor</a>
            <a className="text-slate-500 dark:text-slate-400 font-medium hover:text-sky-600 dark:hover:text-sky-300 transition-all duration-300" href="#">Timetable</a>
          </div>
          <button 
            onClick={onGoToLogin}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-headline font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
          >
            Get Started
          </button>
        </nav>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative px-8 pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase text-primary bg-primary-container/30 rounded-full font-label">The Future of Learning</span>
              <h1 className="text-6xl md:text-7xl font-extrabold font-headline leading-[1.1] text-on-background mb-8">
                Master Your Exams with <span className="text-gradient">Academic Intelligence</span>
              </h1>
              <p className="text-xl text-on-surface-variant mb-12 max-w-xl font-body leading-relaxed">
                Say goodbye to scattered notes and rigid schedules. Study Mitra curates your learning journey with precision AI and an editorial-grade interface.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={onGoToLogin}
                  className="px-8 py-4 bg-primary text-on-primary rounded-full font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
                >
                  Get Started for Free
                </button>
                <button className="px-8 py-4 border-2 border-outline-variant/30 text-primary rounded-full font-headline font-bold text-lg hover:bg-surface-container transition-all">
                  View Portal Demo
                </button>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-tertiary/10 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative bg-surface-container-lowest rounded-[2rem] p-4 shadow-2xl shadow-on-surface/5 overflow-hidden">
                <img alt="Student dashboard" className="rounded-[1.5rem] w-full aspect-[4/3] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3-WoR3KiPUeZC1ziB3bwgZXymEY7cSyD8788-PNoXsCBonCXPg7TZRa2PkTk_6jEHSmw8Ly4uKDi4pmYiBf3pW5QKloGvhT18vWJrBZKw5ANw2-u_8TaiAh_Gz6hz36XUyx5QbysbAP4mAplmKTm4UqPYA1SOjFYrgAJU9XOqTfNn00OBnx0zFlkFNbG02kSvwA-OHfxXf8qa8JVTM-uowIiq8DJ-lvguCKRK7_MKWEnOinVz6SPoXkOb3Davz8KphgFS4RNgQXo"/>
              </div>
              {/* Floating Asymmetric Element */}
              <div className="absolute -bottom-10 -left-10 glass-panel p-6 rounded-2xl shadow-xl border border-white/40 max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-secondary">auto_awesome</span>
                  <span className="font-label font-bold text-xs uppercase tracking-wider text-secondary">AI Insight</span>
                </div>
                <p className="text-sm font-medium text-on-surface">"Focus on Biochemistry modules 3-4 today for 15% better retention."</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-surface-container-low py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <div>
                <div className="text-5xl font-extrabold font-headline text-primary mb-2">98.2%</div>
                <div className="text-sm font-label font-bold text-on-surface-variant uppercase tracking-widest">Exam Pass Rate</div>
              </div>
              <div>
                <div className="text-5xl font-extrabold font-headline text-secondary mb-2">1.2M+</div>
                <div className="text-sm font-label font-bold text-on-surface-variant uppercase tracking-widest">Sessions Sync</div>
              </div>
              <div>
                <div className="text-5xl font-extrabold font-headline text-tertiary mb-2">24/7</div>
                <div className="text-sm font-label font-bold text-on-surface-variant uppercase tracking-widest">AI Assistance</div>
              </div>
              <div>
                <div className="text-5xl font-extrabold font-headline text-on-surface mb-2">500+</div>
                <div className="text-sm font-label font-bold text-on-surface-variant uppercase tracking-widest">Top Universities</div>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Timetable Section */}
        <section className="py-32 px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface mb-6">Intentional Scheduling</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">We've replaced the rigid grid with an organic flow that adapts to your mental peaks and valleys.</p>
            </div>
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Editorial Timetable Card */}
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-[2.5rem] p-10 shadow-sm border border-outline-variant/10 w-full">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-2xl font-bold font-headline">Wednesday, June 12</h3>
                    <p className="text-on-surface-variant font-label text-sm uppercase tracking-wide">4 Scheduled Sessions</p>
                  </div>
                  <button className="p-3 bg-surface-container rounded-full text-primary hover:bg-primary hover:text-on-primary transition-all">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="group flex items-center gap-6 p-6 rounded-2xl bg-primary-container hover:bg-primary-fixed transition-all cursor-pointer">
                    <div className="text-on-primary-container">
                      <div className="font-bold text-lg">09:00 - 10:30</div>
                      <div className="text-xs uppercase font-label font-bold opacity-70">Focus Block</div>
                    </div>
                    <div className="h-10 w-[2px] bg-on-primary-container/20"></div>
                    <div>
                      <h4 className="font-bold text-xl text-on-primary-container">Advanced Macroeconomics</h4>
                      <p className="text-on-primary-container/70 text-sm">Library Quiet Zone</p>
                    </div>
                  </div>
                  <div className="group flex items-center gap-6 p-6 rounded-2xl bg-secondary-container hover:bg-secondary-fixed transition-all cursor-pointer">
                    <div className="text-on-secondary-container">
                      <div className="font-bold text-lg">11:00 - 12:30</div>
                      <div className="text-xs uppercase font-label font-bold opacity-70">Interactive</div>
                    </div>
                    <div className="h-10 w-[2px] bg-on-secondary-container/20"></div>
                    <div>
                      <h4 className="font-bold text-xl text-on-secondary-container">Group Case Study Review</h4>
                      <p className="text-on-secondary-container/70 text-sm">Online Conference Hall</p>
                    </div>
                  </div>
                  <div className="group flex items-center gap-6 p-6 rounded-2xl bg-surface-container-low hover:bg-surface-variant transition-all cursor-pointer">
                    <div className="text-on-surface">
                      <div className="font-bold text-lg">14:00 - 15:00</div>
                      <div className="text-xs uppercase font-label font-bold opacity-60">AI Sync</div>
                    </div>
                    <div className="h-10 w-[2px] bg-outline-variant"></div>
                    <div>
                      <h4 className="font-bold text-xl text-on-surface">Weekly Progress Review</h4>
                      <p className="text-on-surface-variant text-sm">Personal Dashboard</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Side Features */}
              <div className="lg:col-span-5 grid gap-8 flex-col justify-center">
                <div className="bg-surface-container-high rounded-[2rem] p-8">
                  <span className="material-symbols-outlined text-4xl text-primary mb-4">update</span>
                  <h4 className="text-xl font-bold font-headline mb-3 text-on-surface">Cognitive Load Balancing</h4>
                  <p className="text-on-surface-variant leading-relaxed">Our system automatically spaces out heavy reading blocks with light review periods to prevent burnout.</p>
                </div>
                <div className="bg-secondary-container/20 rounded-[2rem] p-8 border border-secondary/10">
                  <span className="material-symbols-outlined text-4xl text-secondary mb-4">sync_alt</span>
                  <h4 className="text-xl font-bold font-headline mb-3 text-on-surface">Multi-Platform Sync</h4>
                  <p className="text-on-surface-variant leading-relaxed">Synchronize your university LMS, personal calendar, and Study Mitra with a single tap.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Professor Feature Section */}
        <section className="py-32 px-8 overflow-hidden bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl"></div>
                <div className="relative glass-panel rounded-[2.5rem] p-8 shadow-2xl border border-white/50">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-tertiary flex items-center justify-center text-white">
                      <span className="material-symbols-outlined">smart_toy</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-on-surface">AI Professor</h4>
                      <span className="text-xs font-label text-tertiary font-bold uppercase">Online &amp; Analyzing</span>
                    </div>
                  </div>
                  <div className="space-y-6 mb-8">
                    <div className="p-4 bg-tertiary-dim/5 rounded-2xl rounded-tl-none mr-12 border border-tertiary/10">
                      <p className="text-sm font-body text-tertiary">Hello Alex! I noticed you struggled with the Elasticity section. Would you like a 10-minute simplified breakdown?</p>
                    </div>
                    <div className="p-4 bg-primary text-on-primary rounded-2xl rounded-tr-none ml-12 shadow-md">
                      <p className="text-sm font-body">Yes please, Professor. Focus on Cross-Price Elasticity specifically.</p>
                    </div>
                    <div className="p-4 bg-tertiary-dim/5 rounded-2xl rounded-tl-none mr-12 border border-tertiary/10">
                      <p className="text-sm font-body text-tertiary">Excellent choice. Imagine if the price of coffee rises; the demand for tea usually increases. This is a positive cross-price elasticity...</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input className="w-full bg-white border-outline-variant/20 rounded-full py-4 px-6 focus:ring-tertiary focus:border-tertiary transition-all" placeholder="Ask your professor anything..." type="text"/>
                    <button className="absolute right-2 top-2 p-2 bg-tertiary text-white rounded-full">
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase text-tertiary bg-tertiary-container/20 rounded-full font-label">The Curator's Mind</span>
                <h2 className="text-4xl md:text-6xl font-extrabold font-headline text-on-surface mb-8 leading-tight">Your Personal <span className="text-tertiary">AI Mentor</span> for every subject.</h2>
                <p className="text-xl text-on-surface-variant mb-10 leading-relaxed">The AI Professor isn't just a chatbot—it's a pedagogical engine. It tracks your learning speed, identifies knowledge gaps, and curates supplemental material from millions of peer-reviewed sources.</p>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-tertiary">check_circle</span>
                    <div>
                      <h5 className="font-bold font-headline text-on-surface">Socratic Questioning</h5>
                      <p className="text-on-surface-variant text-sm">The AI guides you to the answer rather than just giving it.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-tertiary">check_circle</span>
                    <div>
                      <h5 className="font-bold font-headline text-on-surface">Exam Simulations</h5>
                      <p className="text-on-surface-variant text-sm">Generate adaptive mock tests based on your weakest areas.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-32 px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase text-primary bg-primary-container/30 rounded-full font-label">Transparent Pricing</span>
              <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface mb-6">Invest in Your Intelligence</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-lg leading-relaxed">Choose the plan that fits your academic ambitions. Upgrade anytime as your needs evolve.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
              {/* Free Plan */}
              <div className="bg-surface-container-lowest rounded-[2.5rem] p-10 shadow-sm border border-outline-variant/20 hover:shadow-xl transition-all">
                <h3 className="text-2xl font-bold font-headline mb-2 text-on-surface">Basic</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-extrabold text-on-surface">$0</span>
                  <span className="text-on-surface-variant font-label font-medium uppercase tracking-wide">/ forever</span>
                </div>
                <p className="text-on-surface-variant mb-8 text-sm">Perfect for getting started with smart study tools.</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm text-on-surface"><span className="material-symbols-outlined text-primary text-xl">check</span> Basic Syllabus Management</li>
                  <li className="flex items-center gap-3 text-sm text-on-surface"><span className="material-symbols-outlined text-primary text-xl">check</span> Standard Study Planner</li>
                  <li className="flex items-center gap-3 text-sm text-on-surface-variant/50"><span className="material-symbols-outlined text-outline-variant text-xl">close</span> AI Professor Analysis</li>
                </ul>
                <button 
                  onClick={onGoToLogin}
                  className="w-full py-4 rounded-full border-2 border-primary text-primary font-bold font-headline hover:bg-primary-container transition-all"
                >
                  Start for Free
                </button>
              </div>

              {/* Standard Plan */}
              <div className="bg-primary hover:bg-primary/95 text-on-primary rounded-[2.5rem] p-12 shadow-2xl relative transform md:-translate-y-4 transition-all">
                <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide">Most Popular</div>
                <h3 className="text-2xl font-bold font-headline mb-2">Standard</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-extrabold">$100</span>
                  <span className="text-primary-container font-label font-medium uppercase tracking-wide">/ one-time</span>
                </div>
                <p className="text-primary-container mb-8 text-sm">Unlock the full power of standard academic intelligence.</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-white text-xl">check</span> Advanced Syllabus Syncing</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-white text-xl">check</span> AI Professor (Standard Queries)</li>
                  <li className="flex items-center gap-3 text-sm"><span className="material-symbols-outlined text-white text-xl">check</span> Priority Support</li>
                </ul>
                <button 
                  onClick={async () => {
                    try {
                      const res = await fetch('http://localhost:3001/api/create-checkout-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ plan: 'standard' }),
                      });
                      const data = await res.json();
                      if (data.url) window.location.href = data.url;
                    } catch (e) {
                      console.error('Failed to checkout:', e);
                    }
                  }}
                  className="w-full py-4 rounded-full bg-white text-primary font-extrabold font-headline shadow-lg hover:shadow-xl active:scale-95 transition-all"
                >
                  Get Standard
                </button>
              </div>

              {/* Pro Plan */}
              <div className="bg-surface-container-lowest rounded-[2.5rem] p-10 shadow-sm border border-outline-variant/20 hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all"></div>
                <h3 className="text-2xl font-bold font-headline mb-2 text-on-surface">Pro</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-extrabold text-on-surface">$150</span>
                  <span className="text-on-surface-variant font-label font-medium uppercase tracking-wide">/ one-time</span>
                </div>
                <p className="text-on-surface-variant mb-8 text-sm">For top-tier scholars needing profound analytical capability.</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm text-on-surface"><span className="material-symbols-outlined text-secondary text-xl">check</span> Everything in Standard</li>
                  <li className="flex items-center gap-3 text-sm text-on-surface"><span className="material-symbols-outlined text-secondary text-xl">check</span> Unlimited AI Professor Deep-Dives</li>
                  <li className="flex items-center gap-3 text-sm text-on-surface"><span className="material-symbols-outlined text-secondary text-xl">check</span> Predictive Exam Modeling</li>
                </ul>
                <button 
                  onClick={async () => {
                    try {
                      const res = await fetch('http://localhost:3001/api/create-checkout-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ plan: 'pro' }),
                      });
                      const data = await res.json();
                      if (data.url) window.location.href = data.url;
                    } catch (e) {
                      console.error('Failed to checkout:', e);
                    }
                  }}
                  className="w-full py-4 rounded-full border-2 border-secondary text-secondary font-bold font-headline hover:bg-secondary-container transition-all"
                >
                  Go Pro
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-8">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary to-primary-dim rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <img alt="Academic patterns and textures" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhP6QypHm4PXlHSAq9c6AkMUSw52aGDyTxV5G0JgJPjLBOiKnJ6AjTvPLdOo4vd5uFP-j2jBoAaHSHbWbreanOKE2sZoGIaJo4OFH5WYn0iHlGtIQtnT2DHgJwJ1NsyE3bhIBp5gcbdnYpXWJ2H4hC49q7H7S1DN2pZVYPHzQiNZO2clSx9Mlz6YPLsveKForZ_wcwVkLscQgbhP4iZh-0HDNz-WLtkIkS6Y2fVH0r90XUnSXDmKXTf1YPT6ky3pPDkozzUx45hvI"/>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-on-primary mb-8">Ready to Elevate Your Academic Journey?</h2>
              <p className="text-primary-container text-xl mb-12 max-w-2xl mx-auto">Join over 1.2 million students who have transformed their study habits with the power of Academic Intelligence.</p>
              <div className="flex flex-wrap justify-center gap-6">
                <button 
                  onClick={onGoToLogin}
                  className="px-10 py-5 bg-white text-primary rounded-full font-headline font-extrabold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Get Started for Free
                </button>
                <button className="px-10 py-5 border-2 border-white/30 text-white rounded-full font-headline font-bold text-lg hover:bg-white/10 transition-all">
                  Contact Academic Advisor
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-8 bg-slate-50 dark:bg-slate-950 tonal-shift-bg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-sky-700 text-3xl">school</span>
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-sky-900 dark:text-sky-100">Study Mitra</span>
            </div>
            <p className="font-['Manrope'] text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              © 2024 Study Mitra. Your Academic Curator. We empower students through advanced intelligence and focused design.
            </p>
          </div>
          <div>
            <h4 className="font-headline font-bold text-on-surface mb-6">Product</h4>
            <ul className="space-y-4 font-['Manrope'] text-sm">
              <li><a className="text-slate-500 hover:text-sky-600 hover:translate-x-1 transition-all inline-block" href="#">Curator Dashboard</a></li>
              <li><a className="text-slate-500 hover:text-sky-600 hover:translate-x-1 transition-all inline-block" href="#">AI Professor</a></li>
              <li><a className="text-slate-500 hover:text-sky-600 hover:translate-x-1 transition-all inline-block" href="#">Timetable</a></li>
              <li><a className="text-slate-500 hover:text-sky-600 hover:translate-x-1 transition-all inline-block" href="#">Resource Library</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold text-on-surface mb-6">Support</h4>
            <ul className="space-y-4 font-['Manrope'] text-sm">
              <li><a className="text-slate-500 hover:text-sky-600 hover:translate-x-1 transition-all inline-block" href="#">Privacy Policy</a></li>
              <li><a className="text-slate-500 hover:text-sky-600 hover:translate-x-1 transition-all inline-block" href="#">Terms of Service</a></li>
              <li><a className="text-slate-500 hover:text-sky-600 hover:translate-x-1 transition-all inline-block" href="#">Help Center</a></li>
              <li><a className="text-slate-500 hover:text-sky-600 hover:translate-x-1 transition-all inline-block" href="#">Community Forum</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold text-on-surface mb-6">Newsletter</h4>
            <p className="text-sm text-slate-600 mb-4">Get weekly study tips curated by our AI Professor.</p>
            <div className="flex flex-col gap-3">
              <input className="bg-surface border-outline-variant/30 rounded-xl px-4 py-2 focus:ring-primary focus:border-primary" placeholder="Email Address" type="email"/>
              <button className="bg-primary text-white py-2 rounded-xl font-bold font-headline hover:opacity-90">Subscribe</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
