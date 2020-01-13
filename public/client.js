//  Kitsu General Search
const url_fd2 = "https://kitsu.io/api/edge/anime?filter[text]=";
let fetchData = {
  headers: {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json"
  }
};

function search() {
  let searchTerm = document.getElementById("input").value

  //perform search
  //update inner HTML of Foo
  getJSONData(searchTerm);
}



getJSONData("fate");
//document.getElementById("button").addEventListener('click',search);

function getJSONData(searchTerm) {
  console.log('searching ' + searchTerm);
  /*let url = url_base + searchTerm;*/
  let url_fd = "https://kitsu.io/api/edge/anime?filter[text]=" + searchTerm;
  fetch(url_fd, fetchData)
    .then(resp => resp.json()) // Transform the data into json
    .then(function(data) {
      getImageData(data);
      /*document.getElementById("content").innerHTML =
        "<h1>Kitsu General Search</h1>" +
        JSON.stringify(data, undefined, 2) +
        "<br><br>";
        */
    });
}


/*fetch(url_fd2, fetchData)
  .then(resp => resp.json()) // Transform the data into json
  .then(function(data) {
    getImageData(data);
    // document.getElementById("content").innerHTML += "<h1>Kitsu General Search</h1>" + JSON.stringify(data, undefined, 2) + "<br><br>";
  })

  .catch(function(error) {
    document.getElementById("content").innerHTML +=
      "Error with Kitsu API: " + error;
  });*/

function getImageData(data) {
  document.getElementById("pic").innerHTML = "";
  for (var i = 0; i < data.data.length; i++) {
    var output = "";
    var output = "<div class='card'>";
    output +=
      "<h1 class='title'>" + data.data[i].attributes.titles.en_jp + "</h1>";
    output +=
      "<img class='img' src ='" +
      data.data[i].attributes.posterImage.small +
      "' alt=''><br>";
    output += "<p class='text'>" + data.data[i].attributes.synopsis + "</p>";
    output += "</div>";

    document.getElementById("pic").innerHTML += output;
  }
}

function redo() {
  location.reload(true);
}

function getDataFromCache(coords){
if (!('caches' in window)) {
  return null;
}
const url = `${window.location.origin}/forecast/${coords}`;
return caches.match(url)
    .then((response) => {
      if (response) {
        return response.json();
      }
      return null;
    })
    .catch((err) => {
      console.error('Error getting data from cache', err);
      return null;
    });
}

// check if app has connection to the internet
function check() {
  isOnline = navigator.onLine;
  
  // show JSON if online, message if offline
  if(isOnline == true){
      getJSON();
  } else {
    document.getElementById("edge").innerHTML = "You are offline";
  }// else
} // check