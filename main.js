let httpRequest = new XMLHttpRequest();
let theatersEndpoint = "https://api.themoviedb.org/3/movie/now_playing?api_key=38906c642ae078eba4ddaa36f6b881dc&language=en-US&page=1"
httpRequest.open("GET", theatersEndpoint);
httpRequest.send();
httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {
            displayResults(httpRequest.responseText);
        }
        else {
            alert("AJAX ERROR");
            console.log(httpRequest.status);
        }
    }
}

document.querySelector("#search-form").onsubmit = function (event) {
    event.preventDefault();
    let userSearch = document.querySelector("#search-term").value.trim();
    userSearch = encodeURIComponent(userSearch);
    // if(userSearch.length == 0){
    //   document.querySelector("#term-error").innerHTML = `You must provide either email or phone.`;
    //   return false;
    // }

    let endpoint = "https://api.themoviedb.org/3/search/movie?api_key=38906c642ae078eba4ddaa36f6b881dc&query=" + userSearch + "&language=en-US&page=1&include_adult=false";
    let httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", endpoint);
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4) {
            if (httpRequest.status == 200) {
                document.querySelector("#term-error").innerHTML = ``;
                displayResults(httpRequest.responseText);
            }
            else {
                document.querySelector("#term-error").innerHTML = `Please enter your search.`;
            }
        }
    }
}
function displayResults(searchResult) {
    document.querySelector("#movie-details").innerHTML = "";
    let result = JSON.parse(searchResult);
    document.querySelector("#search-stats").innerHTML = "Showing " + result.results.length + " of " + result.total_results + " result(s).";
    
    for (let i = 0; i < result.results.length; i++) {
        let imgURL = "https://image.tmdb.org/t/p/w300" + result.results[i].poster_path;
        if(result.results[i].poster_path == null){
            imgURL = "images/noimg.png";

        }
        let blurb;
        if(result.results[i].overview.length<200){
            blurb = result.results[i].overview;
        }
        else{
            blurb = result.results[i].overview.substring(0,200) + "...";
        }
        let htmlString = `
            <div class = "col-sm-6 col-md-4 col-lg-3 mt-4">
                <div id = "indiv-movie" class = "container">
                    <img id = "poster-img" class = "center" src = "${imgURL}">
                    <div id = "hover-info" class = "hidden">
                        <p>Rating: ${result.results[i].vote_average}/10</p>
                        <p>${result.results[i].vote_count} Reviews</p>
                        <p>${blurb}</p>
                    </div>
                </div>
                <div id = "movie-info">
                    <h5>${result.results[i].title}</h5>
                    <p><em>${result.results[i].release_date}</em></p>
                </div>
            </div>
        `;
        document.querySelector("#movie-details").innerHTML += htmlString;
    }
    let moviePosters = document.querySelectorAll("#indiv-movie");
    for(let i = 0;i<moviePosters.length;i++){
        moviePosters[i].querySelector("#poster-img").onmouseenter = function(){
            this.style.opacity = "0.2";
            moviePosters[i].querySelector("#hover-info").style.display = "block";
        }
        moviePosters[i].querySelector("#poster-img").onmouseleave = function(){
            this.style.opacity = "1";
            moviePosters[i].querySelector("#hover-info").style.display = "none";
        }
    }
}
