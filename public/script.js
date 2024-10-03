const API_URL = '/api/movies'; // Change this to your server endpoint

// Update the getMovies function to use the new API_URL
function getMovies(url) {
    lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results);
        // ... rest of your code ...
    });
}

// Update the search functionality in your form submit event
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    selectedGenre = [];
    highlightSelection();
    if (searchTerm) {
        getMovies(`${API_URL}?query=${searchTerm}`);
    } else {
        getMovies(API_URL);
    }
});

fetch('/api/movies')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Handle the data, e.g., display movies on the page
    })
    .catch(error => console.error('Error:', error));