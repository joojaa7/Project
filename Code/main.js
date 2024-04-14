import { fetchRestaurants, fetchDailyMenu, fetchWeeklyMenu , fetchRestaurant } from './utils.js';

// Local variables

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

const selectedRestaurant = L.icon({
  iconUrl: 'restaurantClosest.png',
  iconSize: [50, 50],
})

const markers = L.layerGroup().addTo(map);

// Functions

const buildSite  = () => navigator.geolocation.getCurrentPosition((pos) => {
    const x = pos.coords.latitude;
    const y = pos.coords.longitude;
    map.setView([x, y], 11)
    restaurants.sort((a, b) => Math.sqrt((y - a.location.coordinates[0])**2 + (x - a.location.coordinates[1])**2)-
                               Math.sqrt((y - b.location.coordinates[0])**2 + (x - b.location.coordinates[1])**2))
    L.marker([x, y], {icon: userIcon}).addTo(map);
    login();
    register();
    createMarkers(restaurants);
    createSelection(restaurants);
    createFilter(restaurants);
    menuButtons();
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

const createSelection = (restaurants) => {
    const selection = document.getElementById('restaurantSelection');
    restaurants.forEach((restaurant) => {
        selection.innerHTML += `<option value='${restaurant.name}'>${restaurant.name} - ${restaurant.city}</option>`
    })
    selection.addEventListener('change', () => {
        markers.clearLayers();
        createMarkers(restaurants);
        restaurants.forEach((restaurant) => {
            if (restaurant.name === selection.value) {
                const marker = L.marker([restaurant.location.coordinates[1], restaurant.location.coordinates[0]], {icon: selectedRestaurant})
                marker.on('click', () => {
                  createInfo(restaurant._id);
                  restaurantId = restaurant._id;
                })
                marker.addTo(map);
                map.flyTo([restaurant.location.coordinates[1], restaurant.location.coordinates[0], 11]);
                return;
            }
        })
        const filter = document.getElementById('filterDropDown');
        filter.value = 'Filter';
    })
}

const createFilter = (restaurants) => {
    const filter = document.getElementById('filterDropDown')
    const uniqueFilters = restaurants.reduce((acc, value) => {
        if (!acc.includes(value.city)) {
            acc.push(value.city)
        }
        if (!acc.includes(value.company)) {
            acc.push(value.company)
        }
        return acc
    }, []);
    uniqueFilters.forEach((filtered) => {
        filter.innerHTML += `<option value='${filtered}'>${filtered}</option>`
    })
    filter.addEventListener('change', () => {
        const filteredRestaurants = filterRestaurants(filter.value);
        markers.clearLayers();
        createMarkers(filteredRestaurants);
        restaurants.forEach((restaurant) => {
            if (Object.values(restaurant).includes(filter.value)) {
                map.flyTo([restaurant.location.coordinates[1], restaurant.location.coordinates[0], 11]);
                return;
            }
        })
    })
    document.getElementById('reset').addEventListener('click', () => {
        markers.clearLayers();
        createMarkers(restaurants);
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

const login = () => {
  document.getElementById('uname').value = '';
  document.getElementById('pw').value = '';
  document.getElementById('submit').addEventListener('click', async (e) => {
    e.preventDefault();
    const name = document.getElementById('uname').value;
    const pw = document.getElementById('pw').value;
    const user = {
      username : name,
      password : pw
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }
    const response = await fetch('http://127.0.0.1:5500/login/', options)
    console.log(response)
  })
}

const register = () => {
  document.getElementById('uname').value = '';
  document.getElementById('pw').value = '';
  document.getElementById('register').addEventListener('click', async (e) => {
    e.preventDefault();
    window.location = 'test.html'
    const name = document.getElementById('uname').value;
    const pw = document.getElementById('pw').value;
    const user = {
      username : name,
      password : pw
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }
    const response = await fetch('http://127.0.0.1:5500/user/', options)
    console.log(response)
  })
}

buildSite();
