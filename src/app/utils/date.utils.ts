export class DateUtils {
    static isToday(timeString: string): boolean {
      const today = new Date();
      const [hours, minutes] = timeString.split(':').map(Number);
      
      const rideDate = new Date();
      rideDate.setHours(hours, minutes, 0, 0);
      return rideDate.getDate() === today.getDate() &&
             rideDate.getMonth() === today.getMonth() &&
             rideDate.getFullYear() === today.getFullYear();
    }
  
    static isWithinTimeBuffer(timeString: string, bufferMinutes: number): boolean {
      const [hours, minutes] = timeString.split(':').map(Number);
      
      const rideTime = new Date();
      rideTime.setHours(hours, minutes, 0, 0);
      
      const currentTime = new Date();
      const bufferMs = bufferMinutes * 60 * 1000;
      
      return Math.abs(rideTime.getTime() - currentTime.getTime()) <= bufferMs;
    }
  
    static formatTimeForInput(date: Date): string {
      return date.toTimeString().slice(0, 5);
    }
  
    static getCurrentTime(): string {
      return this.formatTimeForInput(new Date());
    }
  
    static getTimeWithBuffer(minutes: number): string {
      const date = new Date();
      date.setMinutes(date.getMinutes() + minutes);
      return this.formatTimeForInput(date);
    }
  
    static getTimeSlots(): string[] {
        const slots: string[] = [];
        for (let hour = 0; hour < 24; hour++) {
          for (let minute = 0; minute < 60; minute += 15) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push(timeString);
          }
        }
        return slots;
      }
  
    static isFutureTime(timeString: string): boolean {
      const [hours, minutes] = timeString.split(':').map(Number);
      const rideTime = new Date();
      rideTime.setHours(hours, minutes, 0, 0);
      
      return rideTime.getTime() > new Date().getTime();
    }
  }