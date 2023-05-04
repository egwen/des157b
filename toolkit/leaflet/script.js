(function(){
    'use strict';

    // add your script here
    let map = L.map('map').setView([38.538406,-121.7511548], 15.3);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let SCCmarker = L.marker([38.5393938,-121.7511243]).addTo(map);

    let SCCpopup = L.popup()
    .setLatLng([38.5393938,-121.7511243])
    .setContent("The SCC has 4 single stall bathrooms that are great for pooping and it has two gender neutral bathrooms on the first floor");
    SCCmarker.bindPopup(SCCpopup).openPopup();

    let LatitudeMarker = L.marker([38.538243, -121.756287]).addTo(map);

    let LatitudePopup = L.popup()
    .setLatLng([38.538243, -121.756287])
    .setContent("The Latitude Market has an accessible single stall bathroom that no one knows about so it is always clean");
    LatitudeMarker.bindPopup(LatitudePopup).openPopup();

    let KemperMarker = L.marker([38.5373909,-121.7548561]).addTo(map);

    let KemperPopup = L.popup()
    .setLatLng([38.5373909,-121.7548561])
    .setContent("This spot is great spot for an bathroom if you use the women's restroom because it's the CS & engineering building");
    KemperMarker.bindPopup(KemperPopup).openPopup();

}());