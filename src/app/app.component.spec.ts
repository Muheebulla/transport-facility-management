import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { RideService } from './services/ride.service';
import { Ride } from './models/ride.model';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockRideService: jasmine.SpyObj<RideService>;

  const mockRides: Ride[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      vehicleType: 'Car' as any,
      vehicleNo: 'CAR001',
      vacantSeats: 3,
      time: '14:30',
      pickUpPoint: 'Office',
      destination: 'Airport',
      bookedBy: [],
      createdAt: new Date()
    }
  ];

  beforeEach(async () => {
    const rideServiceSpy = jasmine.createSpyObj('RideService', ['getAllRides']);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: RideService, useValue: rideServiceSpy }
      ]
    }).compileComponents();

    mockRideService = TestBed.inject(RideService) as jasmine.SpyObj<RideService>;
    mockRideService.getAllRides.and.returnValue(of(mockRides));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create the app', () => {
      expect(component).toBeTruthy();
    });

    it(`should have as title 'Transport Facility Management'`, () => {
      expect(component.title).toEqual('Transport Facility Management');
    });

    it('should start with add tab active', () => {
      expect(component.activeTab).toBe('add');
    });
  });

  describe('Tab Navigation', () => {
    it('should switch to book tab', () => {
      component.setActiveTab('book');
      expect(component.activeTab).toBe('book');
    });

    it('should switch to history tab', () => {
      component.setActiveTab('history');
      expect(component.activeTab).toBe('history');
    });

    it('should switch back to add tab', () => {
      component.setActiveTab('book');
      component.setActiveTab('add');
      expect(component.activeTab).toBe('add');
    });

    it('should load rides when switching to book tab', () => {
      component.setActiveTab('book');
      
      expect(mockRideService.getAllRides).toHaveBeenCalled();
    });

    it('should not load rides when switching to other tabs', () => {
      mockRideService.getAllRides.calls.reset();
      
      component.setActiveTab('history');
      component.setActiveTab('add');
      
      expect(mockRideService.getAllRides).not.toHaveBeenCalled();
    });
  });
});