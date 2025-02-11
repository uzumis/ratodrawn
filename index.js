document.addEventListener('DOMContentLoaded', function () {


    // Função para criar o deck com as cartas e as quantidades desejadas
    function createDeck() {
        const cards = [];

        // Função para adicionar cartas com quantidade
        function addCardToDeck(card, quantity) {
            for (let i = 0; i < quantity; i++) {
                cards.push(card);
            }
        }

        // Adicionando as cartas com suas quantidades
        addCardToDeck('./assets/Cards/SUBGIFT.png', 1);
        addCardToDeck('./assets/Cards/GIFT10.png', 1);
        addCardToDeck('./assets/Cards/GIFT30.png', 1);
        addCardToDeck('./assets/Cards/Roleta.png', 5);
        addCardToDeck('./assets/Cards/Corote.png', 4);
        addCardToDeck('./assets/Cards/Ratox.png', 4);
        addCardToDeck('./assets/Cards/Nada.png', 10);
        addCardToDeck('./assets/Cards/Locadora.png', 5);
        addCardToDeck('./assets/Cards/Game.png', 5);
        addCardToDeck('./assets/Cards/CACHACA.png', 3);
        addCardToDeck('./assets/Cards/RoletaD.png', 1); // Se RoletaD for uma carta rara

        return cards;
    }

    // Função de embaralhamento
    function shuffle(array) {
        let shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    }

    // Função para adicionar uma carta ao DOM
    function addCard(number, imageSrc) {
        const cardContainer = document.getElementById('cardWrapper');
        const cardDrawer = document.createElement('div');
        cardDrawer.className = 'card-drawer';
        
        // Adiciona o data-id único para cada carta
        cardDrawer.setAttribute('data-id', number); // Atribuindo um id único para cada carta
        cardDrawer.setAttribute('onclick', 'showModal(this)'); // Ao clicar na carta, a função showModal (definida globalmente abaixo) será chamada

        const cardNumber = document.createElement('div');
        cardNumber.className = 'card-number';
        cardNumber.textContent = number;
        console.log(cardNumber);
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';

        const cardImage = document.createElement('img');
        cardImage.src = imageSrc;
        cardImage.alt = 'Card Image';

        cardContent.appendChild(cardImage);
        cardDrawer.appendChild(cardNumber);
        cardDrawer.appendChild(cardContent);

        cardContainer.appendChild(cardDrawer);
    }

    // Gera o deck
    function generateDeck() {
        const deck = createDeck(); // Cria o deck com as cartas fixas e suas quantidades
        return shuffle(deck); // Embaralha o deck
    }

    // Atualiza a exibição do deck na página
    function updateDeckDisplay(deck) {
        const cardContainer = document.getElementById('cardWrapper');
        cardContainer.innerHTML = ''; // Limpa as cartas atuais
        for (let i = 1; i <= deck.length; i++) {
            addCard(i, deck[i - 1]);
        }
    }

    // Verifica se já existe um deck salvo no localStorage; se não, gera um novo deck
    let deck;
    if (localStorage.getItem("deck")) {
        deck = JSON.parse(localStorage.getItem("deck"));
        if (!deck || deck.length !== 40) {
            deck = generateDeck();
            localStorage.setItem("deck", JSON.stringify(deck));
        }
    } else {
        deck = generateDeck();
        localStorage.setItem("deck", JSON.stringify(deck));
    }
    updateDeckDisplay(deck);

    // Botão para re‑shuffle: gera um novo deck, salva no localStorage e atualiza a exibição
    const reshuffleBtn = document.getElementById('reshuffleBtn');
    if (reshuffleBtn) {
        reshuffleBtn.addEventListener('click', function () {
            deck = generateDeck();
            localStorage.setItem("deck", JSON.stringify(deck));
            for (let i = 0; i <= 40; i++) {
                localStorage.removeItem("cardState_" + i);
            }
            updateDeckDisplay(deck);
        });
    }

    function loadRevealedCardsState() {
        const cards = document.querySelectorAll('.card-drawer');

        cards.forEach(card => {
            const cardId = card.getAttribute('data-id'); // Obtém o data-id da carta
            const savedState = localStorage.getItem(`cardState_${cardId}`);

            if (savedState) {
                const { backgroundImage, cardNumber } = JSON.parse(savedState);
                card.style.backgroundImage = `url(${backgroundImage})`;
                card.querySelector('.card-number').innerText = cardNumber;
            }
        });
    }

    loadRevealedCardsState();



    var x;
    var $cards = $(".card-picked");
    var $style = $(".hover");

    $cards
        .on("mousemove touchmove", function (e) {
            var pos = [e.offsetX, e.offsetY];
            e.preventDefault();
            if (e.type === "touchmove") {
                pos = [e.touches[0].clientX, e.touches[0].clientY];
            }
            var $card = $(this);
            var l = pos[0];
            var t = pos[1];
            var h = $card.height();
            var w = $card.width();
            var px = Math.abs(Math.floor(100 / w * l) - 100);
            var py = Math.abs(Math.floor(100 / h * t) - 100);
            var pa = (50 - px) + (50 - py);
            var lp = (50 + (px - 50) / 1.5);
            var tp = (50 + (py - 50) / 1.5);
            var px_spark = (50 + (px - 50) / 7);
            var py_spark = (50 + (py - 50) / 7);
            var p_opc = 20 + (Math.abs(pa) * 1.5);
            var ty = ((tp - 50) / 2) * -1;
            var tx = ((lp - 50) / 1.5) * .5;
            var grad_pos = `background-position: ${lp}% ${tp}%;`
            var sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`
            var opc = `opacity: ${p_opc / 100};`
            var tf = `transform: rotateX(${ty}deg) rotateY(${tx}deg)`
            var style = `
.card:hover:before { ${grad_pos} }  
.card:hover:after { ${sprk_pos} ${opc} }   
`
            $cards.removeClass("active");
            $card.removeClass("animated");
            $card.attr("style", tf);
            $style.html(style);
            if (e.type === "touchmove") {
                return false;
            }
            clearTimeout(x);
        }).on("mouseout touchend touchcancel", function () {
            var $card = $(this);
            $style.html("");
            $card.removeAttr("style");
            x = setTimeout(function () {
                $card.addClass("animated");
            }, 2500);
        });

    $(".card-picked img").on("load", function () {
        if (this.src.includes('RoletaD') || 
        this.src.includes('GIFT30') ||
        this.src.includes('GIFT10') ||
        this.src.includes('CACHACA') ||
        this.src.includes('SUBGIFT')) {
            $(this).closest(".card-picked").addClass("foil");
        }
    });
    const logo = document.getElementById("logo");
    console.log(logo);
    const sound = document.getElementById("sound");

    logo.addEventListener("mouseover", function () {
        sound.currentTime = 0;
        sound.play();m
    });
});


