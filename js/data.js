// Initialize data from localStorage or use defaults
const defaultPlayers = [
    { id: 1, name: "Michael Brown", regNum: "UNI12345", position: "Forward", image: "https://via.placeholder.com/200" },
    { id: 2, name: "Thomas Anderson", regNum: "UNI23456", position: "Forward", image: "https://via.placeholder.com/200" },
    { id: 3, name: "William Taylor", regNum: "UNI34567", position: "Forward", image: "https://via.placeholder.com/200" },
    { id: 4, name: "David Wilson", regNum: "UNI45678", position: "Midfielder", image: "https://via.placeholder.com/200" },
    { id: 5, name: "Christopher Lee", regNum: "UNI56789", position: "Midfielder", image: "https://via.placeholder.com/200" },
    { id: 6, name: "Richard Walker", regNum: "UNI67890", position: "Midfielder", image: "https://via.placeholder.com/200" }
];

const defaultTeams = [
    {
        id: 1,
        name: "Red Devils",
        logo: "https://via.placeholder.com/60",
        manager: "Alex Johnson",
        owner: "John Smith",
        playerIds: [1, 4]
    },
    {
        id: 2,
        name: "Blue Sharks",
        logo: "https://via.placeholder.com/60",
        manager: "Paul Davis",
        owner: "Sarah Williams",
        playerIds: [2, 5]
    },
    {
        id: 3,
        name: "Green Tigers",
        logo: "https://via.placeholder.com/60",
        manager: "Ryan Thompson",
        owner: "Emma Johnson",
        playerIds: [3, 6]
    }
];

const defaultSchedule = [
    {
        id: 1,
        teams: ["Red Devils", "Blue Sharks"],
        date: "May 10, 2025",
        time: "4:00 PM",
        location: "Main Ground",
        status: "Upcoming"
    },
    {
        id: 2,
        teams: ["Green Tigers", "Yellow Eagles"],
        date: "May 10, 2025",
        time: "6:00 PM",
        location: "Main Ground",
        status: "Upcoming"
    }
];

// Load or initialize data
let players = JSON.parse(localStorage.getItem('players')) || defaultPlayers;
let teams = JSON.parse(localStorage.getItem('teams')) || defaultTeams;
let schedule = JSON.parse(localStorage.getItem('schedule')) || defaultSchedule;

// Save functions
function savePlayers() {
    localStorage.setItem('players', JSON.stringify(players));
}
function removeTeam(id) {
    teams = teams.filter(t => t.id !== id);
    saveTeams();
}

function removePlayer(id) {
    players = players.filter(p => p.id !== id);
    savePlayers();
    // Remove player from all teams
    teams.forEach(team => {
        team.playerIds = team.playerIds.filter(pid => pid !== id);
    });
    saveTeams();
}

function removeSchedule(id) {
    schedule = schedule.filter(s => s.id !== id);
    saveSchedule();
}

function saveTeams() {
    localStorage.setItem('teams', JSON.stringify(teams));
}

function saveSchedule() {
    localStorage.setItem('schedule', JSON.stringify(schedule));
}

// CRUD for Players
function addPlayer(player) {
    player.id = players.length ? Math.max(...players.map(p => p.id)) + 1 : 1;
    players.push(player);
    savePlayers();
}

function updatePlayer(id, updatedPlayer) {
    const index = players.findIndex(p => p.id === id);
    if (index !== -1) {
        players[index] = { ...players[index], ...updatedPlayer };
        savePlayers();
    }
}

function deletePlayer(id) {
    players = players.filter(p => p.id !== id);
    // Remove player from teams
    teams.forEach(team => {
        team.playerIds = team.playerIds.filter(pid => pid !== id);
    });
    savePlayers();
    saveTeams();
}

// CRUD for Teams
function addTeam(team) {
    team.id = teams.length ? Math.max(...teams.map(t => t.id)) + 1 : 1;
    teams.push(team);
    saveTeams();
}

function updateTeam(id, updatedTeam) {
    const index = teams.findIndex(t => t.id === id);
    if (index !== -1) {
        teams[index] = { ...teams[index], ...updatedTeam };
        saveTeams();
    }
}

function deleteTeam(id) {
    teams = teams.filter(t => t.id !== id);
    // Update schedule
    schedule = schedule.filter(s => !s.teams.includes(teams.find(t => t.id === id)?.name));
    saveTeams();
    saveSchedule();
}

// CRUD for Schedule
function addSchedule(match) {
    match.id = schedule.length ? Math.max(...schedule.map(s => s.id)) + 1 : 1;
    schedule.push(match);
    saveSchedule();
}

function updateSchedule(id, updatedMatch) {
    const index = schedule.findIndex(s => s.id === id);
    if (index !== -1) {
        schedule[index] = { ...schedule[index], ...updatedMatch };
        saveSchedule();
    }
}

function deleteSchedule(id) {
    schedule = schedule.filter(s => s.id !== id);
    saveSchedule();
}