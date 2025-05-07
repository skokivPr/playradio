// DOM Elements
const playerScreen = document.getElementById('player-screen');
const playlistScreen = document.getElementById('playlist-screen');
const welcomeScreen = document.getElementById('welcome-screen');
const playBtn = document.querySelector('.play-btn');
const currentTimeEl = document.querySelector('.current-time');
const totalTimeEl = document.querySelector('.total-time');
const favoriteBtn = document.querySelector('.favorite-btn');
const allNavBtns = document.querySelectorAll('.nav-btn');
const screens = document.querySelectorAll('.screen');
const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');

// Available themes
const themes = [
    { id: 'default-theme', name: 'Domyślny' },
    { id: 'dark-theme', name: 'Ciemny' },
    { id: 'burgundy-theme', name: 'Bordowy' },
    { id: 'neon-theme', name: 'Neon' },
    { id: 'minimal-theme', name: 'Minimalistyczny' },
    { id: 'nature-theme', name: 'Natura' },
    { id: 'retrowave-theme', name: 'Retrowave' },
    { id: 'trance-theme', name: 'Trance' },
    { id: 'party-theme', name: 'Party' },
    { id: 'coffee-theme', name: 'Kawa' },
    { id: 'blue-theme', name: 'Niebieski' },
    { id: 'red-theme', name: 'Czerwony' },
    { id: 'purple-theme', name: 'Fioletowy' },
    { id: 'orange-theme', name: 'Pomarańczowy' },
    { id: 'green-theme', name: 'Zielony' },
    { id: 'pastel-theme', name: 'Pastelowy' }
];

// Sample Music Data
const tracks = [
    {
        title: 'Open Your Mind',
        artist: 'A track for your mind',
        duration: 144, // in seconds
        cover: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        audio: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3'
    },
    {
        title: 'Radio Party',
        artist: 'Trance/Dance',
        duration: 180,
        cover: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        audio: 'https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3'
    }
];

// Lista stacji radiowych
const radioStations = [
    {
        id: 1,
        name: "Meloradio",
        genre: "Pop",
        country: "Polska",
        quality: "192 kbps",
        stream: "https://ml.cdn.eurozet.pl/mel-net.mp3",
        logo: "https://gfx-player.meloradio.pl/design/player_meloradio/images/logo-purple.svg",
        icon: "fa-music",
        favorite: false,
        category: "pop"
    },
    {
        id: 2,
        name: "Radio Eska",
        genre: "Pop/Dance",
        country: "Polska",
        quality: "192 kbps",
        stream: "https://ic1.smcdn.pl/2380-1.mp3",
        logo: "https://www.eska.pl/media/eska/desktop/images/logo-ESKA2023.svg",
        icon: "fa-music",
        favorite: false,
        category: "pop"
    },
    {
        id: 13,
        name: "RadioHeaven",
        genre: "Trance/Dance/House",
        country: "Polska",
        quality: "192 kbps",
        stream: "https://sc1.radioheaven.pl:8000/stream.mp3",
        logo: "https://radioheaven.pl/wp-content/uploads/2020/06/nowe-logo-white.png",
        icon: "fa-compact-disc",
        favorite: false,
        category: "trance"
    },
    {
        id: 14,
        name: "VOX Dance ",
        genre: "Trance/Dance",
        country: "Polska",
        quality: "192 kbps",
        stream: "https://ic1.smcdn.pl/6180-2.aac",
        logo: "https://uradio.pl/uploads/img/vox-dance.jpg",
        icon: "fa-compact-disc",
        favorite: false,
        category: "trance"
    },
    {
        id: 15,
        name: "Radio Club Dj",
        genre: "Trance/Dance/House",
        country: "Polska",
        quality: "192 kbps",
        stream: "https://www.4stream.pl/stream/18272",
        logo: "https://cdn.onlineradiobox.com/img/l/5/140225.v14.png",
        icon: "fa-compact-disc",
        favorite: false,
        category: "trance"
    },
    {
        id: 22,
        name: "Radio Party",
        genre: "Trance/Dance",
        country: "Polska",
        quality: "192 kbps",
        stream: "https://s2.radioparty.pl:7000/stream?nocache=7419",
        logo: "https://radioparty.pl/assets/img/logo.png",
        icon: "fa-compact-disc",
        favorite: true,
        category: "trance"
    }
];

// Get categories from radio stations
const categories = [...new Set(radioStations.map(station => station.category))];

// Current state
let currentTrackIndex = 0;
let isPlaying = false;
let audioElement = new Audio();
let currentScreen = 'player';
let currentStationIndex = -1;
let volume = 0.7; // 0-1 volume level
let isDarkTheme = false;
let currentFilter = 'all';
let favorites = loadFavorites();

// Initialize the application
function init() {
    // Load favorites from localStorage
    favorites = loadFavorites();

    // Load the first track
    loadTrack(currentTrackIndex);

    // Check saved theme preference
    loadThemePreference();

    // Show welcome screen first
    showScreen('welcome');

    // Add event listeners
    addEventListeners();

    // Add continue button to welcome screen
    addContinueButton();

    // Populate radio channels
    populateRadioChannels();

    // Add category filters
    addCategoryFilters();

    // Add search functionality
    addSearchFunctionality();

    // Add volume control
    addVolumeControl();

    // Add favorites button to playlist
    addFavoritesButton();

    // Add reset button to playlist
    addResetButton();

    // Add back button to player
    addBackButton();

    // Set initial volume
    setVolume(volume);

    // Handle scrolling for sticky header
    handleScrollEffects();

    // Initialize theme selector
    initThemeSelector();

    // Remove progress bar elements if they exist
    removeProgressBar();

    // Show default station status
    updateStationStatus('ready');

    // Create visualizer container
    createVisualizerContainer();
}

// Remove progress bar elements
function removeProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.remove();
    }
}

// Load favorites from localStorage
function loadFavorites() {
    const saved = localStorage.getItem('radio-favorites');
    return saved ? JSON.parse(saved) : [];
}

// Save favorites to localStorage
function saveFavorites() {
    localStorage.setItem('radio-favorites', JSON.stringify(favorites));
}

// Get current theme from localStorage
function getCurrentTheme() {
    return localStorage.getItem('radio-theme') || 'default-theme';
}

// Apply theme to body element
function applyTheme(themeId) {
    // Remove all theme classes
    document.body.classList.remove(
        'default-theme', 'dark-theme', 'burgundy-theme', 'neon-theme', 'minimal-theme',
        'nature-theme', 'retrowave-theme', 'trance-theme', 'party-theme',
        'coffee-theme', 'blue-theme', 'red-theme', 'purple-theme',
        'orange-theme', 'green-theme', 'pastel-theme'
    );

    // Add selected theme class if not default
    if (themeId !== 'default-theme') {
        document.body.classList.add(themeId);
    }

    // Save to localStorage
    localStorage.setItem('radio-theme', themeId);

    // Update all dropdowns if they exist
    document.querySelectorAll('.theme-selector').forEach(selector => {
        selector.value = themeId;
    });

    // Update visualizer if audio is playing
    if (isPlaying) {
        initVisualizer();
    }

    // Show notification
    showNotification(`Theme changed to ${themes.find(theme => theme.id === themeId).name}`);
}

// Initialize theme selector
function initThemeSelector() {
    // Add theme selector to settings
    addThemeSelector();

    // Apply current theme
    applyTheme(getCurrentTheme());
}

// Add theme selector to the UI
function addThemeSelector() {
    // Find a good place to add the selector (in both playlist and player screens)
    const playlistHeader = document.querySelector('#playlist-screen header');
    const playerHeader = document.querySelector('#player-screen header');

    if (playlistHeader) {
        addThemeSelectorToHeader(playlistHeader);
    }

    if (playerHeader) {
        addThemeSelectorToHeader(playerHeader);
    }
}

// Add theme selector to a header
function addThemeSelectorToHeader(header) {
    // Create theme selector container
    const selectorContainer = document.createElement('div');
    selectorContainer.className = 'theme-selector-container';

    // Create select element
    const select = document.createElement('select');
    select.id = 'theme-selector-' + header.parentElement.id;
    select.className = 'theme-selector';

    // Add options for each theme
    themes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme.id;
        option.textContent = theme.name;
        select.appendChild(option);
    });

    // Set current theme as selected
    select.value = getCurrentTheme();

    // Add change event listener
    select.addEventListener('change', (e) => {
        applyTheme(e.target.value);

        // Update all theme selectors to match
        document.querySelectorAll('.theme-selector').forEach(selector => {
            if (selector !== e.target) {
                selector.value = e.target.value;
            }
        });
    });

    // Add label and select to container
    selectorContainer.innerHTML = '<label for="' + select.id + '">Motyw:</label>';
    selectorContainer.appendChild(select);

    // Add to header
    header.appendChild(selectorContainer);
}

// Load theme preference
function loadThemePreference() {
    // First check for radio-theme
    const savedRadioTheme = localStorage.getItem('radio-theme');
    if (savedRadioTheme) {
        // Apply the theme
        document.body.classList.add(savedRadioTheme);
        return;
    }

    // Fall back to old dark/light theme if no radio-theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        isDarkTheme = true;
    }
}

// Toggle between light and dark theme (legacy function kept for compatibility)
function toggleTheme() {
    // Check if we're using the new theme system
    const currentTheme = getCurrentTheme();

    if (currentTheme === 'default-theme') {
        // Switch to dark theme
        applyTheme('dark-theme');
    } else if (currentTheme === 'dark-theme') {
        // Switch to default theme
        applyTheme('default-theme');
    } else {
        // Toggle between current theme and default
        applyTheme('default-theme');
    }
}

// Show a notification
function showNotification(message) {
    // Create notification if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }

    // Set message and show
    notification.textContent = message;
    notification.classList.add('show');

    // Hide after 2 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Handle scrolling effects
function handleScrollEffects() {
    const mainElements = document.querySelectorAll('main');

    mainElements.forEach(main => {
        main.addEventListener('scroll', () => {
            if (main.scrollTop > 10) {
                main.parentElement.classList.add('scrolled');
            } else {
                main.parentElement.classList.remove('scrolled');
            }
        });
    });
}

// Add volume control
function addVolumeControl() {
    const playerControls = document.querySelector('#player-screen .player-controls');

    // Create volume control elements
    const volumeControl = document.createElement('div');
    volumeControl.className = 'volume-control';

    volumeControl.innerHTML = `
        <i class="fas fa-volume-up"></i>
        <div class="volume-slider">
            <div class="volume-level"></div>
            <div class="volume-knob"></div>
        </div>
    `;

    playerControls.appendChild(volumeControl);

    // Add event listeners
    const volumeSlider = volumeControl.querySelector('.volume-slider');
    const volumeLevel = volumeControl.querySelector('.volume-level');
    const volumeKnob = volumeControl.querySelector('.volume-knob');
    const volumeIcon = volumeControl.querySelector('i');

    // Function to handle volume change
    function handleVolumeChange(e) {
        const rect = volumeSlider.getBoundingClientRect();
        // Check if this is a touch event
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let newVolume = (clientX - rect.left) / rect.width;

        // Clamp between 0 and 1
        newVolume = Math.max(0, Math.min(1, newVolume));
        setVolume(newVolume);
    }

    // Mouse down on slider
    volumeSlider.addEventListener('mousedown', (e) => {
        handleVolumeChange(e);
        volumeSlider.classList.add('dragging');

        // Add mouse move and mouse up events to document
        document.addEventListener('mousemove', handleVolumeChange);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', handleVolumeChange);
            volumeSlider.classList.remove('dragging');
        }, { once: true });
    });

    // Regular click on slider (for direct jumps)
    volumeSlider.addEventListener('click', handleVolumeChange);

    // Touch support for mobile
    volumeSlider.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleVolumeChange(e);
        volumeSlider.classList.add('dragging');

        const handleTouchMove = (e) => {
            e.preventDefault();
            handleVolumeChange(e);
        };

        volumeSlider.addEventListener('touchmove', handleTouchMove);
        volumeSlider.addEventListener('touchend', () => {
            volumeSlider.removeEventListener('touchmove', handleTouchMove);
            volumeSlider.classList.remove('dragging');
        }, { once: true });
    });

    // Mute/unmute toggle
    volumeIcon.addEventListener('click', () => {
        if (audioElement.volume > 0) {
            // Store current volume and mute
            volume = audioElement.volume;
            setVolume(0);
            volumeIcon.className = 'fas fa-volume-mute';
        } else {
            // Restore volume
            setVolume(volume > 0 ? volume : 0.7);
            updateVolumeIcon();
        }
    });
}// Funkcja przełączająca filtr ulubionych
function toggleFavoritesFilter() {
    const favoritesActive = document.querySelector('.favorites-link.active');
    const trackItems = document.querySelectorAll('.track-item');

    if (favoritesActive) {
        // Pokaż tylko ulubione
        trackItems.forEach(item => {
            const isFavorite = item.querySelector('.favorite-btn.active');
            item.style.display = isFavorite ? 'flex' : 'none';
        });
    } else {
        // Pokaż wszystkie
        trackItems.forEach(item => {
            item.style.display = 'flex';
        });
    }
}
// Set volume
function setVolume(value) {
    // Clamp volume between 0 and 1
    volume = Math.max(0, Math.min(1, value));

    // Update audio element
    audioElement.volume = volume;

    // Update UI
    const volumeLevel = document.querySelector('.volume-level');
    const volumeKnob = document.querySelector('.volume-knob');

    if (volumeLevel && volumeKnob) {
        volumeLevel.style.width = `${volume * 100}%`;
        volumeKnob.style.left = `${volume * 100}%`;
    }

    // Update icon
    updateVolumeIcon();
}

// Update volume icon based on level
function updateVolumeIcon() {
    const volumeIcon = document.querySelector('.volume-control i');
    if (!volumeIcon) return;

    if (volume > 0.5) {
        volumeIcon.className = 'fas fa-volume-up';
    } else if (volume > 0) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-mute';
    }
}

// Add search functionality
function addSearchFunctionality() {
    const playlistMain = document.querySelector('#playlist-screen main');
    const radioTitle = playlistMain.querySelector('.radio-title');

    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <i class="fas fa-search search-icon"></i>
        <input type="text" class="search-input" placeholder="Search radio channels...">
    `;

    // Insert after title
    radioTitle.insertAdjacentElement('afterend', searchContainer);

    // Add event listener
    const searchInput = searchContainer.querySelector('.search-input');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        filterRadioChannels(searchTerm);
    });
}

// Filter radio channels by search term
function filterRadioChannels(searchTerm = '', category = currentFilter) {
    const trackItems = document.querySelectorAll('.track-item');
    let found = false;

    trackItems.forEach(item => {
        const index = parseInt(item.dataset.index);
        let station;

        if (isNaN(index)) {
            // This is the featured item
            const featuredIndex = radioStations.findIndex(station => station.favorite) || 0;
            station = radioStations[featuredIndex];
        } else {
            station = radioStations[index];
        }

        const matchesSearch = !searchTerm ||
            station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            station.genre.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = category === 'all' || station.category === category;

        if (matchesSearch && matchesCategory) {
            item.style.display = 'flex';
            found = true;
        } else {
            item.style.display = 'none';
        }
    });

    // Show no results message if nothing found
    let noResultsMsg = document.querySelector('.no-results-message');

    if (!found) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('p');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.textContent = 'Nie znaleziono stacji radiowych.';
            noResultsMsg.style.textAlign = 'center';
            noResultsMsg.style.marginTop = '20px';
            noResultsMsg.style.color = '#777';

            const trackList = document.querySelector('.track-list');
            trackList.appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

// Add category filters
function addCategoryFilters() {
    const playlistMain = document.querySelector('#playlist-screen main');
    const radioTitle = playlistMain.querySelector('.radio-title');

    // Create filter container
    const filterContainer = document.createElement('div');
    filterContainer.className = 'category-filter';

    // Add "All" option
    let filterHTML = `<button class="category-btn active" data-category="all">Wszystkie</button>`;

    // Add category options
    categories.forEach(category => {
        // Translate category names to Polish and capitalize first letter
        let categoryName = category;
        switch (category) {
            case 'pop': categoryName = 'Pop'; break;
            case 'trance': categoryName = 'Trance'; break;
            default: categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        }

        filterHTML += `<button class="category-btn" data-category="${category}">${categoryName}</button>`;
    });

    filterContainer.innerHTML = filterHTML;

    // Insert after radio title
    radioTitle.insertAdjacentElement('afterend', filterContainer);

    // Add event listeners
    const categoryBtns = filterContainer.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update current filter
            currentFilter = btn.dataset.category;

            // Filter channels
            filterRadioChannels('', currentFilter);
        });
    });
}

// Add continue button to welcome screen
function addContinueButton() {
    const welcomeMain = document.querySelector('#welcome-screen main');
    const continueBtn = document.createElement('button');
    continueBtn.className = 'continue-btn';
    continueBtn.textContent = 'Continue';
    welcomeMain.appendChild(continueBtn);

    // Add click event listener to continue button
    continueBtn.addEventListener('click', () => {
        // Go straight to the radio channels list instead of player
        showScreen('playlist');
    });
}

// Populate radio channels list
function populateRadioChannels() {
    const trackList = document.querySelector('.track-list');
    trackList.innerHTML = ''; // Clear existing content

    // Get featured station (first station or first favorite)
    const featuredStation = radioStations.find(station => station.favorite) || radioStations[0];
    const featuredIndex = radioStations.findIndex(station => station.id === featuredStation.id);

    // Update featured channel
    const featuredTrack = document.querySelector('.track-item.featured');
    const featuredImg = featuredTrack.querySelector('.track-image img');
    const featuredTitle = featuredTrack.querySelector('.track-details h2');
    const featuredGenre = featuredTrack.querySelector('.track-details p');
    const featuredFavBtn = featuredTrack.querySelector('.favorite-btn');

    featuredImg.src = featuredStation.logo;
    featuredTitle.textContent = featuredStation.name;
    featuredGenre.textContent = featuredStation.genre;

    featuredFavBtn.classList.toggle('active', featuredStation.favorite);
    featuredFavBtn.innerHTML = `<i class="${featuredStation.favorite ? 'fas' : 'far'} fa-star"></i>`;

    // Add click event to featured track
    featuredTrack.addEventListener('click', () => {
        playRadioChannel(featuredIndex);
    });

    // Add click event for favorite button on featured track
    featuredFavBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the track item click
        toggleRadioFavorite(featuredIndex);
        featuredFavBtn.classList.toggle('active', radioStations[featuredIndex].favorite);
        featuredFavBtn.innerHTML = `<i class="${radioStations[featuredIndex].favorite ? 'fas' : 'far'} fa-star"></i>`;
    });

    // Create and add radio channel items to the list (excluding the featured one)
    radioStations.forEach((station, index) => {
        if (index !== featuredIndex) {
            const stationItem = createRadioChannelItem(station, index);
            trackList.appendChild(stationItem);
        }
    });
}

// Create a radio channel item
function createRadioChannelItem(station, index) {
    const channelItem = document.createElement('div');
    channelItem.className = 'track-item';
    channelItem.dataset.index = index;
    channelItem.innerHTML = `
        <div class="track-image">
            <img src="${station.logo}" alt="${station.name}" onerror="this.src='https://via.placeholder.com/80x80?text=${station.name}'">
        </div>
        <div class="track-details">
            <h2>${station.name}</h2>
            <p>${station.genre}</p>
        </div>
        <button class="favorite-btn ${station.favorite ? 'active' : ''}">
            <i class="${station.favorite ? 'fas' : 'far'} fa-star"></i>
        </button>
    `;

    // Add click event to play this radio channel
    channelItem.addEventListener('click', () => {
        playRadioChannel(index);
    });

    // Add click event for favorite button
    const favBtn = channelItem.querySelector('.favorite-btn');
    favBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the channel item click
        toggleRadioFavorite(index);
        favBtn.classList.toggle('active', radioStations[index].favorite);
        favBtn.querySelector('i').className = radioStations[index].favorite ? 'fas fa-star' : 'far fa-star';
    });

    return channelItem;
}

// Play a radio channel
function playRadioChannel(index) {
    // Update now playing status for UI
    updateNowPlayingUI(index);

    currentStationIndex = index;
    const station = radioStations[index];

    // Update player screen with radio channel info
    document.querySelector('.track-info h1').textContent = station.name;
    document.querySelector('.track-info p').textContent = station.genre;
    document.querySelector('.album-art img').src = station.logo;
    document.querySelector('.album-art img').onerror = function () {
        this.src = `https://via.placeholder.com/300x300?text=${station.name}`;
    };

    // Update the audio source
    audioElement.src = station.stream;
    audioElement.load();

    // Show connecting status
    updateStationStatus('connecting');

    // Add event listeners for streaming status
    audioElement.addEventListener('playing', () => {
        updateStationStatus('streaming');
        initVisualizer();
    }, { once: true });

    audioElement.addEventListener('waiting', () => {
        updateStationStatus('buffering');
    });

    audioElement.addEventListener('error', () => {
        updateStationStatus('error');
        showNotification('Error: Cannot play this station');
    });

    // Start playing
    playAudio();

    // Show player screen
    showScreen('player');

    // Show notification
    showNotification(`Now playing: ${station.name}`);
}

// Update station status indicator
function updateStationStatus(status) {
    // Get or create status indicator
    let statusIndicator = document.querySelector('.station-status');
    if (!statusIndicator) {
        statusIndicator = document.createElement('div');
        statusIndicator.className = 'station-status';
        const playerControls = document.querySelector('.player-controls');
        playerControls.insertBefore(statusIndicator, playerControls.firstChild);
    }

    // Update content based on status
    let statusText = '';
    let statusClass = '';

    switch (status) {
        case 'connecting':
            statusText = '<i class="fas fa-circle-notch fa-spin"></i> Łączenie...';
            statusClass = 'connecting';
            break;
        case 'streaming':
            statusText = '<i class="fas fa-broadcast-tower"></i> Nadawanie';
            statusClass = 'streaming';
            break;
        case 'buffering':
            statusText = '<i class="fas fa-circle-notch fa-spin"></i> Buforowanie...';
            statusClass = 'buffering';
            break;
        case 'error':
            statusText = '<i class="fas fa-exclamation-triangle"></i> Błąd połączenia';
            statusClass = 'error';
            break;
        default:
            statusText = '<i class="fas fa-info-circle"></i> Radio gotowe';
            statusClass = 'ready';
    }

    // Set content and class
    statusIndicator.innerHTML = statusText;

    // Remove all status classes and add current one
    statusIndicator.classList.remove('connecting', 'streaming', 'buffering', 'error', 'ready');
    if (statusClass) {
        statusIndicator.classList.add(statusClass);
    }
}

// Update now playing UI
function updateNowPlayingUI(index) {
    // Remove now-playing class from all items
    document.querySelectorAll('.track-item').forEach(item => {
        item.classList.remove('now-playing');
    });

    // Add now-playing class to the current item
    const featuredIndex = radioStations.findIndex(station => station.favorite) || 0;

    if (index === featuredIndex) {
        document.querySelector('.track-item.featured').classList.add('now-playing');
    } else {
        const item = document.querySelector(`.track-item[data-index="${index}"]`);
        if (item) item.classList.add('now-playing');
    }
}

// Toggle radio channel favorite status
function toggleRadioFavorite(index) {
    radioStations[index].favorite = !radioStations[index].favorite;

    // Update favorites array
    if (radioStations[index].favorite) {
        if (!favorites.includes(radioStations[index].id)) {
            favorites.push(radioStations[index].id);
        }
    } else {
        const favIndex = favorites.indexOf(radioStations[index].id);
        if (favIndex !== -1) {
            favorites.splice(favIndex, 1);
        }
    }

    // Save to localStorage
    saveFavorites();

    // Show notification
    const message = radioStations[index].favorite ?
        `Added ${radioStations[index].name} to favorites` :
        `Removed ${radioStations[index].name} from favorites`;

    showNotification(message);
}

// Load a track
function loadTrack(index) {
    const track = tracks[index];

    // Update audio source
    audioElement.src = track.audio;
    audioElement.load();

    // Update UI
    document.querySelector('.track-info h1').textContent = track.title;
    document.querySelector('.track-info p').textContent = track.artist;
    document.querySelector('.album-art img').src = track.cover;

    // Update time display
    currentTime = 0;
    updateTimeDisplay();

    // If it was playing before, start playing the new track
    if (isPlaying) {
        playAudio();
    }
}

// Format time in MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update time display
function updateTimeDisplay() {
    currentTimeEl.textContent = formatTime(currentTime);
    totalTimeEl.textContent = `-${formatTime(tracks[currentTrackIndex].duration - currentTime)}`;
}

// Play audio
function playAudio() {
    // If no station is selected, show notification
    if (currentStationIndex === -1) {
        showNotification('Najpierw wybierz stację radiową');
        return;
    }

    updateStationStatus('connecting');

    audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
        showNotification('Error playing audio. Please try again.');
        updateStationStatus('error');
    });

    isPlaying = true;
    playBtn.classList.add('playing');
}

// Pause audio
function pauseAudio() {
    audioElement.pause();
    isPlaying = false;
    playBtn.classList.remove('playing');
    updateStationStatus('ready');
    stopVisualizer();
}

// Play next track
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        playAudio();
    }
}

// Play previous track
function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        playAudio();
    }
}

// Toggle favorite status
function toggleFavorite() {
    if (currentStationIndex === -1) return;

    // Toggle favorite status of the current station
    toggleRadioFavorite(currentStationIndex);

    // Update favorite button
    const isFavorite = radioStations[currentStationIndex].favorite;
    favoriteBtn.classList.toggle('active', isFavorite);
    favoriteBtn.innerHTML = `<i class="${isFavorite ? 'fas' : 'far'} fa-star"></i>`;
}

// Show a specific screen
function showScreen(screenName) {
    // Hide all screens
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show the requested screen
    if (screenName === 'player') {
        playerScreen.classList.add('active');
        currentScreen = 'player';
    } else if (screenName === 'playlist') {
        playlistScreen.classList.add('active');
        currentScreen = 'playlist';
    } else if (screenName === 'welcome') {
        welcomeScreen.classList.add('active');
        currentScreen = 'welcome';
    }

    // Update active nav button
    updateActiveNavButton();

    // Ensure the bottom nav is properly positioned
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        // Force a reflow to ensure correct positioning
        bottomNav.style.display = 'none';
        setTimeout(() => {
            bottomNav.style.display = 'flex';
        }, 10);
    }
}

// Update active navigation button
function updateActiveNavButton() {
    allNavBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    if (currentScreen === 'player') {
        // When showing player, highlight no nav button
    } else if (currentScreen === 'playlist') {
        document.querySelector('.home-btn').classList.add('active');
    }
}

// Add all event listeners
function addEventListeners() {
    // Play/Pause button
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });

    // Favorite button
    favoriteBtn.addEventListener('click', toggleFavorite);

    // Home button (show radio channels list)
    document.querySelectorAll('.home-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showScreen('playlist');
        });
    });

    // Theme toggle
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', toggleTheme);
    });

    // Back button
    const backButtons = document.querySelectorAll('.nav-btn.settings-btn');
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // If on player screen, go back to playlist
            if (currentScreen === 'player') {
                showScreen('playlist');
            }
            // If on other screens, don't do anything
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Only process if not in an input field
        if (e.target.tagName.toLowerCase() === 'input') return;

        switch (e.key) {
            case ' ':  // Space
                if (isPlaying) pauseAudio();
                else playAudio();
                e.preventDefault();
                break;
            case 'ArrowUp':
                setVolume(Math.min(1, volume + 0.1));
                break;
            case 'ArrowDown':
                setVolume(Math.max(0, volume - 0.1));
                break;
            case 'Escape':  // Escape key
                if (currentScreen === 'player') {
                    showScreen('playlist');
                }
                break;
        }
    });

    // Audio stream error handling
    audioElement.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        updateStationStatus('error');
        showNotification('Error playing station. Please try again or select another station.');
    });
}

// Create visualizer container
function createVisualizerContainer() {
    // Check if container already exists
    if (document.querySelector('.visualizer-container')) return;

    // Create container for visualizer
    const visualizerContainer = document.createElement('div');
    visualizerContainer.className = 'visualizer-container';

    // Create bars
    for (let i = 0; i < 12; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        visualizerContainer.appendChild(bar);
    }

    // Fix: Insert into player screen main content area, not directly in playerScreen
    const playerControls = document.querySelector('#player-screen .player-controls');
    if (playerControls && playerControls.parentNode) {
        // Insert before the player controls
        playerControls.parentNode.insertBefore(visualizerContainer, playerControls);
    } else {
        // Fallback: Just append to player screen
        const playerMain = document.querySelector('#player-screen main');
        if (playerMain) {
            playerMain.insertBefore(visualizerContainer, playerMain.firstChild);
        }
    }

    // Initially hide it
    visualizerContainer.style.display = 'none';
}

// Initialize visualizer based on theme
function initVisualizer() {
    const visualizerContainer = document.querySelector('.visualizer-container');
    if (!visualizerContainer) return;

    // Get current theme
    const currentTheme = getCurrentTheme();

    // Only show for certain themes
    if (currentTheme === 'party-theme' || currentTheme === 'neon-theme' ||
        currentTheme === 'retrowave-theme' || currentTheme === 'trance-theme' ||
        currentTheme === 'burgundy-theme') {
        visualizerContainer.style.display = 'flex';
        startVisualizer(currentTheme);
    } else {
        visualizerContainer.style.display = 'none';
        stopVisualizer();
    }
}

// Global variable for visualizer animation
let visualizerAnimationId;

// Start visualizer animation
function startVisualizer(theme) {
    // Stop any existing animation
    stopVisualizer();

    const bars = document.querySelectorAll('.visualizer-bar');
    if (!bars.length) return;

    // Get the computed styles for the theme
    const style = getComputedStyle(document.body);
    const primary = style.getPropertyValue('--primary').trim();
    const primaryRgb = style.getPropertyValue('--primary-rgb').trim() || '255, 23, 68'; // Default for party theme

    // Apply theme-specific styles to bars
    bars.forEach((bar, index) => {
        // Set base styles
        bar.style.transition = 'height 0.2s ease';

        // Apply theme-specific styles
        if (theme === 'party-theme') {
            const barColors = [
                'linear-gradient(to top, #ff1744, #ff5252)',
                'linear-gradient(to top, #ff4081, #f06292)',
                'linear-gradient(to top, #f50057, #ff4081)',
                'linear-gradient(to top, #c51162, #f50057)',
                'linear-gradient(to top, #d500f9, #ea80fc)'
            ];
            bar.style.background = barColors[index % barColors.length];
            bar.style.boxShadow = `0 2px 10px rgba(${primaryRgb}, 0.4)`;
        } else if (theme === 'burgundy-theme') {
            const primaryDark = style.getPropertyValue('--primary-dark').trim() || '#ff1a1a';
            const primary5 = style.getPropertyValue('--primary-5').trim() || '#ff3333';

            const burgundyColors = [
                `linear-gradient(to top, ${primaryDark}, ${primary})`,
                `linear-gradient(to top, ${primary5}, ${primary})`,
                `linear-gradient(to top, ${primary}, #ff7b7b)`
            ];
            bar.style.background = burgundyColors[index % burgundyColors.length];
            bar.style.boxShadow = `0 2px 10px rgba(${primaryRgb}, 0.6)`;
        } else if (theme === 'neon-theme') {
            bar.style.background = `linear-gradient(to top, ${primary}, #33ffcc)`;
            bar.style.boxShadow = `0 0 15px ${primary}`;
        } else if (theme === 'retrowave-theme') {
            const retroColors = [
                `linear-gradient(to top, ${primary}, #ff33cc)`,
                'linear-gradient(to top, #00ccff, #33ddff)'
            ];
            bar.style.background = retroColors[index % 2];
            bar.style.boxShadow = `0 0 15px rgba(${primaryRgb}, 0.6)`;
        } else if (theme === 'trance-theme') {
            const primaryDark = style.getPropertyValue('--primary-dark').trim() || '#7b1fa2';

            const tranceColors = [
                `linear-gradient(to top, ${primaryDark}, ${primary})`,
                'linear-gradient(to top, #3498db, #2980b9)'
            ];
            bar.style.background = tranceColors[index % 2];
            bar.style.boxShadow = `0 0 10px rgba(${primaryRgb}, 0.4)`;
        }
    });

    // Animate bars
    function animateBars() {
        bars.forEach(bar => {
            // Generate random height between 15% and 100%
            const height = 15 + Math.random() * 85;
            bar.style.height = `${height}%`;
        });

        // Schedule next animation frame
        visualizerAnimationId = requestAnimationFrame(() => {
            // Slow down the animation by adding a timeout
            setTimeout(() => {
                visualizerAnimationId = requestAnimationFrame(animateBars);
            }, 200); // Adjust for faster/slower animation
        });
    }

    // Start animation
    animateBars();
}

// Stop visualizer animation
function stopVisualizer() {
    if (visualizerAnimationId) {
        cancelAnimationFrame(visualizerAnimationId);
        visualizerAnimationId = null;
    }
}

// Add favorites button to playlist
function addFavoritesButton() {
    const playlistHeader = document.querySelector('#playlist-screen header');
    if (!playlistHeader) return;

    // Create button
    const favButton = document.createElement('button');
    favButton.className = 'header-btn favorites-btn';
    favButton.innerHTML = '<i class="fas fa-star"></i>';
    favButton.title = 'Pokaż ulubione';

    // Add event listener
    favButton.addEventListener('click', () => {
        toggleFavoritesView();
    });

    // Add to header
    const headerControls = playlistHeader.querySelector('.header-controls');
    if (headerControls) {
        headerControls.insertBefore(favButton, headerControls.firstChild);
    } else {
        playlistHeader.appendChild(favButton);
    }
}

// Toggle favorites view
function toggleFavoritesView() {
    // Toggle current filter between 'all' and 'favorites'
    currentFilter = currentFilter === 'favorites' ? 'all' : 'favorites';

    // Update filter buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.classList.remove('active');
        if ((currentFilter === 'favorites' && btn.dataset.category === 'all') ||
            (currentFilter !== 'favorites' && btn.dataset.category === currentFilter)) {
            btn.classList.add('active');
        }
    });

    // Update favorites button active state
    const favoritesBtn = document.querySelector('.favorites-btn');
    if (favoritesBtn) {
        document.querySelector('#playlist-screen').classList.toggle('favorites-active', currentFilter === 'favorites');
    }

    // Filter stations
    filterRadioChannelsByFavorites();

    // Show notification
    showNotification(currentFilter === 'favorites' ? 'Pokazuję tylko ulubione' : 'Pokazuję wszystkie stacje');
}

// Filter radio channels by favorites
function filterRadioChannelsByFavorites() {
    const trackItems = document.querySelectorAll('.track-item');
    let found = false;

    trackItems.forEach(item => {
        const index = parseInt(item.dataset.index);
        let station;

        if (isNaN(index)) {
            // This is the featured item
            const featuredIndex = radioStations.findIndex(station => station.favorite) || 0;
            station = radioStations[featuredIndex];
        } else {
            station = radioStations[index];
        }

        // For favorites filter, only show favorited stations
        if (currentFilter === 'favorites') {
            if (station.favorite) {
                item.style.display = 'flex';
                found = true;
            } else {
                item.style.display = 'none';
            }
        } else {
            // Use the normal category filtering
            filterRadioChannels('', currentFilter);
            return;
        }
    });

    // Show no results message if nothing found
    let noResultsMsg = document.querySelector('.no-results-message');

    if (!found && currentFilter === 'favorites') {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('p');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.textContent = 'Brak ulubionych stacji. Dodaj stacje do ulubionych klikając gwiazdkę.';
            noResultsMsg.style.textAlign = 'center';
            noResultsMsg.style.marginTop = '20px';
            noResultsMsg.style.color = '#777';

            const trackList = document.querySelector('.track-list');
            trackList.appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

// Add reset button to playlist
function addResetButton() {
    const playlistHeader = document.querySelector('#playlist-screen header');
    if (!playlistHeader) return;

    // Create button
    const resetButton = document.createElement('button');
    resetButton.className = 'header-btn reset-btn';
    resetButton.innerHTML = '<i class="fas fa-redo-alt"></i>';
    resetButton.title = 'Resetuj aplikację';

    // Add event listener
    resetButton.addEventListener('click', () => {
        if (confirm('Czy na pewno chcesz zresetować aplikację? Wszystkie ustawienia zostaną utracone.')) {
            resetApp();
        }
    });

    // Add to header
    const headerControls = playlistHeader.querySelector('.header-controls');
    if (headerControls) {
        headerControls.appendChild(resetButton);
    } else {
        playlistHeader.appendChild(resetButton);
    }
}

// Add back button to player
function addBackButton() {
    const playerHeader = document.querySelector('#player-screen header');
    if (!playerHeader) return;

    // Create button
    const backButton = document.createElement('button');
    backButton.className = 'header-btn back-btn';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
    backButton.title = 'Powrót do listy';

    // Add event listener
    backButton.addEventListener('click', () => {
        showScreen('playlist');
    });

    // Add to header at the beginning
    playerHeader.insertBefore(backButton, playerHeader.firstChild);
}

// Reset app
function resetApp() {
    // Clear all localStorage
    localStorage.removeItem('radio-theme');
    localStorage.removeItem('theme');
    localStorage.removeItem('radio-favorites');

    // Reset state
    currentStationIndex = -1;
    isPlaying = false;
    favorites = [];
    currentFilter = 'all';

    // Stop audio
    audioElement.pause();
    audioElement.src = '';

    // Update UI
    showNotification('Aplikacja została zresetowana');

    // Clear favorites
    radioStations.forEach(station => {
        station.favorite = false;
    });

    // Re-render the UI components
    populateRadioChannels();

    // Reset theme to default
    applyTheme('default-theme');

    // Stop visualizer
    stopVisualizer();

    // Show welcome screen
    showScreen('welcome');
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 