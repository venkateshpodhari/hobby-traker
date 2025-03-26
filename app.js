document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.querySelector('.theme-toggle');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const addHobbyBtn = document.getElementById('addHobbyBtn');
    const hobbyModal = document.getElementById('hobbyModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const hobbyForm = document.getElementById('hobbyForm');
    const hobbiesContainer = document.getElementById('hobbiesContainer');
    const activitiesTable = document.getElementById('activitiesTable');

    // Sample Data (in a real app, this would come from an API/database)
    let hobbies = [
        { id: 1, name: 'Photography', category: 'Creative', targetHours: 20, currentHours: 15, icon: 'camera' },
        { id: 2, name: 'Running', category: 'Fitness', targetHours: 15, currentHours: 8, icon: 'running' },
        { id: 3, name: 'Reading', category: 'Educational', targetHours: 10, currentHours: 12, icon: 'book' }
    ];

    let activities = [
        { id: 1, hobbyId: 1, date: '2023-06-15', duration: 120, notes: 'Nature photography in the park' },
        { id: 2, hobbyId: 2, date: '2023-06-14', duration: 45, notes: 'Morning run around the lake' },
        { id: 3, hobbyId: 1, date: '2023-06-12', duration: 90, notes: 'Portrait session with friends' },
        { id: 4, hobbyId: 3, date: '2023-06-10', duration: 60, notes: 'Read "Atomic Habits"' }
    ];

    // Initialize the app
    init();

    function init() {
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Update theme toggle icon
        updateThemeIcon(savedTheme);
        
        // Render initial data
        renderHobbies();
        renderActivities();
        initCharts();
        
        // Set up event listeners
        setupEventListeners();
    }

    function setupEventListeners() {
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
        
        // Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.getAttribute('href');
                showSection(sectionId);
                
                // Update active nav link
                navLinks.forEach(l => l.parentElement.classList.remove('active'));
                this.parentElement.classList.add('active');
            });
        });
        
        // Modal controls
        addHobbyBtn.addEventListener('click', () => toggleModal(hobbyModal, true));
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                toggleModal(modal, false);
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                toggleModal(e.target, false);
            }
        });
        
        // Form submission
        hobbyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const newHobby = {
                id: hobbies.length + 1,
                name: formData.get('name'),
                category: formData.get('category'),
                targetHours: parseInt(formData.get('targetHours')),
                currentHours: 0,
                icon: 'heart' // Default icon
            };
            
            hobbies.push(newHobby);
            renderHobbies();
            toggleModal(hobbyModal, false);
            this.reset();
        });
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        const icon = theme === 'light' ? 'moon' : 'sun';
        themeToggle.innerHTML = `<i class="fas fa-${icon}"></i>`;
    }

    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        document.querySelector(sectionId).classList.add('active');
    }

    function toggleModal(modal, show) {
        if (show) {
            modal.classList.add('active');
        } else {
            modal.classList.remove('active');
        }
    }

    function renderHobbies() {
        hobbiesContainer.innerHTML = '';
        
        hobbies.forEach(hobby => {
            const progressPercent = Math.min((hobby.currentHours / hobby.targetHours) * 100, 100);
            
            const hobbyCard = document.createElement('div');
            hobbyCard.className = 'hobby-card';
            hobbyCard.innerHTML = `
                <div class="hobby-card-header">
                    <div class="hobby-icon">
                        <i class="fas fa-${hobby.icon}"></i>
                    </div>
                    <div>
                        <div class="hobby-title">${hobby.name}</div>
                        <div class="hobby-category">${hobby.category}</div>
                    </div>
                </div>
                <div class="hobby-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <div class="progress-info">
                        <span>${hobby.currentHours}h / ${hobby.targetHours}h</span>
                        <span class="hobby-target">${Math.round(progressPercent)}%</span>
                    </div>
                </div>
                <div class="hobby-actions">
                    <button class="btn outline"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn outline"><i class="fas fa-chart-line"></i> Stats</button>
                </div>
            `;
            
            hobbiesContainer.appendChild(hobbyCard);
        });
    }

    function renderActivities() {
        activitiesTable.innerHTML = '';
        
        activities.forEach(activity => {
            const hobby = hobbies.find(h => h.id === activity.hobbyId);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${formatDate(activity.date)}</td>
                <td>
                    <div class="activity-hobby">
                        <i class="fas fa-${hobby?.icon || 'question'}"></i>
                        ${hobby?.name || 'Unknown'}
                    </div>
                </td>
                <td>${activity.duration} minutes</td>
                <td>${activity.notes}</td>
                <td>
                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon danger"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            activitiesTable.appendChild(row);
        });
    }

    function initCharts() {
        const ctx = document.getElementById('activityChart').getContext('2d');
        
        // Group activities by date
        const activityData = {};
        activities.forEach(activity => {
            if (!activityData[activity.date]) {
                activityData[activity.date] = 0;
            }
            activityData[activity.date] += activity.duration / 60; // Convert to hours
        });
        
        const dates = Object.keys(activityData).sort();
        const hours = dates.map(date => activityData[date]);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates.map(date => formatDate(date)),
                datasets: [{
                    label: 'Hours Spent',
                    data: hours,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y.toFixed(1)} hours`;
                            }
                        }
                    }
                },
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
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Expose functions to global scope for debugging
    window.app = {
        hobbies,
        activities,
        renderHobbies,
        renderActivities
    };
});
