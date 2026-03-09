// ===== make.js =====
document.addEventListener('DOMContentLoaded', () => {

    const potionContainer = document.querySelector('.potion-container');
    const potionFill = document.querySelector('.potion-fill');
    const xBtn = document.querySelector('.potion-x');
    const checkBtn = document.querySelector('.potion-check');
    const scents = Array.from(document.querySelectorAll('.make-grid img'));

    const maxScents = 5;
    let selectedScents = [];

    /* ---------------- DRAG EVENTS ---------------- */

    scents.forEach(img => {

        img.addEventListener('dragstart', () => {
            img.classList.add('dragging');
        });

        img.addEventListener('dragend', () => {
            img.classList.remove('dragging');
        });

    });

    /* ---------------- AUTO SCROLL WHILE DRAGGING ---------------- */

    document.addEventListener("dragover", e => {

        const scrollZone = 120; 
        const scrollSpeed = 10;

        if (e.clientY < scrollZone) {
            window.scrollBy(0, -scrollSpeed);
        }

        if (window.innerHeight - e.clientY < scrollZone) {
            window.scrollBy(0, scrollSpeed);
        }

    });

    /* ---------------- DROP INTO POTION ---------------- */

    potionContainer.addEventListener('dragover', e => {
        e.preventDefault();
    });

    potionContainer.addEventListener('drop', e => {

        e.preventDefault();

        const dragging = document.querySelector('.dragging');
        if(!dragging) return;

        if(selectedScents.length >= maxScents){
            selectedScents[0].classList.add('flash');
            setTimeout(()=> selectedScents[0].classList.remove('flash'),220);
            return;
        }

        dragging.classList.add('selected');
        selectedScents.push(dragging);

        updatePotion();

    });

    /* ---------------- REMOVE LAST SCENT ---------------- */

    xBtn.addEventListener('click', () => {

        if(selectedScents.length === 0) return;

        const last = selectedScents.pop();
        last.classList.remove('selected');

        updatePotion();

    });

    /* ---------------- CONFIRM SCENTS ---------------- */

    checkBtn.addEventListener('click', () => {

        if(selectedScents.length === 0) return;

        const names = selectedScents.map(img => img.alt);
        alert(`You selected: ${names.join(', ')}`);

    });

    /* ---------------- UPDATE POTION FILL ---------------- */

    function updatePotion(){

        const fill = (selectedScents.length / maxScents) * 100;
        potionFill.style.height = `${fill}%`;

    }

});