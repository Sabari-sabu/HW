const feedbackGrid = document.getElementById('feedbackGrid');
const feedbackForm = document.getElementById('feedbackForm');
const searchInput = document.getElementById('searchInput');
const toggleTheme = document.getElementById('toggleTheme');
const exportBtn = document.getElementById('exportBtn');

let feedbackData = JSON.parse(localStorage.getItem('feedback')) || [];

// Utility: Get avatar from GitHub
const getAvatarUrl = (url) => {
  const match = url.match(/github\.com\/([\w-]+)/);
  return match ? `https://github.com/${match[1]}.png` : 'https://ui-avatars.com/api/?name=User';
};

// Render feedback cards
function renderFeedback(data) {
  feedbackGrid.innerHTML = '';
  data.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${getAvatarUrl(item.profile)}" alt="avatar" />
      <h3>${item.name}</h3>
      <p>${item.feedback}</p>
      <p class="timestamp">${item.date}</p>
      <div class="reactions">
        <button onclick="react(${index}, 'likes')">👍 ${item.likes || 0}</button>
        <button onclick="react(${index}, 'hearts')">❤️ ${item.hearts || 0}</button>
        <button onclick="react(${index}, 'cheers')">🎉 ${item.cheers || 0}</button>
      </div>
    `;
    feedbackGrid.appendChild(card);
  });
}

// Add feedback
feedbackForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const profile = document.getElementById('profileLink').value.trim();
  const feedback = document.getElementById('feedback').value.trim();

  const newFeedback = {
    name,
    profile,
    feedback,
    date: new Date().toLocaleString(),
    likes: 0,
    hearts: 0,
    cheers: 0
  };

  feedbackData.unshift(newFeedback);
  localStorage.setItem('feedback', JSON.stringify(feedbackData));
  feedbackForm.reset();
  renderFeedback(feedbackData);
});

// Filter feedback
searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  const filtered = feedbackData.filter(fb =>
    fb.name.toLowerCase().includes(term) || fb.feedback.toLowerCase().includes(term)
  );
  renderFeedback(filtered);
});

// Reactions
function react(index, type) {
  feedbackData[index][type]++;
  localStorage.setItem('feedback', JSON.stringify(feedbackData));
  renderFeedback(feedbackData);
}

// Toggle Theme
toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Export JSON
exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(feedbackData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'feedback.json';
  a.click();
  URL.revokeObjectURL(url);
});
document.getElementById('clearAll').addEventListener('click', () => {
  if (confirm("Are you sure you want to delete all feedback?")) {
    localStorage.removeItem('feedback');
    data = [];
    renderGrid(data);
    Toastify({
      text: "🧹 All feedback cleared",
      duration: 3000,
      backgroundColor: "#e74c3c",
    }).showToast();
  }
});


// Initial render
renderFeedback(feedbackData);
