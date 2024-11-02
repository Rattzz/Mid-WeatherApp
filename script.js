let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let cityRef = document.getElementById("city");
let input = document.querySelector(".autocomplete-input");
let debounceTimer;
let selectedSuggestion = "";


let getWeather = () => {
  let cityValue = selectedSuggestion || cityRef.value;
  if (cityValue.length === 0) {
    result.innerHTML = `<h3 class="msg">Please enter a city name</h3>`;
  } else {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=metric`;
    cityRef.value = "";
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        console.log(data.weather[0].icon);
        console.log(data.weather[0].main);
        console.log(data.weather[0].description);
        console.log(data.name);
        console.log(data.main.temp_min);
        console.log(data.main.temp_max);
        result.innerHTML = `<h2>${data.name}</h2>
                                    <h4 class="weather">${data.weather[0].main}</h4>
                                    <h4 class="desc">${data.weather[0].description}</h4>
                                    <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
                                    <div class="temp-container">
                                        <div>
                                            <h4 class="title">min</h4>
                                            <h4 class="temp">${data.main.temp_min}</h4>
                                        </div>
                                        <div>
                                            <h4 class="title">max</h4>
                                            <h4 class="temp">${data.main.temp_max}</span></p></li>`;
      })
      .catch(() => {
        result.innerHTML = `<h3 class="msg">City not found</h3>`;
      });
  }
};

searchBtn.addEventListener("click", getWeather);
window.addEventListener("load", getWeather);

input.addEventListener("input", (e) => {
    let userInput = e.target.value.toLowerCase().trim();
  
    removeElements();
  
    if (userInput.length < 2) {
      return;
    }
  
    clearTimeout(debounceTimer); 
    debounceTimer = setTimeout(() => {
      let key = "6f45e05170bbdac06957ae9675c76ebd";
      let url = `https://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=15&appid=${key}`;
  
      fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
            let suggestions = data
            .filter((cityValue) => cityValue.name)
            .filter((cityValue) => {
              let cityNameLower = cityValue.name.toLowerCase();
              return cityNameLower.startsWith(userInput) && /^[a-zA-Z\s]*$/.test(cityValue.name);
              });
                    


          for (let city of suggestions) {
            let listItem = document.createElement("li");
            listItem.classList.add("list-items");
            listItem.style.cursor = "pointer";
            listItem.setAttribute("onclick", "displayNames('" + city.name + "')");
  
            let word = "<b>" + city.name.charAt(0).toUpperCase() + city.name.slice(1) + "</b>";
  
            listItem.innerHTML = word;
            listItem.id = city.name;
  
            document.querySelector(".list").appendChild(listItem);
          }
          
        })
        .catch((error) => {
          console.error("Error fetching city names:", error);
        });
    }, 1000); 
  });

function displayNames(value) {
  selectedSuggestion = value;
  input.value = value;
  removeElements();
}

function removeElements() {
  let items = document.querySelectorAll(".list-items");
  items.forEach((item) => {
    item.remove();
  });
}