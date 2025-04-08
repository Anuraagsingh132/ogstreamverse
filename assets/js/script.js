//TMDB API

/*const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://tmdb-a62z.onrender.com';

const API_URL = BASE_URL + '/trending/movie/day?'+API_KEY;

const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;*/

const BASE_URL = 'https://tmdb-a62z.onrender.com/api'; // Note the `/api` prefix

const API_URL = `${BASE_URL}/trending/movie/day`; // No need to include API key

const IMG_URL = 'https://image.tmdb.org/t/p/w500'; // This stays the same

const searchURL = `${BASE_URL}/search/movie`; // Again, no API key needed



const genres = [
    
  ]


const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

const prev=document.getElementById('prev');
const next=document.getElementById('next');
const current=document.getElementById('current');

var currentPage = 1;
var nextPage = 1;
var prevPage = 1;
var lastUrl = '';
var totalPages = 1;

var selectedGenre = []
setGenre();
function setGenre() {
    tagsEl.innerHTML='';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click',() =>{
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id,idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx,1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            // console.log(selectedGenre)
            getMovies(API_URL+'&with_genres='+encodeURI(selectedGenre.join(',')));
            highlightSelection();
        })
        tagsEl.append(t);
    })
}



function highlightSelection() {
   const tags = document.querySelectorAll('.tag');
   tags.forEach(tag => {
        tag.classList.remove('highlight');
   })
   clearBtn();
    if(selectedGenre.length !=0){
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        })
    }
    
}

function clearBtn() {
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{

        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear';
        clear.addEventListener('click',() => {
            selectedGenre=[];
            setGenre();
            getMovies(API_URL);

        })
        tagsEl.append(clear);
    }

   
}

getMovies(API_URL);

function getMovies(url) {
  lastUrl = url;
  fetch(url)
      .then(res => {
          // Check if the response is ok (status in the range 200-299)
          if (!res.ok) {
              throw new Error('Network response was not ok');
          }
          return res.json();
      })
      .then(data => {
          console.log(data.results);
          if (data.results && data.results.length > 0) {
              showMovies(data.results);
              currentPage = data.page;
              nextPage = currentPage + 1;
              prevPage = currentPage - 1;
              totalPages = data.total_pages;
              current.innerText = currentPage;

              if (currentPage <= 1) {
                  prev.classList.add('disabled');
                  next.classList.remove('disabled');
              } else if (currentPage >= totalPages) {
                  prev.classList.remove('disabled');
                  next.classList.add('disabled');
              } else {
                  prev.classList.remove('disabled');
                  next.classList.remove('disabled');
              }

              // Scroll to tags
              tagsEl.scrollIntoView({ behavior: 'smooth' });
          } else {
              main.innerHTML = '<h1 class="no-results">No Results Found!</h1>';
          }
      })
      /*.catch(error => {
          console.error('There was a problem with the fetch operation:', error);
          // Redirect to a fallback URL if TMDB API fails
          window.location.href = 'https://streamverse.biz'; // Replace with your fallback URL
      });*/
}

// search this : The Adventures of Chuck and Warren 
//for placeholder image example

function showMovies(data){
    main.innerHTML = '';

    data.forEach(movie => {
        const {title,poster_path,vote_average,overview,id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        
        <img src="${poster_path?IMG_URL+poster_path:"http://via.placeholder.com/1080x1580"}" alt="${title}" />
        <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
          <h3>Overview</h3>
            ${overview}
            <br/>
            <button class="know-more" id="${id}">Watch Now</button>
        </div>
        
        `
        main.appendChild(movieEl);
        document.getElementById(id).addEventListener('click',() => {
            console.log(id);
            openNav(movie);
        })
    })
}


const overlayContent = document.getElementById('overlay-content');
/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + '/movie/' + id + '/videos?' + API_KEY)
    .then(res => res.json())
    .then(videoData => {
      console.log(videoData);
      if (videoData) {
        document.getElementById("myNav").style.width = "100%";
        if (videoData.results.length > 0) {
          var embed = [];
          var dots = [];
          videoData.results.forEach((video, idx) => {
            let { name, key, site } = video;

            if (site === 'YouTube') {
              embed.push(`
                <iframe src="https://flicky.host/embed/movie/?id=${id}" title="${name}" class="embed hide responsive-iframe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

                <iframe 
                  src="https://vidlink.pro/movie/${id}?primaryColor=63b8bc&secondaryColor=a2a2a2&iconColor=eefdec&icons=vid&player=default&title=true&poster=true&autoplay=true&nextbutton=false" 
                  class="embed hide responsive-iframe" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen ></iframe>               
                <iframe src="https://moviesapi.club/movie/${id}" title="${name}" class="embed hide responsive-iframe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                
                
                <iframe src="https://www.2embed.cc/embed/${id}" title="${name}" class="embed hide responsive-iframe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                
                
                <iframe src="https://multiembed.mov/?video_id=${id}&tmdb=1" title="${name}" class="embed hide responsive-iframe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              `);

              
            }
          });

          var content = `
            <h1 class="no-results">${movie.original_title}</h1>
            <br/>
            ${embed.join('')}
            <br/>
            <div class="dots">${dots.join('')}</div>
          `;
          overlayContent.innerHTML = content;
          activeSlide = 0;
          showVideos();
        } else {
          overlayContent.innerHTML = `<h1 class="no-results">No Results Found!</h1>`;
        }
      }
    });
}

window.addEventListener('resize', function() {
  const player = document.querySelector('.video-player');
  // Adjust player settings here if needed
});


/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

var activeSlide = 0;
var totalVideos = 0;

function showVideos() {

  let embedClasses = document.querySelectorAll('.embed');
  let dots = document.querySelectorAll('.dot');

  totalVideos = embedClasses.length;
  embedClasses.forEach((embedTag,idx) => {
    if(activeSlide == idx) {
      embedTag.classList.add('show');
      embedTag.classList.remove('hide');
    }else{
      embedTag.classList.add('hide');
      embedTag.classList.remove('show');
    }
  })

  dots.forEach((dot,indx) => {
    if(activeSlide == indx){
      dot.classList.add('active');
    }else{
      dot.classList.remove('active');
    }
  })
}

const leftArrow = document.getElementById('left-arrow')
const rightArrow = document.getElementById('right-arrow')

leftArrow.addEventListener('click',() => {
  if(activeSlide > 0){
    activeSlide --;
  }else{
    activeSlide = totalVideos -1;
  }
  showVideos()
})

rightArrow.addEventListener('click',() => {
  if(activeSlide <  (totalVideos -1)){
    activeSlide ++;
  }else{
    activeSlide = 0;
  }
  showVideos()
})



function getColor(vote){
    if(vote>=8){
        return 'green'
    }else if(vote>=5){
        return 'orange'
    }else{
        return 'red'
    }
}


form.addEventListener('submit',(e)=>{
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre = [];
    highlightSelection();
    if(searchTerm){
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(API_URL)
    }
})

prev.addEventListener('click',() => {
    if(prevPage>0){
        pageCall(prevPage);
    }
})

next.addEventListener('click',() => {
    if(nextPage<=totalPages){
        pageCall(nextPage);
    }
})

function pageCall(page) {
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length-1].split('=');
    if(key[0] != 'page'){
        let url = lastUrl + '&page=' + page;
        getMovies(url);
    }else{
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length-1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0]+'?'+b;
        getMovies(url);

    }
} 
