import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectFieldComponent, SelectOption } from './select-field.component';

describe('SelectFieldComponent', () => {
  let component: SelectFieldComponent;
  let fixture: ComponentFixture<SelectFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectFieldComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set default values', () => {
      expect(component.placeholder).toBe('Select an option');
      expect(component.required).toBeFalse();
      expect(component.showError).toBeFalse();
      expect(component.errorMessage).toBe('This field is required');
      expect(component.options).toEqual([]);
    });
  });

  describe('Input Properties', () => {
    it('should accept custom input properties', () => {
      const testOptions: SelectOption[] = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ];

      component.id = 'test-select';
      component.label = 'Test Select';
      component.placeholder = 'Choose option';
      component.value = 'option2';
      component.options = testOptions;
      component.required = true;
      component.showError = true;
      component.errorMessage = 'Selection required';
      
      fixture.detectChanges();
      
      expect(component.id).toBe('test-select');
      expect(component.label).toBe('Test Select');
      expect(component.placeholder).toBe('Choose option');
      expect(component.value).toBe('option2');
      expect(component.options.length).toBe(2);
      expect(component.required).toBeTrue();
      expect(component.showError).toBeTrue();
      expect(component.errorMessage).toBe('Selection required');
    });
  });

  describe('Event Emission', () => {
    it('should emit valueChange on selection change', () => {
      component.options = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' }
      ];
      fixture.detectChanges();
      
      spyOn(component.valueChange, 'emit');
      
      const selectElement = fixture.nativeElement.querySelector('select');
      selectElement.value = 'opt2';
      selectElement.dispatchEvent(new Event('change'));
      
      expect(component.valueChange.emit).toHaveBeenCalledWith('opt2');
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

    it('should render select with correct attributes', () => {
      component.id = 'test-select';
      component.placeholder = 'Choose...';
      component.required = true;
      component.options = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' }
      ];
      
      fixture.detectChanges();
      
      const selectElement = fixture.nativeElement.querySelector('select');
      expect(selectElement.id).toBe('test-select');
      expect(selectElement.required).toBeTrue();
      
      const options = selectElement.querySelectorAll('option');
      expect(options.length).toBe(3); // placeholder + 2 options
      expect(options[0].textContent).toContain('Choose...');
      expect(options[0].disabled).toBeTrue();
      expect(options[1].textContent).toContain('Option 1');
      expect(options[1].value).toBe('opt1');
      expect(options[2].textContent).toContain('Option 2');
      expect(options[2].value).toBe('opt2');
    });

    it('should show error message when showError is true', () => {
      component.showError = true;
      component.errorMessage = 'Selection error';
      
      fixture.detectChanges();
      
      const errorElement = fixture.nativeElement.querySelector('.error-message');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toContain('Selection error');
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
      
      const selectElement = fixture.nativeElement.querySelector('select');
      expect(selectElement.classList).toContain('error');
    });

    it('should not apply error class when showError is false', () => {
      component.showError = false;
      
      fixture.detectChanges();
      
      const selectElement = fixture.nativeElement.querySelector('select');
      expect(selectElement.classList).not.toContain('error');
    });
  });
});