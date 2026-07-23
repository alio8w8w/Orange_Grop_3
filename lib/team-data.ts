// ---------------------------------------------------------------------------
// Mock "Supabase" data layer.
//
// Swap `getTeamMembers()` with your real Supabase fetch later, e.g.:
//
//   const { data } = await supabase.from('team_members').select('*')
//   return data as TeamMember[]
//
// Keep the TypeScript shapes below in sync with your database columns and the
// rest of the UI will work unchanged.
// ---------------------------------------------------------------------------

export type ThemeVariant = 1 | 2 | 3 | 4 | 5 | 6

export interface Skill {
  name: string
  level: number // 0 - 100
  category: string
}

export interface PortfolioWork {
  id: string
  title: string
  category: string
  year: string
  image: string
  description: string
}

export interface Contacts {
  email: string
  phone: string
  website: string
  location: string
}

export interface EducationEntry {
  period: string
  school: string
  degree: string
  detail: string
}

export interface ExperienceStats {
  years: number
  projects: number
  clients: number
  awards: number
}

export interface TeamMember {
  id: string
  firstName: string
  lastName: string
  role: string
  tagline: string
  bio: string
  contacts: Contacts
  profilePicture: string
  teamPhoto: string // shared across the whole team
  education: EducationEntry[]
  experienceStats: ExperienceStats
  skills: Skill[]
  portfolioWorks: PortfolioWork[]
  themeVariant: ThemeVariant
}

export interface TeamProject {
  id: string
  title: string
  category: string
  year: string
  image: string
  description: string
}

/** Collective mission copy shown in the landing "About Us" section. */
export const teamAbout = {
  heading: 'One team, six disciplines, a single obsession with craft.',
  paragraphs: [
    'Orange Group 3 is a six-person creative collective spanning brand, motion, photography, illustration, product and type design. We came together to prove that a small, focused team can out-think and out-make studios many times our size.',
    'Every project we take on is a shared endeavour. We trade skills, critique fearlessly and ship work that is sharper for having passed through six pairs of hands.',
  ],
  values: [
    { label: 'Craft first', detail: 'Details are never negotiable.' },
    { label: 'Bold by default', detail: 'Safe work is forgettable work.' },
    { label: 'Together always', detail: 'Six perspectives, one direction.' },
  ],
}

/** Projects the whole team built together — shown in "Common Projects". */
export const teamProjects: TeamProject[] = [
  {
    id: 'tp-1',
    title: 'Ember Festival',
    category: 'Brand · Motion · Print',
    year: '2025',
    image: '/images/work-1.png',
    description:
      'A full identity, motion package and on-site signage system for a three-day arts festival.',
  },
  {
    id: 'tp-2',
    title: 'Halo Product Launch',
    category: 'Product · Film · Photography',
    year: '2025',
    image: '/images/work-4.png',
    description:
      'End-to-end launch campaign for a consumer hardware brand, from UX to launch film.',
  },
  {
    id: 'tp-3',
    title: 'Type Anthology',
    category: 'Editorial · Illustration',
    year: '2024',
    image: '/images/work-3.png',
    description:
      'A limited-run printed anthology celebrating experimental typography and pattern.',
  },
  {
    id: 'tp-4',
    title: 'Civic Wayfinding',
    category: 'Environmental · Systems',
    year: '2024',
    image: '/images/work-7.png',
    description:
      'A city-wide wayfinding and signage program built on an accessible design system.',
  },
]

const TEAM_PHOTO = '/images/team-photo.png'

export const teamMembers: TeamMember[] = [
  {
    id: 'aaron-loeb',
    firstName: 'Aaron',
    lastName: 'Loeb',
    role: 'Brand Designer',
    tagline: 'Building crisp, confident brand systems.',
    bio: 'Aaron leads brand identity at Orange Group 3, translating fuzzy ideas into sharp visual languages. He believes great design is invisible until you take it away.',
    contacts: {
      email: 'aaron@orangegroup3.com',
      phone: '+1 (123) 456-7890',
      website: 'orangegroup3.com/aaron',
      location: 'New York, NY',
    },
    profilePicture: '/images/profile-1.png',
    teamPhoto: TEAM_PHOTO,
    themeVariant: 1,
    education: [
      {
        period: '2014 — 2018',
        school: 'Rhode Island School of Design',
        degree: 'BFA, Graphic Design',
        detail: 'Focused on identity systems and editorial typography.',
      },
      {
        period: '2018 — 2019',
        school: 'Type@Cooper',
        degree: 'Postgraduate Certificate, Typeface Design',
        detail: 'Intensive study of type anatomy and variable fonts.',
      },
    ],
    experienceStats: { years: 8, projects: 120, clients: 45, awards: 6 },
    skills: [
      { name: 'Brand Identity', level: 95, category: 'Design' },
      { name: 'Typography', level: 90, category: 'Design' },
      { name: 'Art Direction', level: 85, category: 'Strategy' },
      { name: 'Figma', level: 92, category: 'Tools' },
    ],
    portfolioWorks: [
      {
        id: 'w1-1',
        title: 'Northwind Rebrand',
        category: 'Brand Identity',
        year: '2025',
        image: '/images/work-1.png',
        description:
          'A full identity overhaul for a logistics startup, from wordmark to motion system.',
      },
      {
        id: 'w1-2',
        title: 'Kiosk Signage System',
        category: 'Environmental',
        year: '2024',
        image: '/images/work-2.png',
        description: 'Wayfinding and signage for a network of urban retail kiosks.',
      },
      {
        id: 'w1-3',
        title: 'Loeb Type Specimen',
        category: 'Typography',
        year: '2024',
        image: '/images/work-3.png',
        description: 'An experimental variable typeface released as an open specimen.',
      },
    ],
  },
  {
    id: 'mara-vinh',
    firstName: 'Mara',
    lastName: 'Vinh',
    role: 'Motion Designer',
    tagline: 'Making pixels move with purpose.',
    bio: 'Mara turns static frames into stories. She specializes in kinetic typography, product motion and title sequences with a bold, graphic edge.',
    contacts: {
      email: 'mara@orangegroup3.com',
      phone: '+1 (123) 456-7891',
      website: 'orangegroup3.com/mara',
      location: 'Los Angeles, CA',
    },
    profilePicture: '/images/profile-2.png',
    teamPhoto: TEAM_PHOTO,
    themeVariant: 2,
    education: [
      {
        period: '2013 — 2017',
        school: 'CalArts',
        degree: 'BFA, Experimental Animation',
        detail: 'Explored kinetic typography and motion storytelling.',
      },
      {
        period: '2017 — 2018',
        school: 'School of Motion',
        degree: 'Advanced Motion Design',
        detail: 'Mastered advanced After Effects and 3D pipelines.',
      },
    ],
    experienceStats: { years: 9, projects: 140, clients: 52, awards: 8 },
    skills: [
      { name: 'After Effects', level: 96, category: 'Tools' },
      { name: 'Kinetic Type', level: 92, category: 'Motion' },
      { name: '3D / Blender', level: 78, category: 'Motion' },
      { name: 'Storyboarding', level: 84, category: 'Strategy' },
    ],
    portfolioWorks: [
      {
        id: 'w2-1',
        title: 'Pulse Title Sequence',
        category: 'Motion',
        year: '2025',
        image: '/images/work-4.png',
        description: 'Opening titles for a documentary series on electronic music.',
      },
      {
        id: 'w2-2',
        title: 'Orbit App Launch',
        category: 'Product Motion',
        year: '2025',
        image: '/images/work-5.png',
        description: 'A launch film and in-app micro-interactions for a fintech app.',
      },
      {
        id: 'w2-3',
        title: 'Festival Idents',
        category: 'Broadcast',
        year: '2024',
        image: '/images/work-6.png',
        description: 'A suite of animated idents for a summer arts festival.',
      },
    ],
  },
  {
    id: 'theo-park',
    firstName: 'Theo',
    lastName: 'Park',
    role: 'Photographer',
    tagline: 'Chasing light, one frame at a time.',
    bio: 'Theo documents people and places with a warm, editorial eye. His work spans campaign photography, portraiture and architectural studies.',
    contacts: {
      email: 'theo@orangegroup3.com',
      phone: '+1 (123) 456-7892',
      website: 'orangegroup3.com/theo',
      location: 'Chicago, IL',
    },
    profilePicture: '/images/profile-3.png',
    teamPhoto: TEAM_PHOTO,
    themeVariant: 3,
    education: [
      {
        period: '2012 — 2016',
        school: 'School of the Art Institute of Chicago',
        degree: 'BFA, Photography',
        detail: 'Concentration in editorial and architectural photography.',
      },
      {
        period: '2016 — 2017',
        school: 'ICP New York',
        degree: 'Documentary Practice',
        detail: 'Long-form visual storytelling and reportage.',
      },
    ],
    experienceStats: { years: 11, projects: 160, clients: 70, awards: 5 },
    skills: [
      { name: 'Portrait', level: 94, category: 'Photography' },
      { name: 'Editorial', level: 90, category: 'Photography' },
      { name: 'Lighting', level: 88, category: 'Craft' },
      { name: 'Retouching', level: 82, category: 'Post' },
    ],
    portfolioWorks: [
      {
        id: 'w3-1',
        title: 'Concrete & Light',
        category: 'Architecture',
        year: '2025',
        image: '/images/work-7.png',
        description: 'A photographic study of brutalist facades across three cities.',
      },
      {
        id: 'w3-2',
        title: 'Makers Portrait Series',
        category: 'Portrait',
        year: '2024',
        image: '/images/work-8.png',
        description: 'Environmental portraits of independent craftspeople at work.',
      },
      {
        id: 'w3-3',
        title: 'Golden Hour Campaign',
        category: 'Editorial',
        year: '2024',
        image: '/images/work-1.png',
        description: 'A sun-drenched fashion campaign shot entirely at dawn and dusk.',
      },
    ],
  },
  {
    id: 'iris-cole',
    firstName: 'Iris',
    lastName: 'Cole',
    role: 'Illustrator',
    tagline: 'Geometry, pattern and playful color.',
    bio: 'Iris builds worlds out of shapes. Her illustration practice leans on bold geometry, repetition and a fearless use of the group palette.',
    contacts: {
      email: 'iris@orangegroup3.com',
      phone: '+1 (123) 456-7893',
      website: 'orangegroup3.com/iris',
      location: 'Austin, TX',
    },
    profilePicture: '/images/profile-4.png',
    teamPhoto: TEAM_PHOTO,
    themeVariant: 4,
    education: [
      {
        period: '2015 — 2019',
        school: 'ArtCenter College of Design',
        degree: 'BFA, Illustration',
        detail: 'Specialised in geometric and pattern-based illustration.',
      },
      {
        period: '2019 — 2020',
        school: 'Domestika Masterclass',
        degree: 'Surface Pattern Design',
        detail: 'Built a professional pattern and color practice.',
      },
    ],
    experienceStats: { years: 7, projects: 95, clients: 38, awards: 4 },
    skills: [
      { name: 'Vector Illustration', level: 93, category: 'Illustration' },
      { name: 'Pattern Design', level: 91, category: 'Illustration' },
      { name: 'Color Theory', level: 89, category: 'Craft' },
      { name: 'Procreate', level: 86, category: 'Tools' },
    ],
    portfolioWorks: [
      {
        id: 'w4-1',
        title: 'Shape Study No.7',
        category: 'Illustration',
        year: '2025',
        image: '/images/work-2.png',
        description: 'A series exploring tessellation and negative space in three colors.',
      },
      {
        id: 'w4-2',
        title: 'Editorial Spot Set',
        category: 'Editorial',
        year: '2024',
        image: '/images/work-3.png',
        description: 'Spot illustrations for a long-form essay on modern cities.',
      },
      {
        id: 'w4-3',
        title: 'Pattern Pack Vol.2',
        category: 'Surface',
        year: '2024',
        image: '/images/work-4.png',
        description: 'A downloadable pack of seamless geometric surface patterns.',
      },
    ],
  },
  {
    id: 'sol-reyes',
    firstName: 'Sol',
    lastName: 'Reyes',
    role: 'UX Designer',
    tagline: 'Less, but better — split down the middle.',
    bio: 'Sol designs calm, minimal product experiences. A believer in contrast and clarity, they reduce interfaces to their most essential moments.',
    contacts: {
      email: 'sol@orangegroup3.com',
      phone: '+1 (123) 456-7894',
      website: 'orangegroup3.com/sol',
      location: 'Seattle, WA',
    },
    profilePicture: '/images/profile-5.png',
    teamPhoto: TEAM_PHOTO,
    themeVariant: 5,
    education: [
      {
        period: '2013 — 2017',
        school: 'University of Washington',
        degree: 'BSc, Human-Computer Interaction',
        detail: 'Grounded in research-led, accessible product design.',
      },
      {
        period: '2017 — 2018',
        school: 'IDEO U',
        degree: 'Design Thinking Certificate',
        detail: 'Systems thinking and inclusive design methods.',
      },
    ],
    experienceStats: { years: 8, projects: 110, clients: 40, awards: 5 },
    skills: [
      { name: 'Product Design', level: 92, category: 'Design' },
      { name: 'Prototyping', level: 90, category: 'Tools' },
      { name: 'Design Systems', level: 88, category: 'Systems' },
      { name: 'User Research', level: 80, category: 'Strategy' },
    ],
    portfolioWorks: [
      {
        id: 'w5-1',
        title: 'Ledger Dashboard',
        category: 'Product',
        year: '2025',
        image: '/images/work-5.png',
        description: 'A minimal analytics dashboard for a personal finance tool.',
      },
      {
        id: 'w5-2',
        title: 'Split Booking Flow',
        category: 'UX',
        year: '2024',
        image: '/images/work-6.png',
        description: 'A pared-back booking flow that cut drop-off by a third.',
      },
      {
        id: 'w5-3',
        title: 'Mono Design System',
        category: 'Systems',
        year: '2024',
        image: '/images/work-7.png',
        description: 'A high-contrast component library built for accessibility.',
      },
    ],
  },
  {
    id: 'juno-vale',
    firstName: 'Juno',
    lastName: 'Vale',
    role: 'Type & Poster Designer',
    tagline: 'Loud type. Big ideas. No apologies.',
    bio: 'Juno makes work that shouts across a room. Overlapping type, aggressive scale and expressive layouts are the signature of their poster practice.',
    contacts: {
      email: 'juno@orangegroup3.com',
      phone: '+1 (123) 456-7895',
      website: 'orangegroup3.com/juno',
      location: 'Brooklyn, NY',
    },
    profilePicture: '/images/profile-6.png',
    teamPhoto: TEAM_PHOTO,
    themeVariant: 6,
    education: [
      {
        period: '2012 — 2016',
        school: 'Pratt Institute',
        degree: 'BFA, Communication Design',
        detail: 'Poster design, expressive type and print production.',
      },
      {
        period: '2016 — 2017',
        school: 'Werkplaats Typografie',
        degree: 'Independent Type Study',
        detail: 'Experimental layout and large-format typography.',
      },
    ],
    experienceStats: { years: 10, projects: 130, clients: 48, awards: 9 },
    skills: [
      { name: 'Poster Design', level: 95, category: 'Design' },
      { name: 'Expressive Type', level: 94, category: 'Typography' },
      { name: 'Print Production', level: 85, category: 'Craft' },
      { name: 'Layout', level: 90, category: 'Design' },
    ],
    portfolioWorks: [
      {
        id: 'w6-1',
        title: 'Noise Festival Poster',
        category: 'Poster',
        year: '2025',
        image: '/images/work-8.png',
        description: 'A gig poster series built entirely from overlapping headlines.',
      },
      {
        id: 'w6-2',
        title: 'Manifesto Wall',
        category: 'Environmental',
        year: '2024',
        image: '/images/work-1.png',
        description: 'A floor-to-ceiling typographic mural for a design conference.',
      },
      {
        id: 'w6-3',
        title: 'Type in Motion',
        category: 'Typography',
        year: '2024',
        image: '/images/work-2.png',
        description: 'An experimental exhibition pairing print posters with motion loops.',
      },
    ],
  },
]

// Replace this with a real async Supabase query when you connect your database.
export function getTeamMembers(): TeamMember[] {
  return teamMembers
}
