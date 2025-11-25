import gradesData from "@/services/mockData/grades.json";

class GradeService {
  constructor() {
    this.grades = [...gradesData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.grades];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const grade = this.grades.find(g => g.Id === parseInt(id));
    if (!grade) {
      throw new Error("Grade not found");
    }
    return { ...grade };
  }

  async getByStudentId(studentId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.grades
      .filter(grade => grade.studentId === studentId.toString())
      .map(grade => ({ ...grade }));
  }

  async create(gradeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...this.grades.map(g => g.Id)) + 1;
    const percentage = Math.round((gradeData.score / gradeData.maxScore) * 100);
    const letterGrade = this.calculateLetterGrade(percentage);
    
    const newGrade = {
      ...gradeData,
      Id: newId,
      percentage,
      letterGrade,
      date: gradeData.date || new Date().toISOString().split('T')[0]
    };
    
    this.grades.push(newGrade);
    return { ...newGrade };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    
    const updatedGrade = { ...this.grades[index], ...updateData };
    if (updatedGrade.score && updatedGrade.maxScore) {
      updatedGrade.percentage = Math.round((updatedGrade.score / updatedGrade.maxScore) * 100);
      updatedGrade.letterGrade = this.calculateLetterGrade(updatedGrade.percentage);
    }
    
    this.grades[index] = updatedGrade;
    return { ...updatedGrade };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.grades.findIndex(g => g.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Grade not found");
    }
    this.grades.splice(index, 1);
    return true;
  }

  calculateLetterGrade(percentage) {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 63) return "D";
    if (percentage >= 60) return "D-";
    return "F";
  }

  async calculateGPA(studentId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const studentGrades = this.grades.filter(grade => grade.studentId === studentId.toString());
    
    if (studentGrades.length === 0) return 0;
    
    const gradePoints = {
      "A+": 4.0, "A": 4.0, "A-": 3.7,
      "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7,
      "D+": 1.3, "D": 1.0, "D-": 0.7,
      "F": 0.0
    };
    
    const totalPoints = studentGrades.reduce((sum, grade) => {
      return sum + (gradePoints[grade.letterGrade] || 0);
    }, 0);
    
    return Math.round((totalPoints / studentGrades.length) * 100) / 100;
  }
}

export default new GradeService();