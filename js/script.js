document.addEventListener('DOMContentLoaded', () => {
    // Render players (for players.html)
    function renderPlayers(containerId) {
        const playersList = document.getElementById(containerId);
        if (!playersList) return;
        playersList.innerHTML = '';
        players.forEach(player => {
            playersList.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card ${player.isIcon ? 'icon-player' : ''}">
                        <img src="${player.image}" class="card-img-top" alt="${player.name}">
                        <div class="card-body">
                            <h5 class="card-title">${player.name}</h5>
                            <p class="player-position">${player.position}</p>
                            <p class="card-text">Reg: ${player.regNum}</p>
                            ${player.isIcon ? '<span class="badge bg-warning text-dark">Icon Player</span>' : ''}
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // Render teams (for teams.html)
    function renderTeams(containerId) {
        const teamsList = document.getElementById(containerId);
        if (!teamsList) return;
        teamsList.innerHTML = '';
        teams.forEach(team => {
            const teamPlayers = players.filter(p => team.playerIds.includes(p.id));
            const playerNames = teamPlayers.map(p => `${p.name} (${p.position})`).join(', ');
            teamsList.innerHTML += `
                <div class="col-md-6 mb-4">
                    <div class="card team-card" data-team-id="${team.id}" style="cursor: pointer;">
                        <img src="${team.logo}" class="card-img-top" alt="${team.name}">
                        <div class="card-body">
                            <h5 class="card-title">${team.name}</h5>
                            <p class="card-text">
                                Manager: ${team.manager}<br>
                                Owner: ${team.owner}<br>
                                Players: ${playerNames || 'None'}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        });

        // Add click event to team cards
        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('click', () => {
                const teamId = parseInt(card.dataset.teamId);
                showTeamModal(teamId);
            });
        });
    }

    // Show team details in modal
    function showTeamModal(teamId) {
        const team = teams.find(t => t.id === teamId);
        if (!team) return;

        const teamPlayers = players.filter(p => team.playerIds.includes(p.id));

        // Populate modal
        document.getElementById('modal-team-logo').src = team.logo;
        document.getElementById('modal-team-name').textContent = team.name;
        document.getElementById('modal-team-manager').textContent = team.manager;
        document.getElementById('modal-team-owner').textContent = team.owner;

        const playerList = document.getElementById('modal-team-players');
        playerList.innerHTML = '';
        teamPlayers.forEach(player => {
            playerList.innerHTML += `
                <li class="list-group-item ${player.isIcon ? 'icon-player-modal' : ''}">
                    ${player.name} <span class="player-position">${player.position}</span>
                    ${player.isIcon ? '<span class="badge bg-warning text-dark ms-2">Icon</span>' : ''}
                </li>
            `;
        });

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('teamModal'));
        modal.show();
    }

    // Render schedule (for schedule.html)
    function renderSchedule(containerId) {
        const scheduleList = document.getElementById(containerId);
        if (!scheduleList) return;
        scheduleList.innerHTML = '';
        schedule.forEach(match => {
            scheduleList.innerHTML += `
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${match.teams[0]} vs ${match.teams[1]}</h5>
                            <p class="card-text">
                                Date: ${match.date}<br>
                                Time: ${match.time}<br>
                                Location: ${match.location}<br>
                                Status: ${match.status}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // Render for public pages
    renderPlayers('players-list');
    renderTeams('teams-list');
    renderSchedule('schedule-list');

    // Search functionality (for players.html)
    const searchBox = document.getElementById('search-box');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const playersList = document.getElementById('players-list');
            playersList.innerHTML = '';
            players
                .filter(player => 
                    player.name.toLowerCase().includes(searchTerm) || 
                    player.regNum.toLowerCase().includes(searchTerm)
                )
                .forEach(player => {
                    playersList.innerHTML += `
                        <div class="col-md-4 mb-4">
                            <div class="card ${player.isIcon ? 'icon-player' : ''}">
                                <img src="${player.image}" class="card-img-top" alt="${player.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${player.name}</h5>
                                    <p class="player-position">${player.position}</p>
                                    <p class="card-text">Reg: ${player.regNum}</p>
                                    ${player.isIcon ? '<span class="badge bg-warning text-dark">Icon Player</span>' : ''}
                                </div>
                            </div>
                        </div>
                    `;
                });
        });
    }
});