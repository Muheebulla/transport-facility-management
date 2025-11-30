import { TestBed } from '@angular/core/testing';
import { RideService } from './ride.service';
import { BookingHistoryService } from './booking-history.service';
import { Ride, VehicleType } from '../models/ride.model';
import { DateUtils } from '../utils/date.utils';

describe('RideService', () => {
  let service: RideService;
  let mockBookingHistoryService: jasmine.SpyObj<BookingHistoryService>;

  beforeEach(() => {
    const bookingHistoryServiceSpy = jasmine.createSpyObj('BookingHistoryService', 
      ['addToHistory']);

    TestBed.configureTestingModule({
      providers: [
        RideService,
        { provide: BookingHistoryService, useValue: bookingHistoryServiceSpy }
      ]
    });

    service = TestBed.inject(RideService);
    mockBookingHistoryService = TestBed.inject(BookingHistoryService) as jasmine.SpyObj<BookingHistoryService>;
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('Add Ride', () => {
    const mockRideData = {
      employeeId: 'EMP001',
      vehicleType: VehicleType.CAR,
      vehicleNo: 'ABC123',
      vacantSeats: 3,
      time: '14:30',
      pickUpPoint: 'Office',
      destination: 'Airport'
    };

    it('should add a new ride successfully', () => {
      const result = service.addRide(mockRideData);
      
      expect(result).toBeTrue();
      
      service.getAllRides().subscribe(rides => {
        expect(rides.length).toBe(1);
        expect(rides[0].employeeId).toBe('EMP001');
        expect(rides[0].vehicleNo).toBe('ABC123');
        expect(rides[0].vacantSeats).toBe(3);
        expect(rides[0].id).toContain('ride_');
        expect(rides[0].bookedBy).toEqual([]);
      });
    });

    it('should not allow duplicate employee ID', () => {
      service.addRide(mockRideData);
      const duplicateRide = { ...mockRideData, vehicleNo: 'XYZ789' };
      
      const result = service.addRide(duplicateRide);
      
      expect(result).toBeFalse();
      
      service.getAllRides().subscribe(rides => {
        expect(rides.length).toBe(1);
      });
    });

    it('should not allow duplicate vehicle number', () => {
      service.addRide(mockRideData);
      const duplicateRide = { ...mockRideData, employeeId: 'EMP002' };
      
      const result = service.addRide(duplicateRide);
      
      expect(result).toBeFalse();
      
      service.getAllRides().subscribe(rides => {
        expect(rides.length).toBe(1);
      });
    });

    it('should persist rides in localStorage', () => {
      service.addRide(mockRideData);
      
      const stored = localStorage.getItem('transport_rides');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(1);
      expect(parsed[0].employeeId).toBe('EMP001');
    });
  });

  describe('Book Ride', () => {
    let rideId: string;

    beforeEach(() => {
      const rideData = {
        employeeId: 'EMP001',
        vehicleType: VehicleType.CAR,
        vehicleNo: 'ABC123',
        vacantSeats: 3,
        time: '14:30',
        pickUpPoint: 'Office',
        destination: 'Airport'
      };
      
      service.addRide(rideData);
      
      service.getAllRides().subscribe(rides => {
        rideId = rides[0].id;
      });
    });

    it('should book a ride successfully', () => {
      const result = service.bookRide(rideId, 'EMP002');
      
      expect(result).toBeTrue();
      expect(mockBookingHistoryService.addToHistory).toHaveBeenCalled();
      
      service.getAllRides().subscribe(rides => {
        const updatedRide = rides[0];
        expect(updatedRide.vacantSeats).toBe(2);
        expect(updatedRide.bookedBy).toContain('EMP002');
      });
    });

    it('should not allow booking by ride provider', () => {
      const result = service.bookRide(rideId, 'EMP001');
      
      expect(result).toBeFalse();
      
      service.getAllRides().subscribe(rides => {
        expect(rides[0].vacantSeats).toBe(3);
        expect(rides[0].bookedBy.length).toBe(0);
      });
    });

    it('should not allow duplicate booking by same employee', () => {
      service.bookRide(rideId, 'EMP002');
      const result = service.bookRide(rideId, 'EMP002');
      
      expect(result).toBeFalse();
      
      service.getAllRides().subscribe(rides => {
        expect(rides[0].vacantSeats).toBe(2);
        expect(rides[0].bookedBy.length).toBe(1);
      });
    });

    it('should not book ride with no vacant seats', () => {
      // Fill all seats
      service.bookRide(rideId, 'EMP002');
      service.bookRide(rideId, 'EMP003');
      service.bookRide(rideId, 'EMP004');
      const result = service.bookRide(rideId, 'EMP005');
      
      expect(result).toBeFalse();
      
      service.getAllRides().subscribe(rides => {
        expect(rides[0].vacantSeats).toBe(0);
        expect(rides[0].bookedBy.length).toBe(3);
      });
    });
  });

  describe('Cancel Booking', () => {
    let rideId: string;

    beforeEach(() => {
      const rideData = {
        employeeId: 'EMP001',
        vehicleType: VehicleType.CAR,
        vehicleNo: 'ABC123',
        vacantSeats: 3,
        time: '14:30',
        pickUpPoint: 'Office',
        destination: 'Airport'
      };
      
      service.addRide(rideData);
      
      service.getAllRides().subscribe(rides => {
        rideId = rides[0].id;
      });
      
      // Book a seat first
      service.bookRide(rideId, 'EMP002');
    });

    it('should cancel booking successfully', () => {
      const result = service.cancelBooking(rideId, 'EMP002');
      
      expect(result).toBeTrue();
      
      service.getAllRides().subscribe(rides => {
        const updatedRide = rides[0];
        expect(updatedRide.vacantSeats).toBe(3);
        expect(updatedRide.bookedBy).not.toContain('EMP002');
      });
    });

    it('should not cancel booking for non-existent employee', () => {
      const result = service.cancelBooking(rideId, 'EMP999');
      
      expect(result).toBeFalse();
      
      service.getAllRides().subscribe(rides => {
        expect(rides[0].vacantSeats).toBe(2);
      });
    });

    it('should not cancel booking for non-existent ride', () => {
      const result = service.cancelBooking('non-existent-id', 'EMP002');
      
      expect(result).toBeFalse();
    });
  });

  describe('Get Available Rides', () => {
    beforeEach(() => {
      const currentTime = new Date();
      const futureTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
      
      const rides = [
        {
          employeeId: 'EMP001',
          vehicleType: VehicleType.CAR,
          vehicleNo: 'CAR001',
          vacantSeats: 2,
          time: currentTime.toTimeString().slice(0, 5),
          pickUpPoint: 'Office',
          destination: 'Airport'
        },
        {
          employeeId: 'EMP002',
          vehicleType: VehicleType.BIKE,
          vehicleNo: 'BIKE001',
          vacantSeats: 0,
          time: futureTime.toTimeString().slice(0, 5),
          pickUpPoint: 'Office',
          destination: 'Station'
        }
      ];
      
      rides.forEach(ride => service.addRide(ride));
    });

    it('should return only available rides', (done) => {
      service.getAvailableRides().subscribe(rides => {
        // Should only return rides with vacant seats and within time buffer
        expect(rides.length).toBeGreaterThan(0);
        rides.forEach(ride => {
          expect(ride.vacantSeats).toBeGreaterThan(0);
        });
        done();
      });
    });

    it('should filter by vehicle type', (done) => {
      service.getAvailableRides({ vehicleType: VehicleType.CAR }).subscribe(rides => {
        rides.forEach(ride => {
          expect(ride.vehicleType).toBe(VehicleType.CAR);
        });
        done();
      });
    });
  });
});