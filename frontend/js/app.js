const app = {
    init: function () {
        this.router('home');
        this.updateAuthUI();
    },

    router: function (route) {
        const container = document.getElementById('app');
        container.innerHTML = ''; // Clear current view

        switch (route) {
            case 'home':
                this.renderHome(container);
                break;
            case 'login':
                this.renderLogin(container);
                break;
            case 'register':
                this.renderRegister(container);
                break;
            case 'courses':
                if (!authManager.isAuthenticated()) {
                    this.router('login');
                    return;
                }
                this.renderCourses(container);
                break;
            case 'logout':
                authManager.logout();
                this.updateAuthUI();
                this.router('login');
                break;
            default:
                this.renderHome(container);
        }
    },

    updateAuthUI: function () {
        const nav = document.getElementById('nav-links');
        const user = authManager.getUser();

        if (user) {
            nav.innerHTML = `
                <li class="nav-item"><a class="nav-link" href="#" onclick="app.router('home'); return false;">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="#" onclick="app.router('courses'); return false;">Courses</a></li>
                <li class="nav-item"><span class="nav-link disabled">Welcome, ${user.name}</span></li>
                <li class="nav-item"><a class="nav-link" href="#" onclick="app.router('logout'); return false;">Logout</a></li>
            `;
        } else {
            nav.innerHTML = `
                <li class="nav-item"><a class="nav-link" href="#" onclick="app.router('home'); return false;">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="#" onclick="app.router('login'); return false;">Login</a></li>
                <li class="nav-item"><a class="nav-link" href="#" onclick="app.router('register'); return false;">Register</a></li>
            `;
        }
    },

    renderHome: function (container) {
        container.innerHTML = `
            <div class="p-5 mb-4 bg-light rounded-3 text-center">
                <h1>Welcome to Student App</h1>
                <p class="lead">Manage your courses and enrollments easily.</p>
                ${!authManager.isAuthenticated() ?
                `<button onclick="app.router('login')" class="btn btn-primary btn-lg">Login to Start</button>` :
                `<button onclick="app.router('courses')" class="btn btn-primary btn-lg">View Courses</button>`}
            </div>
        `;
    },

    renderLogin: function (container) {
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card p-4">
                        <h3 class="text-center mb-4">Login</h3>
                        <div id="login-alert"></div>
                        <form onsubmit="app.handleLogin(event)">
                            <div class="mb-3">
                                <label>Email</label>
                                <input type="email" id="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label>Password</label>
                                <input type="password" id="password" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    handleLogin: function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const result = authManager.login(email, password);
        if (result.success) {
            this.updateAuthUI();
            this.router('courses');
        } else {
            this.showAlert('login-alert', result.message, 'danger');
        }
    },

    renderRegister: function (container) {
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card p-4">
                        <h3 class="text-center mb-4">Register</h3>
                        <div id="register-alert"></div>
                        <form onsubmit="app.handleRegister(event)">
                            <div class="mb-3">
                                <label>Full Name</label>
                                <input type="text" id="name" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label>Email</label>
                                <input type="email" id="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label>Password</label>
                                <input type="password" id="password" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-success w-100">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    handleRegister: function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const result = authManager.register(name, email, password);
        if (result.success) {
            this.showAlert('register-alert', 'Registration successful! Please login.', 'success');
            setTimeout(() => this.router('login'), 1500);
        } else {
            this.showAlert('register-alert', result.message, 'danger');
        }
    },

    renderCourses: function (container) {
        const courses = dataManager.getCourses();
        const user = authManager.getUser();
        const enrollments = dataManager.getEnrollments(user.email);

        let html = '<h2 class="mb-4">Available Courses</h2><div class="row">';

        courses.forEach(course => {
            const isEnrolled = enrollments.some(e => e.courseId === course.id);
            html += `
                <div class="col-md-4">
                    <div class="card course-card h-100 p-3">
                        <div class="card-body">
                            <h5 class="card-title">${course.title}</h5>
                            <p class="card-text">${course.description}</p>
                            <p class="text-muted">Capacity: ${course.enrolled}/${course.capacity}</p>
                            ${isEnrolled ?
                    `<button class="btn btn-secondary w-100" disabled>Enrolled</button>` :
                    `<button onclick="app.enroll(${course.id})" class="btn btn-primary w-100">Enroll</button>`
                }
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    enroll: function (courseId) {
        const user = authManager.getUser();
        const result = dataManager.enrollStudent(courseId, user.email);

        if (result.success) {
            alert('Enrolled Successfully!');
            this.router('courses'); // Refresh view
        } else {
            alert(result.message);
        }
    },

    showAlert: function (elementId, message, type) {
        document.getElementById(elementId).innerHTML = `
            <div class="alert alert-${type}" role="alert">${message}</div>
        `;
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
