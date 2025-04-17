const firebaseConfig = {
    apiKey: "AIzaSyB_EH7wjIv5F2qjKj40USbQ1BKgTvkmTjg",
    authDomain: "intra-cse-football.firebaseapp.com",
    projectId: "intra-cse-football",
    storageBucket: "intra-cse-football.firebasestorage.app",
    messagingSenderId: "560731856579",
    appId: "1:560731856579:web:6363105bdef059b3cecc76"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Helper to get the highest ID in a collection
async function getNextId(collectionName) {
    const snapshot = await db.collection(collectionName).get();
    if (snapshot.empty) return 1; // Start at 1 if collection is empty
    const ids = snapshot.docs.map(doc => parseInt(doc.id)).filter(id => !isNaN(id));
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
}

// Players
async function getPlayers() {
    const snapshot = await db.collection('players').get();
    return snapshot.docs.map(doc => ({ regNum: doc.id, ...doc.data() }));
}

async function addPlayer(player) {
    if (!player.regNum) throw new Error("Registration number is required");
    const existingPlayer = await db.collection('players').doc(player.regNum).get();
    if (existingPlayer.exists) throw new Error(`Player with regNum ${player.regNum} already exists`);
    const newPlayer = { ...player, regNum: player.regNum };
    await db.collection('players').doc(player.regNum).set(newPlayer);
    return newPlayer;
}

async function updatePlayer(regNum, player) {
    await db.collection('players').doc(regNum).set({ ...player, regNum }, { merge: true });
    return { regNum, ...player };
}

async function removePlayer(regNum) {
    await db.collection('players').doc(regNum).delete();
    return { message: 'Player deleted' };
}

// Teams
async function getTeams() {
    const snapshot = await db.collection('teams').get();
    return snapshot.docs.map(doc => ({ id: parseInt(doc.id), ...doc.data() }));
}

async function addTeam(team) {
    const newId = await getNextId('teams');
    const newTeam = { ...team, id: newId };
    await db.collection('teams').doc(newId.toString()).set(newTeam);
    return newTeam;
}

async function updateTeam(id, team) {
    await db.collection('teams').doc(id.toString()).set({ ...team, id: parseInt(id) }, { merge: true });
    return { id: parseInt(id), ...team };
}

async function removeTeam(id) {
    await db.collection('teams').doc(id.toString()).delete();
    return { message: 'Team deleted' };
}

// Schedule
async function getSchedule() {
    const snapshot = await db.collection('schedule').get();
    return snapshot.docs.map(doc => ({ id: parseInt(doc.id), ...doc.data() }));
}

async function addSchedule(match) {
    const newId = await getNextId('schedule');
    const newMatch = { ...match, id: newId };
    await db.collection('schedule').doc(newId.toString()).set(newMatch);
    return newMatch;
}

async function updateSchedule(id, match) {
    const existingMatch = await db.collection('schedule').doc(id.toString()).get();
    if (!existingMatch.exists) throw new Error(`Schedule with ID ${id} does not exist`);
    await db.collection('schedule').doc(id.toString()).set({ ...match, id: parseInt(id) }, { merge: true });
    return { id: parseInt(id), ...match };
}

async function removeSchedule(id) {
    const existingMatch = await db.collection('schedule').doc(id.toString()).get();
    if (!existingMatch.exists) throw new Error(`Schedule with ID ${id} does not exist`);
    await db.collection('schedule').doc(id.toString()).delete();
    return { message: 'Schedule deleted' };
}