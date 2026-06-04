'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MessageSquare, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!name || !email || !message) return;
  //   setSubmitted(true);
  //   setName('');
  //   setEmail('');
  //   setMessage('');
  //   setTimeout(() => setSubmitted(false), 5000);
  // };

  return (
    <>
      <Navbar />

      <main className="grow hero-gradient py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">

          {/* Info Column */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-extrabold font-display text-slate-900 dark:text-slate-50 mb-2">
                Get in Touch
              </h1>
              <p className="text-xs text-slate-500">
                Have questions about our API, premium tiers, or want to contribute quotes? We would love to hear from you.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-xs mt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Email Us</span>
                  <a href="mailto:mahamuduhalic.official@gmail.com" target="_blank" rel="noopener noreferrer"
                    className="text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 underline">
                    mahamuduhalic.official@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Community Discord</span>
                  <a href="https://discord.gg/m3zhsZaW" target="_blank" rel="noopener noreferrer"
                    className="text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 underline">
                    discord.gg/m3zhsZaW
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Headquarters</span>
                  <span className="text-slate-500">San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          {/* <div className="md:col-span-2">
            <div className="glass-card p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Message Received!</h3>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Thank you for reaching out. A team member will respond to your inquiry within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-900/50 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-xs focus:border-purple-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-slate-500">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-900/50 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-xs focus:border-purple-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-500">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-900/50 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 outline-none text-xs focus:border-purple-500 resize-none"
                      placeholder="How can we help you today?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-purple-500/10"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div> */}

        </div>
      </main>

      <Footer />
    </>
  );
}
