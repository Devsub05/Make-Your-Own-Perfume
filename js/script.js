// Play background music on page load (index.html only)
document.addEventListener('DOMContentLoaded', function() {
    const music = document.getElementById('background-music');
    if (music) {
        const playPromise = music.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                const startMusic = () => {
                    music.play();
                    document.removeEventListener('click', startMusic);
                };
                document.addEventListener('click', startMusic);
            });
        }
    }

    // --- Make page functionality ---
    const makeContainer = document.querySelector('.make-container');
    if(!makeContainer) return; // exit if not make.html

    const grid = makeContainer.querySelector('.make-grid');
    const potion = document.querySelector('.potion-bottle');
    
    // Create potion-fill overlay
    let potionFill = document.createElement('div');
    potionFill.classList.add('potion-fill');
    document.body.appendChild(potionFill); // absolute positioning handles overlap

    const maxScents = 5;
    let selectedScents = [];

    const scentImgs = Array.from(grid.querySelectorAll('img'));

    scentImgs.forEach(img => {
        // Make draggable
        img.setAttribute('draggable', true);

        // Drag start
        img.addEventListener('dragstart', (e) => {
            if(selectedScents.length >= maxScents && !img.classList.contains('selected')) {
                e.preventDefault();
                img.classList.add('flash');
                setTimeout(() => img.classList.remove('flash'), 220);
                return;
            }
            img.classList.add('dragging');
            e.dataTransfer.setData('text/plain', img.alt);
        });

        // Drag end
        img.addEventListener('dragend', () => {
            img.classList.remove('dragging');
        });
    });

    // Potion drop area
    potion.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    potion.addEventListener('drop', (e) => {
        e.preventDefault();
        const scentName = e.dataTransfer.getData('text/plain');
        const draggedImg = scentImgs.find(i => i.alt === scentName);
        if(!draggedImg) return;

        // Add scent if under max
        if(!draggedImg.classList.contains('selected') && selectedScents.length < maxScents) {
            draggedImg.classList.add('selected');
            selectedScents.push(draggedImg);

            // Increase potion fill (20% per scent)
            const fillHeight = (selectedScents.length / maxScents) * potion.offsetHeight;
            potionFill.style.height = fillHeight + 'px';
        }
    });

    // Optional: X and Check buttons
    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add('make-actions');
    const xBtn = document.createElement('img');
    xBtn.src = 'Assets/Make/X.png';
    xBtn.alt = 'Reset';
    const checkBtn = document.createElement('img');
    checkBtn.src = 'Assets/Make/Check.png';
    checkBtn.alt = 'Confirm';
    actionsContainer.appendChild(xBtn);
    actionsContainer.appendChild(checkBtn);
    document.body.appendChild(actionsContainer);

    // X button clears selections
    xBtn.addEventListener('click', () => {
        selectedScents.forEach(img => img.classList.remove('selected'));
        selectedScents = [];
        potionFill.style.height = '0px';
    });

    // Check button confirms selections (you can extend to next page)
    checkBtn.addEventListener('click', () => {
        if(selectedScents.length === 0) {
            alert("Pick at least 1 scent before proceeding!");
            return;
        }
        alert("Selected scents: " + selectedScents.map(i=>i.alt).join(", "));
        // Redirect or save state for recommendations page
    });
});