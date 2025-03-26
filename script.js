document.addEventListener('DOMContentLoaded', function() {
    // Load data from localStorage or initialize
    let hobbies = JSON.parse(localStorage.getItem('hobbies')) || [];
    let activities = JSON.parse(localStorage.getItem('activities')) || [];

    // DOM Elements
    const hobbyForm = document.getElementById('hobby-form');
    const hobbyList = document.getElementById('hobby-list');
    const activityForm = document.getElementById('activity-form');
    const hobbySelect = document.getElementById('activity-hobby');

    // Render all data
    renderHobbies();
    renderHobbySelect();

    // Add new hobby
    hobbyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newHobby = {
            id: Date.now(), // Unique ID
            name: document.getElementById('hobby-name').value,
            category: document.getElementById('hobby-category').value,
            targetHours: parseInt(document.getElementById('hobby-target').value)
        };
        
        hobbies.push(newHobby);
        saveData();
        renderHobbies();
        renderHobbySelect();
        hobbyForm.reset();
    });

    // Log activity
    activityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newActivity = {
            hobbyId: parseInt(hobbySelect.value),
            date: document.getElementById('activity-date').value,
            duration: parseInt(document.getElementById('activity-duration').value),
            notes: document.getElementById('activity-notes').value
        };
        
        activities.push(newActivity);
        saveData();
        activityForm.reset();
        alert('Activity logged!');
    });

    // Render hobbies list
    function renderHobbies() {
        hobbyList.innerHTML = '';
        hobbies.forEach(hobby => {
            const card = document.createElement('div');
            card.className = 'hobby-card';
            card.innerHTML = `
                <h3>${hobby.name}</h3>
                <p>Category: ${hobby.category}</p>
                <p>Target: ${hobby.targetHours} hours</p>
                <button class="edit-btn" data-id="${hobby.id}">Edit</button>
                <button class="delete-btn" data-id="${hobby.id}">Delete</button>
            `;
            hobbyList.appendChild(card);
        });

        // Add event listeners to new buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteHobby);
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editHobby);
        });
    }

    // Render hobby dropdown
    function renderHobbySelect() {
        hobbySelect.innerHTML = '<option value="">Select Hobby</option>';
        hobbies.forEach(hobby => {
            const option = document.createElement('option');
            option.value = hobby.id;
            option.textContent = hobby.name;
            hobbySelect.appendChild(option);
        });
    }

    // Delete hobby
    function deleteHobby(e) {
        const id = parseInt(e.target.dataset.id);
        hobbies = hobbies.filter(hobby => hobby.id !== id);
        activities = activities.filter(activity => activity.hobbyId !== id);
        saveData();
        renderHobbies();
        renderHobbySelect();
    }

    // Edit hobby
    function editHobby(e) {
        const id = parseInt(e.target.dataset.id);
        const hobby = hobbies.find(h => h.id === id);
        
        const newName = prompt('Edit hobby name:', hobby.name);
        const newCategory = prompt('Edit category:', hobby.category);
        const newTarget = prompt('Edit target hours:', hobby.targetHours);
        
        if (newName && newCategory && newTarget) {
            hobby.name = newName;
            hobby.category = newCategory;
            hobby.targetHours = parseInt(newTarget);
            saveData();
            renderHobbies();
            renderHobbySelect();
        }
    }

    // Save all data
    function saveData() {
        localStorage.setItem('hobbies', JSON.stringify(hobbies));
        localStorage.setItem('activities', JSON.stringify(activities));
    }
});
