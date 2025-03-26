document.addEventListener('DOMContentLoaded', function() {
    // Sample data - in a real app, this would come from a database
    let hobbies = [
        { id: 1, name: 'Photography', category: 'Creative', targetHours: 20 },
        { id: 2, name: 'Running', category: 'Fitness', targetHours: 15 },
        { id: 3, name: 'Reading', category: 'Educational', targetHours: 10 }
    ];

    let activities = [
        { id: 1, hobbyId: 1, date: '2023-05-01', duration: 60, notes: 'Nature photography in the park' },
        { id: 2, hobbyId: 2, date: '2023-05-02', duration: 30, notes: 'Morning run' },
        { id: 3, hobbyId: 1, date: '2023-05-03', duration: 45, notes: 'Portrait session' }
    ];

    // DOM elements
    const hobbyList = document.querySelector('.hobby-list');
    const hobbySelect = document.getElementById('hobby-select');
    const activityForm = document.getElementById('activity-form');
    const addHobbyBtn = document.getElementById('add-hobby-btn');

    // Initialize the page
    renderHobbyList();
    updateStats();
    renderCharts();
    populateHobbySelect();

    // Event listeners
    activityForm.addEventListener('submit', handleActivitySubmit);
    addHobbyBtn.addEventListener('click', handleAddHobby);

    function renderHobbyList() {
        hobbyList.innerHTML = '';
        hobbies.forEach(hobby => {
            const hobbyActivities = activities.filter(a => a.hobbyId === hobby.id);
            const totalHours = hobbyActivities.reduce((sum, a) => sum + a.duration, 0) / 60;
            const progress = Math.min((totalHours / hobby.targetHours) * 100, 100);

            const card = document.createElement('div');
            card.className = 'hobby-card';
            card.innerHTML = `
                <h3>${hobby.name}</h3>
                <p>Category: ${hobby.category}</p>
                <p>Target: ${hobby.targetHours} hours</p>
                <p>Logged: ${totalHours.toFixed(1)} hours</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%"></div>
                </div>
                <p>${progress.toFixed(1)}% complete</p>
            `;
            hobbyList.appendChild(card);
        });
    }

    function populateHobbySelect() {
        hobbySelect.innerHTML = '<option value="">Select a hobby</option>';
        hobbies.forEach(hobby => {
            const option = document.createElement('option');
            option.value = hobby.id;
            option.textContent = hobby.name;
            hobbySelect.appendChild(option);
        });
    }

    function handleActivitySubmit(e) {
        e.preventDefault();
        
        const newActivity = {
            id: activities.length + 1,
            hobbyId: parseInt(hobbySelect.value),
            date: document.getElementById('activity-date').value,
            duration: parseInt(document.getElementById('activity-duration').value),
            notes: document.getElementById('activity-notes').value
        };
        
        activities.push(newActivity);
        activityForm.reset();
        
        updateStats();
        renderHobbyList();
        renderCharts();
    }

    function handleAddHobby() {
        const name = prompt('Enter hobby name:');
        if (name) {
            const category = prompt('Enter category:');
            const targetHours = parseInt(prompt('Enter target hours:'));
            
            const newHobby = {
                id: hobbies.length + 1,
                name,
                category,
                targetHours
            };
            
            hobbies.push(newHobby);
            renderHobbyList();
            populateHobbySelect();
        }
    }

    function updateStats() {
        document.getElementById('active-hobbies').textContent = hobbies.length;
        
        const weeklyHours = activities
            .filter(a => isDateInLastWeek(a.date))
            .reduce((sum, a) => sum + a.duration, 0) / 60;
        
        document.getElementById('weekly-hours').textContent = weeklyHours.toFixed(1);
    }

    function isDateInLastWeek(dateStr) {
        const date = new Date(dateStr);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return date >= oneWeekAgo;
    }

    function renderCharts() {
        const timeCtx = document.getElementById('timeChart').getContext('2d');
        const frequencyCtx = document.getElementById('frequencyChart').getContext('2d');
        
        // Time spent per hobby
        const timeData = hobbies.map(hobby => {
            const hobbyActivities = activities.filter(a => a.hobbyId === hobby.id);
            return hobbyActivities.reduce((sum, a) => sum + a.duration, 0) / 60;
        });
        
        new Chart(timeCtx, {
            type: 'bar',
            data: {
                labels: hobbies.map(h => h.name),
                datasets: [{
                    label: 'Hours Spent',
                    data: timeData,
                    backgroundColor: 'rgba(74, 111, 165, 0.7)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    }
                }
            }
        });
        
        // Activity frequency
        const last30Days = activities.filter(a => {
            const activityDate = new Date(a.date);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return activityDate >= thirtyDaysAgo;
        });
        
        const dates = Array(30).fill().map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return d.toISOString().split('T')[0];
        });
        
        const frequencyData = dates.map(date => {
            return last30Days.filter(a => a.date === date).length;
        });
        
        new Chart(frequencyCtx, {
            type: 'line',
            data: {
                labels: dates.map(d => d.split('-').slice(1).join('/')),
                datasets: [{
                    label: 'Activities per Day',
                    data: frequencyData,
                    borderColor: 'rgba(74, 111, 165, 1)',
                    backgroundColor: 'rgba(74, 111, 165, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Activities'
                        }
                    }
                }
            }
        });
    }
});
