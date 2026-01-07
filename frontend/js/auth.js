class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    register(name, email, password) {
        const users = dataManager.getUsers();
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already exists' };
        }

        const newUser = { name, email, password, isAdmin: false };
        dataManager.addUser(newUser);
        return { success: true, message: 'Registration successful' };
    }

    login(email, password) {
        const users = dataManager.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = { name: user.name, email: user.email, isAdmin: user.isAdmin };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            return { success: true, message: 'Login successful' };
        }
        return { success: false, message: 'Invalid credentials' };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getUser() {
        return this.currentUser;
    }
}

const authManager = new AuthManager();
