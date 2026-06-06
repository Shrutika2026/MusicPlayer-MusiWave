// Song metadata library for the MusiWave application
const songsData = [
  {
    id: 1,
    title: "Pehli Nazar Mein",
    artist: "Atif Aslam",
    album: "Race",
    file: "Songs/Pehli_Nazar_Mein_Kaise_Jaado_Kar_Diya___Atif_Aslam_Hits___Race_I_Akshaye,_Bipasha___Saif_Ali(256k).mp3.mpeg",
    lyrics: `Pehli nazar mein kaise jaado kar diya
Tera ban gaya hai mera jiya
Mera jiya dhadakne laga
Dhadkan ne mujhse kaha
Haan main tujhse pyaar karoon
Haan main tujhse pyaar karoon

Har dua mein shamil tera naam hai
Tujhko paaya toh jeena aasaan hai
Tujhe dekh ke dil mera dharakne laga
Tujhpe hi aake mera safar khatam hua
Haan main tujhse pyaar karoon
Haan main tujhse pyaar karoon`
  },
  {
    id: 2,
    title: "Sach Keh Raha Hai Deewana",
    artist: "KK",
    album: "Rehnaa Hai Terre Dil Mein",
    file: "Songs/Sach_Keh_Raha_Hai_Deewana___Rehnaa_Hai_Terre_Dil_Mein___R._Madhavan___Dia_Mirza___K_K(256k).mp3.mpeg",
    lyrics: `Sach keh raha hai deewana dil
Dil na kisi se lagaana
Jhoothe yaar ke vaade saare
Jhoothi hai pyaar ki kasmein
Maine har lamha jise chaaha, jise pooja
Usne hi yaara mujhe dard diya...

Dil tod ke hansti hai mera
Dard tumhaara kya jaanegi
Sach keh raha hai deewana dil
Dil na kisi se lagaana...`
  },
  {
    id: 3,
    title: "Tere Liye (Jhankar)",
    artist: "Atif Aslam & Shreya Ghoshal",
    album: "Prince",
    file: "Songs/Tere_Liye__Jhankar_(256k).mp3.mpeg",
    lyrics: `Tere liye hi jiya main
Khud ko jo yun de diya hai
Tere wafa ne mujhko sambhala
Saare ghamon ko dil se nikala
Dil se nikala...

Main toh jiya na mar saka
Tere bina main kya karoon
Tere liye hi jiya main
Tere liye hi jiya main...`
  },
  {
    id: 4,
    title: "Tu Hi Haqeeqat",
    artist: "Javed Ali & Pritam",
    album: "Tum Mile",
    file: "Songs/Tu_Hi_Haqeeqat_-_Lyrical_Song___Tum_Mile___Emraan_Hashmi___Soha_Ali_Khan___Javed_Ali___Pritam(256k).mp3.mpeg",
    lyrics: `Tu hi haqeeqat khwaab tu
Dhadkan mein apni basa loon
Jism ko rooh mein mila loon
Tujhko apna bana loon...

Tu hi mera saaya, tu hi mera paaya
Tujh bin ek pal ab toh na bhaye
Tu hi mera sach hai, tu hi mera sapna
Tere bina ab kaun hai apna...`
  },
  {
    id: 5,
    title: "Tu Hi Mera",
    artist: "Shafqat Amanat Ali & Pritam",
    album: "Jannat 2",
    file: "Songs/Tu_Hi_Mera_-_Audio_Lyrical___Emraan_Hashmi,_Esha_Gupta___Jannat_2___Shafqat_Amanat_Ali___Pritam(256k).mp3.mpeg",
    lyrics: `Tu hi mera mera mera
Tu hi mera mera mera
Tu hi mera, tu hi mera
Jannat meri tu hi mera...

Dhal jaye shaam jab bhi
Teri hi yaad aati hai
Har lamha har ghadi ab toh
Bas teri yaad rulati hai...
Tu hi mera mera mera...`
  },
  {
    id: 6,
    title: "Chill Beats",
    artist: "Lofi Artist",
    album: "Study Session Vol. 1",
    file: "Songs/Chill Beats.mpeg",
    lyrics: "[Instrumental Beats]\n\nRelax, take a deep breath, and let the soothing lofi melodies calm your mind.\n\nNo vocals. Perfect for coding, writing, or resting."
  },
  {
    id: 7,
    title: "Retro Wave",
    artist: "Synth Master",
    album: "Synthwave Outrun",
    file: "Songs/Retro Wave.mpeg",
    lyrics: "[Synthwave Instrumental]\n\nFeel the neon lights and the virtual highway breeze.\n\nNo vocals. Ideal for late night cruise vibes."
  },
  {
    id: 8,
    title: "Acoustic Guitar",
    artist: "Indie Soul",
    album: "Unplugged Sessions",
    file: "Songs/Acoustic Guitar.mpeg",
    lyrics: "[Acoustic Instrumental]\n\nA soft acoustic guitar strums gently, providing a space for deep thought and relaxation."
  },
  {
    id: 9,
    title: "Summer Dance",
    artist: "EDM Producer",
    album: "Beach Club Anthems",
    file: "Songs/Summer Dance.mpeg",
    lyrics: "[EDM Club Instrumental]\n\nHigh energy drops and pulsing baselines that get the party started.\n\nFeel the beat and dance away!"
  },
  {
    id: 10,
    title: "Deep Sleep Lofi",
    artist: "Ambient Maker",
    album: "Midnight Calm",
    file: "Songs/Deep Sleep Lofi.mpeg",
    lyrics: "[Ambient Sleeping Music]\n\nSlow, drifting chords designed to ease anxiety and assist in restful sleep."
  },
  {
    id: 11,
    title: "Song 6 (Jazz Lounge)",
    artist: "The Quartet",
    album: "Blue Note Chronicles",
    file: "Songs/Song6.mpeg",
    lyrics: "[Soft Jazz Instrumental]\n\nGentle piano keys and smooth bass walking rhythms of a classic smoky jazz club."
  }
];

// Dynamic generation script to build 200 total tracks mapping to the 11 physical audio files
(function generate200Songs() {
  const adjectives = ["Chill", "Midnight", "Summer", "Retro", "Neon", "Deep", "Electric", "Cosmic", "Ocean", "Sunset", "Golden", "Lofi", "Acoustic", "Jazz", "Vocal", "Starlight", "Autumn", "Winter", "Spring", "Shadow"];
  const nouns = ["Vibe", "Wave", "Pulse", "Dream", "Breeze", "Groove", "Flow", "Beats", "Soul", "Melody", "Rhythm", "Horizon", "Echo", "Junction", "Silence", "Tide", "Whisper", "Journey", "Memories", "Drift"];
  const mixes = ["(Lofi Mix)", "(Retro Remix)", "(Acoustic Version)", "(Slowed & Reverb)", "(Instrumental)", "(Extended Edit)", "(Radio Edit)", "(Live Lounge)", "(Remastered 2026)"];
  const artists = ["Atif Aslam", "KK", "Javed Ali", "Pritam", "Shreya Ghoshal", "Lofi Artist", "Synth Master", "Indie Soul", "EDM Producer", "Ambient Maker", "The Quartet", "Arijit Singh", "Sonu Nigam", "Armaan Malik", "Neha Kakkar", "Rahat Fateh Ali Khan", "Darshan Raval", "Badshah", "Kishore Kumar", "Lata Mangeshkar"];
  const albums = ["MusiWave Session Vol. 2", "Golden Hits Collection", "Midnight Chronicles", "Lofi Sunset Beats", "Retro Synthwave Outrun", "Ultimate Chill Zone", "Acoustic Whispers", "EDM Beach Party", "Aura of Love", "Timeless Melodies"];

  const baseSongsCount = songsData.length;
  for (let i = baseSongsCount + 1; i <= 200; i++) {
    const baseSong = songsData[(i - 1) % baseSongsCount];
    const adj = adjectives[i % adjectives.length];
    const noun = nouns[i % nouns.length];
    const mix = mixes[i % mixes.length];
    const artist = artists[i % artists.length];
    const album = albums[i % albums.length];
    
    songsData.push({
      id: i,
      title: `${adj} ${noun} ${mix}`,
      artist: artist,
      album: album,
      file: baseSong.file, // Reuse working audio file!
      lyrics: `[Instrumental & Lyrics for ${adj} ${noun}]\n\nLyrics generated automatically for this edition...\n\nEnjoy the melody and rhythm by ${artist}.\n\nThis song maps to the audio track of ${baseSong.title}.`
    });
  }
})();
