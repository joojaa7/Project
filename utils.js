const makeFetch = async (url) => {
  const result = await fetch(url)

  return await result.json()
}

const fetchRestaurants = async () =>
  await makeFetch("https://10.120.32.94/restaurant/api/v1/restaurants")

const fetchDailyMenu = async (id) =>
makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/fi`)

const fetchWeeklyMenu = async (id) => {
  makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${id}/fi`)
}

const fetchRestaurant = async (id) =>
  await makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/${id}`)

export {fetchWeeklyMenu, fetchRestaurants, fetchDailyMenu, fetchRestaurant};
