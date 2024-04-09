import { fetchRestaurants, fetchDailyMenu, fetchWeeklyMenu , fetchRestaurant } from './utils.js';

let restaurantId;
const restaurants = await fetchRestaurants();

const map = L.map('map', {zoomControl: false}).setView([60.16952, 24.93545], 10);
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
    maxZoom: 17,
    minZoom: 5,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
}).addTo(map);

const restaurantIcon = L.icon({
    iconUrl: 'restaurant.png',
    iconSize: [30, 30],
})

const userIcon = L.icon({
    iconUrl: 'user.png',
    iconSize: [100, 100],
})

const closestRestaurantIcon = L.icon({
    iconUrl: 'restaurantClosest.png',
    iconSize: [100, 100],
})

const markers = L.layerGroup().addTo(map);

const getPos  = () => navigator.geolocation.getCurrentPosition((pos) => {
    const x = pos.coords.latitude;
    const y = pos.coords.longitude;
    map.setView([x, y], 11)
    restaurants.sort((a, b) => Math.sqrt((y - a.location.coordinates[0])**2 + (x - a.location.coordinates[1])**2)-
                               Math.sqrt((y - b.location.coordinates[0])**2 + (x - b.location.coordinates[1])**2))
    L.marker([x, y], {icon: userIcon}).addTo(map);                           
    createMarkers(restaurants);
})

const createInfo = async (id) => {
    const restaurant = await fetchRestaurant(id);
    const text = document.getElementById('asideParagraph');
    text.innerHTML = `<p>Name: ${restaurant.name}</p>
                      <p>Company: ${restaurant.company}</p>
                      <p>City: ${restaurant.city}</p>
                      <p>Address: ${restaurant.address}</p>`
    document.querySelectorAll('li a').forEach((li)=> {
    li.style.background = 'rgb(168, 154, 149)';
    });
    document.getElementById('bg').style.background = 'rgb(95, 84, 82)';
    document.getElementById('infoa').style.background = 'rgb(95, 84, 82)';
}

const createDaily = async (id) => {
    let menuHTML = '';
    const dailyMenu = await fetchDailyMenu(id);
    if (dailyMenu.courses.length !== 0){
    dailyMenu.courses.forEach((course) => {
        const {price} = course;
        const existingPrice = price ? price : 'No pricing info.';
        menuHTML += `<p>${course.name} -  ${existingPrice}</p>`;
      })
    } else {
        menuHTML = 'Unavailable';
    }
      const text = document.getElementById('asideParagraph');
      text.innerHTML = menuHTML;
      document.querySelectorAll('li a').forEach((li)=> {
        li.style.background = 'rgb(168, 154, 149)';
        }); 
    document.getElementById('bg').style.background = 'rgb(95, 84, 82)';
    document.getElementById('dailya').style.background = 'rgb(95, 84, 82)';  
}

const createWeekly= async (id) => {
    let weeklyMenuHTML = '';
    const fWeeklyMenu = await fetchWeeklyMenu(id);
    const weeklyMenu = fWeeklyMenu ? fWeeklyMenu : 'Unavailable.';
    if (weeklyMenu !== 'Unavailable.') {
        // Onko missään viikon menua?
    } else {
        weeklyMenuHTML = weeklyMenu;
    }
      const text = document.getElementById('asideParagraph');
      text.innerHTML = weeklyMenuHTML;
      document.querySelectorAll('li a').forEach((li)=> {
        li.style.background = 'rgb(168, 154, 149)';
        });
      document.getElementById('bg').style.background = 'rgb(95, 84, 82)';
      document.getElementById('weeklya').style.background = 'rgb(95, 84, 82)';  
}

function menuButtons(){
    document.getElementById('daily').addEventListener('click', (e) => {
        document.querySelectorAll('li a').forEach((li)=> {
            li.style.background = 'rgb(168, 154, 149)';
        })
        e.target.style.background = 'rgb(95, 84, 82)';
        e.target.parentElement.style.background = 'rgb(95, 84, 82)';
        document.getElementById('bg').style.background = 'rgb(95, 84, 82)';
        const text = document.getElementById('asideParagraph');
        createDaily(restaurantId);
    })
    
    document.getElementById('weekly').addEventListener('click', (e) => {
        document.querySelectorAll('li a').forEach((li)=> {
            li.style.background = 'rgb(168, 154, 149)';
        })
        e.target.style.background = 'rgb(95, 84, 82)';
        e.target.parentElement.style.background = 'rgb(95, 84, 82)';
        document.getElementById('bg').style.background = 'rgb(95, 84, 82)';
        const text = document.getElementById('asideParagraph');
        createWeekly(restaurantId)
    })
    
    document.getElementById('info').addEventListener('click', (e) => {
        document.querySelectorAll('li a').forEach((li)=> {
            li.style.background = 'rgb(168, 154, 149)';
        })
        e.target.style.background = 'rgb(95, 84, 82)';
        document.getElementById('bg').style.background = 'rgb(95, 84, 82)';
        const text = document.getElementById('asideParagraph');
        createInfo(restaurantId)
    })
}

const createMarkers = (restaurants) => {
    Array.from(restaurants).forEach((restaurant, index) => {
        let marker;
        // Luo lähimmän merkin
        if (index === 0){
            marker = L.marker([restaurant.location.coordinates[1],restaurant.location.coordinates[0]], {icon: closestRestaurantIcon})
            createInfo(restaurant._id);
            restaurantId = restaurant._id;
        } else {
            marker = L.marker([restaurant.location.coordinates[1],restaurant.location.coordinates[0]], {icon: restaurantIcon}).addTo(markers);
        }
        marker.on('click', () => {
            createInfo(restaurant._id);
            restaurantId = restaurant._id;
        }).addTo(markers);
});
}

const filterRestaurants = (param) => {
    const filteredRestaurants = restaurants.filter(restaurant => Object.values(restaurant).includes(param));
    return filteredRestaurants;

}

const filterButtons = () => {
    document.getElementsByClassName('filter')[0].addEventListener('click', () => {
        const textbox = document.getElementById('filterParam');
        const filteredRestaurants = filterRestaurants(textbox.value);
        if (filteredRestaurants.length !== 0){
            markers.clearLayers();
            createMarkers(filteredRestaurants);
        } else {
            alert('Parameter not found.')
        }
        textbox.value = '';
        console.log(filteredRestaurants)
        map.flyTo([filteredRestaurants[0].location.coordinates[1], filteredRestaurants[0].location.coordinates[0]], 11)
    })
    
    document.getElementById('reset').addEventListener('click', () => {
        createMarkers(restaurants);
    })
}

getPos();
menuButtons();
filterButtons();
