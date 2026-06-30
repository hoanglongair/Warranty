"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/data/faqs";

export function TestimonialsSection() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-pink-400">
            Testimonials
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Loved by <span className="gradient-text">thousands</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/60">
            See what our community has to say about their Warranty experience.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="glass-card hover-lift relative h-full p-6">
                <div className="absolute -right-4 -top-4 text-7xl text-violet-500/10 font-serif leading-none">
                  &quot;
                </div>
                
                <div className="relative">
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  
                  <p className="mt-4 text-sm leading-relaxed text-white/70">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 font-bold text-white">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-white/50">
                        {testimonial.role}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <div className="glass-card p-8 text-center">
            <div className="flex items-center justify-center gap-8">
              {[
                { value: "4.9", label: "Average Rating" },
                { value: "98%", label: "Satisfaction" },
                { value: "50K+", label: "Reviews" }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
