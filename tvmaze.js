/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
const searchShows = async (query) => {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let arrayOfShows = [];
  let searchResponse = await axios
    .get("https://api.tvmaze.com/search/shows", {
      params: {
        q: query,
      },
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });

  for (const result of searchResponse) {
    arrayOfShows.push(result.show);
  }

  console.log(arrayOfShows);
  return arrayOfShows;
};

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

const populateShows = (shows) => {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (const show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src=${setShowImage(show)}>
             <p class="card-text">${show.summary}</p>
             <button id="episodes-btn">Episodes</button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
};

const setShowImage = (show) => {
  if (!show.image) {
    return "https://tinyurl.com/tv-missing";
  } else {
    return show.image.original;
  }
};

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  // $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

const getEpisodes = async (id) => {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  // TODO: return array-of-episode-info, as described in docstring above
  let response = await axios
    .get(`http://api.tvmaze.com/shows/${id}/episodes`)
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(response);
  return response;
};

const populateEpisodes = (episodes) => {
  for (const episode of episodes) {
    console.log(episode);
    $("#episodes-list").append(
      `<li>${episode.name} (Season ${episode.season}, Episode ${episode.number})</li>`
    );
  }
};

// handle click on Episodes button
$(document).on("click", async (e) => {
  if (e.target.id === "episodes-btn") {
    let episodeId = $(e.target).closest("div.card")[0].dataset.showId;
    console.log(episodeId);
    let episodes = await getEpisodes(episodeId);
    console.log(episodes);
    populateEpisodes(episodes);
  }
});
