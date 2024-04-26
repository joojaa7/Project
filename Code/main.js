import {
  fetchRestaurants,
  fetchDailyMenu,
  fetchWeeklyMenu,
  fetchRestaurant,
} from './utils.js';

// Local variables

console.log('New');
let restaurantId;
const restaurants = await fetchRestaurants();
const info = document.getElementById('info_paragraph');
const textBackGround = document.getElementById('bg');
const loginDisplay = document.getElementsByClassName('login_form')[0];
const loggedIn = document.getElementById('logged');
const loginWrap = document.getElementsByClassName('login')[0];
let firstTime = true;
let user = JSON.parse(sessionStorage.getItem('user'));
const userAvatar = document.getElementById('avatar');
const fileInput = document.querySelector('#file');
const loginModal = document.getElementById('login-modal')
const registerModal = document.getElementById('register-modal')
const favouriteButton = document.getElementById('star');
let x = 0;
let y = 0;
let favouriteInfo = document.getElementById('favourite');

console.log(sessionStorage.getItem('user'));

const map = L.map('map', {zoomControl: false}).setView(
  [60.16952, 24.93545],
  10
);
L.tileLayer(
  'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}',
  {
    maxZoom: 17,
    minZoom: 5,
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png',
  }
).addTo(map);

const restaurantIcon = L.icon({
  iconUrl: 'restaurant.png',
  iconSize: [30, 30],
});

const userIcon = L.icon({
  iconUrl: 'user.png',
  iconSize: [100, 100],
});

const closestRestaurantIcon = L.icon({
  iconUrl: 'restaurantClosest.png',
  iconSize: [100, 100],
});

const selectedRestaurant = L.icon({
  iconUrl: 'restaurantClosest.png',
  iconSize: [50, 50],
});

const markers = L.layerGroup().addTo(map);

// Functions

const buildSite = (logged) => {
  if (firstTime) {
    navigator.geolocation.getCurrentPosition((pos) => {
      x = pos.coords.latitude;
      y = pos.coords.longitude;
      map.setView([x, y], 11);
      restaurants.sort(
        (a, b) =>
          Math.sqrt(
            (y - a.location.coordinates[0]) ** 2 +
              (x - a.location.coordinates[1]) ** 2
          ) -
          Math.sqrt(
            (y - b.location.coordinates[0]) ** 2 +
              (x - b.location.coordinates[1]) ** 2
          )
        );
        L.marker([x, y], {icon: userIcon}).addTo(map);
        createMarkers(restaurants);
      });
      // L.marker([x, y], {icon: userIcon}).addTo(map);
      login();
      logOut();
      register();
      // createMarkers(restaurants);
      createSelection(restaurants);
      createFilter(restaurants);
      menuButtons();
      changeAvatar();
      favourite();
      firstTime = false;
  }
  userAvatar.src = user.avatar ? 'https://10.120.32.51/app/restaurant/' + user.avatar : 'https://10.120.32.51/app/restaurant/default.jpg'
  loginDisplay.style.display = logged ? 'none' : 'block';
  loggedIn.style.display = logged ? 'flex' : 'none';
  loginWrap.style.width = logged ? '40%' : '';
}


  const createInfo = async (id) => {
    const restaurant = await fetchRestaurant(id);
    const text = info
    text.innerHTML = `<p>Name: ${restaurant.name}</p>
                        <p>Company: ${restaurant.company}</p>
                        <p>City: ${restaurant.city}</p>
                        <p>Address: ${restaurant.address}</p>`;
    document.querySelectorAll('li a').forEach((li) => {
      li.style.background = 'rgb(168, 154, 149)';
    });
    textBackGround.style.background = 'rgb(95, 84, 82)';
    document.getElementById('infoa').style.background = 'rgb(95, 84, 82)';
  };

const createDaily = async (id) => {
  let menuHTML = '';
  const dailyMenu = await fetchDailyMenu(id);
  if (dailyMenu.courses.length !== 0) {
    dailyMenu.courses.forEach((course) => {
      const {price} = course;
      const existingPrice = price ? price : 'No pricing info.';
      menuHTML += `<p>${course.name} -  ${existingPrice}</p>`;
    });
  } else {
    menuHTML = 'Unavailable';
  }
  const text = info;
  text.innerHTML = menuHTML;
  document.querySelectorAll('li a').forEach((li) => {
    li.style.background = 'rgb(168, 154, 149)';
  });
  textBackGround.style.background = 'rgb(95, 84, 82)';
  document.getElementById('dailya').style.background = 'rgb(95, 84, 82)';
};

const createWeekly = async (id) => {
  let weeklyMenuHTML = '';
  const fWeeklyMenu = await fetchWeeklyMenu(id);
  const weeklyMenu = fWeeklyMenu ? fWeeklyMenu : 'Unavailable.';
  if (weeklyMenu !== 'Unavailable.') {
    // Onko missään viikon menua?
  } else {
    weeklyMenuHTML = weeklyMenu;
  }
  const text = info;
  text.innerHTML = weeklyMenuHTML;
  document.querySelectorAll('li a').forEach((li) => {
    li.style.background = 'rgb(168, 154, 149)';
  });
  textBackGround.style.background = 'rgb(95, 84, 82)';
  document.getElementById('weeklya').style.background = 'rgb(95, 84, 82)';
};

const menuButtons = () => {
  document.getElementById('daily').addEventListener('click', (e) => {
    document.querySelectorAll('li a').forEach((li) => {
      li.style.background = 'rgb(168, 154, 149)';
    });
    e.target.style.background = 'rgb(95, 84, 82)';
    e.target.parentElement.style.background = 'rgb(95, 84, 82)';
    textBackGround.style.background = 'rgb(95, 84, 82)';
    createDaily(restaurantId);
  });

  document.getElementById('weekly').addEventListener('click', (e) => {
    document.querySelectorAll('li a').forEach((li) => {
      li.style.background = 'rgb(168, 154, 149)';
    });
    e.target.style.background = 'rgb(95, 84, 82)';
    e.target.parentElement.style.background = 'rgb(95, 84, 82)';
    textBackGround.style.background = 'rgb(95, 84, 82)';
    createWeekly(restaurantId);
  });

  document.getElementById('restaurant_info').addEventListener('click', (e) => {
    document.querySelectorAll('li a').forEach((li) => {
      li.style.background = 'rgb(168, 154, 149)';
    });
    e.target.style.background = 'rgb(95, 84, 82)';
    textBackGround.style.background = 'rgb(95, 84, 82)';
    createInfo(restaurantId);
  });
};

const createSelection = (restaurants) => {
  const selection = document.getElementById('restaurantSelection');
  restaurants.forEach((restaurant) => {
    selection.innerHTML += `<option value='${restaurant.name}'>${restaurant.name} - ${restaurant.city}</option>`;
  });
  selection.addEventListener('change', () => {
    markers.clearLayers();
    createMarkers(restaurants);
    restaurants.forEach((restaurant) => {
      if (restaurant.name === selection.value) {
        const marker = L.marker(
          [
            restaurant.location.coordinates[1],
            restaurant.location.coordinates[0],
          ],
          {icon: selectedRestaurant}
        );
        marker.on('click', () => {
          createInfo(restaurant._id);
          restaurantId = restaurant._id;
        });
        marker.addTo(map);
        map.flyTo([
          restaurant.location.coordinates[1],
          restaurant.location.coordinates[0],
          11,
        ]);
        return;
      }
    });
    const filter = document.getElementById('filterDropDown');
    filter.value = 'Filter';
  });
};

const createFilter = (restaurants) => {
  const filter = document.getElementById('filterDropDown');
  const uniqueFilters = restaurants.reduce((acc, value) => {
    if (!acc.includes(value.city)) {
      acc.push(value.city);
    }
    if (!acc.includes(value.company)) {
      acc.push(value.company);
    }
    return acc;
  }, []);
  uniqueFilters.forEach((filtered) => {
    filter.innerHTML += `<option value='${filtered}'>${filtered}</option>`;
  });
  filter.addEventListener('change', () => {
    const filteredRestaurants = filterRestaurants(filter.value);
    markers.clearLayers();
    createMarkers(filteredRestaurants);
    restaurants.forEach((restaurant) => {
      if (Object.values(restaurant).includes(filter.value)) {
        map.flyTo([
          restaurant.location.coordinates[1],
          restaurant.location.coordinates[0],
          11,
        ]);
        return;
      }
    });
  });
  document.getElementById('reset').addEventListener('click', () => {
    markers.clearLayers();
    createMarkers(restaurants);
  });
};

const createMarkers = (restaurants) => {
  Array.from(restaurants).forEach((restaurant, index) => {
    let marker;
    // Luo lähimmän merkin
    if (index === 0) {
      marker = L.marker(
        [
          restaurant.location.coordinates[1],
          restaurant.location.coordinates[0],
        ],
        {icon: closestRestaurantIcon}
      );
      createInfo(restaurant._id);
      restaurantId = restaurant._id;
      if (restaurantId === localStorage.getItem('favourite')) {
        favouriteButton.src = 'star_clicked.png';
      }

    } else {
      marker = L.marker(
        [
          restaurant.location.coordinates[1],
          restaurant.location.coordinates[0],
        ],
        {icon: restaurantIcon}
      ).addTo(markers);
    }
    marker
      .on('click', () => {
        createInfo(restaurant._id);
        restaurantId = restaurant._id;
        console.log(restaurantId);
        favouriteButton.src =  'star_clicked.png';
        if (restaurantId !== localStorage.getItem('favourite')) {
          favouriteButton.src = 'star.png';
        }
      })
      .addTo(markers);
      if (restaurant._id === localStorage.getItem('favourite')) {
        favouriteInfo.innerHTML = `<p>Favourite: ${restaurant.name}</p>`;
      }
  });
};

const filterRestaurants = (param) => {
  const filteredRestaurants = restaurants.filter((restaurant) =>
    Object.values(restaurant).includes(param)
  );
  return filteredRestaurants;
};

const login = () => {
  document.getElementById('uname').value = '';
  document.getElementById('pw').value = '';
  document.getElementById('submit').addEventListener('click', async (e) => {
    e.preventDefault();
    document.getElementById('avatar').src = 'default.jpg';
    const name = document.getElementById('username').value;
    const pw = document.getElementById('passw').value;
    const formData = new FormData();
    formData.append('username', name)
    formData.append('password', pw)
    const loginUser = {
      username: name,
      password: pw
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginUser),
    };
    console.log(options)
    const response = await fetch('https://10.120.32.51/app/restaurant/login', options);
    console.log(response);
    const json = await response.json();
    if (!json.user) {
      alert(json.error.message);
    } else {
      sessionStorage.setItem('token', json.token);
      sessionStorage.setItem('user', JSON.stringify(json.user));
      user = JSON.parse(sessionStorage.getItem('user'));
      buildSite(true);
    }
  });
};

const register = () => {
  document.getElementById('uname').value = '';
  document.getElementById('pw').value = '';
  document.getElementById('register').addEventListener('click', async (e) => {
    registerModal.showModal();
    e.preventDefault();
  });
  document.getElementById('register-button').addEventListener('click', async () => {
    const name = document.getElementById('uname').value;
    const pw = document.getElementById('pw').value;
    let avatar = null;
    const formData = new FormData();
    if (fileInput.files[0]) {
      avatar = fileInput.files[0].name;
      formData.append('file', fileInput.files[0])
    }
    formData.append('username', name)
    formData.append('password', pw)
    formData.append('avatar', avatar)
    const options = {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: formData,
    };
    const response = await fetch('https://10.120.32.51/app/restaurant/user/register', options);
    console.log(response)


    const userData = {
      username: name,
      password: pw,
    };
    const loginOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    }

    const loginResponse = await fetch('https://10.120.32.51/app/restaurant/login', loginOptions);
    const json = await loginResponse.json();
    console.log('Response: ', json.user, json.token);
    if (!json.user){
      console.log(json.error.message)
    } else {
      sessionStorage.setItem('token', json.token)
      sessionStorage.setItem('user', JSON.stringify(json.user))
      user = JSON.parse(sessionStorage.getItem('user'));
      registerModal.close();
      buildSite(true);
    }
  })
};

const logOut = () => {
  document.getElementById('logout_button').addEventListener('click', () => {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
    buildSite(false);
  })
}


const changeAvatar = () => {
  const avatarFile = document.querySelector('#avatar-file');
  const inputForm = document.getElementById('avatar-form');
  document.getElementById('change-avatar').addEventListener('click', () => {
    loginModal.showModal();
  document.getElementById('avatar-submit').addEventListener('click', async (e) => {
    console.log(e)
    let avatar = null;
    const formData = new FormData();
    if (avatarFile.files[0]) {
      avatar = avatarFile.files[0].name;
      formData.append('file', avatarFile.files[0])
    } else {
      alert('SELECT FILE')
      return
    }
    const userData = JSON.parse(sessionStorage.getItem('user'))
    formData.append('avatar', avatar);
    formData.append('username', userData.username);
    const options = {
      method: 'PUT',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: formData,
    };
    const response = await fetch('https://10.120.32.51/app/restaurant/user/avatar', options);
    const json = await response.json();
    inputForm.reset();
    if (response.ok){
      console.log('OK')
      userData.avatar = json.avatar
      sessionStorage.setItem('user', JSON.stringify(userData));
      user = JSON.parse(sessionStorage.getItem('user'));
      loginModal.close();
      buildSite(true)
    } else {
      alert(response);
    }
  })
})}


const favourite = () => {
  favouriteButton.addEventListener('click', () => {
    	favouriteButton.src = 'star_clicked.png';
      if (localStorage.getItem('favourite') === restaurantId) {
        favouriteButton.src = 'star.png';
        localStorage.removeItem('favourite');
        favouriteInfo.innerHTML = '';
        return;
      }
      localStorage.setItem('favourite', restaurantId);
      restaurants.forEach((restaurant) => {
        if (restaurant._id === restaurantId) {
          favouriteInfo.innerHTML = `<p>Favourite: ${restaurant.name}</p>`;
        }
      });
  })
}


(async () => {
  if (sessionStorage.getItem('token') && sessionStorage.getItem('user')){
    try {
      const options = {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('https://10.120.32.51/app/restaurant/login/verify', options)
      console.log(response)
      if (response.ok) {
        buildSite(true)
      } else {
        buildSite(false)
      }
    } catch (e) {
      console.log(e)
    }
  }
  else {

    buildSite(false);
  }
})();
