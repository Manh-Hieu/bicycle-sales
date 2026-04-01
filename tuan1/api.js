
const API_URL = 'local-storage-auth';

const USERS_KEY = 'demo_users';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateToken(user) {
    return `local-${user.id}-${Date.now()}`;
}

async function apiCall(endpoint, options = {}) {
    try {
        const method = (options.method || 'GET').toUpperCase();
        const body = options.body ? JSON.parse(options.body) : {};

        if (endpoint === '/auth/register' && method === 'POST') {
            return register(body.fullName, body.email, body.password);
        }

        if (endpoint === '/auth/login' && method === 'POST') {
            return login(body.email, body.password);
        }

        if (endpoint === '/auth/me' && method === 'GET') {
            return getCurrentUser();
        }

        if (endpoint === '/auth/logout' && method === 'POST') {
            return logout();
        }

        return {
            ok: false,
            status: 404,
            data: { message: 'Endpoint không tồn tại' }
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            ok: false,
            status: 500,
            data: { message: error.message || 'Có lỗi xảy ra' }
        };
    }
}

async function register(fullName, email, password) {
    const users = getUsers();
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!fullName || !normalizedEmail || !password) {
        return {
            ok: false,
            status: 400,
            data: { message: 'Vui lòng điền đầy đủ thông tin' }
        };
    }

    const existed = users.some(user => user.email.toLowerCase() === normalizedEmail);
    if (existed) {
        return {
            ok: false,
            status: 400,
            data: { message: 'Email đã tồn tại' }
        };
    }

    const newUser = {
        id: Date.now(),
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    return {
        ok: true,
        status: 201,
        data: {
            message: 'Đăng ký thành công',
            user: {
                id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email
            }
        }
    };
}

/**
 * Đăng nhập người dùng
 */
async function login(email, password) {
    const users = getUsers();
    const normalizedEmail = (email || '').trim().toLowerCase();

    const user = users.find(
        item => item.email.toLowerCase() === normalizedEmail && item.password === password
    );

    if (!user) {
        return {
            ok: false,
            status: 401,
            data: { message: 'Email hoặc mật khẩu không đúng' }
        };
    }

    const token = generateToken(user);
    const safeUser = {
        id: user.id,
        fullName: user.fullName,
        email: user.email
    };

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser));

    return {
        ok: true,
        status: 200,
        data: {
            message: 'Đăng nhập thành công',
            token,
            user: safeUser
        }
    };
}

/**
 * Lấy thông tin người dùng hiện tại
 */
async function getCurrentUser() {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = getStoredUser();

    if (!token || !user) {
        return {
            ok: false,
            status: 401,
            data: { message: 'Chưa đăng nhập' }
        };
    }

    return {
        ok: true,
        status: 200,
        data: { user }
    };
}

/**
 * Đăng xuất
 */
async function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    return {
        ok: true,
        status: 200,
        data: { message: 'Đăng xuất thành công' }
    };
}

/**
 * Kiểm tra người dùng đã đăng nhập chưa
 */
function isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
}

/**
 * Lấy thông tin người dùng từ localStorage
 */
function getStoredUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}