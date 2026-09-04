/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT EVERYTHING PERSONAL HERE.
 *  No UI component needs to change — just this file (and drop your
 *  own files into src/assets, public/videos, public/songs).
 * ─────────────────────────────────────────────────────────────
 */

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import memory1 from "@/assets/memory-1.jpg";
import memory2 from "@/assets/memory-2.jpg";
import memory3 from "@/assets/memory-3.jpg";
import memory4 from "@/assets/memory-4.jpg";
import memory5 from "@/assets/memory-5.jpg";
import memory6 from "@/assets/memory-6.jpg";
import cover1 from "@/assets/cover-1.jpg";

export const girlfriend = {
  name: "Her Name",
  nickname: "Beautiful",
  heroMessage: "This is all for you",
  heroSubtitle:
    "A small world I created with all the things that make you, you. Thank you for being the most amazing part of my life.",
  loveMessage: "I love you more than words can explain. ❤️",
  surpriseMessage: "If I could choose one place to be forever, it would be beside you.",
  finalMessage: "Forever isn't long enough with you.",
};

export type HeroSlide = { image: string; alt: string };

export const heroSlides: HeroSlide[] = [
  { image: hero1, alt: "The two of us watching the sun go down" },
  { image: hero2, alt: "Dancing under the string lights" },
  { image: hero3, alt: "Walking together into the morning" },
];

export type PhotoCategory = "Favorites" | "Trips" | "Dates" | "Candid" | "Special";

export type Photo = {
  image: string;
  category: PhotoCategory;
  caption: string;
  date: string;
  favorite?: boolean;
};

export const photoCategories: Array<"All" | PhotoCategory> = [
  "All",
  "Favorites",
  "Trips",
  "Dates",
  "Candid",
  "Special",
];

export const photos: Photo[] = [
  {
    image: memory2,
    category: "Dates",
    caption: "Our beautiful evening by the sea",
    date: "12 May 2024",
    favorite: true,
  },
  {
    image: memory1,
    category: "Dates",
    caption: "You laughed at my terrible joke",
    date: "18 Mar 2024",
    favorite: true,
  },
  {
    image: memory3,
    category: "Trips",
    caption: "That sunset we didn't want to end",
    date: "02 Jun 2024",
  },
  {
    image: memory5,
    category: "Special",
    caption: "First snow, warmest night",
    date: "24 Dec 2023",
    favorite: true,
  },
  {
    image: memory6,
    category: "Trips",
    caption: "Windows down, your favorite song on",
    date: "09 Apr 2024",
  },
  {
    image: memory4,
    category: "Candid",
    caption: "Waiting for you in the rain — worth it",
    date: "27 Jul 2024",
  },
  {
    image: hero1,
    category: "Special",
    caption: "The moment I knew",
    date: "14 Feb 2023",
    favorite: true,
  },
  {
    image: hero2,
    category: "Dates",
    caption: "Our slow dance with no music",
    date: "30 Sep 2023",
  },
  {
    image: hero3,
    category: "Trips",
    caption: "Lost on purpose, together",
    date: "10 Apr 2023",
  },
];

/** Set `+N more` badge on the home overview card. */
export const morePhotosCount = 24;

export type Video = {
  title: string;
  date: string;
  duration: string;
  thumbnail: string;
  /** Drop your own file in public/videos/ and use "/videos/name.mp4" */
  src: string;
  description: string;
  favorite?: boolean;
};

export const videos: Video[] = [
  {
    title: "Sunset Date",
    date: "12 May 2024",
    duration: "0:45",
    thumbnail: memory2,
    src: "/videos/sunset-date.mp4",
    description: "The evening we stayed until the sky went dark.",
    favorite: true,
  },
  {
    title: "You & Your Laugh",
    date: "25 May 2024",
    duration: "1:12",
    thumbnail: memory1,
    src: "/videos/your-laugh.mp4",
    description: "My favorite sound in the entire world.",
  },
  {
    title: "Trip to the Hills",
    date: "18 Jun 2024",
    duration: "0:38",
    thumbnail: hero3,
    src: "/videos/hills.mp4",
    description: "Cold morning, warm hands.",
  },
  {
    title: "Candid Moments",
    date: "30 Jun 2024",
    duration: "0:38",
    thumbnail: memory5,
    src: "/videos/candid.mp4",
    description: "You never noticed I was filming.",
    favorite: true,
  },
];

export type Song = {
  title: string;
  artist: string;
  /** Drop your own file in public/songs/ and use "/songs/name.mp3" */
  audio: string;
  cover: string;
  duration: string;
  note?: string;
  _id?: string;
  date?: string;
  rawDate?: string;
  source?: "upload" | "url" | "spotify" | "google-drive";
  url?: string;
};

export const songs: Song[] = [
  {
    title: "Perfect",
    artist: "Ed Sheeran",
    audio: "/songs/perfect.mp3",
    cover: cover1,
    duration: "4:23",
    note: "This song always reminds me of you.",
  },
  {
    title: "Photograph",
    artist: "Ed Sheeran",
    audio: "/songs/photograph.mp3",
    cover: memory3,
    duration: "4:19",
  },
  {
    title: "You Are The Reason",
    artist: "Calum Scott",
    audio: "/songs/you-are-the-reason.mp3",
    cover: memory2,
    duration: "3:24",
  },
  {
    title: "Thinking Out Loud",
    artist: "Ed Sheeran",
    audio: "/songs/thinking-out-loud.mp3",
    cover: memory5,
    duration: "4:41",
  },
  {
    title: "Make You Feel My Love",
    artist: "Adele",
    audio: "/songs/make-you-feel-my-love.mp3",
    cover: memory6,
    duration: "3:32",
  },
];

export type Letter = {
  title: string;
  preview: string;
  body: string;
  date: string;
};

export const letters: Letter[] = [
  {
    title: "Open When You Need a Smile",
    preview: "You have the most beautiful smile in the world. Never stop smiling, okay? ❤️",
    date: "2 May 2024",
    body: "You have the most beautiful smile in the world.\n\nIf you're reading this, I want you to remember the night you laughed so hard you couldn't breathe, and I just sat there watching you, thinking how lucky I am.\n\nWhatever made today heavy, it doesn't get to take that smile. Never stop smiling, okay? ❤️",
  },
  {
    title: "Open When You Feel Low",
    preview: "I just want you to know that I'll always be here for you...",
    date: "15 May 2024",
    body: "I just want you to know that I'll always be here for you, no matter what.\n\nYou don't have to be okay right now. You don't have to explain it or fix it today. Just breathe, and let me carry a little of it with you.\n\nYou are loved on your best days and just as much on your hardest ones.",
  },
  {
    title: "Open When You Need Motivation",
    preview: "You are stronger than you think and capable of amazing things.",
    date: "28 May 2024",
    body: "You are stronger than you think and capable of amazing things.\n\nI've watched you do things that scared you, quietly, without asking anyone to notice. I noticed.\n\nSo take the next small step. I'm already proud of you, and I'll be right here when you get there.",
  },
  {
    title: "Open When You Miss Me",
    preview: "Close this letter, take a deep breath, and know that I miss you too.",
    date: "10 Jun 2024",
    body: "Close this letter, take a deep breath, and know that I miss you too.\n\nDistance is just time we haven't spent yet. Somewhere out there I'm thinking about the exact same thing you are right now.\n\nSoon. Until then, this whole little world is yours.",
  },
];

export type Milestone = {
  title: string;
  description: string;
  date: string;
  icon: "heart" | "coffee" | "sparkles" | "plane" | "star";
  image?: string;
  highlight?: boolean;
};

export const timeline: Milestone[] = [
  {
    title: "We Met",
    description: "The moment our worlds collided.",
    date: "12 Jan 2023",
    icon: "heart",
    image: hero1,
  },
  {
    title: "First Date",
    description: "A perfect day I'll never forget.",
    date: "26 Jan 2023",
    icon: "coffee",
    image: memory1,
  },
  {
    title: "Officially Us",
    description: "The day we made it official.",
    date: "14 Feb 2023",
    icon: "sparkles",
    image: memory2,
    highlight: true,
  },
  {
    title: "First Trip",
    description: "Our first adventure together.",
    date: "10 Apr 2023",
    icon: "plane",
    image: hero3,
  },
  {
    title: "Many More",
    description: "Can't wait for all the memories ahead.",
    date: "Forever",
    icon: "star",
    image: memory3,
  },
];

export const funZoneConfig = {
  /** Default character image used for Fun Zone */
  characterImage: hero1,
  characterName: girlfriend.nickname || "Cutie",
  title: "Fun Zone ❤️",
  subtitle: "Choose an action and tap the picture!",
};

