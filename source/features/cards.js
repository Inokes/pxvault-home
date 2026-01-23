/*
file: cards.js
what this does:
- renders a card input ui
- no markdown involved
- case-insensitive input
- fortune-card style responses
*/

const RESPONSES = {
  abdi: "you're a cool guy despite me ragebaiting you :>",
  nobody: "even emptiness has shape. you just haven't named it yet.",
  fxzttk: "you send me tiktoks of femboys all the time but you're still cool",
  pxwo: "you're either me or not. choose accordingly",
  sano: "we just met but we have a lot in common :o",
  fred: "dogs cant type",
  agatha: "cats (old cats too) also can't type",
  nico: "youre gay but genuinely still my twin /srs /gen"
};

function normalize(str) {
  return str.trim().toLowerCase();
}

function getResponse(word) {
  return RESPONSES[word] ||
    `you are "${word}". no definition found. so you get to write it yourself.`;
}

export function showCards(content) {
  content.innerHTML = `
    <div class="card-container">
      <div class="card" id="card">
        <div class="card-face card-front">
          <label for="card-input">who are you?</label>
          <input id="card-input" type="text" autocomplete="off">
          <button id="card-submit">this is me</button>
        </div>
        <div class="card-face card-back" id="card-back"></div>
      </div>
    </div>
  `;

  const input = document.getElementById("card-input");
  const submit = document.getElementById("card-submit");
  const card = document.getElementById("card");
  const back = document.getElementById("card-back");

  submit.onclick = () => {
    const value = normalize(input.value);
    if (!value) return;

    back.textContent = getResponse(value);
    card.classList.add("flipped");
  };
}

