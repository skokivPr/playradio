// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Find all bottom navigation elements
    const bottomNavs = document.querySelectorAll('.bottom-nav');

    // Function to update navigation styles based on current screen
    function updateNavigationStyles() {
        bottomNavs.forEach(nav => {
            const homeBtn = nav.querySelector('a i.fa-home').parentElement;

            // Reset styles first
            homeBtn.classList.remove('disabled-nav-item');

            // Apply styles based on current screen
            if (typeof currentScreen !== 'undefined' && currentScreen === 'player') {
                homeBtn.classList.add('disabled-nav-item');
            }
        });
    }

    // Dodajmy style CSS dla wyszarzonego przycisku
    const style = document.createElement('style');
    style.textContent = `
        .bottom-nav .disabled-nav-item {
            color: #999 !important;
            pointer-events: none;
            cursor: default;
        }
    `;
    document.head.appendChild(style);

    // Update each nav bar with the new structure
    bottomNavs.forEach(nav => {
        // Clear existing content
        nav.innerHTML = '';

        // Create Home button
        const homeLink = document.createElement('a');
        homeLink.href = '#';
        homeLink.className = 'active';
        homeLink.innerHTML = `
            <i class="fas fa-home"></i>
            <span>Home</span>
        `;

        // Sprawdź, czy jesteśmy na ekranie odtwarzania i odpowiednio ustaw styl
        if (typeof currentScreen !== 'undefined' && currentScreen === 'player') {
            homeLink.classList.add('disabled-nav-item');
            homeLink.classList.remove('active');
        }

        homeLink.addEventListener('click', function (e) {
            e.preventDefault();
            if (typeof showScreen === 'function') {
                showScreen('playlist');
            }
        });

        // Create Stations button
        const stationsLink = document.createElement('a');
        stationsLink.href = '#';
        stationsLink.innerHTML = `
            <i class="fas fa-list"></i>
            <span>Stacje</span>
        `;
        stationsLink.addEventListener('click', function (e) {
            e.preventDefault();
            if (typeof showScreen === 'function') {
                showScreen('playlist');
            }
        });

        // Create Favorites button
        const favoritesLink = document.createElement('a');
        favoritesLink.href = '#';
        favoritesLink.className = 'favorites-link';
        favoritesLink.innerHTML = `
            <i class="fas fa-star"></i>
            <span>Ulubione</span>
        `;
        favoritesLink.addEventListener('click', function (e) {
            e.preventDefault();
            // Toggle favorites filter
            this.classList.toggle('active');
            if (typeof toggleFavoritesFilter === 'function') {
                toggleFavoritesFilter();
            }
        });

        // Add all elements to the nav
        nav.appendChild(homeLink);
        nav.appendChild(stationsLink);
        nav.appendChild(favoritesLink);

        // Dodajemy kod monitorujący zmianę ekranu
        let originalShowScreen = window.showScreen;
        if (typeof originalShowScreen === 'function') {
            window.showScreen = function (screenName) {
                // Wywołaj oryginalną funkcję
                originalShowScreen(screenName);

                // Aktualizuj styl nawigacji
                setTimeout(updateNavigationStyles, 100); // Małe opóźnienie dla pewności, że ekran już się zmienił
            };
        }
    });

    // Add function to toggle favorites filter if it doesn't exist
    if (typeof window.toggleFavoritesFilter === 'undefined') {
        window.toggleFavoritesFilter = function () {
            const favoritesActive = document.querySelector('.favorites-link.active');
            const trackItems = document.querySelectorAll('.track-item');

            if (favoritesActive) {
                // Show only favorites
                trackItems.forEach(item => {
                    const isFavorite = item.querySelector('.favorite-btn.active');
                    item.style.display = isFavorite ? 'flex' : 'none';
                });
            } else {
                // Show all
                trackItems.forEach(item => {
                    item.style.display = 'flex';
                });
            }
        };
    }

    // Spróbuj zaktualizować styl nawigacji po załadowaniu
    setTimeout(function () {
        try {
            updateNavigationStyles();
        } catch (e) {
            console.log('Nie udało się zaktualizować stylu nawigacji, spróbuj ponownie później.');
        }
    }, 500); // Dajemy czas na załadowanie aplikacji
}); 