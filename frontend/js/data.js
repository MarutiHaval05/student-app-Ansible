class DataManager {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
        }
        if (!localStorage.getItem('courses')) {
            const seedCourses = [
                { id: 1, title: "DevOps Engineering", description: "Learn docker, kubernetes, ansible", capacity: 50, enrolled: 0 },
                { id: 2, title: "Full Stack Web Dev", description: "MERN Stack mastery", capacity: 60, enrolled: 0 },
                { id: 3, title: "Cloud Computing", description: "AWS and Azure fundamentals", capacity: 40, enrolled: 0 }
            ];
            localStorage.setItem('courses', JSON.stringify(seedCourses));
        }
        if (!localStorage.getItem('enrollments')) {
            localStorage.setItem('enrollments', JSON.stringify([]));
        }
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('users'));
    }

    addUser(user) {
        const users = this.getUsers();
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
    }

    getCourses() {
        return JSON.parse(localStorage.getItem('courses'));
    }

    getEnrollments(email) { // Search by email instead of ID for simplicity
        const enrollments = JSON.parse(localStorage.getItem('enrollments'));
        return enrollments.filter(e => e.studentEmail === email);
    }

    enrollStudent(courseId, studentEmail) {
        const enrollments = JSON.parse(localStorage.getItem('enrollments'));

        // Check if already enrolled
        if (enrollments.some(e => e.courseId === courseId && e.studentEmail === studentEmail)) {
            return { success: false, message: 'Already enrolled' };
        }

        const courses = this.getCourses();
        const courseIndex = courses.findIndex(c => c.id === courseId);

        if (courseIndex === -1) return { success: false, message: 'Course not found' };
        if (courses[courseIndex].enrolled >= courses[courseIndex].capacity) {
            return { success: false, message: 'Course full' };
        }

        // Add enrollment
        enrollments.push({ courseId, studentEmail, date: new Date().toISOString() });
        localStorage.setItem('enrollments', JSON.stringify(enrollments));

        // Update course count
        courses[courseIndex].enrolled += 1;
        localStorage.setItem('courses', JSON.stringify(courses));

        return { success: true, message: 'Enrolled successfully' };
    }
}

const dataManager = new DataManager();
