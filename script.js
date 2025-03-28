document.addEventListener('DOMContentLoaded', function() {
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spin-btn');
    const memberInput = document.getElementById('member-name');
    const addMemberBtn = document.getElementById('add-member');
    const teamList = document.getElementById('team-list');
    const selectedMember = document.getElementById('selected-member');
    const result = document.getElementById('result');
    
    // Colors for wheel sections
    const colors = [
        '#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#f1c40f',
        '#1abc9c', '#34495e', '#e67e22', '#27ae60', '#2980b9',
        '#8e44ad', '#c0392b', '#f39c12', '#16a085', '#2c3e50'
    ];
    
    // Load team members from localStorage if available
    let teamMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    
    // Initialize the wheel and team list
    updateTeamList();
    createWheel();
    
    // Event listeners
    spinBtn.addEventListener('click', spinWheel);
    addMemberBtn.addEventListener('click', addMember);
    memberInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addMember();
        }
    });
    
    // Functions
    function addMember() {
        const name = memberInput.value.trim();
        if (name) {
            teamMembers.push(name);
            localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
            memberInput.value = '';
            updateTeamList();
            createWheel();
        }
    }
    
    function removeMember(index) {
        teamMembers.splice(index, 1);
        localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
        updateTeamList();
        createWheel();
    }
    
    function updateTeamList() {
        teamList.innerHTML = '';
        teamMembers.forEach((member, index) => {
            const li = document.createElement('li');
            li.textContent = member;
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.addEventListener('click', () => removeMember(index));
            
            li.appendChild(removeBtn);
            teamList.appendChild(li);
        });
        
        // Disable or enable spin button based on number of members
        if (teamMembers.length < 2) {
            spinBtn.disabled = true;
            spinBtn.style.opacity = 0.5;
        } else {
            spinBtn.disabled = false;
            spinBtn.style.opacity = 1;
        }
    }
    
    function createWheel() {
        wheel.innerHTML = '';
        
        if (teamMembers.length === 0) {
            wheel.style.backgroundColor = '#f0f0f0';
            return;
        }
        
        wheel.style.backgroundColor = '';
        const anglePerSection = 360 / teamMembers.length;
        
        teamMembers.forEach((member, index) => {
            const section = document.createElement('div');
            section.className = 'wheel-section';
            section.style.transform = `rotate(${index * anglePerSection}deg)`;
            section.style.backgroundColor = colors[index % colors.length];
            
            const span = document.createElement('span');
            span.textContent = member;
            section.appendChild(span);
            
            wheel.appendChild(section);
        });
    }
    
    function spinWheel() {
        if (teamMembers.length < 2) return;
        
        // Disable the spin button during spin
        spinBtn.disabled = true;
        
        // Reset the wheel position
        wheel.style.transition = 'none';
        wheel.style.transform = 'rotate(0deg)';
        
        // Trigger reflow
        void wheel.offsetWidth;
        
        // Generate a random rotation between 5 and 10 full spins plus a random angle
        const spinCount = 5 + Math.random() * 5;
        const spinAngle = spinCount * 360;
        const extraAngle = Math.random() * 360;
        const totalAngle = spinAngle + extraAngle;
        
        // Apply the rotation with transition
        wheel.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
        wheel.style.transform = `rotate(${totalAngle}deg)`;
        
        // Calculate which member is selected
        setTimeout(() => {
            // The wheel spins clockwise, so we need to calculate the opposite angle
            const finalAngle = 360 - (totalAngle % 360);
            const anglePerSection = 360 / teamMembers.length;
            let selectedIndex = Math.floor(finalAngle / anglePerSection);
            
            // Adjust in case of rounding errors
            if (selectedIndex >= teamMembers.length) {
                selectedIndex = 0;
            }
            
            selectedMember.textContent = teamMembers[selectedIndex];
            result.style.display = 'block';
            
            // Re-enable the spin button
            spinBtn.disabled = false;
        }, 5000);
    }
});