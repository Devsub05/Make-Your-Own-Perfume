// ===== recommendations.js =====

document.addEventListener('DOMContentLoaded', () => {

    const recommendationsContainer = document.querySelector('.recommendations-container');
    const selectedScents = JSON.parse(localStorage.getItem('selectedScents')) || [];

    if (selectedScents.length === 0) {
        recommendationsContainer.innerHTML = '<p>Please select at least 1 scent on the Make page first.</p>';
        return;
    }

    /* ---------------- SCENT FAMILIES ---------------- */
    const scentFamilies = {
        gourmand: ["Caramel", "Sugar Cookie", "Vanilla"],
        woody: ["Cedarwood", "Oud", "Sandalwood"],
        whiteFlorals: ["Tuberose", "Jasmine", "Orange Blossom"],
        redFlorals: ["Rose", "Poppy", "Hibiscus"],
        aquatic: ["Petrichor", "Fresh Linen", "Aquatic"],
        fruity: ["Citrus", "Berries", "Peach"]
    };

    /* ---------------- HELPER TO ENCODE PATHS ---------------- */
    function encodePath(path) {
        return path.replace(/ /g, '%20')
                   .replace(/'/g, '%27')
                   .replace(/&/g, '%26')
                   .replace(/\|/g, '%7C')
                   .replace(/é/g, '%C3%A9'); // handle accented characters like Péche
    }

    /* ---------------- PERFUME DATABASE ---------------- */
    const perfumeDB = {
        gourmand: [
            {name:"Tom Ford Vanilla Sex 50 ml - eau de parfum", image: encodePath("assets/gourmand/Tom Ford Vanilla Sex 50 ml - Eau de parfum.jpg"), price:"$$$", description:"Decadent vanilla and caramel with warm gourmand richness."},
            {name:"Vanilla Candy Rock Sugar | 42 100 ml - Kayali", image: encodePath("assets/gourmand/Vanilla Candy Rock Sugar | 42 100 ml - Kayali.jpg"), price:"$$", description:"Sweet vanilla and candy notes, playful and indulgent."},
            {name:"Caramel Skin 89 ml - PHLUR", image: encodePath("assets/gourmand/Caramel Skin 89 ml - PHLUR.jpg"), price:"$", description:"Soft caramel and creamy vanilla for an everyday sweet touch."}
        ],
        woody: [
            {name:"Santal Royal 125 ml - Guerlain", image: encodePath("assets/woody/Santal Royal 125 ml - Guerlain.jpg"), price:"$$$", description:"Luxurious sandalwood with deep, resinous woody tones."},
            {name:"Hinoki & Cedarwood Cologne Intense 50ml - Jo Malone", image: encodePath("assets/woody/Hinoki & Cedarwood Cologne Intense 50ml - Jo Malone.jpg"), price:"$$", description:"Balanced cedarwood and hinoki notes, fresh yet grounding."},
            {name:"OUD Parfum 100 ml - Bellavita", image: encodePath("assets/woody/OUD Parfum 100 ml - Bellavita.jpg"), price:"$", description:"Light and approachable woody fragrance with smooth oud."}
        ],
        whiteFlorals: [
            {name:"Do Son 75 ml - Diptyque", image: encodePath("assets/white-floral/Do Son 75 ml - Diptyque.jpg"), price:"$$$", description:"Elegant tuberose and jasmine, refined and sophisticated."},
            {name:"Jasminum Sambac 50 ml - Chloe", image: encodePath("assets/white-floral/Jasminum Sambac 50 ml - Chloe.jpg"), price:"$$", description:"Bright jasmine-forward floral, clean and feminine."},
            {name:"Marrakesh in a Bottle 10 ml - Kayali", image: encodePath("assets/white-floral/Marrakesh in a Bottle 10 ml - Kayali.png"), price:"$", description:"Lively orange blossom with a delicate floral touch."}
        ],
        redFlorals: [
            {name:"Rose 31 50 ml - Le Labo", image: encodePath("assets/red-floral/Rose 31 50 ml - Le Labo.jpg"), price:"$$$", description:"Deep rose and poppy notes, complex and luxurious."},
            {name:"Red Hibiscus Cologne Intense 50 ml - Jo Malone", image: encodePath("assets/red-floral/Red Hibiscus Cologne Intense 50 ml - Jo Malone.jpg"), price:"$$", description:"Vibrant hibiscus and red floral bouquet, elegant yet fresh."},
            {name:"Poppy Eau de Parfum 30 ml - Coach", image: encodePath("assets/red-floral/Poppy Eau de Parfum 30 ml - Coach.jpg"), price:"$", description:"Playful poppy-centric floral, light and uplifting."}
        ],
        aquatic: [
            {name:"I Don’t Know What 50 ml - D.S. & Durga", image: encodePath("assets/aquatic/I Don’t Know What 50 ml - D.S. & Durga.jpg"), price:"$$$", description:"Sophisticated aquatic freshness with nuanced complexity."},
            {name:"L'Eau Papier Eau De Toilette 50 ml - Diptyque", image: encodePath("assets/aquatic/L'Eau Papier Eau De Toilette 50 ml - Diptyque.jpeg"), price:"$$", description:"Crisp, airy, and refreshing clean aquatic scent."},
            {name:"Kerala Forest 5 ml (strong perfume oil) - Soma Ayurvedic", image: encodePath("assets/aquatic/Kerala Forest 5 ml (strong perfume oil) - Soma Ayurvedic.jpeg"), price:"$", description:"Herbal aquatic freshness with a subtle natural aroma."}
        ],
        fruity: [
            {name:"Péche Mirage Eau De Parfum 100 ml - Guerlain", image: encodePath("assets/fruity/Péche Mirage Eau De Parfum 100 ml - Guerlain.jpg"), price:"$$$", description:"Juicy citrus and sweet berries, bright and luxurious."},
            {name:"Libre Berry Crush 50 ml - YSL", image: encodePath("assets/fruity/Libre Berry Crush 50 ml - YSL.jpg"), price:"$$", description:"Fruity, vibrant, playful berry-forward composition."},
            {name:"Victoria Eau De Parfum 100 ml - Lataffa", image: encodePath("assets/fruity/Victoria Eau De Parfum 100 ml - Lataffa.jpg"), price:"$", description:"Affordable, soft fruity fragrance with citrus notes."}
        ],
        fusion: [
            {name:"Fables D'orient 100 ml - L'Artisan Parfumeur", image: encodePath("assets/random/Fables D'orient 100 ml - L'Artisan Parfumeur.jpeg"), price:"$$$", description:"Exotic blend of fruity, woody, and musky accords."},
            {name:"Chance Eau Fraîche 35 ml - Chanel", image: encodePath("assets/random/Chance Eau Fraîche 35 ml - Chanel.jpeg"), price:"$$", description:"Balanced woody, citrus, and aromatic notes for daily wear."},
            {name:"Badee Al Oud Amethyst - Lattafa", image: encodePath("assets/random/Badee Al Oud Amethyst - Lattafa.jpg"), price:"$", description:"Accessible multi-family fragrance combining woody, aquatic, and fruity scents."}
        ]
    };

    /* ---------------- PRICE RANGE INFO ---------------- */
    const priceRange = {"$$$":"$200+","$$":"<$180","$":"<$100"};

    /* ---------------- DETERMINE DOMINANT FAMILY ---------------- */
    function getDominantFamily(scents){
        let familyCount = {};
        for(let family in scentFamilies){
            familyCount[family] = scents.filter(s => scentFamilies[family].includes(s)).length;
        }
        const dominant = Object.entries(familyCount)
            .filter(([family,count])=>count>=2)
            .sort((a,b)=>b[1]-a[1]);
        return dominant.length>0?dominant[0][0]:null;
    }

    const dominantFamily = getDominantFamily(selectedScents);

    /* ---------------- SELECT PERFUMES ---------------- */
    let recommendations = dominantFamily ? perfumeDB[dominantFamily] : perfumeDB.fusion;

    /* ---------------- RENDER RECOMMENDATIONS ---------------- */
    const cardOrder = ["expensive","mid","budget"];
    recommendations.forEach((perfume,index)=>{
        const card = document.createElement('div');
        card.classList.add('recommendation-card',cardOrder[index]);
        card.innerHTML = `
            <h2>${perfume.name}</h2>
            <img src="${perfume.image}" alt="${perfume.name}" class="perfume-image">
            <p class="description">${perfume.description}</p>
            <div class="price">${perfume.price}</div>
            <div class="price-info">${priceRange[perfume.price]}</div>
        `;
        recommendationsContainer.appendChild(card);
    });

});