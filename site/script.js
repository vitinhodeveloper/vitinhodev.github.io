document.getElementById('matchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const teamA = document.getElementById('teamA').value;
    const teamB = document.getElementById('teamB').value;
    const scoreA = parseInt(document.getElementById('scoreA').value);
    const scoreB = parseInt(document.getElementById('scoreB').value);
    const matchTime = new Date().toLocaleString();
    
    if (teamA === teamB) {
        alert("As equipes A e B não podem ser iguais.");
        return;
    }
    
    updateTable(teamA, scoreA, scoreB);
    updateTable(teamB, scoreB, scoreA);
    addMatchHistory(teamA, scoreA, teamB, scoreB, matchTime);
    
    this.reset();
});

document.getElementById('editTeamNamesForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const newNames = {
        'Time 1': document.getElementById('team1').value,
        'Time 2': document.getElementById('team2').value,
        'Time 3': document.getElementById('team3').value,
        'Time 4': document.getElementById('team4').value
    };
    
    updateTeamNames(newNames);
});

const teams = {
    'Time 1': { points: 0, matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, lastMatches: [], previousPosition: null },
    'Time 2': { points: 0, matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, lastMatches: [], previousPosition: null },
    'Time 3': { points: 0, matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, lastMatches: [], previousPosition: null },
    'Time 4': { points: 0, matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, lastMatches: [], previousPosition: null }
};

function updateTeamNames(newNames) {
    for (const oldName in teams) {
        const newName = newNames[oldName];
        if (newName !== oldName) {
            teams[newName] = { ...teams[oldName] };
            delete teams[oldName];
        }
    }
    updateSelectOptions(newNames);
    renderTable();
}

function updateSelectOptions(newNames) {
    const teamASelect = document.getElementById('teamA');
    const teamBSelect = document.getElementById('teamB');
    const options = Object.values(newNames);
    
    while (teamASelect.firstChild) {
        teamASelect.removeChild(teamASelect.firstChild);
    }
    
    while (teamBSelect.firstChild) {
        teamBSelect.removeChild(teamBSelect.firstChild);
    }
    
    options.forEach(option => {
        const optionElementA = document.createElement('option');
        const optionElementB = document.createElement('option');
        optionElementA.value = option;
        optionElementA.textContent = option;
        optionElementB.value = option;
        optionElementB.textContent = option;
        teamASelect.appendChild(optionElementA);
        teamBSelect.appendChild(optionElementB);
    });
}

function updateTable(team, goalsFor, goalsAgainst) {
    if (!teams[team]) {
        teams[team] = { 
            points: 0, 
            matches: 0, 
            wins: 0, 
            draws: 0, 
            losses: 0, 
            goalsFor: 0, 
            goalsAgainst: 0, 
            goalDifference: 0, 
            lastMatches: [], 
            previousPosition: null
        };
    }
    
    teams[team].matches++;
    teams[team].goalsFor += goalsFor;
    teams[team].goalsAgainst += goalsAgainst;
    teams[team].goalDifference = teams[team].goalsFor - teams[team].goalsAgainst;
    
    if (goalsFor > goalsAgainst) {
        teams[team].wins++;
        teams[team].points += 3;
        teams[team].lastMatches.unshift('<img src="win.png" alt="Win">');
    } else if (goalsFor === goalsAgainst) {
        teams[team].draws++;
        teams[team].points += 1;
        teams[team].lastMatches.unshift('<img src="draw.png" alt="Draw">');
    } else {
        teams[team].losses++;
        teams[team].lastMatches.unshift('<img src="loss.png" alt="Loss">');
    }
    
    if (teams[team].lastMatches.length > 5) {
        teams[team].lastMatches.pop();
    }
    
    renderTable();
}

function renderTable() {
    const tableBody = document.querySelector('#leagueTable tbody');
    tableBody.innerHTML = '';
    
    const sortedTeams = Object.keys(teams).sort((a, b) => {
        if (teams[b].points === teams[a].points) {
            return teams[b].goalDifference - teams[a].goalDifference;
        }
        return teams[b].points - teams[a].points;
    });
    
    sortedTeams.forEach((team, index) => {
        const positionChange = getPositionChange(team, index);
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1} ${positionChange}</td>
            <td>${team}</td>
            <td>${teams[team].points}</td>
            <td>${teams[team].matches}</td>
            <td>${teams[team].wins}</td>
            <td>${teams[team].draws}</td>
            <td>${teams[team].losses}</td>
            <td>${teams[team].goalsFor}</td>
            <td>${teams[team].goalsAgainst}</td>
            <td>${teams[team].goalDifference}</td>
            <td>${teams[team].lastMatches.join(' ')}</td>
        `;
        
        tableBody.appendChild(row);
        
        teams[team].previousPosition = index;
    });
}

function getPositionChange(team, currentPosition) {
    const previousPosition = teams[team].previousPosition;
    if (previousPosition === null) return '';
    
    if (currentPosition < previousPosition) {
        return '<span class="position-up">↑</span>';
    } else if (currentPosition > previousPosition) {
        return '<span class="position-down">↓</span>';
    } else {
        return '■';
    }
}

function addMatchHistory(teamA, scoreA, teamB, scoreB, matchTime) {
    const historyList = document.getElementById('matchHistory');
    const listItem = document.createElement('li');
    
    const teamAName = scoreA > scoreB ? `<strong>${teamA}</strong>` : teamA;
    const teamBName = scoreB > scoreA ? `<strong>${teamB}</strong>` : teamB;
    
    listItem.innerHTML = `${teamAName} (${scoreA}) x (${scoreB}) ${teamBName}`;
    
    historyList.appendChild(listItem);
}
