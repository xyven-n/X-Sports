document.addEventListener("DOMContentLoaded", () => {
    console.log("X Sports portal initialized successfully.");
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Add smooth scroll behavior for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
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
            if (window.scrollY >= sectionTop - 200) {
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
    
    // Parallax effect to gradient orbs
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
    
    matchCards.forEach(card => {
        card.addEventListener('click', () => {
            if (!card.dataset.matchPlayers) return;
            const matchData = JSON.parse(card.dataset.matchPlayers);
            
            formationTitle.textContent = matchData.map(p => p.name).join(' vs ');
            formationPlayers.innerHTML = '';
            
            matchData.forEach((player, index) => {
                const positionClass = index === 0 ? 'player-left' : 'player-right';
                const playerHTML = `
                    <div class="player-container ${positionClass}">
                        <span class="player-position">${player.position}</span>
                        <div class="player-inner">
                            <img src="${player.image}" alt="${player.name}" class="field-player-img" onerror="this.onerror=null; this.src='https://placehold.co/120?text=${player.name}';">
                        </div>
                    </div>
                `;
                formationPlayers.innerHTML += playerHTML;
            });
            
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            void modal.offsetWidth;
            
            setTimeout(() => {
                const playerContainers = formationPlayers.querySelectorAll('.player-container');
                playerContainers.forEach(container => {
                    container.classList.add('animate-in');
                });
            }, 50);
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Player Cards Filter & Search
    const playerCards = document.querySelectorAll('.card-crop-wrapper');
    const viewAllBtn = document.getElementById('viewAllBtn');
    const searchInput = document.getElementById('playerSearch');
    const sportButtons = document.querySelectorAll('.sport-btn:not([data-standings-sport])');
    let showingAll = false;
    let currentSport = 'soccer';
    
    function showTopPlayers() {
        const sportCards = Array.from(playerCards).filter(card => {
            const cardSport = card.dataset.sport || 'soccer';
            return cardSport === currentSport;
        });
        
        const sortedCards = sportCards.sort((a, b) => {
            const ratingA = parseInt(a.dataset.rating) || 0;
            const ratingB = parseInt(b.dataset.rating) || 0;
            return ratingB - ratingA;
        });
        
        playerCards.forEach(card => {
            const cardSport = card.dataset.sport || 'soccer';
            if (cardSport === currentSport) {
                card.classList.add('hidden');
                card.classList.remove('highlighted');
            } else {
                card.classList.add('hidden');
            }
        });
        
        sortedCards.slice(0, 3).forEach(card => {
            card.classList.remove('hidden');
        });
        
        showingAll = false;
        updateViewAllButton();
    }
    
    function showAllPlayers() {
        playerCards.forEach(card => {
            const cardSport = card.dataset.sport || 'soccer';
            if (cardSport === currentSport) {
                card.classList.remove('hidden');
                card.classList.remove('highlighted');
            } else {
                card.classList.add('hidden');
            }
        });
        
        showingAll = true;
        updateViewAllButton();
    }
    
    function updateViewAllButton() {
        if (!viewAllBtn) return;
        if (showingAll) {
            viewAllBtn.innerHTML = 'Top 3 <i data-lucide="arrow-up"></i>';
        } else {
            viewAllBtn.innerHTML = 'Full <i data-lucide="arrow-right"></i>';
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    
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
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toUpperCase().trim();
            
            if (searchTerm === '') {
                if (showingAll) {
                    showAllPlayers();
                } else {
                    showTopPlayers();
                }
                return;
            }
            
            playerCards.forEach(card => {
                const cardSport = card.dataset.sport || 'soccer';
                
                if (cardSport !== currentSport) {
                    card.classList.add('hidden');
                    card.classList.remove('highlighted');
                    return;
                }
                
                card.classList.remove('hidden');
                card.classList.remove('highlighted');
                
                const playerName = (card.dataset.name || '').toUpperCase();
                const fullName = (card.dataset.fullName || '').toUpperCase();
                
                if (playerName.includes(searchTerm) || fullName.includes(searchTerm)) {
                    card.classList.add('highlighted');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }
    
    // Sports Filter (Players Section)
    sportButtons.forEach(button => {
        button.addEventListener('click', () => {
            sportButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            currentSport = button.dataset.sport;
            
            playerCards.forEach(card => {
                const cardSport = card.dataset.sport || 'soccer';
                
                if (cardSport === currentSport) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
            
            showingAll = false;
            updateViewAllButton();
        });
    });
    
    showTopPlayers();
    
    // --- STANDINGS & STATS DATA ---
    const sportsStandings = {
        soccer: [
            { 
                name: "Z. HERCEDA", 
                fullName: "ZETH HERCEDA", 
                rating: 93, 
                image: "zherceda.png", 
                yellowCards: 0, 
                redCards: 0, 
                goals: 12, 
                assists: 2, 
                wins: 8, 
                losses: 1,
                matchHistory: [
                    { opponent: "UIC", score: "2 - 0", result: "WIN", goalsScored: 1, team: "SPAC" },
                    { opponent: "???", score: "0(1) - 0(0)", result: "WIN", goalsScored: 1, team: "SPAC" },
                    { opponent: "???", score: "3 - 2", result: "LOSS", goalsScored: 2, team: "SPAC" },
                    { opponent: "???", score: "2 - 1", result: "WIN", goalsScored: 1, team: "SPAC" },
                    { opponent: "???", score: "1 - 0", result: "WIN", goalsScored: 0, team: "SPAC" },
                    { opponent: "???", score: "4 - 3", result: "WIN", goalsScored: 3, team: "SPAC" },
                    { opponent: "???", score: "5 - 2", result: "WIN", goalsScored: 2, team: "SPAC" },
                    { opponent: "???", score: "3 - 2", result: "WIN", goalsScored: 2, team: "SPAC" },
                    { opponent: "???", score: "1(3) - 1(1)", result: "WIN", goalsScored: 0, team: "SPAC" }
                ]
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
                losses: 0,
                matchHistory: [
                    { opponent: "PHR", score: "3 - 2", result: "WIN", goalsScored: 1, team: "CJE" },
                    { opponent: "PHIRO", score: "5 - 1", result: "WIN", goalsScored: 5, team: "CCL" }
                ]
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
                losses: 2,
                matchHistory: [
                    { opponent: "PHR", score: "3 - 2", result: "LOSS", goalsScored: 1, team: "CJE" },
                    { opponent: "PHIRO", score: "5 - 1", result: "LOSS", goalsScored: 1, team: "CCL" }
                ]
            },
            { 
                name: "J. MILAR", 
                fullName: "JOSH CLARK MILAR", 
                rating: 80, 
                image: "jmilar.png", 
                yellowCards: 0, 
                redCards: 0, 
                goals: 2, 
                assists: 0, 
                wins: 2, 
                losses: 1,
                matchHistory: [
                    { opponent: "EBORA", score: "1 - 0", result: "LOSS", goalsScored: 0, team: "MILAR" },
                    { opponent: "DCSDAES", score: "1 - 0", result: "WIN", goalsScored: 1, team: "UIC" },
                    { opponent: "NABOR", score: "1 - 0", result: "WIN", goalsScored: 1, team: "MILAR" }
                ]
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
                losses: 0,
                matchHistory: [
                    { opponent: "AZH", score: "5 - 1", result: "WIN", goalsScored: 5, team: "Reyven" }
                ]
            }
        ],
        basketball: [
            {
                name: "R. BATIANCILA",
                fullName: "ROIE BATIANCILA",
                rating: 85,
                image: "rbatiancila.png",
                yellowCards: 0,
                redCards: 0,
                goals: 20,
                assists: 0,
                wins: 2,
                losses: 0,
                matchHistory: [
                    { opponent: "NABOR", score: "10 - 9", result: "WIN", goalsScored: 10, team: "BATIANCILA" },
                    { opponent: "NABOR, J", score: "10 - 7", result: "WIN", goalsScored: 10, team: "BATIANCILA" }
                ]
            },
            {
                name: "C. NABOR",
                fullName: "CLIFFORD JOHN NABOR JR",
                rating: 80,
                image: "cnabor.png",
                yellowCards: 0,
                redCards: 0,
                goals: 16,
                assists: 0,
                wins: 0,
                losses: 2,
                matchHistory: [
                    { opponent: "BATIANCILA", score: "10 - 9", result: "LOSS", goalsScored: 9, team: "NABOR" },
                    { opponent: "NABOR, J", score: "10 - 7", result: "LOSS", goalsScored: 7, team: "NABOR" }
                ]
            }
        ],
        pickleball: [],
        volleyball: [],
        kickball: [],
        badminton: []
    };

    // Calculate dynamic points and win rates for all sports
    Object.entries(sportsStandings).forEach(([sportName, sportList]) => {
        sportList.forEach(player => {
            player.sport = sportName;
            const matches = player.wins + player.losses;
            player.matches = matches;
            player.points = (player.wins * 3) + (player.goals * 2) + (player.assists * 1) - ((player.yellowCards || 0) * 1) - ((player.redCards || 0) * 3);
            player.winRate = matches > 0 ? Math.round((player.wins / matches) * 100) : 0;
            if (!player.matchHistory) {
                player.matchHistory = [];
            }
        });
    });

    const leaderboardBody = document.getElementById('leaderboardBody');
    const standingsSportBtns = document.querySelectorAll('[data-standings-sport]');

    function renderStandings(sport) {
        if (!leaderboardBody) return;
        leaderboardBody.innerHTML = '';

        const list = sportsStandings[sport] || [];

        if (list.length === 0) {
            leaderboardBody.innerHTML = `
                <div class="no-matches" style="padding: 3rem; text-align: center; font-style: italic; color: var(--text-muted);">
                    No standings available yet for ${sport.toUpperCase()}.
                </div>
            `;
            return;
        }

        const sorted = [...list].sort((a, b) => b.points - a.points);

        sorted.forEach((player, index) => {
            const row = document.createElement('div');
            row.className = 'player-row';
            row.dataset.playerIndex = index;
            
            const rankClass = index < 3 ? `rank-${index + 1}` : '';
            
            row.innerHTML = `
                <div class="rank-cell ${rankClass}">${index + 1}</div>
                <div class="player-cell">
                    <div class="player-row-avatar">
                        <img src="${player.image}" alt="${player.name}" onerror="this.onerror=null; this.src='https://placehold.co/50?text=${player.name.charAt(0)}';">
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

        // Toggle full name on click
        leaderboardBody.querySelectorAll('.player-row-name').forEach(nameElement => {
            nameElement.addEventListener('click', (e) => {
                e.stopPropagation();
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
            nameElement.title = 'Click to see full name';
        });
    }

    // Standings Sport Filter Listeners
    standingsSportBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            standingsSportBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderStandings(btn.dataset.standingsSport);
        });
    });

    // Initial render for Soccer
    renderStandings('soccer');

    const playerStatsModal = document.getElementById('playerStatsModal');
    const closeStatsModal = document.getElementById('closeStatsModal');
    
    function showPlayerStats(player) {
        document.getElementById('statsPlayerName').textContent = player.fullName;
        document.getElementById('statsPlayerRating').textContent = `Rating: ${player.rating}`;
        
        const statsImg = document.getElementById('statsPlayerImg');
        statsImg.onerror = function() {
            this.onerror = null;
            this.src = `https://placehold.co/100?text=${player.fullName.charAt(0)}`;
        };
        statsImg.src = player.image;
        
        // Dynamic labels & cards based on sport
        const yellowCardStat = document.getElementById('yellowCardStat');
        const redCardStat = document.getElementById('redCardStat');
        const goalsLabel = document.getElementById('statsGoalsLabel');

        if (player.sport === 'basketball') {
            if (yellowCardStat) yellowCardStat.style.display = 'none';
            if (redCardStat) redCardStat.style.display = 'none';
            if (goalsLabel) goalsLabel.textContent = 'Points';
        } else {
            if (yellowCardStat) yellowCardStat.style.display = 'flex';
            if (redCardStat) redCardStat.style.display = 'flex';
            if (goalsLabel) goalsLabel.textContent = 'Goals';
        }
        
        document.getElementById('statsYellowCards').textContent = player.yellowCards || 0;
        document.getElementById('statsRedCards').textContent = player.redCards || 0;
        document.getElementById('statsGoals').textContent = player.goals;
        document.getElementById('statsAssists').textContent = player.assists;
        document.getElementById('statsMatches').textContent = player.matches;
        document.getElementById('statsWins').textContent = player.wins;
        document.getElementById('statsLosses').textContent = player.losses;
        document.getElementById('statsPoints').textContent = player.points;
        document.getElementById('statsWinRate').textContent = `${player.winRate}%`;
        
        // Populate match history
        const matchHistoryList = document.getElementById('matchHistoryList');
        matchHistoryList.innerHTML = '';
        
        if (player.matchHistory && player.matchHistory.length > 0) {
            player.matchHistory.forEach((match, index) => {
                const matchItem = document.createElement('div');
                matchItem.className = 'match-history-item';
                matchItem.style.animationDelay = `${index * 0.1}s`;
                
                const resultClass = match.result === 'WIN' ? 'win' : 'loss';
                const scoreUnit = player.sport === 'basketball' ? 'pt' : 'goal';
                
                matchItem.innerHTML = `
                    <div class="match-header">
                        <span class="match-teams">${match.team} vs ${match.opponent}</span>
                        <span class="match-score">${match.score}</span>
                        <span class="match-result ${resultClass}">${match.result}</span>
                    </div>
                    <div class="match-details">
                        <span class="match-goals">scored ${match.goalsScored} ${scoreUnit}${match.goalsScored !== 1 ? 's' : ''}</span>
                    </div>
                `;
                
                matchHistoryList.appendChild(matchItem);
            });
        } else {
            matchHistoryList.innerHTML = '<div class="no-matches">No match history available</div>';
        }
        
        const circle = document.querySelector('.progress-ring__circle');
        if (circle) {
            const radius = circle.r.baseVal.value;
            const circumference = radius * 2 * Math.PI;
            const offset = circumference - (player.winRate / 100) * circumference;
            
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;
            
            playerStatsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                circle.style.strokeDashoffset = offset;
            }, 300);
        } else {
            playerStatsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    
    if (closeStatsModal) {
        closeStatsModal.addEventListener('click', () => {
            playerStatsModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (playerStatsModal) {
        playerStatsModal.addEventListener('click', (e) => {
            if (e.target === playerStatsModal) {
                playerStatsModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && playerStatsModal && playerStatsModal.classList.contains('active')) {
            playerStatsModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
