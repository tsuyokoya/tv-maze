// Make an ajax request to the searchShows API
const searchShows = async (query) => {
  let arrayOfShows = [];
  const searchResponse = await axios
    .get("https://api.tvmaze.com/search/shows", {
      params: {
        q: query,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });

  for (const result of searchResponse) {
    arrayOfShows.push(result.show);
  }

  return arrayOfShows;
};

// Given list of shows, add shows to DOM
const populateShows = (shows) => {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (const show of shows) {
    const $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">
               <a href=${setURL(show)} target="_blank">
                 ${show.name}
               </a>
             </h5>
             <button id="episodes-btn"
               type="button"
               class="btn btn-primary"
               data-toggle="modal"
               data-target="#episodes-modal">
               View Episodes
             </button>
             <img class="card-img-top" src=${setImage(show)}>
             <p class="card-text">${setSummary(show)}</p>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($item);
  }
};

const setSummary = (content) => {
  if (!content.summary) {
    return "";
  } else {
    return content.summary;
  }
};

const setImage = (content) => {
  if (!content.image) {
    return "https://tinyurl.com/tv-missing";
  } else {
    return content.image.original;
  }
};

const setURL = (content) => {
  if (!content.url) {
    return;
  } else {
    return content.url;
  }
};

// Handle search form submission
// Get list of matching shows and populate
$("#search-form").on("submit", async (evt) => {
  evt.preventDefault();

  const query = $("#search-query").val();
  if (!query) return;

  const shows = await searchShows(query);
  populateShows(shows);
});

// Return list of episodes given a show ID
const getEpisodes = async (id) => {
  const response = await axios
    .get(`http://api.tvmaze.com/shows/${id}/episodes`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });

  return response;
};

// Append episodes information to modal
const populateEpisodes = (episodes) => {
  for (const episode of episodes) {
    $(".modal-body").append(
      `<div class="episode-information">
        <div class="general-information">
          <a href="${setURL(episode)}" target="_blank">
            ${episode.name} (Season ${episode.season}, Episode ${
        episode.number
      })
          </a>
        </div>
        <div class="episode-image-div">
          <img class="episode-image" src = ${setImage(episode)}>
        </div>
        <div class="episode-summary">
          ${setSummary(episode)}
        </div>
        <div class="episode-rating">
          Average Rating: ${setEpisodeRating(episode)}
        </div>
      </div>`
    );
  }
};

const setEpisodeRating = (episode) => {
  if (!episode.rating.average) {
    return "N/A";
  } else {
    return episode.rating.average;
  }
};

const updateModalHeader = (e) => {
  const showTitle = $(e.target).siblings(".card-title")[0].innerText;
  $("#episodesModalLabel")[0].innerText = showTitle;
  return showTitle;
};

// handle click on Episodes button
$(document).on("click", async (e) => {
  if (e.target.id === "episodes-btn") {
    const episodeId = $(e.target).closest("div.card")[0].dataset.showId;
    const episodes = await getEpisodes(episodeId);

    $(".episode-information").remove();
    updateModalHeader(e);
    populateEpisodes(episodes);
  }
});

// set example on load
$(document).ready(async () => {
  const example = await searchShows("24");
  populateShows(example);
});
