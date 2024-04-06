let x;
let y;

const getPos  = () => navigator.geolocation.getCurrentPosition((pos) => {
    x = pos.coords.latitude;
    y = pos.coords.longitude;
    map.setView([x, y], 13)
})

const map = L.map('map', {zoomControl: false}).setView([60, 24], 10);
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
}).addTo(map);

getPos();