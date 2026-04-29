// Initialize posts array from localStorage or with default posts
// Force default posts (remove after testing)
localStorage.removeItem('blogPosts');
let posts = [
    // Your default posts here

    {
        title: "How to Learn JavaScript",
        content: "Start with basics, practice daily, and build small projects.",
        category: "tech",
        author: "N Panthoiiba Singha",
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        createdAt: new Date('2023-01-01').toISOString()
    },
    {
        title: "Best Travel Destinations",
        content: "Japan, Italy, and New Zealand are amazing places to visit.",
        category: "travel",
        author: "Twinkle Sonowal",
        image: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        createdAt: new Date('2023-01-15').toISOString()
    },
    {
        title: "Easy Homemade Pizza",
        content: "Just flour, yeast, tomatoes, and cheese. Bake at 200°C for 15 mins.",
        category: "food",
        author: "Sudarsana Mahanta",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        createdAt: new Date('2023-02-01').toISOString()
    }
];

// DOM Elements
const postsContainer = document.getElementById('posts-container');
const postForm = document.getElementById('post-form');
const postModal = document.getElementById('post-modal');
const newPostBtn = document.getElementById('new-post-btn');
const closeBtn = document.querySelector('.close-btn');
const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-button');
const categoryBtn = document.getElementById('category-btn');
const categoryDropdown = document.getElementById('category-dropdown');

// Helper function to format dates
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Display posts
function displayPosts(postsToDisplay = posts) {
    postsContainer.innerHTML = '';
    
    if (postsToDisplay.length === 0) {
        postsContainer.innerHTML = '<p class="no-posts">No posts found. Create one!</p>';
        return;
    }
    
    postsToDisplay.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.innerHTML = `
            <img src="${post.image}" alt="${post.title}" class="post-image" onerror="this.src='https://via.placeholder.com/800x600?text=Image+Not+Available'">
            <div class="post-content">
                <button class="delete-btn" data-index="${index}">×</button>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-author">By ${post.author}</p>
                <span class="post-date">${formatDate(post.createdAt)}</span>
                <p class="post-excerpt">${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
                <span class="category-tag">${post.category}</span>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.getAttribute('data-index'));
            if (confirm('Are you sure you want to delete this post?')) {
                posts.splice(index, 1);
                savePosts();
                displayPosts();
            }
        });
    });
}

// Save posts to localStorage
function savePosts() {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

// Filter posts by search term
function searchPosts() {
    const searchTerm = searchBar.value.toLowerCase();
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) || 
        post.content.toLowerCase().includes(searchTerm) ||
        post.author.toLowerCase().includes(searchTerm)
    );
    displayPosts(filteredPosts);
}

// Filter posts by category
function filterByCategory(category) {
    if (category === 'all') {
        displayPosts(posts);
    } else {
        const filteredPosts = posts.filter(post => post.category === category);
        displayPosts(filteredPosts);
    }
}

// Event Listeners
postForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newPost = {
        title: document.getElementById('post-title').value.trim(),
        author: document.getElementById('post-author').value.trim(),
        category: document.getElementById('post-category').value,
        content: document.getElementById('post-content').value.trim(),
        image: `https://source.unsplash.com/random/800x600/?${document.getElementById('post-category').value}`,
        createdAt: new Date().toISOString()
    };
    
    // Validate inputs
    if (!newPost.title || !newPost.author || !newPost.content) {
        alert('Please fill in all fields');
        return;
    }
    
    posts.unshift(newPost);
    savePosts();
    displayPosts();
    postModal.style.display = 'none';
    postForm.reset();
});

newPostBtn.addEventListener('click', function() {
    postModal.style.display = 'flex';
});

closeBtn.addEventListener('click', function() {
    postModal.style.display = 'none';
});

window.addEventListener('click', function(e) {
    if (e.target === postModal) {
        postModal.style.display = 'none';
    }
});

searchBar.addEventListener('input', searchPosts);
searchButton.addEventListener('click', searchPosts);

// Category dropdown functionality
categoryBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    categoryDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', function() {
    categoryDropdown.classList.remove('show');
});

// Category selection
categoryDropdown.addEventListener('click', function(e) {
    e.stopPropagation();
    if (e.target.tagName === 'A') {
        const category = e.target.getAttribute('data-category');
        filterByCategory(category);
        categoryDropdown.classList.remove('show');
    }
});

// Initialize
displayPosts();
if (!localStorage.getItem('blogPosts')) {
    savePosts(); // Save the default posts if localStorage was empty
}
