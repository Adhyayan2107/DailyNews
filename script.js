
const apiKey = "843036bb90564047aaefd9544edc6fc7"; 
let currentCategory = "technology"; 
let currentPage = 1;


function clearNewsContainer() {
    document.getElementById("news-container").innerHTML = "";
}

function toggleLoadMore(category) {
    const loadMoreButton = document.getElementById('load-more');
    loadMoreButton.style.display = category === 'bookmark' ? 'none' : 'block';
}


async function fetchNews(category, page = 1) {
    const url = `https://newsapi.org/v2/top-headlines?category=${category}&page=${page}&pageSize=10&apiKey=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        displayArticles(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}


function displayArticles(articles) {
    const newsContainer = document.getElementById("news-container");
    articles.forEach(article => {
        if (!article.url || article.url === "https://removed.com") return;
        const articleElement = document.createElement("div");
        articleElement.classList.add("article");
        articleElement.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description || "No description available."}</p>
            <button onclick="bookmarkArticle('${article.url}')">Bookmark</button>
            <button onclick="window.open('${article.url}', '_blank')">Read More</button>
        `;
        newsContainer.appendChild(articleElement);
    });
}


function bookmarkArticle(url) {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    if (!bookmarks.includes(url)) {
        bookmarks.push(url);
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        alert("Article bookmarked!");
    } else {
        alert("Article is already bookmarked.");
    }
}


function displayBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    clearNewsContainer();
    toggleLoadMore('bookmark');
    if (bookmarks.length === 0) {
        document.getElementById("news-container").innerHTML = `<p class="no-bookmarks-message">No bookmarks yet.</p>`;

    } else {
        bookmarks.forEach(url => {
            const articleElement = document.createElement("div");
            articleElement.classList.add("article");
            articleElement.innerHTML = `
                <p><a href="${url}" target="_blank">${url}</a></p>
                <button onclick="removeBookmark('${url}')">Remove</button>
            `;
            document.getElementById("news-container").appendChild(articleElement);
        });
    }
}


function removeBookmark(url) {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark !== url);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    alert("Bookmark removed!");
    displayBookmarks();
}

function setCategory(category) {
    currentCategory = category;
    currentPage = 1;
    clearNewsContainer();
    fetchNews(category, currentPage);
    toggleLoadMore(category);
}


function loadMoreNews() {
    currentPage++;
    fetchNews(currentCategory, currentPage);
}


fetchNews(currentCategory);
