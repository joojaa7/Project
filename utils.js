const makeFetch = async (url) => {
  const result = await fetch(url)

  return await result.json()
}

const fetchRestaurants = async () =>
  await makeFetch("https://10.120.32.94/restaurant/api/v1/restaurants")

const fetchDailyMenu = async (id) =>
  makeFetch(`https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/fi`)


export {makeFetch, fetchRestaurants, fetchDailyMenu};
