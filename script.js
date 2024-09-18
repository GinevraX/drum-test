// Variables
let score = 0;
let timeLeft = 300;
let drumsHit = { kick: false, snare: false, hihat: false, tom: false, crash: false };
let interval;

// Start timer
function startTimer() {
    interval = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;

        if (timeLeft === 0) {
            clearInterval(interval);
            endGame();
        }
    }, 1000);
}

// Play sound and update score
let drumsHitCount = {}; // 记录每个鼓件的击打次数
let simultaneousHits = []; // 同时击打的鼓件

function playSound(drumElement) {
    const sound = drumElement.getAttribute('data-sound');
    const audio = new Audio(`sounds/${sound}.mp3`);

    // 播放音效
    audio.play();

    // 更新击打次数
    if (!drumsHitCount[sound]) {
        drumsHitCount[sound] = 1; // 第一次击打，计为1次
    } else {
        drumsHitCount[sound] += 1; // 多次击打次数递增
    }

    // 更新得分机制
    let hitCount = drumsHitCount[sound];
    if (hitCount === 1) {
        score += 10; // 第一次击打10分
    } else if (hitCount === 2) {
        score += 20; // 第二次击打20分
    } else {
        score += 20; // 超过两次，固定增加20分
    }

    // 同时击打多个零部件时的处理
    simultaneousHits.push(sound);
    setTimeout(() => {
        if (simultaneousHits.length === 2) {
            score += 15; // 同时击打两个鼓件，加15分
        } else if (simultaneousHits.length >= 3) {
            score += 20; // 同时击打三个及以上鼓件，加20分
        }
        simultaneousHits = []; // 清空同时击打记录
    }, 100); // 时间间隔设定为100ms来检测是否是“同时击打”

    // 更新界面上的得分
    document.getElementById('score').textContent = score;

    // 检查是否所有鼓件都已击打
    if (Object.keys(drumsHitCount).length === document.querySelectorAll('.drum').length) {
        document.getElementById('message-board').style.display = 'block'; // 显示留言板
    }
}


// End game logic
function endGame() {
    alert(`Time's up! Your final score is ${score}`);
    document.getElementById('message-board').style.display = 'block';
}

// Load comments from localStorage
function loadComments() {
    const commentList = document.getElementById('comment-list');
    commentList.innerHTML = '';
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.forEach(comment => {
        const li = document.createElement('li');
        li.textContent = comment;
        commentList.appendChild(li);
    });
}

// Save comment to localStorage
function saveComment(comment) {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.push(comment);
    localStorage.setItem('comments', JSON.stringify(comments));
}

// Initialize game
document.querySelectorAll('.drum').forEach(drum => {
    drum.addEventListener('click', () => playSound(drum));
});

// Start timer when the page loads
window.onload = () => {
    startTimer();
    loadComments(); // Load existing comments
};

// Submit comment
document.getElementById('submit-comment').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    if (message.trim()) {
        saveComment(message); // Save to localStorage
        loadComments(); // Reload comments
        document.getElementById('message').value = ''; // Clear input
        alert('Comment submitted!');
    } else {
        alert('Please enter a comment!');
    }
});
