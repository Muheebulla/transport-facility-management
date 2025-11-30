import { TestBed } from '@angular/core/testing';
import { BookingHistoryService } from './booking-history.service';
import { BookingHistory, Ride, VehicleType } from '../models/ride.model';

describe('BookingHistoryService', () => {
  let service: BookingHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingHistoryService);
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

  describe('Add to History', () => {
    const mockRide: Ride = {
      id: 'ride-1',
      employeeId: 'EMP001',
      vehicleType: VehicleType.CAR,
      vehicleNo: 'CAR001',
      vacantSeats: 2,
      time: '14:30',
      pickUpPoint: 'Office',
      destination: 'Airport',
      bookedBy: ['EMP002'],
      createdAt: new Date()
    };
  });

  describe('Cancel Booking', () => {
    let historyItem: BookingHistory;

    beforeEach(() => {
      const mockRide: Ride = {
        id: 'ride-1',
        employeeId: 'EMP001',
        vehicleType: VehicleType.CAR,
        vehicleNo: 'CAR001',
        vacantSeats: 2,
        time: '14:30',
        pickUpPoint: 'Office',
        destination: 'Airport',
        bookedBy: ['EMP002'],
        createdAt: new Date()
      };

      service.addToHistory(mockRide, 'EMP002');

      service.getHistory().subscribe(history => {
        historyItem = history[0];
      });
    });

    it('should not cancel completed booking', () => {
      historyItem.status = 'completed';

      const result = service.cancelBooking('ride-1', 'EMP002');

      expect(result).toBeFalse();

      service.getHistory().subscribe(history => {
        expect(history[0].status).toBe('completed');
      });
    });

    it('should not cancel non-existent booking', () => {
      const result = service.cancelBooking('non-existent', 'EMP002');

      expect(result).toBeFalse();
    });
  });

  describe('Filter History by Employee', () => {
    beforeEach(() => {
      const mockRide1: Ride = {
        id: 'ride-1',
        employeeId: 'EMP001',
        vehicleType: VehicleType.CAR,
        vehicleNo: 'CAR001',
        vacantSeats: 2,
        time: '14:30',
        pickUpPoint: 'Office',
        destination: 'Airport',
        bookedBy: ['EMP002'],
        createdAt: new Date()
      };

      const mockRide2: Ride = {
        id: 'ride-2',
        employeeId: 'EMP003',
        vehicleType: VehicleType.BIKE,
        vehicleNo: 'BIKE001',
        vacantSeats: 1,
        time: '15:00',
        pickUpPoint: 'Office',
        destination: 'Station',
        bookedBy: ['EMP004'],
        createdAt: new Date()
      };

      service.addToHistory(mockRide1, 'EMP002');
      service.addToHistory(mockRide2, 'EMP004');
    });

    it('should filter history by employee ID', () => {
      const emp002History = service.getHistoryByEmployee('EMP002');

      expect(emp002History.length).toBe(1);
      expect(emp002History[0].employeeId).toBe('EMP002');
    });

    it('should return empty array for non-existent employee', () => {
      const unknownEmpHistory = service.getHistoryByEmployee('EMP999');

      expect(unknownEmpHistory.length).toBe(0);
    });
  });

  describe('History Observable', () => {
    it('should provide observable of history', (done) => {
      service.getHistory().subscribe(history => {
        expect(history).toEqual(jasmine.any(Array));
        done();
      });
    });
  });

  describe('Test Data Generation', () => {
    it('should have test upcoming ride on initialization', (done) => {
      service.getHistory().subscribe(history => {
        const hasUpcoming = history.some(item => item.status === 'upcoming');
        expect(hasUpcoming).toBeTrue();
        done();
      });
    });
  });
});