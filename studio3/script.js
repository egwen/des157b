(function(){
    'use strict';
    // Script for Back4App functionality
    Parse.initialize("yQYReuHAlihi4JIncRPWRQKiOWxBcTaVgxtaxnwG","31X2AXjKlZJU5f5Z3ekaHfiCCXOatWVVImyEZ0e4"); // PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    Parse.serverURL = 'https://parseapi.back4app.com/';

    // Variables for geoGuessr game
    let geoGuessList = []; // List of markers
    let prevLocations = [];
    let imageElem = document.getElementById('locationImage');
    let currentGeoGuess;
    let guessing = true;
    let totalScore = 0;
    let timer;
    const timerElem = document.querySelector('#timer span');
    const timerParent = document.getElementById('timer-overlay');
    const startTime = 600;
    let timeLeft = startTime;
    // Initialize timer element to match the start time

    // Variables for map functionality
    let marker, map, line;
    let answerMarker;
    let bounds = [
        [38.52780212591687, -121.72701358795167],
        [38.54463587695316, -121.77677314641188]
    ];
    // Initialize map 
    map = L.map('map', {
        minZoom: 15,
        maxZoom: 19,
        maxBounds: bounds
    }).setView([38.538406,-121.7511548], 15);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 25,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    
    window.addEventListener('load', () => {
        // Initialize timer
        setTimerText(startTime);
        document.getElementById('start').addEventListener('click', () => {
            document.getElementById('intro-overlay').className = 'hidden';
            startGame();
        });
        // Start game when window loads -> later switch to after instructions overlay
    });

    async function startGame() {
        try {
            await getLocations();
            try {
                await startRound();
            } catch (error) {
                console.error('Error while starting a new round', error);
            }
        } catch (error) {
            console.error('Error while fetching locations from Back4App');
        }
    }

    async function startRound() {
        try {
            await setRandomImage();
            try {
                await startTimer();
            } catch (error) {
                console.error('Error while fetching locations from Back4App')
            }
        } catch (error) {
            console.error('Error while starting a new round', error);
        }
        resetMap();
        hideResults();
        nextBtn.className = 'hidden';
        nextBtn.tabIndex = -1; // Not keyboard focusable
        timerParent.className = 'showing'
        guessing = true;
    }

    async function getLocations() {
        const locations = Parse.Object.extend('GeoGuess');
        const query = new Parse.Query(locations);

        try {
            const results = await query.find();
            results.forEach( (location) => {
                geoGuessList.push({
                    id: location.id,
                    locationImg: location.get('locationImage')._url,
                    latLng: location.get('latLng'),
                    difficulty: location.get('difficulty')
                });
            });
            console.log('getLocation success');

        } catch (error) {
            console.log('Error while fetching locations', error);
        }

        // DEBUGGING: Adds all the answers to the map
        // geoGuessList.forEach((geoGuess) => {
        //     let marker = L.marker([geoGuess.latLng._latitude,geoGuess.latLng._longitude]).addTo(map);
        //     let popupContent = `<img width=200 height=200 src=${geoGuess.locationImg}>`
        //     marker.bindPopup(popupContent).openPopup();
        // });
        // Debugging end

        return true;
    }

    async function setRandomImage() {
        let i = getRandomInt(0, geoGuessList.length);
        // continue generating a random int until it is a new location
        while (currentGeoGuess && currentGeoGuess.id == geoGuessList[i].id) {
            i = getRandomInt(0, geoGuessList.length);
        }
        currentGeoGuess = geoGuessList[i];
        imageElem.src = currentGeoGuess.locationImg;
        document.getElementById('image').className = 'showing';
        console.log("setRandomImage Success");
    }

    async function startTimer() {
        timerParent.style.color = 'black';          
        timeLeft = startTime;
        setTimerText(timeLeft);
        // timerElem.textContent = timeLeft >= 100 ? `00:${timeLeft/10}`:`00:0${timeLeft/10}`;
        timer = setInterval(countDown, 100);
        console.log("start timer");
    }

    // async function nextLocation() {
    //     resetMap();
    //     try {
    //         await setRandomImage();
    //     } catch (error) {
    //         console.error('Error while loading image: ', error);
    //     }
    //     hideResults();
    //     nextBtn.className = 'disabled';
    //     nextBtn.tabIndex = -1;
    // }

    // Event Listeners
    window.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
            if (guessBtn.className == 'enabled') {
                checkGeoGuess();
            } else if (nextBtn.className == 'enabled') {
                startRound();
            }
        }
    });

    const guessBtn = document.getElementById('guess');
    guessBtn.addEventListener('click', () => {
        if (guessBtn.className == 'enabled') {
            checkGeoGuess();
        }
    });

    const maximizeBtn = document.getElementById('maximize');
    const minimizeBtn = document.getElementById('minimize');
    maximizeBtn.addEventListener('click', toggleImageSize);
    minimizeBtn.addEventListener('click', toggleImageSize);

    function toggleImageSize() {
        if (imageElem.className == 'max') {
            imageElem.className = 'min';
            minimizeBtn.style.display = 'none';
            maximizeBtn.style.display = 'block';
        } else {
            imageElem.className = 'max';
            maximizeBtn.style.display = 'none';
            minimizeBtn.style.display = 'block';
        }
    }

    let resultOverlay = document.getElementById('result-overlay');
    function showResults() {
        if (marker) {
            marker.dragging.disable();
        }
        resultOverlay.className = 'showing';
        guessBtn.className = 'disabled';
        guessBtn.tabIndex = -1;
        nextBtn.className = 'enabled';
        nextBtn.tabIndex = 0;
        guessing = false;
    }

    let nextBtn = document.getElementById('next');
    nextBtn.addEventListener('click', () => {
        if (nextBtn.className == 'enabled') {
            startRound();
        }
    });

   
    function hideResults() {
        resultOverlay.className = 'hidden';
    }

    function resetMap() {
        if (line) {
            line.remove();
            line = null;
        }
        if (marker) {
            marker.remove();
            marker = null;
        }
        if (answerMarker) {
            answerMarker.remove();
        }
        map.setView([38.538406,-121.7511548], 15);
    }

    function countDown() {
        timeLeft--;
        if (timeLeft % 10 == 0) {
            setTimerText(timeLeft);
            // timerElem.textContent = timeLeft >= 100 ? `00:${timeLeft/10}`:`00:0${timeLeft/10}`;
            if (timeLeft <= 100) {
                timerParent.style.color = 'red';
                timerParent.style.transform = 'scale(1.5)';
                timerParent.addEventListener('transitionend', () => {
                    timerParent.style.transform = 'scale(1)';
                });
            }
            console.log(timeLeft);
        }
        if (timeLeft == 0) {
            console.log('Out of time');
            checkGeoGuess();
        }
    }

    

    map.addEventListener('click', (e) => {
        if (guessing) {
            guessBtn.className = 'enabled';
            guessBtn.tabIndex = 0;
            if (marker) {
                marker.setLatLng(e.latlng);
            } else {
                addMarker([e.latlng.lat, e.latlng.lng]);
            }
        }
        if (imageElem.className == 'max') {
            toggleImageSize();
        }

        // DEBUGGING: print the location of where the map was clicked
        console.log("marker", parseFloat(marker._latlng.lat), parseFloat(marker._latlng.lng));
    })

    function addMarker(coord) {
        console.log(coord);
        marker = L.marker(coord, {
            draggable: true,
            keyboard: true
        }).addTo(map);

        marker.addEventListener('move', (e) => {
            // Show trash can
            // trashMarker.setOpacity(1);
            // If marker is moved out of bounds, return to original spot
            if (!map.getBounds().contains(marker.getLatLng())) {
                marker.setLatLng(e.oldLatLng);
            }

            if (line) {
                line.remove();
                line = null;
            }
        });
    }

    function checkGeoGuess() {
        // Minimize the image if it has been maximized
        if (imageElem.className == 'max') {
            toggleImageSize();
        }

        // Disable future guesses until the next location
        guessing = false;

        // Stop timer
        clearInterval(timer);

        // Add a marker corresponding to the current image
        answerMarker = L.marker([currentGeoGuess.latLng._latitude,currentGeoGuess.latLng._longitude]).addTo(map);
        let answerPoint = answerMarker.getLatLng();

        // Calculate distance, score, and total score and update results overlay
        let distance, score;
        if (marker) {
            let markerPoint = marker.getLatLng();
            distance = Math.round(map.distance(markerPoint, answerPoint) * 100) / 100;
            score = 1200 - distance > 0 ? Math.round(1200 - distance) : 0;

            // Draw line between user guess and answer markers and zoom map to fit
            line = L.polyline([markerPoint, answerPoint], {color: 'red'}).addTo(map);
            map.fitBounds(L.latLngBounds(markerPoint, answerPoint).pad(0.5));
        } else {
            distance = '-- ';
            score = 0;
        }
        
        totalScore += score;
        // Update the results overlay to match values
        document.querySelector('#distance span').textContent = distance;
        document.querySelector('#score span').textContent = score;
        document.querySelector('#total-score span').textContent = totalScore;
        document.querySelector('#time span').textContent = (startTime - timeLeft) / 10;

        showResults();
    }

    // Parses and sets the text of the timer element 
    function setTimerText(time) {
        // Remove any old text content
        timerElem.textContent = '';

        // Set the minutes time
        if (time >= 600) {
            let minutes =  Math.floor(time / 600);
            timerElem.textContent += minutes >= 10 ? `${minutes}:`:`0${minutes}:`;
            // Update time to remaining seconds
            time %= 600;
        } else {
            timerElem.textContent += '00:';
        }
        // Set the seconds time
        timerElem.textContent += time >= 100 ? `${time/10}`:`0${time/10}`;
        // console.log(timerElem.textContent);
    }

    // Get a random int between min and max (exclusive)
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
}());