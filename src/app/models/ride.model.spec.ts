 
import { VehicleType, Ride, BookingHistory } from './ride.model';

describe('Ride Model', () => {
  describe('VehicleType Enum', () => {
    it('should have correct values', () => {
      expect(VehicleType.BIKE).toBe('Bike');
      expect(VehicleType.CAR).toBe('Car');
    });
  });

  describe('Ride Interface', () => {
    it('should create a valid Ride object', () => {
      const ride: Ride = {
        id: '1',
        employeeId: 'EMP001',
        vehicleType: VehicleType.CAR,
        vehicleNo: 'ABC123',
        vacantSeats: 3,
        time: '14:30',
        pickUpPoint: 'Office',
        destination: 'Airport',
        bookedBy: ['EMP002'],
        createdAt: new Date('2024-01-01T10:00:00'),
        rideDateTime: new Date('2024-01-01T14:30:00')
      };

      expect(ride.id).toBe('1');
      expect(ride.employeeId).toBe('EMP001');
      expect(ride.vehicleType).toBe(VehicleType.CAR);
      expect(ride.vehicleNo).toBe('ABC123');
      expect(ride.vacantSeats).toBe(3);
      expect(ride.time).toBe('14:30');
      expect(ride.pickUpPoint).toBe('Office');
      expect(ride.destination).toBe('Airport');
      expect(ride.bookedBy).toEqual(['EMP002']);
      expect(ride.createdAt).toEqual(new Date('2024-01-01T10:00:00'));
      expect(ride.rideDateTime).toEqual(new Date('2024-01-01T14:30:00'));
    });
  });

  describe('BookingHistory Interface', () => {
    it('should create a valid BookingHistory object', () => {
      const ride: Ride = {
        id: '1',
        employeeId: 'EMP001',
        vehicleType: VehicleType.CAR,
        vehicleNo: 'ABC123',
        vacantSeats: 2,
        time: '14:30',
        pickUpPoint: 'Office',
        destination: 'Airport',
        bookedBy: ['EMP002'],
        createdAt: new Date('2024-01-01T10:00:00')
      };

      const bookingHistory: BookingHistory = {
        rideId: '1',
        employeeId: 'EMP002',
        bookedAt: new Date('2024-01-01T11:00:00'),
        rideDetails: ride,
        status: 'upcoming'
      };

      expect(bookingHistory.rideId).toBe('1');
      expect(bookingHistory.employeeId).toBe('EMP002');
      expect(bookingHistory.bookedAt).toEqual(new Date('2024-01-01T11:00:00'));
      expect(bookingHistory.rideDetails).toEqual(ride);
      expect(bookingHistory.status).toBe('upcoming');
    });
  });

  describe('Status Types', () => {
    it('should allow valid status values for BookingHistory', () => {
      const validStatuses: BookingHistory['status'][] = ['completed', 'cancelled', 'upcoming'];
      
      expect(validStatuses).toContain('completed');
      expect(validStatuses).toContain('cancelled');
      expect(validStatuses).toContain('upcoming');
    });
  });
});