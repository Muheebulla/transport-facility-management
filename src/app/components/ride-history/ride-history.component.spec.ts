import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { RideHistoryComponent } from './ride-history.component';
import { BookingHistoryService } from '../../services/booking-history.service';
import { RideService } from '../../services/ride.service';
import { ToastService } from '../../services/toast.service';
import { BookingHistory, VehicleType } from '../../models/ride.model';

describe('RideHistoryComponent', () => {
  let component: RideHistoryComponent;
  let fixture: ComponentFixture<RideHistoryComponent>;
  let mockBookingHistoryService: jasmine.SpyObj<BookingHistoryService>;
  let mockRideService: jasmine.SpyObj<RideService>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  const mockHistory: BookingHistory[] = [
    {
      rideId: '1',
      employeeId: 'EMP001',
      bookedAt: new Date('2024-01-01T10:00:00'),
      rideDetails: {
        id: '1',
        employeeId: 'EMP002',
        vehicleType: VehicleType.CAR,
        vehicleNo: 'CAR001',
        vacantSeats: 2,
        time: '14:30',
        pickUpPoint: 'Office',
        destination: 'Airport',
        bookedBy: ['EMP001'],
        createdAt: new Date('2024-01-01T09:00:00')
      },
      status: 'upcoming'
    },
    {
      rideId: '2',
      employeeId: 'EMP003',
      bookedAt: new Date('2024-01-01T11:00:00'),
      rideDetails: {
        id: '2',
        employeeId: 'EMP004',
        vehicleType: VehicleType.BIKE,
        vehicleNo: 'BIKE001',
        vacantSeats: 0,
        time: '09:00',
        pickUpPoint: 'Office',
        destination: 'Station',
        bookedBy: ['EMP003'],
        createdAt: new Date('2024-01-01T08:00:00')
      },
      status: 'completed'
    }
  ];

  beforeEach(async () => {
    const bookingHistoryServiceSpy = jasmine.createSpyObj('BookingHistoryService', 
      ['getHistory', 'cancelBooking']);
    const rideServiceSpy = jasmine.createSpyObj('RideService', ['cancelBooking']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [RideHistoryComponent],
      providers: [
        { provide: BookingHistoryService, useValue: bookingHistoryServiceSpy },
        { provide: RideService, useValue: rideServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    mockBookingHistoryService = TestBed.inject(BookingHistoryService) as jasmine.SpyObj<BookingHistoryService>;
    mockRideService = TestBed.inject(RideService) as jasmine.SpyObj<RideService>;
    mockToastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

    mockBookingHistoryService.getHistory.and.returnValue(of(mockHistory));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RideHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.filterStatus).toBe('all');
      expect(component.searchEmployeeId).toBe('');
      expect(component.history).toEqual(mockHistory);
    });

    it('should load history on initialization', () => {
      expect(mockBookingHistoryService.getHistory).toHaveBeenCalled();
      expect(component.history.length).toBe(2);
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      component.history = mockHistory;
    });

    it('should apply status filter correctly', () => {
      component.filterStatus = 'upcoming';
      component.applyFilters();

      expect(component.filteredHistory.length).toBe(1);
      expect(component.filteredHistory[0].status).toBe('upcoming');
    });

    it('should show all when filter is all', () => {
      component.filterStatus = 'all';
      component.applyFilters();

      expect(component.filteredHistory.length).toBe(2);
    });

    it('should apply employee ID search filter', () => {
      component.searchEmployeeId = 'EMP001';
      component.applyFilters();

      expect(component.filteredHistory.length).toBe(1);
      expect(component.filteredHistory[0].employeeId).toBe('EMP001');
    });

    it('should sort history by booking date descending', () => {
      component.applyFilters();

      expect(component.filteredHistory[0].bookedAt.getTime())
        .toBeGreaterThan(component.filteredHistory[1].bookedAt.getTime());
    });
  });

  describe('Status Filter Change', () => {
    it('should update filter status and apply filters', () => {
      spyOn(component, 'applyFilters');

      component.onStatusFilterChange('completed');

      expect(component.filterStatus).toBe('completed');
      expect(component.applyFilters).toHaveBeenCalled();
    });
  });

  describe('Search Change', () => {
    it('should update search term and apply filters', () => {
      spyOn(component, 'applyFilters');

      component.onSearchChange('EMP001');

      expect(component.searchEmployeeId).toBe('EMP001');
      expect(component.applyFilters).toHaveBeenCalled();
    });
  });

  describe('Cancel Booking', () => {
    it('should cancel booking when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      mockRideService.cancelBooking.and.returnValue(true);
      mockBookingHistoryService.cancelBooking.and.returnValue(true);
      spyOn(component, 'applyFilters');

      component.cancelBooking(mockHistory[0]);

      expect(mockRideService.cancelBooking).toHaveBeenCalledWith('1', 'EMP001');
      expect(mockBookingHistoryService.cancelBooking).toHaveBeenCalledWith('1', 'EMP001');
      expect(mockToastService.success).toHaveBeenCalledWith('Booking cancelled successfully! Your seat has been freed up.');
      expect(component.applyFilters).toHaveBeenCalled();
    });

    it('should not cancel booking when not confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.cancelBooking(mockHistory[0]);

      expect(mockRideService.cancelBooking).not.toHaveBeenCalled();
      expect(mockBookingHistoryService.cancelBooking).not.toHaveBeenCalled();
    });

    it('should show error when cancellation fails', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      mockRideService.cancelBooking.and.returnValue(false);
      mockBookingHistoryService.cancelBooking.and.returnValue(false);

      component.cancelBooking(mockHistory[0]);

      expect(mockToastService.error).toHaveBeenCalledWith('Cannot cancel this booking. It may be completed, already cancelled, or no longer available.');
    });
  });

  describe('UI Helper Methods', () => {
    it('should return correct status badge class', () => {
      expect(component.getStatusBadgeClass('upcoming')).toBe('status-upcoming');
      expect(component.getStatusBadgeClass('completed')).toBe('status-completed');
      expect(component.getStatusBadgeClass('cancelled')).toBe('status-cancelled');
      expect(component.getStatusBadgeClass('unknown')).toBe('status-unknown');
    });

    it('should return correct status icon', () => {
      expect(component.getStatusIcon('upcoming')).toBe('🕒');
      expect(component.getStatusIcon('completed')).toBe('✅');
      expect(component.getStatusIcon('cancelled')).toBe('❌');
      expect(component.getStatusIcon('unknown')).toBe('❓');
    });

    it('should return correct vehicle icon', () => {
      expect(component.getVehicleIcon(VehicleType.CAR)).toBe('🚗');
      expect(component.getVehicleIcon(VehicleType.BIKE)).toBe('🏍️');
    });

    it('should show cancel button only for upcoming rides', () => {
      expect(component.shouldShowCancelButton(mockHistory[0])).toBeTrue();
      expect(component.shouldShowCancelButton(mockHistory[1])).toBeFalse();
    });
  });
});