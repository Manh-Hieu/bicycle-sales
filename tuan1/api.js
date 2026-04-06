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

function sanitizeUser(user) {
    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email
    };
}
async function register(fullName, email, password) {
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const users = getUsers();

        const existingUser = users.find(
            user => user.email.toLowerCase() === normalizedEmail
        );

        if (existingUser) {
            return {
                ok: false,
                data: {
                    message: 'Email đã tồn tại'
                }
            };
        }

        const newUser = {
            id: Date.now(),
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        return {
            ok: true,
            data: {
                message: 'Đăng ký thành công',
                user: sanitizeUser(newUser)
            }
        };
    } catch (error) {
        return {
            ok: false,
            data: {
                message: 'Không thể đăng ký'
            }
        };
    }
}

function getStoredUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

function generateToken(user) {
    return `local-${user.id}-${Date.now()}`;
}

function getStoredToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setSession(user) {
    const safeUser = sanitizeUser(user);
    const token = generateToken(user);

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser));

    return {
        token,
        user: safeUser
    };
}

function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

async function register(fullName, email, password) {
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const users = getUsers();

        const existingUser = users.find(
            user => user.email.toLowerCase() === normalizedEmail
        );

        if (existingUser) {
            return {
                ok: false,
                data: {
                    message: 'Email đã tồn tại'
                }
            };
        }

        const newUser = {
            id: Date.now(),
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        return {
            ok: true,
            data: {
                message: 'Đăng ký thành công',
                user: sanitizeUser(newUser)
            }
        };
    } catch (error) {
        return {
            ok: false,
            data: {
                message: 'Không thể đăng ký'
            }
        };
    }
}

async function login(email, password) {
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const users = getUsers();

        const foundUser = users.find(
            user =>
                user.email.toLowerCase() === normalizedEmail &&
                user.password === password
        );

        if (!foundUser) {
            return {
                ok: false,
                data: {
                    message: 'Email hoặc mật khẩu không đúng'
                }
            };
        }

        const session = setSession(foundUser);

        return {
            ok: true,
            data: {
                message: 'Đăng nhập thành công',
                token: session.token,
                user: session.user
            }
        };
    } catch (error) {
        return {
            ok: false,
            data: {
                message: 'Không thể đăng nhập'
            }
        };
    }
}

async function logout() {
    clearSession();

    return {
        ok: true,
        data: {
            message: 'Đăng xuất thành công'
        }
    };
}

async function getCurrentUser() {
    const token = getStoredToken();
    const user = getStoredUser();

    if (!token || !user) {
        return {
            ok: false,
            data: {
                message: 'Chưa đăng nhập'
            }
        };
    }

    return {
        ok: true,
        data: {
            user
        }
    };
}