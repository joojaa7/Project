const getPos  = () => navigator.geolocation.getCurrentPosition((pos) => {
    const x = pos.coords.latitude;
    const y = pos.coords.longitude;
    map.setView([x, y], 13)
})

const map = L.map('map', {zoomControl: false}).setView([60, 24], 10);
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
    maxZoom: 50,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
}).addTo(map);

getPos();
document.getElementById('daily').addEventListener('click', () => {
    const text = document.getElementById('asideParagraph');
    text.innerHTML = 'Daily';
})