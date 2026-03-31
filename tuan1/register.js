        function switchTab(tabName) {

            const tabs = document.querySelectorAll('.auth-tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));

            const tabButtons = document.querySelectorAll('.auth-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));

            document.getElementById(tabName).classList.add('active');

            event.target.classList.add('active');
        }

        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            const button = event.target;
            
            if (input.type === 'password') {
                input.type = 'text';
                button.textContent = '👁️‍🗨️';
            } else {
                input.type = 'password';
                button.textContent = '👁️';
            }
        }

        function handleLogin(event) {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            alert(`Login with:\nEmail: ${email}\nPassword: ${password}`);

        }

        function handleRegister(event) {
            event.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('register-confirm').value;

            if (password !== confirm) {
                alert('Passwords do not match!');
                return;
            }

            alert(`Register with:\nName: ${name}\nEmail: ${email}\nPassword: ${password}`);

        }