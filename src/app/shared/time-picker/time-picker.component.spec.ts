import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimePickerComponent } from './time-picker.component';

describe('TimePickerComponent', () => {
  let component: TimePickerComponent;
  let fixture: ComponentFixture<TimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimePickerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set default values', () => {
      expect(component.value).toBe('');
      expect(component.required).toBeFalse();
      expect(component.showError).toBeFalse();
      expect(component.errorMessage).toBe('Time is required');
    });

    it('should generate time slots on initialization', () => {
      expect(component.timeSlots.length).toBe(16);
      expect(component.timeSlots[0]).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe('Input Properties', () => {
    it('should accept custom input properties', () => {
      component.label = 'Pickup Time';
      component.value = '14:30';
      component.required = true;
      component.showError = true;
      component.errorMessage = 'Time selection required';
      
      fixture.detectChanges();
      
      expect(component.label).toBe('Pickup Time');
      expect(component.value).toBe('14:30');
      expect(component.required).toBeTrue();
      expect(component.showError).toBeTrue();
      expect(component.errorMessage).toBe('Time selection required');
    });
  });

  describe('Time Formatting', () => {
    it('should format AM times correctly', () => {
      expect(component.getDisplayTime('09:30')).toBe('9:30 AM');
      expect(component.getDisplayTime('11:45')).toBe('11:45 AM');
    });

    it('should format PM times correctly', () => {
      expect(component.getDisplayTime('14:30')).toBe('2:30 PM');
      expect(component.getDisplayTime('23:15')).toBe('11:15 PM');
    });

    it('should handle 12-hour times correctly', () => {
      expect(component.getDisplayTime('12:00')).toBe('12:00 PM');
      expect(component.getDisplayTime('00:00')).toBe('12:00 AM');
    });

    it('should pad single-digit minutes', () => {
      expect(component.getDisplayTime('09:05')).toBe('9:05 AM');
      expect(component.getDisplayTime('14:05')).toBe('2:05 PM');
    });
  });

  describe('Template Rendering', () => {
    it('should render label when provided', () => {
      component.label = 'Select Time';
      fixture.detectChanges();
      
      const labelElement = fixture.nativeElement.querySelector('label');
      expect(labelElement).toBeTruthy();
      expect(labelElement.textContent).toContain('Select Time');
    });

    it('should not render label when not provided', () => {
      component.label = undefined;
      fixture.detectChanges();
      
      const labelElement = fixture.nativeElement.querySelector('label');
      expect(labelElement).toBeFalsy();
    });

    it('should render time slots in dropdown', () => {
      component.timeSlots = ['09:00', '09:15', '09:30'];
      fixture.detectChanges();
      
      const options = fixture.nativeElement.querySelectorAll('option');
      expect(options.length).toBe(4); // placeholder + 3 time slots
      expect(options[1].textContent).toContain('9:00 AM');
      expect(options[2].textContent).toContain('9:15 AM');
      expect(options[3].textContent).toContain('9:30 AM');
    });

    it('should show error message when showError is true', () => {
      component.showError = true;
      component.errorMessage = 'Please select a time';
      
      fixture.detectChanges();
      
      const errorElement = fixture.nativeElement.querySelector('.error-message');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Please select a time');
    });

    it('should not show error message when showError is false', () => {
      component.showError = false;
      
      fixture.detectChanges();
      
      const errorElement = fixture.nativeElement.querySelector('.error-message');
      expect(errorElement).toBeFalsy();
    });
  });
});