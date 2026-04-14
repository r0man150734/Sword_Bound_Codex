const canvas = document.getElementById("canvas");
const cardList = document.getElementById("cardList");

let cardsData = [];

/* Загрузка карточек */
fetch("./cards.json")
  .then(res => res.json())
  .then(data => {
    const totalList = data["total-card-list"];

    // превращаем объект категорий в один массив
    cardsData = Object.values(totalList).flat();

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

  const x = cardData.view?.x ?? 100;
  const y = cardData.view?.y ?? 100;

  card.style.left = x + "px";
  card.style.top = y + "px";

  switch (cardData.type){
    case 'weapon':

  // Формируем HTML для всех атак
  const attacksHtml = (cardData.atacks || []).map(attack => {
    const formula = attack["ATC Atributes"] 
      ? `(${attack["ATC Atributes"]})` 
      : '';
    const attackProps = attack["ATC properties"] || '';
    
    const range = attack["Range"]

    return `
      <div class="weapon-attack">
        <div class="attack-name">
          [${attack.Range}] ${attack.Name} \\ <b>урон: ${attack.Damage}</b>
        </div>
        ${formula ? `<div class="attack-formula">${formula}</div>` : ''}
        ${attackProps ? `<div class="attack-properties">${attackProps}</div>` : ''}
      </div>
    `;
  }).join('');

  const propertiesHtml = cardData.properties 
    ? `<div class="weapon-properties"${cardData.properties}</div>` 
    : '';


  const descriptionHtml = cardData.text 
    ? `<div class="weapon-description">${cardData.text}</div>` 
    : '';

  // Собираем итоговую карточку
  card.innerHTML = `
    <div class="card-header">
      <div class="card-title">${cardData.title}</div>
      <button class="card-delete">×</button>
    </div>
    <div class="card-lables">
      ${cardData.difficulty} ${cardData.rarity} ${cardData.magicness}
    </div>

    <br>

    <div class="card-content">
      ${attacksHtml}
      ${propertiesHtml}
      ${descriptionHtml}
    </div>
  `;
  break;
    default:
      card.innerHTML = `
      <div class="card-header">
        <div class="card-title">${cardData.title}</div>
        <button class="card-delete">×</button>
      </div>
      <div class="card-content">${cardData.text || ""}</div>
    `;
  }

  

  // удаление карточки
  const deleteBtn = card.querySelector(".card-delete");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    removeCard(card);
  });

  makeDraggable(card);
  canvas.appendChild(card);
}

function removeCard(cardElement) {
  cardElement.remove();
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