import { DateUtils } from './date.utils';

describe('DateUtils', () => {
  describe('isToday', () => {
    it('should return true for current date', () => {
      const today = new Date().toTimeString().slice(0, 5);
      expect(DateUtils.isToday(today)).toBeTrue();
    });
  });

  describe('isWithinTimeBuffer', () => {
    it('should return true for time within buffer', () => {
      const currentTime = new Date();
      const withinBufferTime = new Date(currentTime.getTime() + 30 * 60 * 1000); // +30 minutes
      
      const result = DateUtils.isWithinTimeBuffer(
        withinBufferTime.toTimeString().slice(0, 5), 
        60
      );
      
      expect(result).toBeTrue();
    });

    it('should return true for time exactly at buffer limit', () => {
      const currentTime = new Date();
      const bufferLimitTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
      
      const result = DateUtils.isWithinTimeBuffer(
        bufferLimitTime.toTimeString().slice(0, 5), 
        60
      );
      
      expect(result).toBeTrue();
    });

    it('should return false for time outside buffer', () => {
      const currentTime = new Date();
      const outsideBufferTime = new Date(currentTime.getTime() + 90 * 60 * 1000);
      
      const result = DateUtils.isWithinTimeBuffer(
        outsideBufferTime.toTimeString().slice(0, 5), 
        60
      );
      
      expect(result).toBeFalse();
    });

    it('should handle past times within buffer', () => {
      const currentTime = new Date();
      const pastTime = new Date(currentTime.getTime() - 30 * 60 * 1000);
      
      const result = DateUtils.isWithinTimeBuffer(
        pastTime.toTimeString().slice(0, 5), 
        60
      );
      
      expect(result).toBeTrue();
    });
  });

  describe('formatTimeForInput', () => {
    it('should format time as HH:MM', () => {
      const date = new Date('2024-01-01T14:30:00');
      const formatted = DateUtils.formatTimeForInput(date);
      
      expect(formatted).toBe('14:30');
    });

    it('should pad single digit hours and minutes', () => {
      const date = new Date('2024-01-01T09:05:00');
      const formatted = DateUtils.formatTimeForInput(date);
      
      expect(formatted).toBe('09:05');
    });
  });

  describe('getCurrentTime', () => {
    it('should return current time in HH:MM format', () => {
      const currentTime = DateUtils.getCurrentTime();
      
      expect(currentTime).toMatch(/^\d{2}:\d{2}$/);
      
      const [hours, minutes] = currentTime.split(':').map(Number);
      expect(hours).toBeGreaterThanOrEqual(0);
      expect(hours).toBeLessThanOrEqual(23);
      expect(minutes).toBeGreaterThanOrEqual(0);
      expect(minutes).toBeLessThanOrEqual(59);
    });
  });

  describe('getTimeWithBuffer', () => {
    it('should return time with added buffer minutes', () => {
      const baseTime = new Date('2024-01-01T10:00:00');
      jasmine.clock().install();
      jasmine.clock().mockDate(baseTime);
      
      const bufferedTime = DateUtils.getTimeWithBuffer(30);
      
      expect(bufferedTime).toBe('10:30');
      
      jasmine.clock().uninstall();
    });

    it('should handle minute overflow', () => {
      const baseTime = new Date('2024-01-01T10:45:00');
      jasmine.clock().install();
      jasmine.clock().mockDate(baseTime);
      
      const bufferedTime = DateUtils.getTimeWithBuffer(30);
      
      expect(bufferedTime).toBe('11:15');
      
      jasmine.clock().uninstall();
    });
  });

  describe('getTimeSlots', () => {
    it('should generate all time slots for 24 hours', () => {
      const timeSlots = DateUtils.getTimeSlots();
      
      expect(timeSlots.length).toBe(96);
      expect(timeSlots[0]).toBe('00:00');
      expect(timeSlots[1]).toBe('00:15');
      expect(timeSlots[95]).toBe('23:45');
    });

    it('should generate slots in 15-minute intervals', () => {
      const timeSlots = DateUtils.getTimeSlots();
      
      for (let i = 0; i < timeSlots.length - 1; i++) {
        const [currentHours, currentMinutes] = timeSlots[i].split(':').map(Number);
        const [nextHours, nextMinutes] = timeSlots[i + 1].split(':').map(Number);
        
        const currentTotalMinutes = currentHours * 60 + currentMinutes;
        const nextTotalMinutes = nextHours * 60 + nextMinutes;
        
        expect(nextTotalMinutes - currentTotalMinutes).toBe(15);
      }
    });
  });

  describe('isFutureTime', () => {
    it('should return true for future times', () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 1);
      const futureTimeString = futureTime.toTimeString().slice(0, 5);
      
      expect(DateUtils.isFutureTime(futureTimeString)).toBeTrue();
    });

    it('should return false for past times', () => {
      const pastTime = new Date();
      pastTime.setHours(pastTime.getHours() - 1);
      const pastTimeString = pastTime.toTimeString().slice(0, 5);
      
      expect(DateUtils.isFutureTime(pastTimeString)).toBeFalse();
    });
  });
});