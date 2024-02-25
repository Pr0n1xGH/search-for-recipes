//import translate from "translate";

const inputElement = document.querySelector('.ingredients');

inputElement.addEventListener('input', addCommas);

if (localStorage.getItem("apikey") == '') {
    console.log(localStorage.getItem("apikey")) 
}


function addCommas(event) {
    const inputValue = event.target.value;
    if (inputValue.indexOf(' ') > -1) {
        const formattedValue = formatWithCommas(inputValue);
        event.target.value = formattedValue;
    }
}

function formatWithCommas(str) {
    const words = str.split(' ');
    if (words[0].substr(-1) !== ",") {
        const formattedWords = words.filter((words) => words !== "")
                                    .map(word => word + ',');
        return formattedWords.join(' ');
    } else {
        return words[0].toString().substring(0, str.length - 1)
    }
}

function setApiKey() {
    let apikey = document.getElementById("apikey")
    localStorage.setItem("apikey", apikey.value);
    alert("Изменения сохранены! Новый ключ: " + apikey.value)
}

async function getReceptions() {
    let apiKeySpoonacular = localStorage.getItem("apikey");

    if (localStorage.getItem("apikey") == null || localStorage.getItem("apikey") == '') {
        apiKeySpoonacular = "47db37349a534b34833999f0ae0edf2f";
    }

    fetch((
        "https://api.spoonacular.com/recipes/findByIngredients?" +
        new URLSearchParams({
            apiKey: apiKeySpoonacular,
            ingredients: inputElement.value
        }).toString()
    ), {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data) => {
        inputElement.value = ""

        for (item in data) {
            fetch((
                `https://api.spoonacular.com/recipes/${data[item].id}/information?` +
                new URLSearchParams({
                    apiKey: apiKeySpoonacular
                })
            ), {
                method: "GET",
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then((response) => response.json())
            .then((recepts) => {
                let receptsDiv = document.getElementById('recepts');
                let recept = document.createElement('div');

                recept.className = 'recept';
                recept.innerHTML = `
                    <img src=${recepts.image}>
                    <h2 class='title_recept'>${recepts.title}</h2>
                    <p class='summary'>${recepts.summary.replace(/(<([^>]+)>)/ig, '')}</p>
                    <a class="underline" href=${recepts.spoonacularSourceUrl}>
                        Подробнее 
                        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" /></svg>
                    </a>
                `;
                
                receptsDiv.appendChild(recept);
            })
            .catch((error) => {
                return alert("Произошла ошибка: " + error.toString());
            })
        }
    });
}