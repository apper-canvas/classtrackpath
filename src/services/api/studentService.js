import studentsData from "@/services/mockData/students.json";

class StudentService {
  constructor() {
    this.students = [...studentsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.students];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const student = this.students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  }

  async create(studentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...this.students.map(s => s.Id)) + 1;
    const newStudent = {
      ...studentData,
      Id: newId,
      status: "Active"
    };
    this.students.push(newStudent);
    return { ...newStudent };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    this.students[index] = { ...this.students[index], ...updateData };
    return { ...this.students[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    this.students.splice(index, 1);
    return true;
  }

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const searchTerm = query.toLowerCase();
    return this.students.filter(student =>
      student.firstName.toLowerCase().includes(searchTerm) ||
      student.lastName.toLowerCase().includes(searchTerm) ||
      student.studentId.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm)
    );
  }

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.students.filter(student => student.status === status);
  }
}

export default new StudentService();