// eslint-disable-next-line max-lines-per-function
function createStudent(name, year) {
  return {
    name,
    year,
    courses: [],

    info() {
      console.log(`${name} is a ${year} year student`);
    },

    listCourses() {
      return this.courses;
    },

    addCourse(course) {
      this.courses.push(course);
    },

    addNote(code, note) {
      let course = this.courses.find(course => course.code === code);
      if (course) {
        if (!course.notes) course.notes = [];
        course.notes.push(note);
      }
    },

    viewNotes() {
      this.courses.forEach(course => {
        if (course.notes) console.log(`${course.name}: ${course.notes.join('; ')}`);
      });
    },

    updateNote(code, note) {
      let course = this.courses.find(course => course.code === code);
      if (course) course.notes = [note];
    },
  };
}

// eslint-disable-next-line max-lines-per-function
function createSchool() {
  return {
    students: [],

    addStudent(student) {
      const VALID_YEARS = ['1st', '2nd', '3rd', '4th', '5th'];

      if (VALID_YEARS.includes(student.year)) {
        this.students.push(student);
        return student;
      } else {
        console.log('Invalid Year');
        return null;
      }
    },

    enrollStudent(student, name, code) {
      student.addCourse({ name, code });
    },

    addGrade(student, code, grade) {
      let course = student.courses.find(course => course.code === code);
      if (course) course.grade = grade;
    },

    getReportCard(student) {
      student.courses.forEach(course => {
        console.log(`${course.name}: ${course.grade ? course.grade : 'In Progress'}`);
      });
    },

    getCourse(student, courseName) {
      return student.courses.find(course => course.name === courseName);
    },

    getStudentsInCourse(courseName) {
      return this.students.filter(student => {
        let course = this.getCourse(student, courseName);
        return course && course.grade;
      });
    },

    courseReport(courseName) {
      let gradeSum = 0;

      let students = this.getStudentsInCourse(courseName);

      if (students.length) {
        console.log(`=${courseName} Grades=`);

        students.forEach(student => {
          let course = this.getCourse(student, courseName);
          console.log(`${student.name}: ${course.grade}`);
          gradeSum += course.grade;
        });

        let average = gradeSum / students.length;

        console.log('---');
        console.log(`Course Average: ${average}`);
      } else {
        console.log(undefined);
      }
    }
  };
}

let school = createSchool();

let foo = createStudent('foo', '3rd');
let bar = createStudent('bar', '1st');
let qux = createStudent('qux', '2nd');

school.addStudent(foo);
school.addStudent(bar);
school.addStudent(qux);

school.enrollStudent(foo, 'Math', 101);
school.enrollStudent(foo, 'Advanced Math', 102);
school.enrollStudent(foo, 'Physics', 202);

school.enrollStudent(bar, 'Math', 101);

school.enrollStudent(qux, 'Math', 101);
school.enrollStudent(qux, 'Advanced Math', 102);

school.addGrade(foo, 101, 95);
school.addGrade(foo, 102, 90);

school.addGrade(bar, 101, 91);

school.addGrade(qux, 101, 93);
school.addGrade(qux, 102, 90);

school.getReportCard(foo);
school.courseReport('Math');
school.courseReport('Advanced Math');
school.courseReport('Physics');