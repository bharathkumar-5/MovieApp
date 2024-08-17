const apiKey = 'https://www.omdbapi.com/?s=SEARCH_QUERY&apikey=YOUR_API_KEY'; // Replace with your OMDB API key
const apiUrl = 'https://www.omdbapi.com/';
let currentPage = 1;
let totalPages = 1;

document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('movie-title').value.trim();
    if (query) {
        fetchMovies(query, currentPage);
    } else {
        displayError('Please enter a movie title.');
    }
});

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies(document.getElementById('movie-title').value.trim(), currentPage);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchMovies(document.getElementById('movie-title').value.trim(), currentPage);
    }
});

async function fetchMovies(query, page) {
    try {
        const response = await fetch(`${apiUrl}?s=${encodeURIComponent(query)}&page=${page}&apikey=${apiKey}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.Response === 'True') {
            totalPages = Math.ceil(data.totalResults / 10); 
            displayMovies(data.Search);
            updatePaginationControls();
        } else {
            displayError(data.Error);
        }
    } catch (error) {
        displayError('Something went wrong: ' + error.message);
    }
}

function displayMovies(movies) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (movies.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300'}" alt="${movie.Title}">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </div>
        `;
        resultsDiv.appendChild(movieCard);
    });
}

function displayError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p>${message}</p>`;
}

function updatePaginationControls() {
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
}