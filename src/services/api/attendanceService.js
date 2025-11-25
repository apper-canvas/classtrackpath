import attendanceData from "@/services/mockData/attendance.json";

class AttendanceService {
  constructor() {
    this.attendance = [...attendanceData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.attendance];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const record = this.attendance.find(a => a.Id === parseInt(id));
    if (!record) {
      throw new Error("Attendance record not found");
    }
    return { ...record };
  }

  async getByStudentId(studentId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.attendance
      .filter(record => record.studentId === studentId.toString())
      .map(record => ({ ...record }));
  }

  async getByDate(date) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.attendance
      .filter(record => record.date === date)
      .map(record => ({ ...record }));
  }

  async create(attendanceData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...this.attendance.map(a => a.Id)) + 1;
    const newRecord = {
      ...attendanceData,
      Id: newId,
      recordedAt: new Date().toISOString()
    };
    this.attendance.push(newRecord);
    return { ...newRecord };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    this.attendance[index] = { ...this.attendance[index], ...updateData };
    return { ...this.attendance[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.attendance.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Attendance record not found");
    }
    this.attendance.splice(index, 1);
    return true;
  }

  async calculateAttendanceRate(studentId, startDate = null, endDate = null) {
    await new Promise(resolve => setTimeout(resolve, 200));
    let records = this.attendance.filter(record => record.studentId === studentId.toString());
    
    if (startDate) {
      records = records.filter(record => record.date >= startDate);
    }
    if (endDate) {
      records = records.filter(record => record.date <= endDate);
    }
    
    if (records.length === 0) return 100;
    
    const presentCount = records.filter(record => record.status === "Present" || record.status === "Tardy").length;
    return Math.round((presentCount / records.length) * 100);
  }

  async markAttendance(studentId, date, status, notes = "") {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if record already exists for this student and date
    const existingIndex = this.attendance.findIndex(
      record => record.studentId === studentId.toString() && record.date === date
    );
    
    if (existingIndex !== -1) {
      // Update existing record
      this.attendance[existingIndex] = {
        ...this.attendance[existingIndex],
        status,
        notes,
        recordedAt: new Date().toISOString()
      };
      return { ...this.attendance[existingIndex] };
    } else {
      // Create new record
      return await this.create({ studentId: studentId.toString(), date, status, notes });
    }
  }
}

export default new AttendanceService();