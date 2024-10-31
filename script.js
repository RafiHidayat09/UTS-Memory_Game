const themes = {
    perkuliahan: ["📘", "📎", "🖊️", "📏", "📒", "📐", "📝", "💻"]
  };
  
  let selectedTheme = themes.perkuliahan;
  let cards = [];
  let flippedCards = [];
  let matchedCards = 0;
  let moves = 0;
  let time = 90; // Hitung mundur dari 60 detik
  let timer;
  let gameStarted = false; // Status permainan
  
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  function createBoard() {
    cards = [...selectedTheme, ...selectedTheme];
    shuffle(cards);
    matchedCards = 0;
    flippedCards = [];
    moves = 0;
    time = 60; // Reset waktu saat permainan dimulai
    document.getElementById("moves").textContent = moves;
    document.getElementById("time").textContent = time;
  
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";
    cards.forEach((icon, index) => {
      const card = document.createElement("div");
      card.classList.add("card", "flipped"); // Mulai dengan semua kartu terbuka
      card.dataset.icon = icon;
      card.dataset.index = index;
  
      const cardInner = document.createElement("div");
      cardInner.classList.add("card-inner");
  
      const cardFront = document.createElement("div");
      cardFront.classList.add("card-front");
  
      const cardBack = document.createElement("div");
      cardBack.classList.add("card-back");
      cardBack.textContent = icon;
  
      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      card.appendChild(cardInner);
  
      card.addEventListener("click", flipCard);
      gameBoard.appendChild(card);
    });
  
    document.getElementById("game-info").classList.remove("hidden");
    document.getElementById("game-board").classList.remove("hidden");
    document.getElementById("reset-button").classList.remove("hidden");
  
    // Tampilkan kartu selama 3 detik, lalu tutup dan mulai timer
    setTimeout(() => {
      document.querySelectorAll(".card").forEach(card => card.classList.remove("flipped"));
      startTimer();
    }, 10000);
  }
  
  function startTimer() {
    timer = setInterval(() => {
      time--;
      document.getElementById("time").textContent = time;
  
      // Jika waktu habis
      if (time <= 0) {
        clearInterval(timer);
        showLossPopup(); // Tampilkan popup kekalahan
      }
    }, 1000);
  }
  
  function flipCard() {
    if (!gameStarted) {
      showClickInfoPopup(); // Tampilkan popup info jika permainan belum dimulai
      return;
    }
  
    if (flippedCards.length === 2 || this.classList.contains("flipped")) return;
  
    this.classList.add("flipped");
    flippedCards.push(this);
    moves++;
    document.getElementById("moves").textContent = moves;
  
    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 600);
    }
  }
  
  function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.icon === card2.dataset.icon) {
      card1.classList.add("matched");
      card2.classList.add("matched");
      matchedCards += 2;
  
      if (matchedCards === cards.length) {
        clearInterval(timer);
        showReport(); // Tampilkan popup kemenangan
        document.getElementById("confetti").classList.remove("hidden");
        setTimeout(() => {
          document.getElementById("confetti").classList.add("hidden");
        }, 1500);
        gameStarted = false; // Hentikan interaksi setelah permainan selesai
      }
    } else {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
    }
    flippedCards = [];
  }
  
  function showReport() {
    const reportText = `Permainan selesai! Anda membutuhkan ${60 - time} detik dan melakukan ${moves} langkah.`;
    document.getElementById("report-text").textContent = reportText;
    document.getElementById("report-popup").classList.remove("hidden");
  }
  
  function showLossPopup() {
    const reportText = `Waktu habis! Anda melakukan ${moves} langkah.`;
    document.getElementById("report-text").textContent = reportText;
    document.getElementById("report-popup").classList.remove("hidden");
    resetGame(); // Mulai ulang permainan otomatis
  }
  
  function closePopup() {
    document.getElementById("report-popup").classList.add("hidden");
    hideAllCards(); // Menyembunyikan semua kartu saat popup ditutup
  }
  
  function hideAllCards() {
    document.querySelectorAll(".card").forEach(card => {
      card.classList.remove("flipped");
      card.classList.remove("matched");
    });
    resetGame(); // Mengatur ulang tampilan permainan
  }
  
  function resetGame() {
    matchedCards = 0;
    moves = 0;
    time = 60; // Reset waktu
    document.getElementById("moves").textContent = moves;
    document.getElementById("time").textContent = time;
    document.getElementById("game-info").classList.add("hidden");
    document.getElementById("game-board").classList.add("hidden");
    document.getElementById("reset-button").classList.add("hidden");
    document.getElementById("start-button").classList.remove("hidden"); // Tombol Start tetap terlihat
    gameStarted = false; // Hentikan interaksi sampai tombol mulai diklik
  }
  
  function showClickInfoPopup() {
    document.getElementById("click-info-popup").classList.remove("hidden");
  }
  
  function closeClickInfoPopup() {
    document.getElementById("click-info-popup").classList.add("hidden");
  }
  
  document.getElementById("start-button").addEventListener("click", () => {
    createBoard();
    document.getElementById("start-button").classList.add("hidden");
    gameStarted = true; // Set permainan dimulai
  });
  
  document.getElementById("reset-button").addEventListener("click", resetGame);
  
  document.getElementById("close-popup").addEventListener("click", closePopup);
  document.getElementById("close-click-popup").addEventListener("click", closeClickInfoPopup);
  