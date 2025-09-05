//
const creatElements = (arr) => {
  const htmlElemets = arr.map((el) => `<span class ="btn">${el}</span>`);
  return htmlElemets.join(" ");
};
const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("word-container").classList.remove("hidden");
  }
};

const lodaLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLessons(json.data));
};

// Remove active
const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

// Getting data from level container
const loadLevelWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickedBtn = document.getElementById(`lesson-btn-${id}`);
      clickedBtn.classList.add("active");
      displayLevelWord(data.data);
    });
};

// Load word pop up
const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};

const displayWordDetails = (word) => {
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
            <div class="">
            <h2 class="text-2xl font-bold">
              ${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${
    word.pronunciation
  })
            </h2>
          </div>
          <div class="">
            <h2 class="text-2xl font-bold">Meaning</h2>
            <p>${word.meaning}</p>
          </div>
          <div class="">
            <h2 class="text-2xl font-bold">Example</h2>
            <p>${word.sentence}</p>
          </div>
          <div>
            <h2 class="text-2xl font-bold">Synonyms</h2>
            <div class =" ">${creatElements(word.synonyms)}</div>
          </div>`;
  document.getElementById("word-modal").showModal();
};
// Function display level word

const displayLevelWord = (words) => {
  const worContainer = document.getElementById("word-container");
  worContainer.innerHTML = "";

  if (words.length == 0) {
    worContainer.innerHTML = `
      <div
        class="text-center col-span-full rounded-xl py-10 space-y-6 bangla-font"
      > 
        <img src="./assets/alert-error.png" class="mx-auto" alt="" />
        <p class="text-xl font-medium text-gray-500">
          এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
        </p>
        <h2 class="text-4xl font-bold">নেক্সট Lesson এ যান</h2>
      </div>
    `;
    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    console.log(word);
    const card = document.createElement("div");
    card.innerHTML = `
     <div
        class="bg-white rounded-xl shadow-sm text-center px-5 py-10 space-y-4"
      >
        <h2 class="text-2xl font-bold">${
          word.word ? word.word : "শব্দ পাওয়া যায়নি "
        }</h2>
        <p class="font-semibold">Meanig and Pronounciation</p>
        <div class="font-bangla font-medium text-2xl">${
          word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
        } / ${
      word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"
    }</div>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${
            word.id
          })" class="btn bg-sky-50 hover:bg-sky-500">
            <i class="fa-solid fa-circle-info"></i>
          </button>
          <button class="btn bg-sky-50 hover:bg-sky-500">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>
    `;
    worContainer.append(card);
    manageSpinner(false);
  });
};

const displayLessons = (lessons) => {
  // 1. get the container
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  // 2. get into every lessons

  for (let lesson of lessons) {
    // 3. Create Elements
    const btnDiv = document.createElement("div");

    btnDiv.innerHTML = `
            <button id="lesson-btn-${lesson.level_no}" onClick= loadLevelWord(${lesson.level_no}) 
              class="btn btn-outline btn-primary lesson-btn">
              <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
            </button>
    `;
    // 4. Append into the container
    levelContainer.append(btnDiv);
  }
};

lodaLessons();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displayLevelWord(filterWords);
    });
});
