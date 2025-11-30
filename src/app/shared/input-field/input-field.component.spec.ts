import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputFieldComponent } from './input-field.component';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputFieldComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set default values', () => {
      expect(component.type).toBe('text');
      expect(component.placeholder).toBe('');
      expect(component.required).toBeFalse();
      expect(component.showError).toBeFalse();
      expect(component.errorMessage).toBe('This field is required');
    });
  });

  describe('Input Properties', () => {
    it('should accept custom input properties', () => {
      component.id = 'test-input';
      component.label = 'Test Label';
      component.type = 'email';
      component.placeholder = 'Enter email';
      component.value = 'test@example.com';
      component.required = true;
      component.showError = true;
      component.errorMessage = 'Invalid email';
      
      fixture.detectChanges();
      
      expect(component.id).toBe('test-input');
      expect(component.label).toBe('Test Label');
      expect(component.type).toBe('email');
      expect(component.placeholder).toBe('Enter email');
      expect(component.value).toBe('test@example.com');
      expect(component.required).toBeTrue();
      expect(component.showError).toBeTrue();
      expect(component.errorMessage).toBe('Invalid email');
    });
  });

  describe('Event Emission', () => {
    it('should emit valueChange on input', () => {
      spyOn(component.valueChange, 'emit');
      
      const inputElement = fixture.nativeElement.querySelector('input');
      inputElement.value = 'new value';
      inputElement.dispatchEvent(new Event('input'));
      
      expect(component.valueChange.emit).toHaveBeenCalledWith('new value');
    });

    it('should emit correct value for different input types', () => {
      spyOn(component.valueChange, 'emit');
      component.type = 'number';
      fixture.detectChanges();
      
      const inputElement = fixture.nativeElement.querySelector('input');
      inputElement.value = '123';
      inputElement.dispatchEvent(new Event('input'));
      
      expect(component.valueChange.emit).toHaveBeenCalledWith('123');
    });
  });

  describe('Template Rendering', () => {
    it('should render label when provided', () => {
      component.label = 'Test Label';
      fixture.detectChanges();
      
      const labelElement = fixture.nativeElement.querySelector('label');
      expect(labelElement).toBeTruthy();
      expect(labelElement.textContent).toContain('Test Label');
    });

    it('should not render label when not provided', () => {
      component.label = undefined;
      fixture.detectChanges();
      
      const labelElement = fixture.nativeElement.querySelector('label');
      expect(labelElement).toBeFalsy();
    });

    it('should render input with correct attributes', () => {
      component.id = 'test-input';
      component.type = 'number';
      component.placeholder = 'Enter number';
      component.value = '42';
      component.required = true;
      
      fixture.detectChanges();
      
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.id).toBe('test-input');
      expect(inputElement.type).toBe('number');
      expect(inputElement.placeholder).toBe('Enter number');
      expect(inputElement.value).toBe('42');
      expect(inputElement.required).toBeTrue();
    });

    it('should show error message when showError is true', () => {
      component.showError = true;
      component.errorMessage = 'Custom error message';
      
      fixture.detectChanges();
      
      const errorElement = fixture.nativeElement.querySelector('.error-message');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Custom error message');
    });

    it('should not show error message when showError is false', () => {
      component.showError = false;
      
      fixture.detectChanges();
      
      const errorElement = fixture.nativeElement.querySelector('.error-message');
      expect(errorElement).toBeFalsy();
    });

    it('should apply error class when showError is true', () => {
      component.showError = true;
      
      fixture.detectChanges();
      
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.classList).toContain('error');
    });

    it('should not apply error class when showError is false', () => {
      component.showError = false;
      
      fixture.detectChanges();
      
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.classList).not.toContain('error');
    });
  });
});