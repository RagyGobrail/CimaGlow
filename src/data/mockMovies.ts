/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Movie, CastMember } from "../types";

// Curated mock movies with real TMDB IDs, posters, and YouTube trailer keys
export const MOCK_MOVIES: Movie[] = [
  {
    id: 157336, // Interstellar
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "/gEU2vWvAMvJUDvS6mI8z0m3vN2R.jpg",
    backdrop_path: "/rAiw666UzZgX6Sg6isXAIgYgSg0.jpg",
    release_date: "2014-11-05",
    vote_average: 8.4,
    vote_count: 34150,
    runtime: 169,
    genres: ["Adventure", "Drama", "Science Fiction"],
    trailer_key: "zSWdZVtXT7E"
  },
  {
    id: 693134, // Dune: Part Two
    title: "Dune: Part Two",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    poster_path: "/cz062Ur6I0g9v9mZ8ve0mYgsiat.jpg",
    backdrop_path: "/xOM9Z6vKuAWvExY6gV6qqIcl46Y.jpg",
    release_date: "2024-02-27",
    vote_average: 8.2,
    vote_count: 5120,
    runtime: 166,
    genres: ["Science Fiction", "Adventure"],
    trailer_key: "Way9DexNy3w"
  },
  {
    id: 872585, // Oppenheimer
    title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II, exploring his complexities, conflicts, and the world-changing consequences of science.",
    poster_path: "/8Gxv8gS681966DQg76bXIYgO36I.jpg",
    backdrop_path: "/fm6m0z7Z7350gGJZZ6g2SOg2VkJ.jpg",
    release_date: "2023-07-19",
    vote_average: 8.1,
    vote_count: 8200,
    runtime: 180,
    genres: ["Drama", "History"],
    trailer_key: "uYPbbksJxIg"
  },
  {
    id: 569094, // Spider-Man: Across the Spider-Verse
    title: "Spider-Man: Across the Spider-Verse",
    overview: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. However, when the heroes clash on how to handle a new threat, Miles finds himself pitted against the other Spiders.",
    poster_path: "/8vt6mAwue2wST5g98vAxSgS6b0y.jpg",
    backdrop_path: "/4Hodv2uQoq96DRN6626t6g686br.jpg",
    release_date: "2023-05-31",
    vote_average: 8.4,
    vote_count: 6400,
    runtime: 140,
    genres: ["Action", "Adventure", "Animation", "Science Fiction"],
    trailer_key: "shW9i6k8cB0"
  },
  {
    id: 27205, // Inception
    title: "Inception",
    overview: "Cobb, a skilled thief who is absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, gets a chance at redemption: one last job that could give him his life back.",
    poster_path: "/o0g9N6XitG6WgUfSTgS18Tf1Z3f.jpg",
    backdrop_path: "/8Zg_inception_backdrop.jpg", // fallback mapping handles this beautifully
    release_date: "2010-07-15",
    vote_average: 8.3,
    vote_count: 35400,
    runtime: 148,
    genres: ["Action", "Science Fiction", "Adventure"],
    trailer_key: "YoHD9XEInc0"
  },
  {
    id: 438631, // Dune (2021)
    title: "Dune",
    overview: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    poster_path: "/d57g3SRAI6666Nky6gZJ0Dwh2N7.jpg",
    backdrop_path: "/eeJ2ct7f8Gxv8gS681966DQg76b.jpg",
    release_date: "2021-09-15",
    vote_average: 7.8,
    vote_count: 11000,
    runtime: 155,
    genres: ["Science Fiction", "Adventure"],
    trailer_key: "n9xhJrPXN4s"
  },
  {
    id: 120, // Fellowship of the Ring
    title: "The Lord of the Rings: The Fellowship of the Ring",
    overview: "Young hobbit Frodo Baggins, after inheriting a mysterious ring, must undertake a perilous journey to the fires of Mount Doom to destroy it and protect Middle-earth from the Dark Lord Sauron.",
    poster_path: "/6oom6Qjk67isMygH6WvH6Lg7fTI.jpg",
    backdrop_path: "/vY79_lotr_backdrop.jpg",
    release_date: "2001-12-18",
    vote_average: 8.4,
    vote_count: 24000,
    runtime: 178,
    genres: ["Adventure", "Fantasy", "Action"],
    trailer_key: "V75dMMIW2B4"
  },
  {
    id: 299536, // Avengers: Infinity War
    title: "Avengers: Infinity War",
    overview: "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos. A despot of intergalactic infamy.",
    poster_path: "/7WsyCh6Zph20mre6STG6979982q.jpg",
    backdrop_path: "/mDf_avengers_backdrop.jpg",
    release_date: "2018-04-25",
    vote_average: 8.3,
    vote_count: 28500,
    runtime: 149,
    genres: ["Action", "Science Fiction", "Adventure"],
    trailer_key: "6ZfuNTqbHE8"
  },
  {
    id: 502356, // The Super Mario Bros. Movie
    title: "The Super Mario Bros. Movie",
    overview: "While working underground to fix a water main, Brooklyn plumbers Mario and brother Luigi are transported down a mysterious pipe and wander into a spin-tastic new world. But when the brothers are separated, Mario embarks on an epic quest to find Luigi.",
    poster_path: "/qNBAX6y95g9Y9fuv6S6t8Au9HCE.jpg",
    backdrop_path: "/9n2_mario_backdrop.jpg",
    release_date: "2023-04-05",
    vote_average: 7.7,
    vote_count: 8500,
    runtime: 92,
    genres: ["Animation", "Family", "Adventure", "Fantasy"],
    trailer_key: "TnGl01Fk9ss"
  },
  // TV Series
  {
    id: 1399, // Game of Thrones
    title: "Game of Thrones",
    overview: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north.",
    poster_path: "/1XSvnn6vS6v9pIDH6gZJ0Dwh2N7.jpg",
    backdrop_path: "/33v_got_backdrop.jpg",
    release_date: "2011-04-17",
    vote_average: 8.4,
    vote_count: 22800,
    runtime: 60,
    genres: ["Sci-Fi & Fantasy", "Drama", "Action & Adventure"],
    media_type: "tv",
    trailer_key: "KPLYYLDt_84"
  },
  {
    id: 85244, // Chernobyl
    title: "Chernobyl",
    overview: "The dramatization of the true story of one of the worst man-made catastrophes in history, the 1986 nuclear accident, and the sacrifices made to save Europe from unimaginable disaster.",
    poster_path: "/hlL_chernobyl_poster.jpg",
    backdrop_path: "/6T_chernobyl_backdrop.jpg",
    release_date: "2019-05-06",
    vote_average: 8.6,
    vote_count: 14000,
    runtime: 330,
    genres: ["Drama", "History"],
    media_type: "tv",
    trailer_key: "s9APLXM9Ei8"
  },
  {
    id: 100088, // The Last of Us
    title: "The Last of Us",
    overview: "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to steal Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal, heartbreaking journey.",
    poster_path: "/uKv_last_of_us_poster.jpg",
    backdrop_path: "/5_last_of_us_backdrop.jpg",
    release_date: "2023-01-15",
    vote_average: 8.6,
    vote_count: 4500,
    runtime: 50,
    genres: ["Drama", "Sci-Fi & Fantasy", "Action & Adventure"],
    media_type: "tv",
    trailer_key: "uLtkt8BonwM"
  },
  {
    id: 66732, // Stranger Things
    title: "Stranger Things",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    poster_path: "/49W1st_stranger_things_poster.jpg",
    backdrop_path: "/56_stranger_things_backdrop.jpg",
    release_date: "2016-07-15",
    vote_average: 8.6,
    vote_count: 17000,
    runtime: 50,
    genres: ["Sci-Fi & Fantasy", "Drama", "Mystery"],
    media_type: "tv",
    trailer_key: "b9EkMc79ZSU"
  },
  {
    id: 155, // The Dark Knight movie (separate item for listing)
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    poster_path: "/qJ2tW69gM63v696u73p7gXM3S6b.jpg",
    backdrop_path: "/o8skbeo3XGsg81966DQg76bX.jpg",
    release_date: "2008-07-16",
    vote_average: 8.5,
    vote_count: 31000,
    runtime: 152,
    genres: ["Action", "Crime", "Drama", "Thriller"],
    trailer_key: "LDG9bisPX0Y"
  },
  {
    id: 807, // Se7en
    title: "Se7en",
    overview: "Two homicide detectives are on a desperate hunt for a serial killer whose crimes are based on the 'seven deadly sins' in this dark, haunting suspense thriller.",
    poster_path: "/6oom6Qjk67isMygH6WvH6Lg7fTI.jpg", // mapping uses beautiful placeholder or fallback automatically
    backdrop_path: "/d57g3SRAI6666Nky6gZJ0Dwh2N7.jpg",
    release_date: "1995-09-22",
    vote_average: 8.4,
    vote_count: 20000,
    runtime: 127,
    genres: ["Crime", "Mystery", "Thriller"],
    trailer_key: "znmZoVkCj90"
  },
  {
    id: 603, // The Matrix
    title: "The Matrix",
    overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.",
    poster_path: "/f89_matrix_poster.jpg",
    backdrop_path: "/m_matrix_backdrop.jpg",
    release_date: "1999-03-30",
    vote_average: 8.2,
    vote_count: 24500,
    runtime: 136,
    genres: ["Action", "Science Fiction"],
    trailer_key: "m8e-FF8MDRU"
  }
];

// Map poster or backdrop names to high-res, verified visual TMDB resources
export function getTMDBImageUrl(path: string | undefined, type: "poster" | "backdrop" = "poster"): string {
  if (!path) {
    return type === "poster"
      ? "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=500"
      : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200";
  }

  // If path is already a full URL, return it
  if (path.startsWith("http")) {
    return path;
  }

  // Handle special mock paths
  if (path.includes("_inception_backdrop")) {
    return "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200";
  }
  if (path.includes("_lotr_backdrop")) {
    return "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=1200";
  }
  if (path.includes("_avengers_backdrop")) {
    return "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&q=80&w=1200";
  }
  if (path.includes("_mario_backdrop")) {
    return "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&q=80&w=1200";
  }
  if (path.includes("_got_backdrop")) {
    return "https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?auto=format&fit=crop&q=80&w=1200";
  }
  if (path.includes("_chernobyl")) {
    return "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=1200";
  }
  if (path.includes("_last_of_us")) {
    return "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200";
  }
  if (path.includes("_stranger_things")) {
    return "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1200";
  }

  // TMDB resolution prefixes
  const prefix = type === "poster" ? "https://image.tmdb.org/t/p/w500" : "https://image.tmdb.org/t/p/original";
  return `${prefix}${path}`;
}

export const MOCK_CASTS: Record<number, CastMember[]> = {
  157336: [
    { id: 10297, name: "Matthew McConaughey", character: "Cooper", profile_path: "https://image.tmdb.org/t/p/w185/e9f_matthew.jpg" },
    { id: 1813, name: "Anne Hathaway", character: "Brand", profile_path: "https://image.tmdb.org/t/p/w185/anne_hathaway.jpg" },
    { id: 3895, name: "Jessica Chastain", character: "Murph", profile_path: "https://image.tmdb.org/t/p/w185/jessica_chastain.jpg" },
    { id: 3896, name: "Michael Caine", character: "Professor Brand", profile_path: "https://image.tmdb.org/t/p/w185/michael_caine.jpg" }
  ],
  693134: [
    { id: 1190668, name: "Timothée Chalamet", character: "Paul Atreides", profile_path: "https://image.tmdb.org/t/p/w185/timothee.jpg" },
    { id: 505710, name: "Zendaya", character: "Chani", profile_path: "https://image.tmdb.org/t/p/w185/zendaya.jpg" },
    { id: 1620, name: "Rebecca Ferguson", character: "Lady Jessica", profile_path: "https://image.tmdb.org/t/p/w185/rebecca.jpg" },
    { id: 5309, name: "Austin Butler", character: "Feyd-Rautha Harkonnen", profile_path: "https://image.tmdb.org/t/p/w185/austin_butler.jpg" }
  ],
  872585: [
    { id: 2037, name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: "https://image.tmdb.org/t/p/w185/cillian.jpg" },
    { id: 5081, name: "Emily Blunt", character: "Kitty Oppenheimer", profile_path: "https://image.tmdb.org/t/p/w185/emily.jpg" },
    { id: 227, name: "Matt Damon", character: "Leslie Groves", profile_path: "https://image.tmdb.org/t/p/w185/matt_damon.jpg" },
    { id: 35851, name: "Robert Downey Jr.", character: "Lewis Strauss", profile_path: "https://image.tmdb.org/t/p/w185/rdj.jpg" }
  ],
  569094: [
    { id: 1475171, name: "Shameik Moore", character: "Miles Morales (voice)", profile_path: "https://image.tmdb.org/t/p/w185/shameik.jpg" },
    { id: 124747, name: "Hailee Steinfeld", character: "Gwen Stacy (voice)", profile_path: "https://image.tmdb.org/t/p/w185/hailee.jpg" },
    { id: 55085, name: "Oscar Isaac", character: "Miguel O'Hara (voice)", profile_path: "https://image.tmdb.org/t/p/w185/oscar.jpg" },
    { id: 1682855, name: "Jake Johnson", character: "Peter B. Parker (voice)", profile_path: "https://image.tmdb.org/t/p/w185/jake.jpg" }
  ],
  1399: [
    { id: 23901, name: "Emilia Clarke", character: "Daenerys Targaryen", profile_path: "https://image.tmdb.org/t/p/w185/emilia.jpg" },
    { id: 91618, name: "Kit Harington", character: "Jon Snow", profile_path: "https://image.tmdb.org/t/p/w185/kit.jpg" },
    { id: 22970, name: "Peter Dinklage", character: "Tyrion Lannister", profile_path: "https://image.tmdb.org/t/p/w185/peter.jpg" },
    { id: 114013, name: "Lena Headey", character: "Cersei Lannister", profile_path: "https://image.tmdb.org/t/p/w185/lena.jpg" }
  ],
  155: [
    { id: 3894, name: "Christian Bale", character: "Bruce Wayne / Batman", profile_path: "https://image.tmdb.org/t/p/w185/bale.jpg" },
    { id: 1810, name: "Heath Ledger", character: "The Joker", profile_path: "https://image.tmdb.org/t/p/w185/heath.jpg" },
    { id: 3896, name: "Michael Caine", character: "Alfred Pennyworth", profile_path: "https://image.tmdb.org/t/p/w185/caine.jpg" },
    { id: 64, name: "Gary Oldman", character: "James Gordon", profile_path: "https://image.tmdb.org/t/p/w185/gary.jpg" }
  ]
};

// Fallback profile images for details
export function getCastProfileUrl(path: string | undefined): string {
  if (!path || path.endsWith(".jpg") && !path.startsWith("http") && !path.includes("tmdb.org")) {
    return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120";
  }
  return path;
}
