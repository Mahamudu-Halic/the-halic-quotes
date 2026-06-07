export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  coverImage?: string;
  content: string; // HTML or rich text markup
  author: string;
}

export const ALL_POSTS: BlogPost[] = [
  {
    slug: 'the-science-of-motivation-breaking-the-procrastination-cycle',
    title: 'The Science of Motivation: Breaking the Procrastination Cycle',
    excerpt: 'Understand how dopamine pathways regulate our drive, and learn how to lower the bar of starting to bypass mental paralysis.',
    date: 'June 1, 2026',
    readTime: '5 min read',
    category: 'Science',
    author: 'Halic Mahamudu',
    content: `
      <p class="lead text-lg text-slate-600 dark:text-slate-300 mb-6 font-sans">
        We often treat procrastination as a character flaw or a symptom of laziness. But neuroscience tells a very different story: procrastination is an emotional regulation problem, governed by dopamine pathways and the survival mechanisms of our ancient brain.
      </p>
      
      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">The Dopamine Delusion</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        Dopamine is commonly misunderstood as the "pleasure chemical." In reality, dopamine is the chemical of <strong>anticipation and motivation</strong>. It spikes not when we receive a reward, but when we <em>anticipate</em> it. 
      </p>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        When you contemplate a complex task (like writing a report or building a software feature), your brain evaluates the friction. If the immediate reward is low and the immediate stress is high, your brain seeks a quick dopamine hit elsewhere—checking social media, organizing your desk, or reading news. The amygdala (the brain's emotional threat detector) hijacks the prefrontal cortex (the rational planner), choosing short-term emotional relief over long-term benefit.
      </p>

      <div class="my-6 p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10">
        <h3 class="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">Key Neuroscientific Fact</h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic">
          "Procrastination is an immediate coping mechanism for stress. Your amygdala perceives the task as a threat (of failure, boredom, or frustration) and urges your body to flee to safety (a distraction)."
        </p>
      </div>

      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">How to Reset the Amygdala: The 5-Minute Rule</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        To break this cycle, you must bypass the cognitive friction of starting. The human brain is incredibly sensitive to transitions. The biggest surge of resistance happens in the transition from <em>doing nothing</em> to <em>doing something</em>. Once we begin, momentum takes over.
      </p>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        <strong>The 5-Minute Rule:</strong> Tell yourself you are only going to work on the task for exactly five minutes. If you want to stop after five minutes, you are fully allowed to stop. 
      </p>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        By lowering the bar of entry so low, you convince your amygdala that the task is not a threat. In 80% of cases, once you start, the brain adapts, dopamine begins to flow, and you will choose to keep going.
      </p>

      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">3 Daily Steps to Build High-Drive Pathways</h2>
      <ul class="list-decimal pl-6 text-slate-600 dark:text-slate-400 mb-6 flex flex-col gap-3">
        <li>
          <strong>Reduce Environmental Friction:</strong> Clean your workspace and open the required application files the night before. Make the next action require zero cognitive setup.
        </li>
        <li>
          <strong>Delay Instant Gratification:</strong> Train your dopamine receptors. Instead of checking your phone first thing in the morning, complete a high-leverage task for 45 minutes, using your phone as a rewards-based incentive.
        </li>
        <li>
          <strong>Frame Tasks as 'Micro-Milestones':</strong> Instead of "Write research paper," write "Write one bullet-point outline of page 1." Shrinking the scope minimizes threat perception.
        </li>
      </ul>

      <blockquote class="border-l-4 border-purple-500 pl-4 py-1 my-6 italic text-slate-600 dark:text-slate-300">
        "Action is not the effect of motivation; it is the cause of it." — Christian Neill
      </blockquote>
    `
  },
  {
    slug: 'stoic-discipline-timeless-reflections-from-marcus-aurelius',
    title: 'Stoic Discipline: Timeless Reflections from Marcus Aurelius',
    excerpt: 'Deep dive into Meditations, focusing on how separating external events from internal reactions builds unwavering mental toughness.',
    date: 'May 28, 2026',
    readTime: '7 min read',
    category: 'Philosophy',
    author: 'Halic Mahamudu',
    content: `
      <p class="lead text-lg text-slate-600 dark:text-slate-300 mb-6 font-sans">
        Written in army camps while defending the Roman Empire, the journal entries of Emperor Marcus Aurelius were never meant for publication. Instead, they served as a self-corrective guidebook on resilience, duty, and discipline.
      </p>
      
      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">The Dichotomy of Control</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        At the heart of Stoicism lies a singular, powerful filter: the dichotomy of control. Stoics divide all aspects of life into two categories:
      </p>
      <ol class="list-decimal pl-6 text-slate-600 dark:text-slate-400 mb-6 flex flex-col gap-2">
        <li>Things within our control (our thoughts, reactions, actions, and values).</li>
        <li>Things outside of our control (reputation, economy, other people's behavior, weather, and the past).</li>
      </ol>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        Marcus Aurelius wrote that mental suffering stems not from external events, but from our internal estimations of them. When you separate the raw facts of a situation from the narrative your mind spins, you reclaim your agency.
      </p>

      <div class="my-6 p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10">
        <h3 class="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">Reflections from Meditations</h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic">
          "You have power over your mind - not outside events. Realize this, and you will find strength." — Marcus Aurelius, Meditations
        </p>
      </div>

      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">Overcoming the Morning Resistance</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        One of the most human passages in <em>Meditations</em> is Marcus Aurelius debating with himself about waking up early. He writes:
      </p>
      <p class="italic text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl mb-4">
        "At dawn, when you have trouble getting out of bed, tell yourself: 'I have to go to work — as a human being. What do I have to complain of, if I'm going to do what I was born for?' Or is this what I was created for? To huddle under the blankets and keep warm?"
      </p>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        For Marcus Aurelius, discipline was not about depriving oneself of pleasure; it was about fulfilling one's duty to the community and to oneself. The comfort of the bed was pleasant, but staying there was a refusal of one's purpose.
      </p>

      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">Practical Stoic Exercises for Daily Grit</h2>
      <ul class="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-6 flex flex-col gap-3">
        <li>
          <strong>Premeditatio Malorum (The Premeditation of Evils):</strong> Every morning, visualize potential challenges, delays, or rude behaviors you might encounter today. Rehearse your calm, composed response in advance.
        </li>
        <li>
          <strong>The View from Above:</strong> When stressed by minor problems, mentally zoom out. Look at your neighborhood, your city, your country, and finally the planet. Realize how temporary and tiny your concerns are in the cosmic context.
        </li>
        <li>
          <strong>Voluntary Discomfort:</strong> Intentionally choose a slightly harder path—take a cold shower, opt for a simple meal, or walk instead of taking a cab. Training your mind to handle minor discomforts immunizes you against major crises.
        </li>
      </ul>
    `
  },
  {
    slug: 'creating-a-vision-board-that-actually-triggers-action',
    title: 'Creating a Vision Board That Actually Triggers Action',
    excerpt: 'Vision boards fail when they represent passive daydreaming. Learn how to pair goals with immediate micro-milestones.',
    date: 'May 15, 2026',
    readTime: '4 min read',
    category: 'Guides',
    author: 'Halic Mahamudu',
    content: `
      <p class="lead text-lg text-slate-600 dark:text-slate-300 mb-6 font-sans">
        Most vision boards are setups for disappointment. They are plastered with luxury mansions, white sand beaches, and dream cars—images that inspire passive fantasy, but do absolutely nothing to prompt the labor needed to acquire them.
      </p>
      
      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">The Psychology of Daydreaming</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        Psychologists at NYU found that when you fantasize about an idealized future outcome, your brain produces a physiological response as if you have <em>already achieved</em> that goal. Your systolic blood pressure drops, your muscle tension decreases, and your overall energy levels recede. 
      </p>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        Essentially, passive vision boards trick your neurochemistry into relaxing. You get the emotional satisfaction of the goal without ever taking the first step.
      </p>

      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">Introducing Mental Contrasting: The WOOP Method</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        To create a board that drives execution, you must pair the vision of the goal with the reality of the obstacle. This is known as <strong>Mental Contrasting</strong>. 
      </p>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        We can apply this using the WOOP framework designed by psychologist Gabriele Oettingen:
      </p>
      <ul class="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-6 flex flex-col gap-2">
        <li><strong>W</strong>ish: What is your primary, meaningful goal?</li>
        <li><strong>O</strong>utcome: What does the successful completion of that wish look like?</li>
        <li><strong>O</strong>bstacle: What is the main internal or external block that will try to stop you?</li>
        <li><strong>P</strong>lan: What concrete action will you take when that obstacle presents itself? (If-Then planning).</li>
      </ul>

      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">Designing an Active Vision Board</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        When structuring your physical or digital board:
      </p>
      <ol class="list-decimal pl-6 text-slate-600 dark:text-slate-400 mb-6 flex flex-col gap-3">
        <li>
          <strong>Include the Process, Not Just the Prize:</strong> If your goal is a marathon finish line, place a picture of someone running in the freezing rain next to it. If it is building an app, add a graphic of code editor layouts.
        </li>
        <li>
          <strong>Define the 'If-Then' Cards:</strong> Place written statements on your board. For example: <em>"IF I feel too tired to work on my startup at 6 PM, THEN I will open my editor for just 5 minutes."</em>
        </li>
        <li>
          <strong>Scale Daily Wins:</strong> Place a small checklist grid directly in the center. Use visual checkpoints to log your daily consistency.
        </li>
      </ol>

      <blockquote class="border-l-4 border-purple-500 pl-4 py-1 my-6 italic text-slate-600 dark:text-slate-300">
        "The best way to predict your future is to create it, step by painful step."
      </blockquote>
    `
  },
  {
    slug: 'micro-habits-the-atomic-approach-to-personal-change',
    title: 'Micro-Habits: The Atomic Approach to Personal Change',
    excerpt: 'Building massive change doesn\'t require massive willpower. Learn how to anchor tiny, 2-minute behaviors to your routine.',
    date: 'June 5, 2026',
    readTime: '4 min read',
    category: 'Guides',
    author: 'Halic Mahamudu',
    content: `
      <p class="lead text-lg text-slate-600 dark:text-slate-300 mb-6 font-sans">
        We often believe that key changes require radical actions. We wait for a massive surge of willpower or a major life event to begin. In reality, sustained change is almost entirely a game of margins—forged by tiny, atomic micro-habits.
      </p>
      
      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">The Fallacy of Willpower</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        Willpower is a finite emotional resource. It drains as we make decisions, fight traffic, or work through complex tasks. If your routine depends on feeling highly motivated or exerting extreme willpower, it will inevitably break when life gets stressful.
      </p>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        Habits, on the other hand, are stored in the basal ganglia—the brain's automatic processing center. Once a behavior becomes automatic, it bypasses the prefrontal cortex, requiring almost zero decision-making energy to execute.
      </p>

      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">The 2-Minute Rule</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        To build a micro-habit, you must scale your desired behavior down until it takes **two minutes or less** to perform. 
      </p>
      <ul class="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-6 flex flex-col gap-2">
        <li>Instead of: "Read one book a week," scale to: "Read one page before sleeping."</li>
        <li>Instead of: "Do 30 minutes of yoga," scale to: "Roll out my yoga mat."</li>
        <li>Instead of: "Write a journal entry," scale to: "Write one sentence about today."</li>
      </ul>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        This prevents starting resistance. Once the action becomes a consistent trigger, you naturally expand the duration.
      </p>

      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">Habit Stacking: The Ultimate Routine Anchor</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        The best way to build a new habit is to stack it onto an existing, solid trigger. The formula is:
      </p>
      <p class="italic text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl mb-4 font-sans font-semibold">
        "After I [CURRENT HABIT], I will [NEW MICRO-HABIT]."
      </p>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        For instance: <em>"After I pour my morning coffee, I will write down the single most important task for today."</em> Or: <em>"After I close my work laptop, I will complete 10 pushups."</em> This leverages established brain pathways to secure the new habit.
      </p>
    `
  },
  {
    slug: 'neuroscience-of-focus-minimizing-workspace-friction',
    title: 'The Neuroscience of Focus: Minimizing Workspace Friction',
    excerpt: 'Attention switching leaves a cognitive residue that slows you down. Learn how to design a high-drive environment.',
    date: 'June 4, 2026',
    readTime: '6 min read',
    category: 'Science',
    author: 'Halic Mahamudu',
    content: `
      <p class="lead text-lg text-slate-600 dark:text-slate-300 mb-6 font-sans">
        In an era of notifications, multi-monitor setups, and instant messaging, focus is no longer a natural state. It is an active skill that requires strategic structural support.
      </p>
      
      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">Attention Residue and Context Switching</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        When you switch from Task A (deep programming or designing) to quickly check Task B (Slack or an email notification), your brain does not immediately transition. A portion of your attention remains stuck on Task B for up to 20 minutes. 
      </p>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        This is what computer scientist Cal Newport refers to as **attention residue**. If you check messages every 15 minutes, you spend your entire day in a state of cognitive division, dramatically reducing your ability to perform complex work.
      </p>

      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">The Friction Baseline</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        Your brain will always seek the path of least resistance. To protect your focus, you must intentionally introduce **friction to negative habits** and **reduce friction for positive ones**.
      </p>
      <ul class="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-6 flex flex-col gap-2.5">
        <li><strong>Friction for Distractions:</strong> Move your phone to another room while working. Block social websites using hosts files or browser extensions. Log out of social apps so you must type a password to enter.</li>
        <li><strong>Flow for Focus:</strong> Set up your workspace the night before. Keep your desk clean. Have your code editor, documentation, and browser tabs open and ready so there is zero setup friction when you start.</li>
      </ul>

      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">Ultradian Rhythms: Wavelengths of Deep Work</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        Human brains operate on 90-to-120 minute biological cycles called **ultradian rhythms**. Trying to push past 90 minutes of high-intensity focus triggers fatigue and a sharp decrease in performance.
      </p>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        Divide your day into 90-minute focus cycles. Once the cycle finishes, take 15-20 minutes of active recovery—walk around, stretch, or drink water. Refrain from checking your phone during recovery, as it denies your brain the rest it requires.
      </p>
    `
  },
  {
    slug: 'the-growth-mindset-rewiring-your-brain-for-challenges',
    title: 'The Growth Mindset: Rewiring Your Brain for Challenges',
    excerpt: 'Neuroplasticity proves that the brain physically grows when we struggle with hard tasks. Embrace the "not yet".',
    date: 'June 3, 2026',
    readTime: '5 min read',
    category: 'Philosophy',
    author: 'Halic Mahamudu',
    content: `
      <p class="lead text-lg text-slate-600 dark:text-slate-300 mb-6 font-sans">
        How do you react when you encounter a complex programming bug, a difficult project, or a setback? Your reaction depends entirely on whether you have a fixed mindset or a growth mindset.
      </p>
      
      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">Fixed vs. Growth Mindset</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        Popularized by Stanford psychologist Carol Dweck:
      </p>
      <ul class="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-6 flex flex-col gap-2">
        <li><strong>Fixed Mindset:</strong> Believes that intelligence, talent, and ability are static traits. You are either good at something or you are not. Hard work is viewed as a sign of weakness (if you were smart, it would be easy).</li>
        <li><strong>Growth Mindset:</strong> Believes that intelligence and abilities can be developed over time through effort, strategy, and persistence. Challenges are opportunities to grow.</li>
      </ul>

      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">Neuroplasticity: The Rewiring Process</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        Mindset is not just self-help advice; it is rooted in biology. Our brains have a property called **neuroplasticity**—the physical ability of the brain to form new neural connections and strengthen existing ones.
      </p>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        When you work on a task that is just beyond your current capability and you struggle, your brain cells fire in new ways. The brain wraps these active neural pathways in myelin, a protective sheath that speeds up electrical signals. Struggling with a task is the physical sign that your brain is reconfiguring itself to become smarter.
      </p>

      <blockquote class="border-l-4 border-purple-500 pl-4 py-1 my-6 italic text-slate-600 dark:text-slate-300">
        "Praising someone's intelligence makes them fragile. Praising their strategies and effort makes them resilient."
      </blockquote>

      <h2 class="text-2xl font-bold font-display text-slate-900 dark:text-slate-50 mt-8 mb-4">The Power of "Not Yet"</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        When Dweck studied high school grading systems, she found that one school gave grades of "A", "B", "C", and **"Not Yet"** instead of "F".
      </p>
      <p class="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        "Not Yet" changes the relationship with failure. If you fail, you feel you are nothing. If you are "Not Yet," you understand you are on a learning curve. Remind yourself: you haven't mastered the task *yet*, but you are actively building the path to do so.
      </p>
    `
  }
];

// Helper to determine active posts based on current time
// We group dates into 3-day intervals since a fixed epoch (January 1, 2026).
export function getActivePosts(): BlogPost[] {
  if (typeof window === 'undefined') {
    // During build or SSR, return a static initial set to avoid build discrepancies
    return ALL_POSTS.slice(0, 3);
  }

  const epoch = new Date('2026-01-01').getTime();
  const millisecondsIn3Days = 3 * 24 * 60 * 60 * 1000;
  
  // Calculate index offset based on current time
  const intervalIndex = Math.floor((Date.now() - epoch) / millisecondsIn3Days);
  
  const postsCount = ALL_POSTS.length;
  const activePosts: BlogPost[] = [];
  
  // Select 3 posts dynamically by shifting the index
  for (let i = 0; i < Math.min(3, postsCount); i++) {
    const index = (intervalIndex + i) % postsCount;
    activePosts.push(ALL_POSTS[index]);
  }
  
  return activePosts;
}

// Keep the POSTS export pointing to ALL_POSTS so dynamic slug route lookups don't break
export const POSTS = ALL_POSTS;
