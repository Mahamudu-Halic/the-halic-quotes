import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AUTHORS = [
  {
    name: 'Steve Jobs',
    bio: 'Co-founder of Apple Inc., pioneer of the personal computer revolution, and visionary business leader known for his creative design philosophies.',
  },
  {
    name: 'Winston Churchill',
    bio: 'British statesman, soldier, and writer who served as Prime Minister of the United Kingdom during the Second World War.',
  },
  {
    name: 'Oprah Winfrey',
    bio: 'American talk show host, television producer, actress, author, and philanthropist, renowned for her empathetic communication style.',
  },
  {
    name: 'Nelson Mandela',
    bio: 'South African anti-apartheid revolutionary, political leader, and philanthropist who served as President of South Africa from 1994 to 1999.',
  },
  {
    name: 'Maya Angelou',
    bio: 'American memoirist, popular poet, and civil rights activist whose works are widely read and studied around the world.',
  },
  {
    name: 'Marcus Aurelius',
    bio: 'Roman Emperor and Stoic philosopher, known for his personal journals "Meditations" that offer timeless reflections on duty and discipline.',
  },
  {
    name: 'Albert Einstein',
    bio: 'Theoretical physicist who developed the theory of relativity, widely considered one of the greatest scientists and thinkers of all time.',
  },
];

const QUOTES = [
  {
    content: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Success",
    mood: "Motivated",
    tags: "passion, greatness, work",
    isPopular: true,
    isTrending: true,
  },
  {
    content: "Have the courage to follow your heart and intuition. They somehow already know what you truly want to become. Everything else is secondary.",
    author: "Steve Jobs",
    category: "Productivity",
    mood: "Motivated",
    tags: "courage, intuition, vision",
    isPopular: true,
  },
  {
    content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Success",
    mood: "Stressed",
    tags: "courage, perseverance, failure",
    isPopular: true,
    isTrending: true,
  },
  {
    content: "If you are going through hell, keep going.",
    author: "Winston Churchill",
    category: "Discipline",
    mood: "Sad",
    tags: "grit, endurance, resilience",
    isPopular: true,
  },
  {
    content: "The biggest adventure you can take is to live the life of your dreams.",
    author: "Oprah Winfrey",
    category: "Growth",
    mood: "Happy",
    tags: "adventure, dreams, lifestyle",
    isPopular: true,
  },
  {
    content: "You become what you believe. My philosophy is that you are responsible for your own life.",
    author: "Oprah Winfrey",
    category: "Confidence",
    mood: "Confused",
    tags: "belief, responsibility, growth",
    isPopular: true,
    isTrending: true,
  },
  {
    content: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    category: "Leadership",
    mood: "Tired",
    tags: "possibility, achievement, victory",
    isPopular: true,
    isTrending: true,
  },
  {
    content: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
    category: "Leadership",
    mood: "Sad",
    tags: "resilience, rising, strength",
    isPopular: true,
  },
  {
    content: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.",
    author: "Maya Angelou",
    category: "Relationships",
    mood: "Happy",
    tags: "empathy, impact, feeling",
    isPopular: true,
  },
  {
    content: "You may not control all the events that happen to you, but you can decide not to be reduced by them.",
    author: "Maya Angelou",
    category: "Growth",
    mood: "Stressed",
    tags: "attitude, agency, strength",
    isPopular: true,
    isTrending: true,
  },
  {
    content: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    category: "Discipline",
    mood: "Stressed",
    tags: "mindset, control, stoicism",
    isPopular: true,
    isTrending: true,
  },
  {
    content: "The happiness of your life depends upon the quality of your thoughts.",
    author: "Marcus Aurelius",
    category: "Happiness",
    mood: "Happy",
    tags: "thoughts, perception, mindset",
    isPopular: true,
  },
  {
    content: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "Education",
    mood: "Confused",
    tags: "difficulty, opportunity, perspective",
    isPopular: true,
  },
  {
    content: "A person who never made a mistake never tried anything new.",
    author: "Albert Einstein",
    category: "Education",
    mood: "Confused",
    tags: "learning, mistakes, trying",
    isPopular: true,
    isTrending: true,
  },
  {
    content: "Do not let making a living prevent you from making a life.",
    author: "Steve Jobs",
    category: "Life Lessons",
    mood: "Tired",
    tags: "balance, priorities, lifestyle",
    isPopular: false,
  },
  {
    content: "Faith is taking the first step even when you don't see the whole staircase.",
    author: "Nelson Mandela",
    category: "Faith",
    mood: "Confused",
    tags: "faith, steps, belief",
    isPopular: true,
  },
];

async function main() {
  console.log('Seeding authors...');
  for (const author of AUTHORS) {
    // We update author profiles or seed if they don't exist in existing quotes
  }

  console.log('Seeding quotes...');
  for (const quote of QUOTES) {
    const authorBio = AUTHORS.find((a) => a.name === quote.author)?.bio || null;
    await prisma.quote.create({
      data: {
        content: quote.content,
        author: quote.author,
        category: quote.category,
        mood: quote.mood,
        tags: quote.tags,
        isPopular: quote.isPopular,
        isTrending: quote.isTrending ?? false,
        authorBio: authorBio,
      },
    });
  }

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
