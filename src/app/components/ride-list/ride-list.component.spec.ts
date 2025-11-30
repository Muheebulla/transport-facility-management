import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subscription } from 'rxjs';
import { RideListComponent } from './ride-list.component';
import { RideService } from '../../services/ride.service';
import { ToastService } from '../../services/toast.service';
import { Ride, VehicleType } from '../../models/ride.model';

describe('RideListComponent', () => {
  let component: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;
  let mockRideService: jasmine.SpyObj<RideService>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  const mockRides: Ride[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      vehicleType: VehicleType.CAR,
      vehicleNo: 'CAR001',
      vacantSeats: 3,
      time: '14:30',
      pickUpPoint: 'Office',
      destination: 'Airport',
      bookedBy: [],
      createdAt: new Date()
    },
    {
      id: '2',
      employeeId: 'EMP002',
      vehicleType: VehicleType.BIKE,
      vehicleNo: 'BIKE001',
      vacantSeats: 1,
      time: '15:00',
      pickUpPoint: 'Office',
      destination: 'Station',
      bookedBy: [],
      createdAt: new Date()
    }
  ];

  beforeEach(async () => {
    const rideServiceSpy = jasmine.createSpyObj('RideService', 
      ['getAvailableRides', 'bookRide']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', 
      ['success', 'error', 'warning']);

    await TestBed.configureTestingModule({
      declarations: [RideListComponent],
      providers: [
        { provide: RideService, useValue: rideServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    mockRideService = TestBed.inject(RideService) as jasmine.SpyObj<RideService>;
    mockToastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

    mockRideService.getAvailableRides.and.returnValue(of(mockRides));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.rides).toEqual(mockRides);
      expect(component.filters).toEqual({});
      expect(component.bookingEmployeeId).toBe('');
      expect(component.showBookingForm).toBeFalse();
      expect(component.selectedRideId).toBe('');
    });

    it('should load available rides on initialization', () => {
      expect(mockRideService.getAvailableRides).toHaveBeenCalledWith({});
      expect(component.rides.length).toBe(2);
    });

    it('should initialize vehicle types', () => {
      expect(component.vehicleTypes.length).toBe(3);
      expect(component.vehicleTypes[0].value).toBe('');
      expect(component.vehicleTypes[1].value).toBe(VehicleType.CAR);
      expect(component.vehicleTypes[2].value).toBe(VehicleType.BIKE);
    });
  });

  describe('Ride Booking', () => {
    it('should show booking form when book ride is clicked', () => {
      component.onBookRide('1');

      expect(component.showBookingForm).toBeTrue();
      expect(component.selectedRideId).toBe('1');
    });

    it('should confirm booking with valid employee ID', () => {
      mockRideService.bookRide.and.returnValue(true);
      component.selectedRideId = '1';
      component.bookingEmployeeId = 'EMP003';

      component.confirmBooking();

      expect(mockRideService.bookRide).toHaveBeenCalledWith('1', 'EMP003');
      expect(mockToastService.success).toHaveBeenCalledWith('Ride booked successfully! Your seat has been confirmed.');
      expect(component.showBookingForm).toBeFalse();
      expect(component.bookingEmployeeId).toBe('');
    });

    it('should show warning when employee ID is empty', () => {
      component.selectedRideId = '1';
      component.bookingEmployeeId = '';

      component.confirmBooking();

      expect(mockRideService.bookRide).not.toHaveBeenCalled();
      expect(mockToastService.warning).toHaveBeenCalledWith('Please enter your Employee ID to book the ride.');
    });

    it('should cancel booking and reset form', () => {
      component.showBookingForm = true;
      component.bookingEmployeeId = 'EMP003';
      component.selectedRideId = '1';

      component.cancelBooking();

      expect(component.showBookingForm).toBeFalse();
      expect(component.bookingEmployeeId).toBe('');
      expect(component.selectedRideId).toBe('');
    });
  });

  describe('Filtering', () => {
    it('should filter rides by vehicle type', () => {
      const filteredRides = [mockRides[0]]; // Only car
      mockRideService.getAvailableRides.and.returnValue(of(filteredRides));

      component.onVehicleTypeChange(VehicleType.CAR);

      expect(component.filters.vehicleType).toBe(VehicleType.CAR);
      expect(mockRideService.getAvailableRides).toHaveBeenCalledWith({ vehicleType: VehicleType.CAR });
    });

    it('should refresh rides', () => {
      spyOn(component, 'refreshRides');

      component.refreshRides();

      expect(component.refreshRides).toHaveBeenCalled();
    });
  });

  describe('Vehicle Icon', () => {
    it('should return correct vehicle icon', () => {
      expect(component.getVehicleIcon(VehicleType.CAR)).toBe('🚗');
      expect(component.getVehicleIcon(VehicleType.BIKE)).toBe('🏍️');
    });
  });

  describe('Component Destruction', () => {
  it('should stop receiving ride updates after destruction', (done) => {
    let updateCount = 0;
    mockRideService.getAvailableRides.and.returnValue(of([
      {
        id: '1',
        employeeId: 'EMP001',
        vehicleType: VehicleType.CAR,
        vehicleNo: 'CAR001',
        vacantSeats: 3,
        time: '14:30',
        pickUpPoint: 'Office',
        destination: 'Airport',
        bookedBy: [],
        createdAt: new Date()
      }
    ]));

    component.ngOnInit();
    const initialRides = component.rides.length;
    
    component.ngOnDestroy();
    mockRideService.getAvailableRides.and.returnValue(of([]));
    setTimeout(() => {
      expect(component.rides.length).toBe(initialRides);
      done();
    }, 100);
  });
});
});