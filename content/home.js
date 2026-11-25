/**
 * Home page copy and photos that are edited in the Studio (Home Page). This file is the local fallback: any field left
 * empty in the CMS, or a list without the number of items the scroll story needs, uses the value here instead.
 * scripts/import-home.mjs copied these values into Sanity as the starting content.
 *
 * Images: { src, w, h, alt, pos } – pos is an optional object-position for the crop (in the CMS, the image hotspot).
 * The scroll story (lib/home-story.js) needs exactly 4 panels, 4 process steps and 3 transformation pictures.
 * Everything else on the home page (films, the 3D garden, hero headlines, diagram labels, icons) stays in code.
 */
export const home = {
  heroIntro:
    'A home is made up of everyday experiences, and we believe each one deserves careful thought. From the layout of a room to the materials we choose, we design every project with care and purpose. We create beautiful spaces that are comfortable, practical, and support your well-being.',
  heroValues: ['Thoughtful Interiors.', 'Healthy Living.', 'Timeless Spaces.'],

  walkInLabel: 'Healthy Living by Design',
  walkInHeading: 'How You Feel the Moment You Walk In.',
  walkInText: 'Designed for the way you live and how you feel.',

  // In the order of the room films they appear over (content/media.js)
  panels: [
    { title: 'Natural Light', text: 'Thoughtful use of natural light to create bright, welcoming, and comfortable interiors.' },
    { title: 'Comfort & Airflow', text: 'Designed for good ventilation, comfortable temperatures, and fresh indoor air.' },
    { title: 'Considered Materials', text: 'Beautiful, practical materials chosen for comfort and healthier living.' },
    { title: 'Functional Living', text: 'Practical spaces designed around your daily routine, personal needs, and long-term comfort.' },
  ],

  holisticLabel: 'Holistic design',
  holisticHeading: 'A Home Designed to Work as One.',
  holisticText:
    'We design homes that work with their surroundings throughout the day and year. We consider sunlight, fresh air, water, plants, and the people who live there. Every detail is planned together.',

  detailsLabel: 'The Quieter Details',
  detailsHeading: 'What Else Makes a Home Healthy?',
  detailsText:
    'Beyond natural light, fresh air, and greenery, we consider the small details that make a home healthier. Many of these details are hidden once the home is complete. You experience their benefits in how you sleep, breathe, and feel throughout the day.',
  detailCards: [
    {
      title: 'Natural Materials',
      subtitle: 'Organic elements for everyday comfort.',
      points: ['Clean-air, low-VOC paints.', 'Solid wood, stone, and lime plaster.', 'Breathable linen, cotton, and wool.'],
      image: { src: '/m/materials-board.jpg', w: 1200, h: 1493, alt: 'Material samples laid out on oak: violet-veined marble, travertine, walnut, bouclé and linen swatches beside kitchen drawings' },
    },
    {
      title: 'Humidity Control',
      subtitle: 'Fresh air for a healthier home.',
      points: ['Natural cross-ventilation and fresh airflow.', 'Balanced indoor humidity.', 'Dust-minimizing layouts.'],
      image: { src: '/m/kitchen-marble.jpg', w: 809, h: 1470, alt: 'Kitchen with a full marble backsplash and shelf, oak cabinets and an olive branch in a glass vase', pos: '50% 40%' },
    },
    {
      title: 'Layered Lighting',
      subtitle: 'The right light for every moment.',
      points: ['Bright light for daily tasks.', 'Warm light for evening rest.', 'Easy dimming with lamps and switches.'],
      image: { src: '/m/bed-sunlight.jpg', w: 720, h: 1280, alt: 'Bedroom with late sun falling across the wall, a palm-print headboard and a small lamp on the bedside table', pos: '50% 55%' },
    },
    {
      title: 'Sound Insulation',
      subtitle: 'Acoustic comfort for a quieter home.',
      points: ['Noise-absorbing rugs and drapes.', 'Soft-close doors and drawers.', 'Sound-dampening finishes.'],
      image: { src: '/m/acoustic.jpg', w: 1200, h: 1600, alt: 'Reading corner with a slatted timber wall, felt acoustic pendants and a green velvet armchair', pos: '50% 45%' },
    },
    {
      title: 'Considered Storage',
      subtitle: 'Effortless organization for calm spaces.',
      points: ['Tailored daily storage.', 'Seamless built-in cabinets.', 'Open, clutter-free layouts.'],
      image: { src: '/m/pf/joinery-dressing-wall.jpg', w: 1448, h: 1086, alt: 'The finished dressing wall: a curved wardrobe with a bronze inlay beside a wave-fronted chest of drawers', pos: '20% 50%' },
    },
  ],

  // The featured project's name, location, type and services come from the project itself (Portfolio in the Studio).
  // This one is shown unless a project has "Featured Project" ticked.
  featuredSlug: 'emirates-living-villa',
  featuredSubtitle: 'Interior renovation & styling',
  featuredText:
    'A complete villa renovation combining warm neutral colours, natural materials, and timeless design. Rooms open to light and fresh air, with bespoke joinery, refined finishes and a calm, layered feel for everyday living.',
  featuredQuote: 'A home should feel like you.',

  processHeading: 'From the First Visit to the Final Touch.',
  processSteps: [
    { title: 'Consultation', text: 'We visit and listen.' },
    { title: 'Concept and materials', text: 'Light and airflow first, then finishes.' },
    { title: 'Joinery and finishes', text: 'Thoughtful details, carefully coordinated.' },
    { title: 'Furnishing and Styling', text: 'The finishing touches that make it yours.' },
  ],

  founderLabel: 'THE PERSON BEHIND THE DESIGN',
  founderHeading: 'Meet Roula.',
  founderText:
    'With a background in healthcare and interior design, Roula Jbour combines her passion for helping people with her love for creating beautiful spaces.',
  founderQuote: 'I believe a beautiful space is not just about how it looks, but also about how comfortable and natural it feels to live in.',
  founderSignature: 'ROULA JBOUR — FOUNDER, ARCHIFORM',
  founderImage: { src: '/m/roula.jpg', w: 980, h: 1600, alt: 'Roula Jbour, founder of ARCHIFORM, leaning against a white wall' },

  // The journey between the founder and the studio name: one room as we found it, the inspiration, and what we made
  journeyHeading: 'The Transformation.',
  journey: [
    { label: 'What we got', image: { src: '/m/journey-before.webp', w: 999, h: 558, alt: 'The bedroom as we found it: a plain white floating TV unit and a small timber desk beneath a wall-mounted TV' } },
    { label: 'The inspo', image: { src: '/m/journey-inspo.jpg', w: 1447, h: 1087, alt: 'Design visualisation of the dressing wall: a curved wardrobe, a long cream chest and dressing table, a round backlit mirror and floating shelves' } },
    { label: 'What we made', image: { src: '/m/pf/joinery-dressing-wall.jpg', w: 1448, h: 1086, alt: 'The finished dressing wall: a curved wardrobe with a bronze inlay, a wave-fronted chest of drawers and a backlit arched mirror' } },
  ],

  closeLabel: "LET'S CREATE SOMETHING MEANINGFUL",
  closeHeading: 'A home should feel like you.',
  closeParagraphs: [
    'Not just beautiful in photographs. Not simply impressive when guests arrive.',
    'But genuinely comfortable, deeply personal and thoughtfully designed for the life happening within it.',
    "Tell us what home means to you. Together, we'll bring that vision to life.",
  ],
  closeCta: "LET'S TALK ABOUT YOUR SPACE",
};
