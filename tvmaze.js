const missing_image = "https://tinyurl.com/tv-missing";

async function searchShows(query) {
  const response = await axios.get('https://api.tvmaze.com/search/shows', { params: { q: query } });
  return response.data;
}


async function renderShows(query) {
  const searched = await searchShows(query);
  const array = [];
  searched.map(result => {
    const obj = {};
    obj.id = result.show.id;
    obj.name = result.show.name;
    obj.summary = result.show.summary;
    obj.image = result.show.image ? result.show.image.medium : missing_image;
    array.push(obj)
    return obj;
  });
  return array;
}


function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <img class="card-img-top" src=${show.image}>
             <p class="card-text">${show.summary}</p>
           </div>
            <div>
              <button class="episode-button btn btn-success btn-block">
                Episodes
              </button>
           <div>
         </div>
       </div>
      `);
    $showsList.append($item);
  }
}

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await renderShows(query);

  populateShows(shows);
});


async function getEpisodes(id) {
  const response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  return response.data;
}

async function renderEpisodes(id) {
  const episodes = await getEpisodes(id);
  const array = [];
  episodes.map(result => {
    const obj = {};
    obj.season = result.season;
    obj.episode = result.number;
    obj.about = result.summary ? result.summary : "<p>no info</p>";
    array.push(obj)
    return obj;
  });
  return array;
}

async function appendEpisodes(id) {
  const episodes = await renderEpisodes(id);
  for (let episode of episodes) {
    let $epi = $(
      `<li><b>Season ${episode.season}, Episode ${episode.episode}:</b> ${episode.about}</li>`
    );
    $('#episodes-list').append($epi);
  };
  $('#episodes-area').show();
}


$("#shows-list").on("click", ".episode-button", async function handleEpisodeClick(event) {
  event.preventDefault();
  $('#episodes-list').text('');
  let showId = $(event.target).closest(".Show").data("show-id");
  // let episodes = await getEpisodes(showId);
  $('html,body').animate({ scrollTop: $(document).height() }, 1000);
  appendEpisodes(showId);
});