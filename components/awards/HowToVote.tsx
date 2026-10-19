import React from 'react';
import { motion } from 'framer-motion';
import { riseIn, staggerParent } from './motion';

const STEPS = [
  { icon: 'search', title: 'Find your nominee', text: 'Browse a category, or type the nominee code printed on their poster.' },
  { icon: 'how_to_vote', title: 'Choose your votes', text: 'Pick how many votes you want to give. The total is shown before you pay.' },
  { icon: 'smartphone', title: 'Enter your number', text: 'Your mobile number is used for the payment and stored only as a one-way hash.' },
  { icon: 'verified', title: 'Confirm payment', text: 'Your votes count as soon as the payment is confirmed. You get a receipt.' },
];

/** The four voting steps, revealed one after another as they scroll into view. */
const HowToVote: React.FC = () => (
  <section aria-labelledby="how-to-vote">
    <h2 id="how-to-vote" className="mb-4 text-xl font-black text-[#111418] dark:text-white">
      How to vote
    </h2>
    <motion.ol
      variants={staggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
    >
      {STEPS.map((step, i) => (
        <motion.li
          key={step.title}
          variants={riseIn}
          className="relative rounded-2xl border-2 border-[#e5e7eb] bg-white p-4 dark:border-white/10 dark:bg-[#14181c]"
        >
          <span className="absolute -top-3 left-4 rounded-full bg-primary px-2.5 py-0.5 text-xs font-black text-white">
            Step {i + 1}
          </span>
          <span className="material-symbols-outlined mt-1 text-3xl text-ghana-green" aria-hidden="true">
            {step.icon}
          </span>
          <p className="mt-1 font-black text-[#111418] dark:text-white">{step.title}</p>
          <p className="mt-1 text-sm text-[#617289] dark:text-gray-400">{step.text}</p>
        </motion.li>
      ))}
    </motion.ol>
  </section>
);

export default HowToVote;
