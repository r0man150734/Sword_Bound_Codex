const canvas = document.getElementById("canvas");
const cardList = document.getElementById("cardList");

let cardsData = [];

/* Загрузка карточек */
fetch("./cards.json")
  .then(res => res.json())
  .then(data => {
    cardsData = data;
    renderSidebar();
  })
  .catch(err => console.error("Ошибка загрузки cards.json:", err));

/* Sidebar */
function renderSidebar() {
  cardList.innerHTML = "";

  cardsData.forEach(card => {
    const btn = document.createElement("button");
    btn.classList.add("card-btn");
    btn.textContent = card.title;

    btn.addEventListener("click", () => {
      createCard(card);
    });

    cardList.appendChild(btn);
  });
}

/* Создание карточки */
function createCard(cardData) {
  const card = document.createElement("div");
  card.classList.add("card");

  // позиция из JSON (с fallback)
  const x = cardData.view?.x ?? 100;
  const y = cardData.view?.y ?? 100;

  card.style.left = x + "px";
  card.style.top = y + "px";
  card.style.background = cardData.view?.color || "#333";

  card.innerHTML = `
    <div class="card-title">${cardData.title}</div>
    <div class="card-content">${cardData.summary || ""}</div>
  `;

  makeDraggable(card);

  canvas.appendChild(card);
}

/* Drag logic */
function makeDraggable(element) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    element.style.left = e.clientX - offsetX + "px";
    element.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}