const resultsNav = document.querySelector("#resultsNav");
const favouritesNav = document.querySelector("#favouritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// NASA API
const apiKey = "DEMO_KEY";
const count = 10;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

// Global Variable
let dataObjects = [];
let favourites = {};

function showContent() {
  window.scrollTo({
    top: 0,
    behavior: "instant",
  });
  loader.classList.add("hidden");
}

function createDOMNodes(page) {
  const dataToUse = page === "result" ? dataObjects : Object.values(favourites);
  dataToUse.forEach((result) => {
    // Card Container
    const card = document.createElement("div");
    card.classList.add("card");
    // Link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    // Image
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA Picture of The Day";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    // Card Body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Card Title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // Save Text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "result") {
      saveText.textContent = "Add to Favourites";
      saveText.setAttribute("onclick", `saveFavourite('${result.url}')`);
    } else {
      saveText.textContent = "Remove from Favourites";
      saveText.setAttribute("onclick", `removeFromFavourite('${result.url}')`);
    }
    // Card Text
    const cardText = document.createElement("p");
    cardText.textContent = result.explanation;
    // Footer Container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    // Date
    const date = document.createElement("strong");
    date.textContent = result.date;
    // Copyright
    const copyright = document.createElement("span");
    copyright.textContent = result.copyright ? ` ${result.copyright}` : "";

    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

function updateDOM(page) {
  // get favourites from local storage
  if (localStorage.getItem("favourites")) {
    favourites = JSON.parse(localStorage.getItem("favourites"));
  }
  if (page === "result") {
    resultsNav.classList.remove("hidden");
    favouritesNav.classList.add("hidden");
  } else {
    favouritesNav.classList.remove("hidden");
    resultsNav.classList.add("hidden");
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent();
}

// Async function to load 10 APOD Objects from the API
async function getDataFromNasa() {
  // show loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    dataObjects = await response.json();
    updateDOM("result");
  } catch (err) {
    console.log("getDataFromNasa function", err);
  }
}

// Add result to favourites
function saveFavourite(itemUrl) {
  if (favourites[itemUrl]) {
    alert("This item is already in Favourites");
    return;
  } else {
    // loop through dataObjects to select favourite
    dataObjects.forEach((result) => {
      if (result.url === itemUrl) {
        favourites[itemUrl] = result;
        // Show save confirmation
        saveConfirmed.classList.remove("hidden");
        setTimeout(() => {
          saveConfirmed.classList.add("hidden");
        }, 2000);
        localStorage.setItem("favourites", JSON.stringify(favourites));
      }
    });
  }
}

// Remove from Favourite
function removeFromFavourite(itemUrl) {
  if (favourites[itemUrl]) {
    delete favourites[itemUrl];
    localStorage.setItem("favourites", JSON.stringify(favourites));
    updateDOM("favourites");
  }
}

// On Load
getDataFromNasa();
