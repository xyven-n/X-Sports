document.addEventListener("DOMContentLoaded", () => {
    console.log("X Sports portal initialized successfully.");
    
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Add smooth scroll behavior for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add active state to navigation links on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Add parallax effect to gradient orbs
    const orbs = document.querySelectorAll('.gradient-orb');
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
    
    // Soccer Field Modal Functionality
    const matchCards = document.querySelectorAll('.match-card');
    const modal = document.getElementById('soccerFieldModal');
    const closeModal = document.getElementById('closeModal');
    const formationTitle = document.getElementById('formationTitle');
    const formationPlayers = document.getElementById('formationPlayers');
    
    // Open modal when any match card is clicked
    matchCards.forEach(card => {
        card.addEventListener('click', () => {
            // Get match data from the clicked card
            const matchData = JSON.parse(card.dataset.matchPlayers);
            
            // Update formation title
            const playerNames = matchData.map(p => p.name).join(' vs ');
            formationTitle.textContent = playerNames;
            
            // Clear existing players
            formationPlayers.innerHTML = '';
            
            // Add players to formation
            matchData.forEach((player, index) => {
                const positionClass = index === 0 ? 'player-left' : 'player-right';
                const playerHTML = `
                    <div class="player-container ${positionClass}">
                        <span class="player-position">${player.position}</span>
                        <div class="player-inner">
                            <img src="${player.image}" alt="${player.name}" class="field-player-img" onerror="this.src='https://via.placeholder.com/120?text=${player.name}'">
                        </div>
                    </div>
                `;
                formationPlayers.innerHTML += playerHTML;
            });
            
            // Reinitialize Lucide icons
            lucide.createIcons();
            
            // Open modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Force reflow to trigger animations
            void modal.offsetWidth;
            
            // Add animation class to trigger CSS transitions
            setTimeout(() => {
                const playerContainers = formationPlayers.querySelectorAll('.player-container');
                playerContainers.forEach(container => {
                    container.classList.add('animate-in');
                });
            }, 50);
        });
    });
    
    // Close modal when close button is clicked
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Player Cards Functionality
    const playersContainer = document.getElementById('playersContainer');
    const playerCards = document.querySelectorAll('.card-crop-wrapper');
    const viewAllBtn = document.getElementById('viewAllBtn');
    const searchInput = document.getElementById('playerSearch');
    let showingAll = false;
    
    // Function to show top 3 players by rating
    function showTopPlayers() {
        // Sort players by rating (descending)
        const sortedCards = Array.from(playerCards).sort((a, b) => {
            const ratingA = parseInt(a.dataset.rating);
            const ratingB = parseInt(b.dataset.rating);
            return ratingB - ratingA;
        });
        
        // Hide all cards first
        playerCards.forEach(card => {
            card.classList.add('hidden');
            card.classList.remove('highlighted');
        });
        
        // Show only top 3
        sortedCards.slice(0, 3).forEach(card => {
            card.classList.remove('hidden');
        });
        
        showingAll = false;
        updateViewAllButton();
    }
    
    // Function to show all players
    function showAllPlayers() {
        playerCards.forEach(card => {
            card.classList.remove('hidden');
            card.classList.remove('highlighted');
        });
        
        showingAll = true;
        updateViewAllButton();
    }
    
    // Update view all button text
    function updateViewAllButton() {
        if (showingAll) {
            viewAllBtn.innerHTML = 'Top 3 <i data-lucide="arrow-up"></i>';
        } else {
            viewAllBtn.innerHTML = 'Full <i data-lucide="arrow-right"></i>';
        }
        lucide.createIcons();
    }
    
    // View All button click handler
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (showingAll) {
                showTopPlayers();
            } else {
                showAllPlayers();
            }
        });
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toUpperCase().trim();
            
            if (searchTerm === '') {
                // If search is empty, show current view (top 3 or all)
                if (showingAll) {
                    showAllPlayers();
                } else {
                    showTopPlayers();
                }
                return;
            }
            
            // Show all cards when searching
            playerCards.forEach(card => {
                card.classList.remove('hidden');
                card.classList.remove('highlighted');
                
                const playerName = card.dataset.name.toUpperCase();
                const fullName = card.dataset.fullName ? card.dataset.fullName.toUpperCase() : '';
                
                if (playerName.includes(searchTerm) || fullName.includes(searchTerm)) {
                    card.classList.add('highlighted');
                    // Scroll to the found card
                    setTimeout(() => {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }
    
    // Initialize with top 3 players
    showTopPlayers();
    
    // Standings and Player Stats Functionality
    const playersData = [
        {
            name: "Z. HERCEDA",
            fullName: "ZETH HERCEDA",
            rating: 93,
            image: "zherceda.png",
            yellowCards: 0,
            redCards: 0,
            goals: 11,
            assists: 2,
            wins: 8,
            losses: 1
        },
        {
            name: "C. NABOR",
            fullName: "CLIFFORD JOHN NABOR JR",
            rating: 89,
            image: "cnabor.png",
            yellowCards: 0,
            redCards: 0,
            goals: 6,
            assists: 0,
            wins: 2,
            losses: 0
        },
        {
            name: "R. BATIANCILA",
            fullName: "ROIE BATIANCILA",
            rating: 82,
            image: "rbatiancila.png",
            yellowCards: 1,
            redCards: 0,
            goals: 2,
            assists: 1,
            wins: 0,
            losses: 2
        },
        {
            name: "J. MILAR",
            fullName: "JOSH CLARK MILAR",
            rating: 78,
            image: "jmilar.png",
            yellowCards: 0,
            redCards: 0,
            goals: 2,
            assists: 0,
            wins: 2,
            losses: 1
        },
        {
            name: "R. LINUGAW",
            fullName: "REYVEN JAY LINUGAW",
            rating: 75,
            image: "rlinugaw.png",
            yellowCards: 0,
            redCards: 0,
            goals: 5,
            assists: 0,
            wins: 1,
            losses: 0
        }
    ];
    
    // Calculate points and win rate for each player
    playersData.forEach(player => {
        const matches = player.wins + player.losses;
        player.matches = matches;
        
        // Points calculation: (wins * 3) + (goals * 2) + (assists * 1) - (yellowCards * 1) - (redCards * 3)
        player.points = (player.wins * 3) + (player.goals * 2) + (player.assists * 1) - (player.yellowCards * 1) - (player.redCards * 3);
        
        // Win rate calculation
        player.winRate = matches > 0 ? Math.round((player.wins / matches) * 100) : 0;
    });
    
    // Sort players by points (descending)
    const sortedPlayers = [...playersData].sort((a, b) => b.points - a.points);
    
    // Populate leaderboard
    const leaderboardBody = document.getElementById('leaderboardBody');
    if (leaderboardBody) {
        sortedPlayers.forEach((player, index) => {
            const row = document.createElement('div');
            row.className = 'player-row';
            row.dataset.playerIndex = index;
            
            const rankClass = index < 3 ? `rank-${index + 1}` : '';
            
            row.innerHTML = `
                <div class="rank-cell ${rankClass}">${index + 1}</div>
                <div class="player-cell">
                    <div class="player-row-avatar">
                        <img src="${player.image}" alt="${player.name}" onerror="this.src='https://via.placeholder.com/50?text=${player.name.charAt(0)}'">
                    </div>
                    <span class="player-row-name" data-full-name="${player.fullName}" data-short-name="${player.name}">${player.name}</span>
                </div>
                <div class="rating-cell">${player.rating}</div>
                <div class="points-cell">${player.points}</div>
                <div class="win-rate-cell">${player.winRate}%</div>
            `;
            
            row.addEventListener('click', () => showPlayerStats(player));
            leaderboardBody.appendChild(row);
        });
    }
    
    // Add name toggle functionality
    document.querySelectorAll('.player-row-name').forEach(nameElement => {
        nameElement.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent opening stats modal
            const fullName = nameElement.dataset.fullName;
            const shortName = nameElement.dataset.shortName;
            
            if (nameElement.textContent === shortName) {
                nameElement.textContent = fullName;
                nameElement.style.color = 'var(--primary)';
            } else {
                nameElement.textContent = shortName;
                nameElement.style.color = '#fff';
            }
        });
        
        // Add visual indicator that it's clickable
        nameElement.style.cursor = 'pointer';
        nameElement.title = 'Click to see full name';
    });
    
    // Player Stats Modal
    const playerStatsModal = document.getElementById('playerStatsModal');
    const closeStatsModal = document.getElementById('closeStatsModal');
    
    function showPlayerStats(player) {
        // Update modal content
        document.getElementById('statsPlayerName').textContent = player.fullName;
        document.getElementById('statsPlayerRating').textContent = `Rating: ${player.rating}`;
        document.getElementById('statsPlayerImg').src = player.image;
        document.getElementById('statsPlayerImg').onerror = function() {
            this.src = `https://via.placeholder.com/100?text=${player.fullName.charAt(0)}`;
        };
        
        // Update stats
        document.getElementById('statsYellowCards').textContent = player.yellowCards;
        document.getElementById('statsRedCards').textContent = player.redCards;
        document.getElementById('statsGoals').textContent = player.goals;
        document.getElementById('statsAssists').textContent = player.assists;
        document.getElementById('statsMatches').textContent = player.matches;
        document.getElementById('statsWins').textContent = player.wins;
        document.getElementById('statsLosses').textContent = player.losses;
        document.getElementById('statsPoints').textContent = player.points;
        document.getElementById('statsWinRate').textContent = `${player.winRate}%`;
        
        // Animate win rate circle
        const circle = document.querySelector('.progress-ring__circle');
        if (circle) {
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            const offset = circumference - (player.winRate / 100) * circumference;
            
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;
            
            // Show modal
            playerStatsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Animate circle after modal is visible
            setTimeout(() => {
                circle.style.strokeDashoffset = offset;
            }, 300);
        } else {
            // Show modal without circle animation
            playerStatsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Reinitialize Lucide icons for the modal
        lucide.createIcons();
    }
    
    // Close stats modal
    if (closeStatsModal) {
        closeStatsModal.addEventListener('click', () => {
            playerStatsModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close modal when clicking outside
    playerStatsModal.addEventListener('click', (e) => {
        if (e.target === playerStatsModal) {
            playerStatsModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && playerStatsModal.classList.contains('active')) {
            playerStatsModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});