import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RideFormComponent } from './ride-form.component';
import { RideService } from '../../services/ride.service';
import { ToastService } from '../../services/toast.service';
import { VehicleType } from '../../models/ride.model';

describe('RideFormComponent', () => {
  let component: RideFormComponent;
  let fixture: ComponentFixture<RideFormComponent>;
  let mockRideService: jasmine.SpyObj<RideService>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    const rideServiceSpy = jasmine.createSpyObj('RideService', ['addRide']);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'error', 'warning']);

    await TestBed.configureTestingModule({
      declarations: [RideFormComponent],
      imports: [FormsModule],
      providers: [
        { provide: RideService, useValue: rideServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]  // ADD THIS LINE
    }).compileComponents();

    mockRideService = TestBed.inject(RideService) as jasmine.SpyObj<RideService>;
    mockToastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RideFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form data with default values', () => {
      expect(component.formData.employeeId).toBe('');
      expect(component.formData.vehicleType).toBe('');
      expect(component.formData.vehicleNo).toBe('');
      expect(component.formData.vacantSeats).toBe(1);
      expect(component.formData.time).toBeTruthy();
      expect(component.formData.pickUpPoint).toBe('');
      expect(component.formData.destination).toBe('');
    });

    it('should initialize vehicle options', () => {
      expect(component.vehicleOptions.length).toBe(2);
      expect(component.vehicleOptions[0].value).toBe(VehicleType.CAR);
      expect(component.vehicleOptions[1].value).toBe(VehicleType.BIKE);
    });

    it('should initialize time constraints', () => {
      expect(component.minTime).toBeTruthy();
      expect(component.maxTime).toBeTruthy();
    });

    it('should initialize errors with all false', () => {
      Object.values(component.errors).forEach(error => {
        expect(error).toBeFalse();
      });
    });
  });

  describe('Form Validation', () => {
    it('should validate form with all required fields filled', () => {
      component.formData = {
        employeeId: 'EMP001',
        vehicleType: VehicleType.CAR,
        vehicleNo: 'ABC123',
        vacantSeats: 3,
        time: '14:30',
        pickUpPoint: 'Office',
        destination: 'Airport'
      };

      const isValid = component['validateForm']();

      expect(isValid).toBeTrue();
      Object.values(component.errors).forEach(error => {
        expect(error).toBeFalse();
      });
    });

    it('should invalidate form with missing employeeId', () => {
      component.formData.employeeId = '';
      
      const isValid = component['validateForm']();

      expect(isValid).toBeFalse();
      expect(component.errors.employeeId).toBeTrue();
    });

    it('should invalidate form with missing vehicleType', () => {
      component.formData.vehicleType = '' as any;
      
      const isValid = component['validateForm']();

      expect(isValid).toBeFalse();
      expect(component.errors.vehicleType).toBeTrue();
    });

    it('should invalidate form with missing vehicleNo', () => {
      component.formData.vehicleNo = '';
      
      const isValid = component['validateForm']();

      expect(isValid).toBeFalse();
      expect(component.errors.vehicleNo).toBeTrue();
    });

    it('should invalidate form with invalid vacantSeats', () => {
      component.formData.vacantSeats = 0;
      
      const isValid = component['validateForm']();

      expect(isValid).toBeFalse();
      expect(component.errors.vacantSeats).toBeTrue();
    });

    it('should invalidate form with missing time', () => {
      component.formData.time = '';
      
      const isValid = component['validateForm']();

      expect(isValid).toBeFalse();
      expect(component.errors.time).toBeTrue();
    });

    it('should invalidate form with missing pickUpPoint', () => {
      component.formData.pickUpPoint = '';
      
      const isValid = component['validateForm']();

      expect(isValid).toBeFalse();
      expect(component.errors.pickUpPoint).toBeTrue();
    });

    it('should invalidate form with missing destination', () => {
      component.formData.destination = '';
      
      const isValid = component['validateForm']();

      expect(isValid).toBeFalse();
      expect(component.errors.destination).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.formData = {
        employeeId: 'EMP001',
        vehicleType: VehicleType.CAR,
        vehicleNo: 'ABC123',
        vacantSeats: 3,
        time: '14:30',
        pickUpPoint: 'Office',
        destination: 'Airport'
      };
    });

    it('should submit form successfully when valid', () => {
      mockRideService.addRide.and.returnValue(true);
      spyOn(component.rideAdded, 'emit');

      component.onSubmit();

      expect(mockRideService.addRide).toHaveBeenCalledWith({
        employeeId: 'EMP001',
        vehicleType: VehicleType.CAR,
        vehicleNo: 'ABC123',
        vacantSeats: 3,
        time: '14:30',
        pickUpPoint: 'Office',
        destination: 'Airport'
      });
      expect(mockToastService.success).toHaveBeenCalledWith('Ride added successfully! Your ride is now available for booking.');
      expect(component.rideAdded.emit).toHaveBeenCalled();
    });

    it('should show error when ride service fails', () => {
      mockRideService.addRide.and.returnValue(false);

      component.onSubmit();

      expect(mockRideService.addRide).toHaveBeenCalled();
      expect(mockToastService.error).toHaveBeenCalledWith('Failed to add ride. Employee ID or Vehicle Number already exists. Please use different details.');
      expect(mockToastService.success).not.toHaveBeenCalled();
    });

    it('should show warning when form is invalid', () => {
      component.formData.employeeId = '';

      component.onSubmit();

      expect(mockRideService.addRide).not.toHaveBeenCalled();
      expect(mockToastService.warning).toHaveBeenCalledWith('Please fill all required fields correctly.');
    });

    it('should reset form after successful submission', () => {
      mockRideService.addRide.and.returnValue(true);

      component.onSubmit();

      expect(component.formData.employeeId).toBe('');
      expect(component.formData.vehicleType).toBe('');
      expect(component.formData.vehicleNo).toBe('');
      expect(component.formData.vacantSeats).toBe(1);
      expect(component.formData.pickUpPoint).toBe('');
      expect(component.formData.destination).toBe('');
    });
  });

  describe('Event Emission', () => {
    it('should emit rideAdded event', () => {
      spyOn(component.rideAdded, 'emit');

      component.rideAdded.emit();

      expect(component.rideAdded.emit).toHaveBeenCalled();
    });
  });
});