function switchTab(tabName) {
    document.querySelectorAll('.auth-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.auth-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    const buttons = document.querySelectorAll('.auth-tab');
    if (tabName === 'login') {
        buttons[0].classList.add('active');
    } else {
        buttons[1].classList.add('active');
    }
}


function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    button.textContent = button.textContent === '🐵' ? '🙈' : '🐵';
    input.type = input.type === 'password' ? 'text' : 'password';

}

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const button = event.target.querySelector('button[type="submit"]');

    try {
        button.disabled = true;
        button.textContent = 'Logging in...';

        const result = await login(email, password);

        if (result.ok) {
            alert('Đăng nhập thành công!');
            window.location.href = 'index.html';
        } else {
            alert('Lỗi đăng nhập: ' + (result.data?.message || 'Email hoặc mật khẩu không đúng'));
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Lỗi: ' + error.message);
    } finally {
        button.disabled = false;
        button.textContent = 'Login';
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    const button = event.target.querySelector('button[type="submit"]');

    if (password !== confirm) {
        alert('Mật khẩu không khớp!');
        return;
    }

    if (password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }

    try {
        button.disabled = true;
        button.textContent = 'Creating Account...';

        const result = await register(name, email, password);

        if (result.ok) {
            alert('Đăng ký thành công! Vui lòng đăng nhập.');

            document.getElementById('register-name').value = '';
            document.getElementById('register-email').value = '';
            document.getElementById('register-password').value = '';
            document.getElementById('register-confirm').value = '';
            document.getElementById('register-terms').checked = false;

            switchTab('login');
        } else {
            alert('Lỗi đăng ký: ' + (result.data?.message || 'Không thể đăng ký'));
        }
    } catch (error) {
        console.error('Register error:', error);
        alert('Lỗi: ' + error.message);
    } finally {
        button.disabled = false;
        button.textContent = 'Create Account';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = getStoredUser();
    if (currentUser && window.location.pathname.endsWith('register.html')) {
        console.log('Đã có người dùng đăng nhập:', currentUser.email);
    }
});