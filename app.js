/**
 * MusiWave - Core JavaScript Application Logic
 * Implements audio control, playlist operations, favorites, dynamic theme customization,
 * lyrics editing, custom cover art, and query-based song sharing.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- APPLICATION STATE ---
  const state = {
    songs: songsData,              // Loaded from songs.js
    currentSongIndex: 0,           // Currently active song index
    isPlaying: false,              // Audio playback state
    isShuffle: false,             // Shuffle playback mode
    isRepeat: false,              // Repeat active track mode
    favorites: [],                 // Array of song IDs
    playlists: [],                 // Custom playlist objects [{ id, name, desc, songs: [] }]
    recentlyPlayed: [],            // Recently played tracks list
    customLyrics: {},             // Custom user edited lyrics { songId: text }
    activeView: "home",            // Active navigation view panel
    activePlaylistId: null,        // Currently viewing playlist ID (playlists detail view)
    playbackQueue: [],             // Playback list: IDs of songs in active sequence
    queueIndex: 0,                 // Current index within playbackQueue
    activeTheme: "neongroove",      // Selected visual theme class
    customAccent: null,            // Custom picked color (HEX)
    currentVolume: 0.7,            // Default volume (0 to 1)
    sidebarLyricsOpen: false,      // Sidebar inline lyrics panel
    isSeeking: false               // User is dragging a progress slider
  };

  // --- AUDIO SETUP ---
  const audio = document.getElementById("main-audio");

  // --- HTML DOM ELEMENT REFERENCES ---
  const DOM = {
    // Nav elements
    navItems: document.querySelectorAll(".nav-item"),
    mobileNavItems: document.querySelectorAll(".mobile-nav-item"),
    panels: document.querySelectorAll(".view-panel"),
    
    // Playlists View
    playlistsGrid: document.getElementById("playlists-grid"),
    sidebarPlaylists: document.getElementById("sidebar-playlists"),
    playlistDetailView: document.getElementById("playlist-detail-view"),
    playlistDetailTitle: document.getElementById("playlist-detail-title"),
    playlistDetailDesc: document.getElementById("playlist-detail-desc"),
    playlistDetailMeta: document.getElementById("playlist-detail-meta"),
    playlistDetailCover: document.getElementById("playlist-detail-cover"),
    playlistDetailPlayBtn: document.getElementById("playlist-detail-play-btn"),
    playlistDetailAddBtn: document.getElementById("playlist-detail-add-btn"),
    playlistDetailDeleteBtn: document.getElementById("playlist-detail-delete-btn"),
    playlistDetailBackBtn: document.getElementById("playlist-detail-back-btn"),
    playlistSongsList: document.getElementById("playlist-songs-list"),
    
    // Songs modal elements
    modalEditPlaylistSongs: document.getElementById("modal-edit-playlist-songs"),
    editPlaylistModalTitle: document.getElementById("edit-playlist-modal-title"),
    editPlaylistSongInfo: document.getElementById("edit-playlist-song-info"),
    playlistSongsEditList: document.getElementById("playlist-songs-edit-list"),
    playlistEditSearchInput: document.getElementById("playlist-edit-search"),
    btnCloseEditPlaylistSongs: document.getElementById("btn-close-edit-playlist-songs"),
    btnAddPlaylistSongs: document.getElementById("btn-add-playlist-songs"),
    
    // Lists Containers
    allSongsList: document.getElementById("all-songs-list"),
    favoritesSongsList: document.getElementById("favorites-songs-list"),
    songsCountBadge: document.getElementById("songs-count-badge"),
    favCountBadge: document.getElementById("fav-count-badge"),
    
    // Search Box
    searchInput: document.getElementById("search-input"),
    
    // Bottom Playbar elements
    playbarTrackDetails: document.getElementById("playbar-track-details"),
    playbarArt: document.getElementById("playbar-art"),
    playbarSongTitle: document.getElementById("playbar-song-title"),
    playbarSongArtist: document.getElementById("playbar-song-artist"),
    playbarFavBtn: document.getElementById("playbar-fav-btn"),
    playbarPlayPauseBtn: document.getElementById("ctrl-play-pause"),
    playbarPrevBtn: document.getElementById("ctrl-prev"),
    playbarNextBtn: document.getElementById("ctrl-next"),
    playbarShuffleBtn: document.getElementById("ctrl-shuffle"),
    playbarRepeatBtn: document.getElementById("ctrl-repeat"),
    playbarLyricsBtn: document.getElementById("playbar-lyrics-btn"),
    playbarShareBtn: document.getElementById("playbar-share-btn"),
    playbarDownloadBtn: document.getElementById("playbar-download-btn"),
    playbarMuteBtn: document.getElementById("playbar-mute-btn"),
    volumeSlider: document.getElementById("volume-slider"),
    progressSlider: document.getElementById("progress-slider"),
    timeCurrent: document.getElementById("time-current"),
    timeTotal: document.getElementById("time-total"),
    mobileProgressFill: document.getElementById("mobile-progress-fill"),

    // Mobile Expanded Player Elements
    expandedPlayer: document.getElementById("expanded-player"),
    expandedCloseBtn: document.getElementById("expanded-close-btn"),
    expandedArtCover: document.getElementById("expanded-art-cover"),
    expandedTitle: document.getElementById("expanded-title"),
    expandedArtist: document.getElementById("expanded-artist"),
    expandedProgressSlider: document.getElementById("expanded-progress-slider"),
    expandedTimeCurrent: document.getElementById("expanded-time-current"),
    expandedTimeTotal: document.getElementById("expanded-time-total"),
    expandedPlayPauseBtn: document.getElementById("expanded-ctrl-play-pause"),
    expandedPrevBtn: document.getElementById("expanded-ctrl-prev"),
    expandedNextBtn: document.getElementById("expanded-ctrl-next"),
    expandedShuffleBtn: document.getElementById("expanded-ctrl-shuffle"),
    expandedRepeatBtn: document.getElementById("expanded-ctrl-repeat"),
    expandedFavBtn: document.getElementById("expanded-fav-btn"),
    expandedLyricsBtn: document.getElementById("expanded-lyrics-btn"),
    expandedShareBtn: document.getElementById("expanded-share-btn"),
    expandedDownloadBtn: document.getElementById("expanded-download-btn"),

    // Hero Spotlights
    heroSongTitle: document.getElementById("hero-song-title"),
    heroSongDesc: document.getElementById("hero-song-desc"),
    heroPlayBtn: document.getElementById("hero-play-btn"),
    heroFavBtn: document.getElementById("hero-fav-btn"),
    heroArtCover: document.getElementById("hero-art-cover"),

    // Lyrics Panel
    lyricsArt: document.getElementById("lyrics-art"),
    lyricsSongTitle: document.getElementById("lyrics-song-title"),
    lyricsSongArtist: document.getElementById("lyrics-song-artist"),
    lyricsTextDisplay: document.getElementById("lyrics-text-display"),
    lyricsEditorTextarea: document.getElementById("lyrics-editor-textarea"),
    lyricsEditBtn: document.getElementById("lyrics-edit-btn"),
    lyricsSaveBtn: document.getElementById("lyrics-save-btn"),
    lyricsCancelBtn: document.getElementById("lyrics-cancel-btn"),
    lyricsEditActions: document.getElementById("lyrics-edit-actions"),

    // Themes & Custom Theme Creator
    themeCards: document.querySelectorAll(".theme-card"),
    customPrimaryColor: document.getElementById("custom-primary-color"),
    resetThemeBtn: document.getElementById("reset-theme-btn"),
    // Modals
    modalCreatePlaylist: document.getElementById("modal-create-playlist"),
    modalAddToPlaylist: document.getElementById("modal-add-to-playlist"),
    modalShare: document.getElementById("modal-share"),
    
    // Modal buttons
    sidebarAddPlaylistBtn: document.getElementById("sidebar-add-playlist-btn"),
    createPlaylistBtn: document.getElementById("create-playlist-btn"),
    btnCancelCreatePlaylist: document.getElementById("btn-cancel-create-playlist"),
    btnCloseCreatePlaylist: document.getElementById("btn-close-create-playlist"),
    btnSavePlaylist: document.getElementById("btn-save-playlist"),
    
    btnCloseAddToPlaylist: document.getElementById("btn-close-add-to-playlist"),
    btnCloseAddDialog: document.getElementById("btn-close-add-dialog"),
    playlistSelectList: document.getElementById("playlist-select-list"),
    modalEditPlaylistSongs: document.getElementById("modal-edit-playlist-songs"),
    editPlaylistModalTitle: document.getElementById("edit-playlist-modal-title"),
    editPlaylistSongInfo: document.getElementById("edit-playlist-song-info"),
    playlistSongsEditList: document.getElementById("playlist-songs-edit-list"),
    btnCloseEditPlaylistSongs: document.getElementById("btn-close-edit-playlist-songs"),
    btnCloseEditPlaylistSongsBtn: document.getElementById("btn-close-edit-playlist-songs-btn"),

    btnCloseShare: document.getElementById("btn-close-share"),
    btnCopyLink: document.getElementById("btn-copy-link"),
    shareLinkInput: document.getElementById("share-link-input"),
    shareSongTitle: document.getElementById("share-song-title"),
    shareWhatsapp: document.getElementById("share-whatsapp"),
    shareFacebook: document.getElementById("share-facebook"),
    shareTwitter: document.getElementById("share-twitter"),
    shareTelegram: document.getElementById("share-telegram"),
    
    playlistNameInput: document.getElementById("playlist-name"),
    playlistDescInput: document.getElementById("playlist-desc"),

    // Now Playing Sidebar & 3D Elements
    nowPlayingPanel: document.getElementById("app-now-playing"),
    btnToggleNowPlaying: document.getElementById("playbar-nowplaying-btn"),
    btnCloseNowPlaying: document.getElementById("btn-close-now-playing"),
    sidebarRecentsList: document.getElementById("sidebar-recents-list"),
    cardContainer: document.getElementById("now-playing-card-container"),
    cardCoverImg: document.getElementById("card-cover-img"),
    cardSongTitle: document.getElementById("card-song-title"),
    cardSongArtist: document.getElementById("card-song-artist"),
    cardTimeCurrent: document.getElementById("card-time-current"),
    cardTimeTotal: document.getElementById("card-time-total"),
    cardProgressTrack: document.getElementById("card-progress-track"),
    cardProgressFill: document.getElementById("card-progress-fill"),
    cardProgressSlider: document.getElementById("card-progress-slider"),
    cardBeatBars: document.getElementById("card-beat-bars"),
    cardCtrlRepeat: document.getElementById("card-ctrl-repeat"),
    cardCtrlPrev: document.getElementById("card-ctrl-prev"),
    cardCtrlPlayPause: document.getElementById("card-ctrl-play-pause"),
    cardCtrlNext: document.getElementById("card-ctrl-next"),
    cardCtrlShuffle: document.getElementById("card-ctrl-shuffle"),
    cardCtrlLyrics: document.getElementById("card-ctrl-lyrics"),
    cardCtrlDownload: document.getElementById("card-ctrl-download"),
    nowPlayingBody: document.getElementById("now-playing-body"),
    sidebarLyricsPanel: document.getElementById("sidebar-lyrics-panel"),
    sidebarLyricsSnippet: document.getElementById("now-playing-lyrics-snippet"),
    modeToast: document.getElementById("mode-toast"),
    expandedVinylContainer: document.getElementById("expanded-vinyl-container"),
    expandedVinylLabel: document.getElementById("expanded-vinyl-label"),
    expandedCoverImg: document.getElementById("expanded-cover-img"),

  };

  // --- LOCAL STORAGE DATA PERSISTENCE ---
  function loadLocalStorageData() {
    // 1. Favorites
    const savedFavs = localStorage.getItem("mw_favorites");
    if (savedFavs) {
      state.favorites = JSON.parse(savedFavs);
    }

    // 2. Playlists
    const savedPlaylists = localStorage.getItem("mw_playlists");
    if (savedPlaylists) {
      state.playlists = JSON.parse(savedPlaylists);
    } else {
      // Default placeholder playlist
      state.playlists = [
        { id: 1, name: "Chill Coding Beats", desc: "Soothe your mind while writing code.", songs: [6, 7, 10] }
      ];
      savePlaylistsToStorage();
    }

    // 3. Custom user lyrics
    const savedLyrics = localStorage.getItem("mw_custom_lyrics");
    if (savedLyrics) {
      state.customLyrics = JSON.parse(savedLyrics);
    }

    // Recently played
    const savedRecents = localStorage.getItem("mw_recently_played");
    if (savedRecents) {
      state.recentlyPlayed = JSON.parse(savedRecents);
    }

    // 4. Themes — Minimalist Obsidian is the default
    const savedTheme = localStorage.getItem("mw_active_theme");
    if (savedTheme) {
      state.activeTheme = savedTheme;
    } else {
      state.activeTheme = "obsidian";
    }
    const savedAccent = localStorage.getItem("mw_custom_accent");
    if (savedAccent) {
      state.customAccent = savedAccent;
    }
  }

  function saveFavoritesToStorage() {
    localStorage.setItem("mw_favorites", JSON.stringify(state.favorites));
  }

  function savePlaylistsToStorage() {
    localStorage.setItem("mw_playlists", JSON.stringify(state.playlists));
  }

  function saveLyricsToStorage() {
    localStorage.setItem("mw_custom_lyrics", JSON.stringify(state.customLyrics));
  }

  function saveThemeToStorage() {
    localStorage.setItem("mw_active_theme", state.activeTheme);
    if (state.customAccent) {
      localStorage.setItem("mw_custom_accent", state.customAccent);
    } else {
      localStorage.removeItem("mw_custom_accent");
    }
  }

  // --- CANVAS-BASED DYNAMIC COVER ART GENERATOR ---
  const coverArtCache = {};
  function getCoverArt(songId, title, artist) {
    const cacheKey = `cover_${songId}`;
    if (coverArtCache[cacheKey]) return coverArtCache[cacheKey];

    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");

    // String hash to make specific tracks consistently render same gradients
    let hash1 = 0;
    let hash2 = 0;
    const combined = title + artist;
    for (let i = 0; i < combined.length; i++) {
      hash1 = combined.charCodeAt(i) + ((hash1 << 5) - hash1);
      hash2 = combined.charCodeAt(i) + ((hash2 << 7) - hash2);
    }

    const hue1 = Math.abs(hash1) % 360;
    const hue2 = Math.abs(hash2) % 360;

    const color1 = `hsl(${hue1}, 85%, 45%)`;
    const color2 = `hsl(${hue2}, 70%, 15%)`;

    // Linear Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 300, 300);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 300, 300);

    // Decorative vinyl lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 2;
    for (let r = 25; r < 140; r += 16) {
      ctx.beginPath();
      ctx.arc(150, 150, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Modern glowing record hub
    const gradHub = ctx.createRadialGradient(150, 150, 5, 150, 150, 25);
    gradHub.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    gradHub.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
    gradHub.addColorStop(1, "rgba(0, 0, 0, 0.4)");
    ctx.fillStyle = gradHub;
    ctx.beginPath();
    ctx.arc(150, 150, 25, 0, Math.PI * 2);
    ctx.fill();

    // Render title initials in upper area
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = "bold 64px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const initials = title
      .split(" ")
      .map(n => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    ctx.fillText(initials, 150, 150);

    // Render brand watermark
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = "500 10px Inter, sans-serif";
    ctx.fillText("MusiWave HD", 150, 270);

    const dataUrl = canvas.toDataURL();
    coverArtCache[cacheKey] = dataUrl;
    return dataUrl;
  }

  // Helper function to format duration (seconds -> MM:SS)
  function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  // --- CORE VIEW ROUTING & NAVIGATION ---
  function setView(viewName) {
    state.activeView = viewName;
    
    // Update active visual navigation tabs
    DOM.navItems.forEach(item => {
      if (item.getAttribute("data-view") === viewName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    DOM.mobileNavItems.forEach(item => {
      if (item.getAttribute("data-view") === viewName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update visibility of views panels
    DOM.panels.forEach(panel => {
      if (panel.id === `panel-${viewName}`) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });

    // Exit playlist detail view when navigating back to playlists view
    if (viewName === "playlists") {
      closePlaylistDetail();
    }

    // Refresh view states
    if (viewName === "playlists") renderPlaylists();
    if (viewName === "favorites") renderFavorites();
    if (viewName === "lyrics") renderLyricsView();
    if (viewName === "themes") renderThemesView();
  }

  // --- PLAYBACK CONTROL ENGINE ---
  
  function getSongById(id) {
    return state.songs.find(s => s.id === parseInt(id));
  }

  function hasActiveTrack() {
    return Boolean(audio.currentSrc) && !audio.currentSrc.endsWith(window.location.pathname);
  }

  function playTrack(songId) {
    const song = getSongById(songId);
    if (!song) return;

    const songIndex = state.songs.findIndex(s => s.id === song.id);
    const isSameTrack = state.currentSongIndex === songIndex && hasActiveTrack();

    state.currentSongIndex = songIndex;

    let idx = state.playbackQueue.indexOf(song.id);
    if (idx === -1) {
      loadDefaultQueue();
      idx = state.playbackQueue.indexOf(song.id);
    }
    state.queueIndex = idx;

    if (isSameTrack) {
      if (audio.paused) {
        audio.play().then(() => {
          state.isPlaying = true;
          updatePlaybarUI();
          renderAllSongsList();
        }).catch(error => {
          console.warn("Playback resume blocked.", error);
          state.isPlaying = false;
          updatePlaybarUI();
        });
      }
      updateHeroSpotlight(song);
      updateLyricsTrackInfo(song);
      return;
    }

    audio.src = song.file;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        state.isPlaying = true;
        updatePlaybarUI();
        renderAllSongsList();
      }).catch(error => {
        console.warn("Autoplay blocked by browser. Click play to start.", error);
        state.isPlaying = false;
        updatePlaybarUI();
        renderAllSongsList();
      });
    }

    updatePlaybarUI();
    renderAllSongsList();
    updateHeroSpotlight(song);
    updateLyricsTrackInfo(song);
    recordRecentlyPlayed(song.id);

    if (state.activeView === "lyrics") {
      renderLyricsView();
    }
  }

  function loadDefaultQueue() {
    // Load all songs in default order into playback queue
    state.playbackQueue = state.songs.map(s => s.id);
  }

  function togglePlay(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!hasActiveTrack()) {
      playTrack(state.songs[0].id);
      return;
    }

    if (!audio.paused) {
      audio.pause();
      state.isPlaying = false;
    } else {
      audio.play().then(() => {
        state.isPlaying = true;
        updatePlaybarUI();
        renderAllSongsList();
      }).catch(err => {
        console.error("Failed to resume audio playback", err);
        state.isPlaying = false;
        updatePlaybarUI();
      });
      return;
    }

    updatePlaybarUI();
    renderAllSongsList();
  }

  function shuffleQueueOrder() {
    if (state.playbackQueue.length < 2) return;
    const currentId = state.songs[state.currentSongIndex]?.id;
    for (let i = state.playbackQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.playbackQueue[i], state.playbackQueue[j]] = [state.playbackQueue[j], state.playbackQueue[i]];
    }
    if (currentId) {
      const idx = state.playbackQueue.indexOf(currentId);
      if (idx !== -1) state.queueIndex = idx;
    }
  }

  function showModeToast(message) {
    if (!DOM.modeToast) return;
    DOM.modeToast.textContent = message;
    DOM.modeToast.classList.add("show");
    clearTimeout(showModeToast._timer);
    showModeToast._timer = setTimeout(() => {
      DOM.modeToast.classList.remove("show");
    }, 2200);
  }

  function toggleShuffle(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (state.playbackQueue.length === 0) loadDefaultQueue();

    state.isShuffle = !state.isShuffle;

    if (state.isShuffle) {
      shuffleQueueOrder();
      showModeToast("Shuffle ON — next & previous play random songs");
    } else {
      showModeToast("Shuffle OFF — songs play in order");
    }

    updatePlaybarUI();
  }

  function toggleRepeat(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    state.isRepeat = !state.isRepeat;

    if (state.isRepeat) {
      showModeToast("Repeat ON — current song will loop");
    } else {
      showModeToast("Repeat OFF");
    }

    updatePlaybarUI();
  }

  function updateModeButtonIcons() {
    const repeatIcon = state.isRepeat
      ? '<i class="fa-solid fa-repeat"></i><span class="repeat-one-badge">1</span>'
      : '<i class="fa-solid fa-repeat"></i>';

    [DOM.playbarRepeatBtn, DOM.expandedRepeatBtn, DOM.cardCtrlRepeat].forEach(btn => {
      if (btn) btn.innerHTML = repeatIcon;
    });
  }

  function nextTrack() {
    if (state.playbackQueue.length === 0) loadDefaultQueue();

    if (state.isShuffle) {
      // Pick a random song index from queue
      state.queueIndex = Math.floor(Math.random() * state.playbackQueue.length);
    } else {
      // Regular sequence loop
      state.queueIndex = (state.queueIndex + 1) % state.playbackQueue.length;
    }

    const nextId = state.playbackQueue[state.queueIndex];
    playTrack(nextId);
  }

  function prevTrack() {
    if (state.playbackQueue.length === 0) loadDefaultQueue();

    // If song is past 3 seconds, reset timeline instead
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    if (state.isShuffle) {
      state.queueIndex = Math.floor(Math.random() * state.playbackQueue.length);
    } else {
      state.queueIndex = (state.queueIndex - 1 + state.playbackQueue.length) % state.playbackQueue.length;
    }

    const prevId = state.playbackQueue[state.queueIndex];
    playTrack(prevId);
  }

  // --- UI UPDATER FUNCTIONS ---

  function updatePlaybarUI() {
    const currentSong = state.songs[state.currentSongIndex];
    if (!currentSong) return;

    const cover = getCoverArt(currentSong.id, currentSong.title, currentSong.artist);

    // 1. Desktop Bottom Playbar Update
    DOM.playbarArt.innerHTML = `<img src="${cover}" alt="${currentSong.title}">`;
    DOM.playbarSongTitle.textContent = currentSong.title;
    DOM.playbarSongArtist.textContent = currentSong.artist;
    
    // Play/pause icon switch
    const playIcon = state.isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    DOM.playbarPlayPauseBtn.innerHTML = playIcon;

    // Heart toggle
    if (state.favorites.includes(currentSong.id)) {
      DOM.playbarFavBtn.className = "action-btn fav-btn active";
      DOM.playbarFavBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    } else {
      DOM.playbarFavBtn.className = "action-btn fav-btn";
      DOM.playbarFavBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    }

    // Toggle active badges for modes
    DOM.playbarShuffleBtn.classList.toggle("active", state.isShuffle);
    DOM.playbarRepeatBtn.classList.toggle("active", state.isRepeat);
    updateModeButtonIcons();

    // 2. Desktop Right Now Playing Sidebar Update
    if (DOM.nowPlayingPanel) {
      if (DOM.cardCoverImg) DOM.cardCoverImg.src = cover;
      if (DOM.cardSongTitle) DOM.cardSongTitle.textContent = currentSong.title;
      if (DOM.cardSongArtist) DOM.cardSongArtist.textContent = currentSong.artist;
      
      const playIcon = state.isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
      if (DOM.cardCtrlPlayPause) DOM.cardCtrlPlayPause.innerHTML = playIcon;
      
      if (DOM.cardCtrlShuffle) DOM.cardCtrlShuffle.classList.toggle("active", state.isShuffle);
      if (DOM.cardCtrlRepeat) DOM.cardCtrlRepeat.classList.toggle("active", state.isRepeat);

      // Playback State animations
      if (DOM.cardContainer) {
        if (state.isPlaying) {
          DOM.cardContainer.classList.add("playing");
          DOM.cardContainer.classList.remove("paused");
        } else {
          DOM.cardContainer.classList.add("paused");
          DOM.cardContainer.classList.remove("playing");
        }
      }
      if (DOM.cardBeatBars) {
        DOM.cardBeatBars.classList.toggle("animating", state.isPlaying);
      }

      updateSidebarLyrics();
      
      // Render the sidebar recents list to keep it updated with active states
      renderSidebarRecents();
    }

    // 3. Mobile Expanded Player Update
    if (DOM.expandedPlayer) {
      DOM.expandedCoverImg.src = cover;
      
      const initials = currentSong.title.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      DOM.expandedVinylLabel.textContent = initials;
      DOM.expandedVinylLabel.style.color = "white";
      DOM.expandedVinylLabel.style.fontSize = "12px";
      DOM.expandedVinylLabel.style.fontWeight = "bold";
      DOM.expandedVinylLabel.style.textShadow = "0 1px 3px rgba(0,0,0,0.8)";
      
      DOM.expandedTitle.textContent = currentSong.title;
      DOM.expandedArtist.textContent = currentSong.artist;
      DOM.expandedPlayPauseBtn.innerHTML = playIcon;

      if (state.favorites.includes(currentSong.id)) {
        DOM.expandedFavBtn.className = "action-btn fav-btn active";
        DOM.expandedFavBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
      } else {
        DOM.expandedFavBtn.className = "action-btn fav-btn";
        DOM.expandedFavBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
      }

      DOM.expandedShuffleBtn.classList.toggle("active", state.isShuffle);
      DOM.expandedRepeatBtn.classList.toggle("active", state.isRepeat);

      // Playback State animations for mobile expanded disc
      if (state.isPlaying) {
        DOM.expandedVinylContainer.classList.add("playing");
        DOM.expandedVinylContainer.classList.remove("paused");
      } else {
        DOM.expandedVinylContainer.classList.add("paused");
        DOM.expandedVinylContainer.classList.remove("playing");
      }
    }
  }

  function updateHeroSpotlight(song) {
    if (!song) return;
    const cover = getCoverArt(song.id, song.title, song.artist);
    DOM.heroArtCover.innerHTML = `<img src="${cover}" alt="${song.title}">`;
    DOM.heroSongTitle.textContent = song.title;
    DOM.heroSongDesc.textContent = `Performing Artist: ${song.artist} | Album Track: ${song.album || 'MusiWave Hits'}. Expand detail views, edit lyrics, share with friends, or download high-fidelity local copy!`;
    
    if (state.favorites.includes(song.id)) {
      DOM.heroFavBtn.innerHTML = '<i class="fa-solid fa-heart" style="color: #ff5e62;"></i> Favorited';
    } else {
      DOM.heroFavBtn.innerHTML = '<i class="fa-regular fa-heart"></i> Add to Favorite';
    }
  }

  function updateLyricsTrackInfo(song) {
    if (!song) return;
    const cover = getCoverArt(song.id, song.title, song.artist);
    DOM.lyricsArt.innerHTML = `<img src="${cover}" alt="${song.title}">`;
    DOM.lyricsSongTitle.textContent = song.title;
    DOM.lyricsSongArtist.textContent = song.artist;
  }

  // --- SONGS RENDERING LISTS ---

  function createSongRow(song, idx, listType = "all") {
    const isPlayingThis = (state.isPlaying && state.songs[state.currentSongIndex].id === song.id);
    const isSelectedThis = (state.songs[state.currentSongIndex].id === song.id);
    const isFav = state.favorites.includes(song.id);
    const cover = getCoverArt(song.id, song.title, song.artist);
    
    const rowClass = `song-row ${isSelectedThis ? 'playing' : ''}`;
    
    // Add dynamic row
    const row = document.createElement("div");
    row.className = rowClass;
    row.setAttribute("data-song-id", song.id);

    row.innerHTML = `
      <div class="song-index" data-id="${song.id}">
        <span class="song-index-num">${idx + 1}</span>
        <div class="song-index-wave">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="song-meta-cell">
        <div class="song-thumbnail">
          <img src="${cover}" alt="cover">
        </div>
        <div class="song-name-artist">
          <span class="song-name">${song.title}</span>
          <span class="song-artist">${song.artist}</span>
        </div>
      </div>
      <div class="song-album">${song.album || 'Single'}</div>
      <div class="song-duration">--:--</div>
      <div class="song-actions">
        <button class="action-btn fav-btn ${isFav ? 'active' : ''}" data-action="fav" data-id="${song.id}">
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
        <button class="action-btn" data-action="add-playlist" data-id="${song.id}" title="Add to Playlist">
          <i class="fa-solid fa-circle-plus"></i>
        </button>
        <button class="action-btn" data-action="download" data-id="${song.id}" title="Download">
          <i class="fa-solid fa-circle-down"></i>
        </button>
        <button class="action-btn" data-action="share" data-id="${song.id}" title="Share Link">
          <i class="fa-solid fa-share-nodes"></i>
        </button>
        ${listType === 'playlist' ? `
          <button class="action-btn remove-playlist-btn" data-action="remove-from-playlist" data-id="${song.id}" title="Remove from Playlist" style="color: #ff5e62;">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        ` : ''}
      </div>
    `;

    // Click play trigger
    row.addEventListener("click", (e) => {
      // Prevent song play if clicking action buttons
      if (e.target.closest("button") || e.target.closest(".action-btn")) return;
      
      // Load context queue
      if (listType === "all") {
        state.playbackQueue = state.songs.map(s => s.id);
      } else if (listType === "favorites") {
        state.playbackQueue = [...state.favorites];
      } else if (listType === "playlist" && state.activePlaylistId) {
        const playlist = state.playlists.find(p => p.id === state.activePlaylistId);
        if (playlist) state.playbackQueue = [...playlist.songs];
      }
      
      playTrack(song.id);
    });

    // Handle internal triggers inside row
    row.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = btn.getAttribute("data-action");
        const songId = parseInt(btn.getAttribute("data-id"));
        
        if (action === "fav") {
          toggleFavorite(songId);
        } else if (action === "add-playlist") {
          openAddToPlaylistModal(songId);
        } else if (action === "download") {
          const targetSong = getSongById(songId);
          if (targetSong) triggerDownload(targetSong);
        } else if (action === "share") {
          openShareModal(songId);
        } else if (action === "remove-from-playlist") {
          removeSongFromPlaylist(state.activePlaylistId, songId);
        }
      });
    });

    // Use placeholder duration immediately for fast initial rendering.
    // Audio metadata is loaded only when playback starts to avoid blocking refresh.
    return row;
  }

  let allSongsRenderToken = 0;

  function renderAllSongsList() {
    DOM.allSongsList.innerHTML = "";
    const query = DOM.searchInput.value.toLowerCase().trim();
    
    const filteredSongs = state.songs.filter(song => {
      return song.title.toLowerCase().includes(query) || 
             song.artist.toLowerCase().includes(query) || 
             (song.album && song.album.toLowerCase().includes(query));
    });

    DOM.songsCountBadge.textContent = `${filteredSongs.length} song${filteredSongs.length !== 1 ? 's' : ''}`;

    if (filteredSongs.length === 0) {
      DOM.allSongsList.innerHTML = `<div style="padding: 32px; text-align: center; color: var(--text-muted);">No matching tracks found. Try a different search!</div>`;
      return;
    }

    allSongsRenderToken += 1;
    const renderToken = allSongsRenderToken;
    const chunkSize = 30;

    const scheduleChunk = (callback) => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(callback, { timeout: 100 });
      } else {
        setTimeout(callback, 0);
      }
    };

    const renderChunk = (startIndex) => {
      if (renderToken !== allSongsRenderToken) return;

      const endIndex = Math.min(filteredSongs.length, startIndex + chunkSize);
      for (let idx = startIndex; idx < endIndex; idx += 1) {
        const song = filteredSongs[idx];
        const row = createSongRow(song, idx, "all");
        DOM.allSongsList.appendChild(row);
      }

      if (endIndex < filteredSongs.length) {
        scheduleChunk(() => renderChunk(endIndex));
      }
    };

    renderChunk(0);
  }

  // --- FAVORITES MODULE ---
  
  function toggleFavorite(songId) {
    const idx = state.favorites.indexOf(songId);
    if (idx === -1) {
      state.favorites.push(songId);
    } else {
      state.favorites.splice(idx, 1);
    }
    saveFavoritesToStorage();
    
    // Update active playbar hearts
    updatePlaybarUI();
    
    // Refresh all lists
    renderAllSongsList();
    if (state.activeView === "favorites") renderFavorites();
    if (state.activeView === "playlists" && state.activePlaylistId) renderPlaylistDetail(state.activePlaylistId);
    
    // Update active hero button if current song changed favorites
    const currentSong = state.songs[state.currentSongIndex];
    if (currentSong && currentSong.id === songId) {
      updateHeroSpotlight(currentSong);
    }
  }

  function renderFavorites() {
    DOM.favoritesSongsList.innerHTML = "";
    DOM.favCountBadge.textContent = `${state.favorites.length} song${state.favorites.length !== 1 ? 's' : ''}`;

    if (state.favorites.length === 0) {
      DOM.favoritesSongsList.innerHTML = `
        <div style="padding: 48px; text-align: center; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <i class="fa-regular fa-heart" style="font-size: 48px; color: var(--border);"></i>
          <p>No favorite tracks saved yet. Click the heart icons next to any song to build your favorites list!</p>
        </div>`;
      return;
    }

    state.favorites.forEach((favId, idx) => {
      const song = getSongById(favId);
      if (song) {
        const row = createSongRow(song, idx, "favorites");
        DOM.favoritesSongsList.appendChild(row);
      }
    });
  }

  function recordRecentlyPlayed(songId) {
    if (!songId) return;

    // Filter out if duplicate so it shifts to top
    state.recentlyPlayed = state.recentlyPlayed.filter(id => id !== songId);
    state.recentlyPlayed.unshift(songId);

    // Keep only last 6
    if (state.recentlyPlayed.length > 6) {
      state.recentlyPlayed.pop();
    }

    localStorage.setItem("mw_recently_played", JSON.stringify(state.recentlyPlayed));
    renderSidebarRecents();
  }

  function renderSidebarRecents() {
    if (!DOM.sidebarRecentsList) return;

    DOM.sidebarRecentsList.innerHTML = "";

    const recentIds = state.recentlyPlayed.slice(0, 3);

    if (recentIds.length === 0) {
      DOM.sidebarRecentsList.innerHTML = `<div class="sidebar-recents-empty">No recently played songs yet.</div>`;
      return;
    }

    recentIds.forEach(songId => {
      const song = getSongById(songId);
      if (!song) return;

      const cover = getCoverArt(song.id, song.title, song.artist);
      const currentSong = state.songs[state.currentSongIndex];
      const isSelected = currentSong && currentSong.id === song.id;
      
      const row = document.createElement("div");
      row.className = `recent-mini-row ${isSelected ? 'active' : ''}`;
      row.innerHTML = `
        <div class="recent-mini-art">
          <img src="${cover}" alt="cover">
          ${isSelected && state.isPlaying ? '<div class="mini-play-overlay"><i class="fa-solid fa-volume-high"></i></div>' : ''}
        </div>
        <div class="recent-mini-info">
          <span class="recent-mini-title">${song.title}</span>
          <span class="recent-mini-artist">${song.artist}</span>
        </div>
        <button class="recent-mini-play-btn" title="Play Now">
          <i class="fa-solid ${isSelected && state.isPlaying ? 'fa-pause' : 'fa-play'}"></i>
        </button>
      `;

      row.addEventListener("click", (e) => {
        if (e.target.closest(".recent-mini-play-btn")) {
          e.stopPropagation();
          if (isSelected) {
            togglePlay(e);
          } else {
            state.playbackQueue = state.songs.map(s => s.id);
            playTrack(song.id);
          }
          return;
        }
        if (isSelected) {
          togglePlay(e);
          return;
        }
        state.playbackQueue = state.songs.map(s => s.id);
        playTrack(song.id);
      });

      DOM.sidebarRecentsList.appendChild(row);
    });
  }

  // --- PLAYLIST OPERATIONS MANAGER ---

  function renderPlaylists() {
    // Clear sidebar listing & grid listing
    DOM.sidebarPlaylists.innerHTML = "";
    
    // Hide details view, show grid view by default
    DOM.playlistsGrid.innerHTML = "";

    // 1. Sidebar listing
    state.playlists.forEach(pl => {
      const sidebarItem = document.createElement("div");
      sidebarItem.className = "playlist-item";
      sidebarItem.setAttribute("data-playlist-id", pl.id);
      
      sidebarItem.innerHTML = `
        <div class="playlist-info">
          <i class="fa-solid fa-list-music"></i>
          <span>${pl.name}</span>
        </div>
        <i class="fa-regular fa-trash-can delete-playlist-btn" title="Delete Playlist"></i>
      `;

      // Sidebar playlist click -> open details
      sidebarItem.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-playlist-btn")) {
          e.stopPropagation();
          deletePlaylist(pl.id);
          return;
        }
        setView("playlists");
        openPlaylistDetail(pl.id);
      });

      DOM.sidebarPlaylists.appendChild(sidebarItem);

      // 2. Playlists Grid panel cards
      const card = document.createElement("div");
      card.className = "playlist-card";
      
      // Calculate first song cover for card or standard gradient
      let coverImgHTML = `<i class="fa-solid fa-compact-disc"></i>`;
      if (pl.songs.length > 0) {
        const firstSong = getSongById(pl.songs[0]);
        if (firstSong) {
          const cover = getCoverArt(firstSong.id, firstSong.title, firstSong.artist);
          coverImgHTML = `<img src="${cover}" alt="cover">`;
        }
      }

      card.innerHTML = `
        <div class="playlist-card-cover">
          ${coverImgHTML}
        </div>
        <span class="playlist-card-title">${pl.name}</span>
        <span class="playlist-card-desc">${pl.desc || 'No description provided.'}</span>
        <button class="playlist-card-play" title="Play Now">
          <i class="fa-solid fa-play"></i>
        </button>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.closest(".playlist-card-play")) {
          e.stopPropagation();
          playPlaylistSequence(pl.id);
          return;
        }
        openPlaylistDetail(pl.id);
      });

      DOM.playlistsGrid.appendChild(card);
    });
  }

  function playPlaylistSequence(playlistId) {
    const pl = state.playlists.find(p => p.id === playlistId);
    if (!pl || pl.songs.length === 0) {
      alert("This playlist has no songs! Open the playlist and add tracks first.");
      return;
    }

    state.playbackQueue = [...pl.songs];
    state.queueIndex = 0;
    playTrack(pl.songs[0]);
  }

  function createNewPlaylist(name, desc) {
    if (!name.trim()) return;

    const newId = state.playlists.length > 0 ? Math.max(...state.playlists.map(p => p.id)) + 1 : 1;
    const newPlaylist = {
      id: newId,
      name: name,
      desc: desc || "Custom user collection.",
      songs: []
    };

    state.playlists.push(newPlaylist);
    savePlaylistsToStorage();
    renderPlaylists();
    closeAllModals();
  }

  function deletePlaylist(playlistId) {
    if (confirm("Are you sure you want to delete this playlist? This action cannot be undone.")) {
      state.playlists = state.playlists.filter(p => p.id !== playlistId);
      savePlaylistsToStorage();
      renderPlaylists();
      
      // If we are currently viewing this playlist details, go back
      if (state.activePlaylistId === playlistId) {
        closePlaylistDetail();
      }
    }
  }

  function openPlaylistDetail(playlistId) {
    state.activePlaylistId = playlistId;
    const pl = state.playlists.find(p => p.id === playlistId);
    if (!pl) return;

    DOM.playlistsGrid.style.display = "none";
    DOM.playlistDetailView.style.display = "block";
    DOM.createPlaylistBtn.style.display = "none";

    DOM.playlistDetailTitle.textContent = pl.name;
    DOM.playlistDetailDesc.textContent = pl.desc;
    DOM.playlistDetailMeta.textContent = `${pl.songs.length} song${pl.songs.length !== 1 ? 's' : ''}`;

    // Generate cover art preview
    let coverHTML = `<i class="fa-solid fa-music"></i>`;
    if (pl.songs.length > 0) {
      const firstSong = getSongById(pl.songs[0]);
      if (firstSong) {
        coverHTML = `<img src="${getCoverArt(firstSong.id, firstSong.title, firstSong.artist)}" alt="cover">`;
      }
    }
    DOM.playlistDetailCover.innerHTML = coverHTML;

    // Load songs list table
    DOM.playlistSongsList.innerHTML = "";
    if (pl.songs.length === 0) {
      DOM.playlistSongsList.innerHTML = `
        <div style="padding: 48px; text-align: center; color: var(--text-muted);">
          <i class="fa-solid fa-circle-plus" style="font-size: 32px; margin-bottom: 12px; color: var(--border);"></i>
          <p>No tracks added to this playlist yet. Browse "Home & Library" to add some tunes!</p>
        </div>`;
      return;
    }

    pl.songs.forEach((songId, idx) => {
      const song = getSongById(songId);
      if (song) {
        const row = createSongRow(song, idx, "playlist");
        DOM.playlistSongsList.appendChild(row);
      }
    });
  }

  function closePlaylistDetail() {
    state.activePlaylistId = null;
    DOM.playlistDetailView.style.display = "none";
    DOM.playlistsGrid.style.display = "grid";
    DOM.createPlaylistBtn.style.display = "flex";
  }

  function renderEditPlaylistSongsList(filterText = "") {
    if (!DOM.playlistSongsEditList || !state.editingPlaylistId) return;

    const pl = state.playlists.find(p => p.id === state.editingPlaylistId);
    if (!pl) return;

    const query = filterText.trim().toLowerCase();
    DOM.playlistSongsEditList.innerHTML = "";

    const matchingSongs = state.songs.filter(song => {
      return !query || song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query);
    });

    if (matchingSongs.length === 0) {
      DOM.playlistSongsEditList.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted);">
          No songs matched your search.
        </div>`;
      return;
    }

    matchingSongs.forEach(song => {
      const selected = state.editingPlaylistSelection.has(song.id);
      const cover = getCoverArt(song.id, song.title, song.artist);
      const item = document.createElement("div");
      item.className = `playlist-select-item ${selected ? 'selected' : ''}`;
      item.innerHTML = `
        <div class="song-meta-cell playlist-edit-meta">
          <div class="song-thumbnail">
            <img src="${cover}" alt="${song.title}">
          </div>
          <div class="song-name-artist">
            <span class="song-name">${song.title}</span>
            <span class="song-artist">${song.artist}</span>
          </div>
        </div>
        <i class="fa-solid fa-circle-check"></i>
      `;

      item.addEventListener("click", () => {
        if (state.editingPlaylistSelection.has(song.id)) {
          state.editingPlaylistSelection.delete(song.id);
          item.classList.remove("selected");
        } else {
          state.editingPlaylistSelection.add(song.id);
          item.classList.add("selected");
        }
      });

      DOM.playlistSongsEditList.appendChild(item);
    });
  }

  function openEditPlaylistSongsModal(playlistId) {
    const pl = state.playlists.find(p => p.id === playlistId);
    if (!pl) return;

    state.editingPlaylistId = playlistId;
    state.editingPlaylistSelection = new Set(pl.songs);
    DOM.modalEditPlaylistSongs.classList.add("active");
    DOM.editPlaylistModalTitle.textContent = `Edit "${pl.name}" Songs`;
    DOM.editPlaylistSongInfo.textContent = `Search and select songs to add or remove from "${pl.name}."`;
    DOM.playlistEditSearchInput.value = "";
    renderEditPlaylistSongsList();
  }

  function openAddToPlaylistModal(songId) {
    const song = getSongById(songId);
    if (!song) return;

    DOM.modalAddToPlaylist.classList.add("active");
    DOM.playlistSelectList.innerHTML = "";
    document.getElementById("add-to-playlist-song-info").textContent = `Add "${song.title}" by ${song.artist} to playlists:`;

    state.playlists.forEach(pl => {
      const hasSong = pl.songs.includes(song.id);
      
      const item = document.createElement("div");
      item.className = `playlist-select-item ${hasSong ? 'selected' : ''}`;
      
      item.innerHTML = `
        <span>${pl.name}</span>
        <i class="fa-solid fa-circle-check"></i>
      `;

      item.addEventListener("click", () => {
        if (hasSong) {
          // Remove song
          pl.songs = pl.songs.filter(id => id !== song.id);
          item.classList.remove("selected");
        } else {
          // Add song
          pl.songs.push(song.id);
          item.classList.add("selected");
        }
        savePlaylistsToStorage();
        renderPlaylists();
        
        // If viewing current detail list, refresh
        if (state.activePlaylistId === pl.id) {
          openPlaylistDetail(pl.id);
        }
      });

      DOM.playlistSelectList.appendChild(item);
    });
  }

  function removeSongFromPlaylist(playlistId, songId) {
    const pl = state.playlists.find(p => p.id === playlistId);
    if (!pl) return;

    pl.songs = pl.songs.filter(id => id !== songId);
    savePlaylistsToStorage();
    renderPlaylists();
    openPlaylistDetail(playlistId);
  }

  // --- LYRICS VIEW PANEL ---

  function getLyricsText(song) {
    if (!song) return "No song selected. Play a track to view lyrics.";
    if (state.customLyrics[song.id] !== undefined) {
      return state.customLyrics[song.id];
    }
    return song.lyrics || "No lyrics available for this track.";
  }

  function updateSidebarLyrics() {
    if (!DOM.sidebarLyricsSnippet) return;
    const currentSong = state.songs[state.currentSongIndex];
    DOM.sidebarLyricsSnippet.textContent = getLyricsText(currentSong);
  }

  function toggleSidebarLyrics() {
    state.sidebarLyricsOpen = !state.sidebarLyricsOpen;

    if (DOM.sidebarLyricsPanel) {
      DOM.sidebarLyricsPanel.classList.toggle("visible", state.sidebarLyricsOpen);
    }
    if (DOM.cardCtrlLyrics) {
      DOM.cardCtrlLyrics.classList.toggle("active", state.sidebarLyricsOpen);
    }

    if (state.sidebarLyricsOpen) {
      updateSidebarLyrics();
      setTimeout(() => {
        if (DOM.sidebarLyricsSnippet) {
          DOM.sidebarLyricsSnippet.scrollTop = 0;
        }
      }, 50);
    }
  }

  function renderLyricsView() {
    const currentSong = state.songs[state.currentSongIndex];
    if (!currentSong) {
      DOM.lyricsTextDisplay.textContent = "No song selected. Start playing music to view and edit lyrics!";
      DOM.lyricsEditBtn.style.display = "none";
      return;
    }

    DOM.lyricsEditBtn.style.display = "flex";
    
    // Load custom lyrics if edited, otherwise load default
    const text = state.customLyrics[currentSong.id] !== undefined ? state.customLyrics[currentSong.id] : currentSong.lyrics;
    DOM.lyricsTextDisplay.textContent = text;
    updateLyricsTrackInfo(currentSong);
    updateSidebarLyrics();
  }

  function enableLyricsEditing() {
    const currentSong = state.songs[state.currentSongIndex];
    if (!currentSong) return;

    const currentText = state.customLyrics[currentSong.id] !== undefined ? state.customLyrics[currentSong.id] : currentSong.lyrics;
    
    DOM.lyricsEditorTextarea.value = currentText;
    DOM.lyricsTextDisplay.style.display = "none";
    DOM.lyricsEditorTextarea.style.display = "block";
    DOM.lyricsEditBtn.style.display = "none";
    DOM.lyricsEditActions.style.display = "flex";
  }

  function saveLyricsText() {
    const currentSong = state.songs[state.currentSongIndex];
    if (!currentSong) return;

    const text = DOM.lyricsEditorTextarea.value;
    state.customLyrics[currentSong.id] = text;
    saveLyricsToStorage();

    DOM.lyricsTextDisplay.textContent = text;
    updateSidebarLyrics();
    cancelLyricsEditing();
  }

  function cancelLyricsEditing() {
    DOM.lyricsTextDisplay.style.display = "block";
    DOM.lyricsEditorTextarea.style.display = "none";
    DOM.lyricsEditBtn.style.display = "flex";
    DOM.lyricsEditActions.style.display = "none";
  }

  // --- PRESET & CUSTOM COLOR THEMES SWITCHER ---

  function applyActiveTheme() {
    // 1. Remove all old theme classes on body
    document.body.className = "";
    
    // 2. Add selected theme preset class
    document.body.classList.add(`theme-${state.activeTheme}`);

    // Update active theme classes
    DOM.themeCards.forEach(card => {
      if (card.getAttribute("data-theme") === state.activeTheme) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });

    // 3. Custom primary colors
    if (state.activeTheme === "custom" && state.customAccent) {
      applyCustomAccent(state.customAccent);
    } else {
      // Clear custom properties
      document.documentElement.style.removeProperty("--primary");
      document.documentElement.style.removeProperty("--primary-glow");
    }

    saveThemeToStorage();
  }

  function hexToRgba(hex, alpha) {
    let r = 29, g = 185, b = 84;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      let c = hex.substring(1).split("");
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      const val = parseInt("0x" + c.join(""));
      r = (val >> 16) & 255;
      g = (val >> 8) & 255;
      b = val & 255;
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function applyCustomAccent(colorHex) {
    state.customAccent = colorHex;
    document.documentElement.style.setProperty("--primary", colorHex);
    document.documentElement.style.setProperty("--primary-glow", hexToRgba(colorHex, 0.35));
    DOM.customPrimaryColor.value = colorHex;
  }

  function renderThemesView() {
    DOM.themeCards.forEach(card => {
      const th = card.getAttribute("data-theme");
      card.classList.toggle("active", th === state.activeTheme);
    });

    if (state.customAccent) {
      DOM.customPrimaryColor.value = state.customAccent;
    }
  }

  // --- DOWNLOAD & SHARING SYSTEMS ---

  function triggerDownload(song) {
    if (!song || !song.file) return;
    const ext = (song.file.split(".").pop() || "mp3").replace(/\?.*$/, "");
    const link = document.createElement("a");
    link.href = song.file;
    link.download = `${song.title} - ${song.artist}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showModeToast(`Downloading "${song.title}"...`);
  }

  function openShareModal(songId) {
    const song = getSongById(songId);
    if (!song) return;

    // Create shareable link format: url?song=ID
    const path = window.location.href.split("?")[0];
    const url = `${path}?song=${song.id}`;

    DOM.shareLinkInput.value = url;
    DOM.shareSongTitle.textContent = `Share "${song.title}" by ${song.artist} with friends:`;
    
    // Set social href triggers
    DOM.shareWhatsapp.href = `https://api.whatsapp.com/send?text=Check%20out%20this%20awesome%20song!%20%20${encodeURIComponent(song.title)}%20by%20${encodeURIComponent(song.artist)}%20-%20${encodeURIComponent(url)}`;
    DOM.shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    DOM.shareTwitter.href = `https://twitter.com/intent/tweet?text=Listening%20to%20${encodeURIComponent(song.title)}%20on%20MusiWave!%20&url=${encodeURIComponent(url)}`;
    DOM.shareTelegram.href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=Listen%20to%20${encodeURIComponent(song.title)}`;

    DOM.modalShare.classList.add("active");
  }

  // --- QUERY LOAD INITIALIZER ---
  function parseUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    const songId = params.get("song");
    if (songId) {
      const parsedId = parseInt(songId);
      const song = getSongById(parsedId);
      if (song) {
        // Wait briefly for page render to build queue and play
        setTimeout(() => {
          playTrack(song.id);
        }, 800);
      }
    } else {
      // Pick first song as spotlight default cover (but do not play yet)
      updateHeroSpotlight(state.songs[0]);
      updateLyricsTrackInfo(state.songs[0]);
      updatePlaybarUI();
    }
  }

  // --- MODALS OPEN/CLOSE MANAGER ---
  function closeAllModals() {
    DOM.modalCreatePlaylist.classList.remove("active");
    DOM.modalAddToPlaylist.classList.remove("active");
    DOM.modalEditPlaylistSongs.classList.remove("active");
    DOM.modalShare.classList.remove("active");
  }

  // --- AUDIO LOGIC EVENT BINDINGS ---

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration || state.isSeeking) return;

    const progress = (audio.currentTime / audio.duration) * 100;
    const currentLabel = formatTime(audio.currentTime);
    const totalLabel = formatTime(audio.duration);

    DOM.progressSlider.value = progress;
    DOM.timeCurrent.textContent = currentLabel;
    DOM.timeTotal.textContent = totalLabel;

    DOM.mobileProgressFill.style.width = `${progress}%`;

    DOM.expandedProgressSlider.value = progress;
    DOM.expandedTimeCurrent.textContent = currentLabel;
    DOM.expandedTimeTotal.textContent = totalLabel;

    if (DOM.cardTimeCurrent) DOM.cardTimeCurrent.textContent = currentLabel;
    if (DOM.cardTimeTotal) DOM.cardTimeTotal.textContent = totalLabel;
    if (DOM.cardProgressFill) DOM.cardProgressFill.style.width = `${progress}%`;
    if (DOM.cardProgressSlider) DOM.cardProgressSlider.value = progress;
    updateAllProgressSliderBackgrounds();
  });

  audio.addEventListener("ended", () => {
    if (state.isRepeat) {
      audio.currentTime = 0;
      audio.play().then(() => {
        state.isPlaying = true;
        updatePlaybarUI();
      }).catch(err => console.log(err));
    } else {
      nextTrack();
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    DOM.timeTotal.textContent = formatTime(audio.duration);
    DOM.expandedTimeTotal.textContent = formatTime(audio.duration);
    updateAllProgressSliderBackgrounds();
  });

  // --- USER INTERACTION EVENT LISTENERS ---

  // Progress Bar Seek controls
  function handleProgressSeek(sliderVal) {
    if (!audio.duration) return;
    const seekTime = (sliderVal / 100) * audio.duration;
    audio.currentTime = seekTime;

    const currentLabel = formatTime(seekTime);
    DOM.timeCurrent.textContent = currentLabel;
    DOM.expandedTimeCurrent.textContent = currentLabel;
    if (DOM.cardTimeCurrent) DOM.cardTimeCurrent.textContent = currentLabel;

    DOM.progressSlider.value = sliderVal;
    DOM.expandedProgressSlider.value = sliderVal;
    if (DOM.cardProgressSlider) DOM.cardProgressSlider.value = sliderVal;

    DOM.mobileProgressFill.style.width = `${sliderVal}%`;
    if (DOM.cardProgressFill) DOM.cardProgressFill.style.width = `${sliderVal}%`;
    updateAllProgressSliderBackgrounds();
  }

  function updateRangeSliderBackground(slider) {
    if (!slider) return;
    const value = parseFloat(slider.value) || 0;
    slider.style.background = `linear-gradient(90deg, var(--primary) ${value}%, var(--slider-bg) ${value}%)`;
  }

  function updateAllProgressSliderBackgrounds(value) {
    updateRangeSliderBackground(DOM.progressSlider);
    updateRangeSliderBackground(DOM.expandedProgressSlider);
    updateRangeSliderBackground(DOM.cardProgressSlider);
  }

  function bindProgressSeek(slider) {
    if (!slider) return;
    const startSeek = () => { state.isSeeking = true; };
    const endSeek = () => { state.isSeeking = false; };

    slider.addEventListener("mousedown", startSeek);
    slider.addEventListener("touchstart", startSeek, { passive: true });
    slider.addEventListener("input", () => {
      handleProgressSeek(slider.value);
      updateRangeSliderBackground(slider);
    });
    slider.addEventListener("mouseup", endSeek);
    slider.addEventListener("touchend", endSeek);
    slider.addEventListener("change", endSeek);
  }

  bindProgressSeek(DOM.progressSlider);
  bindProgressSeek(DOM.expandedProgressSlider);
  bindProgressSeek(DOM.cardProgressSlider);

  document.addEventListener("mouseup", () => { state.isSeeking = false; });
  document.addEventListener("touchend", () => { state.isSeeking = false; });

  // Mute volume control
  DOM.playbarMuteBtn.addEventListener("click", () => {
    if (audio.muted) {
      audio.muted = false;
      DOM.playbarMuteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      DOM.volumeSlider.value = state.currentVolume;
    } else {
      audio.muted = true;
      DOM.playbarMuteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      DOM.volumeSlider.value = 0;
    }
  });

  DOM.volumeSlider.addEventListener("input", () => {
    state.currentVolume = DOM.volumeSlider.value;
    audio.volume = state.currentVolume;
    audio.muted = (state.currentVolume === 0);
    
    // Switch speaker icons
    if (audio.muted) {
      DOM.playbarMuteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else if (state.currentVolume < 0.4) {
      DOM.playbarMuteBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
    } else {
      DOM.playbarMuteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
  });

  // Playback Controls
  DOM.playbarPlayPauseBtn.addEventListener("click", (e) => togglePlay(e));
  DOM.expandedPlayPauseBtn.addEventListener("click", (e) => togglePlay(e));
  if (DOM.cardCtrlPlayPause) DOM.cardCtrlPlayPause.addEventListener("click", (e) => togglePlay(e));

  DOM.playbarNextBtn.addEventListener("click", (e) => { e.stopPropagation(); nextTrack(); });
  DOM.expandedNextBtn.addEventListener("click", (e) => { e.stopPropagation(); nextTrack(); });
  if (DOM.cardCtrlNext) DOM.cardCtrlNext.addEventListener("click", (e) => { e.stopPropagation(); nextTrack(); });

  DOM.playbarPrevBtn.addEventListener("click", (e) => { e.stopPropagation(); prevTrack(); });
  DOM.expandedPrevBtn.addEventListener("click", (e) => { e.stopPropagation(); prevTrack(); });
  if (DOM.cardCtrlPrev) DOM.cardCtrlPrev.addEventListener("click", (e) => { e.stopPropagation(); prevTrack(); });

  DOM.playbarShuffleBtn.addEventListener("click", (e) => toggleShuffle(e));
  DOM.expandedShuffleBtn.addEventListener("click", (e) => toggleShuffle(e));
  if (DOM.cardCtrlShuffle) {
    DOM.cardCtrlShuffle.addEventListener("click", (e) => toggleShuffle(e));
  }

  if (DOM.cardCtrlLyrics) {
    DOM.cardCtrlLyrics.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSidebarLyrics();
    });
  }

  if (DOM.cardCtrlDownload) {
    DOM.cardCtrlDownload.addEventListener("click", (e) => {
      e.stopPropagation();
      const currentSong = state.songs[state.currentSongIndex];
      if (currentSong) triggerDownload(currentSong);
    });
  }

  DOM.playbarRepeatBtn.addEventListener("click", (e) => toggleRepeat(e));
  DOM.expandedRepeatBtn.addEventListener("click", (e) => toggleRepeat(e));
  if (DOM.cardCtrlRepeat) {
    DOM.cardCtrlRepeat.addEventListener("click", (e) => toggleRepeat(e));
  }

  DOM.playbarFavBtn.addEventListener("click", () => {
    const currentSong = state.songs[state.currentSongIndex];
    if (currentSong) toggleFavorite(currentSong.id);
  });
  DOM.expandedFavBtn.addEventListener("click", () => {
    const currentSong = state.songs[state.currentSongIndex];
    if (currentSong) toggleFavorite(currentSong.id);
  });

  // Spotlights Play Button
  DOM.heroPlayBtn.addEventListener("click", () => {
    const currentSong = state.songs[state.currentSongIndex];
    if (currentSong) {
      if (state.songs[state.currentSongIndex].id === state.songs[0].id && !hasActiveTrack()) {
        playTrack(state.songs[0].id);
      } else {
        togglePlay();
      }
    }
  });

  DOM.heroFavBtn.addEventListener("click", () => {
    const currentSong = state.songs[state.currentSongIndex];
    if (currentSong) toggleFavorite(currentSong.id);
  });

  // Page Navigation
  DOM.navItems.forEach(item => {
    item.addEventListener("click", () => {
      const v = item.getAttribute("data-view");
      setView(v);
    });
  });

  DOM.mobileNavItems.forEach(item => {
    item.addEventListener("click", () => {
      const v = item.getAttribute("data-view");
      setView(v);
    });
  });

  // Search trigger
  DOM.searchInput.addEventListener("input", renderAllSongsList);

  // Now Playing Toggle actions
  if (DOM.btnToggleNowPlaying) {
    DOM.btnToggleNowPlaying.addEventListener("click", () => {
      DOM.nowPlayingPanel.classList.toggle("collapsed");
      const isCollapsed = DOM.nowPlayingPanel.classList.contains("collapsed");
      DOM.btnToggleNowPlaying.style.color = isCollapsed ? "var(--text-muted)" : "var(--primary)";
    });
  }

  if (DOM.btnCloseNowPlaying) {
    DOM.btnCloseNowPlaying.addEventListener("click", () => {
      DOM.nowPlayingPanel.classList.add("collapsed");
      if (DOM.btnToggleNowPlaying) DOM.btnToggleNowPlaying.style.color = "var(--text-muted)";
    });
  }

  // Playbar utility buttons
  DOM.playbarLyricsBtn.addEventListener("click", () => setView("lyrics"));
  DOM.expandedLyricsBtn.addEventListener("click", () => {
    DOM.expandedPlayer.style.display = "none";
    setView("lyrics");
  });

  DOM.playbarShareBtn.addEventListener("click", () => {
    const currentSong = state.songs[state.currentSongIndex];
    if (currentSong) openShareModal(currentSong.id);
  });
  DOM.expandedShareBtn.addEventListener("click", () => {
    const currentSong = state.songs[state.currentSongIndex];
    if (currentSong) openShareModal(currentSong.id);
  });

  DOM.playbarDownloadBtn.addEventListener("click", () => {
    const currentSong = state.songs[state.currentSongIndex];
    if (currentSong) triggerDownload(currentSong);
  });
  DOM.expandedDownloadBtn.addEventListener("click", () => {
    const currentSong = state.songs[state.currentSongIndex];
    if (currentSong) triggerDownload(currentSong);
  });

  // Mobile Expanded Player trigger on click of track info card
  DOM.playbarTrackDetails.addEventListener("click", (e) => {
    // Prevent toggle if user click Favorite Heart directly
    if (e.target.closest("#playbar-fav-btn")) return;
    
    // Only open details on mobile size (under 768px)
    if (window.innerWidth <= 768) {
      updatePlaybarUI();
      DOM.expandedPlayer.style.display = "flex";
    }
  });

  DOM.expandedCloseBtn.addEventListener("click", () => {
    DOM.expandedPlayer.style.display = "none";
  });

  // Modal event controls
  DOM.sidebarAddPlaylistBtn.addEventListener("click", () => {
    DOM.modalCreatePlaylist.classList.add("active");
  });
  DOM.createPlaylistBtn.addEventListener("click", () => {
    DOM.modalCreatePlaylist.classList.add("active");
  });

  // Cancel modals
  DOM.btnCancelCreatePlaylist.addEventListener("click", closeAllModals);
  DOM.btnCloseCreatePlaylist.addEventListener("click", closeAllModals);
  DOM.btnCloseAddToPlaylist.addEventListener("click", closeAllModals);
  DOM.btnCloseAddDialog.addEventListener("click", closeAllModals);
  DOM.btnCloseEditPlaylistSongs.addEventListener("click", closeAllModals);
  DOM.btnCloseShare.addEventListener("click", closeAllModals);

  // Save actions
  DOM.btnSavePlaylist.addEventListener("click", () => {
    const title = DOM.playlistNameInput.value;
    const desc = DOM.playlistDescInput.value;
    if (title.trim()) {
      createNewPlaylist(title, desc);
      DOM.playlistNameInput.value = "";
      DOM.playlistDescInput.value = "";
    } else {
      alert("Please enter a valid playlist title.");
    }
  });

  DOM.playlistDetailDeleteBtn.addEventListener("click", () => {
    if (state.activePlaylistId) {
      deletePlaylist(state.activePlaylistId);
    }
  });

  DOM.playlistDetailAddBtn.addEventListener("click", () => {
    if (state.activePlaylistId) {
      openEditPlaylistSongsModal(state.activePlaylistId);
    }
  });

  DOM.playlistEditSearchInput.addEventListener("input", (e) => {
    renderEditPlaylistSongsList(e.target.value);
  });

  DOM.btnAddPlaylistSongs.addEventListener("click", () => {
    if (!state.editingPlaylistId) return;
    const pl = state.playlists.find(p => p.id === state.editingPlaylistId);
    if (!pl) return;
    pl.songs = Array.from(state.editingPlaylistSelection);
    savePlaylistsToStorage();
    renderPlaylists();
    if (state.activePlaylistId === pl.id) {
      openPlaylistDetail(pl.id);
    }
    closeAllModals();
  });

  DOM.playlistDetailBackBtn.addEventListener("click", closePlaylistDetail);

  DOM.playlistDetailPlayBtn.addEventListener("click", () => {
    if (state.activePlaylistId) {
      playPlaylistSequence(state.activePlaylistId);
    }
  });

  // Copy share links
  DOM.btnCopyLink.addEventListener("click", () => {
    DOM.shareLinkInput.select();
    document.execCommand("copy");
    
    DOM.btnCopyLink.textContent = "Copied!";
    DOM.btnCopyLink.style.backgroundColor = "var(--primary)";
    DOM.btnCopyLink.style.color = "var(--bg-dark)";

    setTimeout(() => {
      DOM.btnCopyLink.textContent = "Copy";
      DOM.btnCopyLink.style.backgroundColor = "var(--primary)";
      DOM.btnCopyLink.style.color = "var(--bg-dark)";
    }, 2000);
  });

  // Themes View Preset changes
  DOM.themeCards.forEach(card => {
    card.addEventListener("click", () => {
      state.activeTheme = card.getAttribute("data-theme");
      applyActiveTheme();
    });
  });

  // Custom Accent changes
  DOM.customPrimaryColor.addEventListener("input", () => {
    state.activeTheme = "custom";
    applyActiveTheme();
    applyCustomAccent(DOM.customPrimaryColor.value);
    saveThemeToStorage();
  });

  DOM.resetThemeBtn.addEventListener("click", () => {
    state.activeTheme = "obsidian";
    state.customAccent = null;
    applyActiveTheme();
    renderThemesView();
  });

  // Lyrics Panel Actions
  DOM.lyricsEditBtn.addEventListener("click", enableLyricsEditing);
  DOM.lyricsSaveBtn.addEventListener("click", saveLyricsText);
  DOM.lyricsCancelBtn.addEventListener("click", cancelLyricsEditing);

  // --- INITIALIZE APPLICATION ---
  loadLocalStorageData();
  applyActiveTheme();
  renderAllSongsList();
  renderPlaylists();
  renderSidebarRecents();
  parseUrlParameters();
  
  // Set default audio volume setting
  audio.volume = state.currentVolume;
  DOM.volumeSlider.value = state.currentVolume;
});
