/*
file: cards.js
renders a fortune-style flip card
fully controlled here
*/

const RESPONSES = {
  abdi: "you're a cool guy despite me ragebaiting you :>",
  nobody: "even emptiness has shape. you just haven't named it yet.",
  fxzttk: "you send me tiktoks of femboys all the time but you're still cool",
  pxwo: "you're either me or not. choose accordingly",
  sano: "we just met but we have a lot in common :o",
  fred: "dogs cant type",
  agatha: "cats (old cats too) also can't type",
  nico: "youre sosososo cool nico :o",
  bigpo: "youre popopo go bigpo bogpo pog pigbo bipgo also cool",
  fluorescentadolescent: "you used to get it on your fishnets, now you get it on your night dress",
  rals: "voce e muito legal caba 🥝",
  eco: "so sad you're gone",
  solwt: "so sad you got your mineberry account hacked lmao",
  coas: "you think youre nonchalant denying my dms son.",
  kay: "kay more like gay",
  giovanni: "unha de mendingo",
  calixto: "calixto calixto...",
  pereba: "voce e muito homosexual pereba.",
  me: "THANKS FOR TEACHING ME HOW TO BE A FRIEND"
};

function normalize(str) {
  return str.trim().toLowerCase();
}

function getResponse(word) {
  return (
    RESPONSES[word] ||
    `you are "${word}". no definition found. so you get to write it yourself.`
  );
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

        <div class="card-face card-back">
          <div class="card-result" id="card-back"></div>
          <button class="card-flip-again" id="card-reset">
            flip again
          </button>
        </div>
      </div>
    </div>
  `;

  const input = document.getElementById("card-input");
  const submit = document.getElementById("card-submit");
  const reset = document.getElementById("card-reset");
  const card = document.getElementById("card");
  const back = document.getElementById("card-back");

  submit.onclick = () => {
    const value = normalize(input.value);
    if (!value) return;

    back.textContent = getResponse(value);
    card.classList.add("flipped");
  };

  reset.onclick = e => {
    e.stopPropagation();
    input.value = "";
    card.classList.remove("flipped");
    input.focus();
  };
}