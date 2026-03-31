 let API_KEY = "1a761d3bb408836cd1af3641ce1604c9";

        let form = document.querySelector("form")
        let city = document.getElementById("city")
        let wheather = document.querySelector("#wheather-data")
        let historyContainer = document.getElementById("Search-history")
        let consoleBox = document.getElementById("console-output")

        function logMessage(msg){
            let p = document.createElement("div")
            p.className = "log"
            p.innerText = msg
            consoleBox.appendChild(p)
            consoleBox.scrollTop = consoleBox.scrollHeight
        }

        async function fetchweather(cityName){
            consoleBox.innerHTML = ""            

            logMessage("Sync Start")

            try{
                logMessage("Before fetching")

                let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`)

                if(!response.ok){
                    throw new Error("City not found")
                }

                let data = await response.json()

                logMessage("Promise resolved (Microtask)")

                setTimeout(()=>{
                    logMessage("setTimeout (Macrotask)")
                },0)

                let card = document.createElement("div")

                card.innerHTML =`
        <div class="weather-row"><span>City</span><span>${data.name}, ${data.sys.country}</span></div>
        <div class="weather-row"><span>Temp</span><span>${data.main.temp} °C</span></div>
        <div class="weather-row"><span>Weather</span><span>${data.weather[0].main}</span></div>
        <div class="weather-row"><span>Humidity</span><span>${data.main.humidity}%</span></div>
        <div class="weather-row"><span>Wind</span><span>${data.wind.speed} m/s</span></div>
`

                wheather.innerHTML = ""
                wheather.append(card)

                saveToHistory(cityName)

            }catch(error){
                logMessage("Error: " + error.message)
                wheather.innerHTML = `<h4 style="color:red;">${error.message}</h4>`
            }
        }

        function saveToHistory(cityName){
            let cities = JSON.parse(localStorage.getItem("cities")) || []

            if(!cities.includes(cityName)){
                cities.push(cityName)
                localStorage.setItem("cities", JSON.stringify(cities))
            }

            displayHistory()
        }

        function displayHistory(){
            let cities = JSON.parse(localStorage.getItem("cities")) || []

            historyContainer.innerHTML = ""

            cities.forEach(city => {
                let btn = document.createElement("button")
                btn.innerText = city
                btn.addEventListener("click", ()=>{
                    fetchweather(city)
                })

                historyContainer.appendChild(btn)
            })
        }

        form.addEventListener("submit",(event)=>{
            event.preventDefault()

            if(city.value.trim() === ""){
                alert("Please enter a city name")
                return
            }

            fetchweather(city.value)
        })

        window.addEventListener("load", ()=>{
            displayHistory()
        })