import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ToastComponent } from './toast.component';
import { ToastService } from '../../services/toast.service';
import { Toast } from '../../services/toast.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  const mockToasts: Toast[] = [
    { id: 1, type: 'success', message: 'Success message', duration: 4000 },
    { id: 2, type: 'error', message: 'Error message', duration: 5000 },
    { id: 3, type: 'warning', message: 'Warning message', duration: 4000 }
  ];

  beforeEach(async () => {
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['getToasts', 'remove']);

    await TestBed.configureTestingModule({
      declarations: [ToastComponent],
      providers: [
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    mockToastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    mockToastService.getToasts.and.returnValue(of(mockToasts));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load toasts on initialization', () => {
      expect(mockToastService.getToasts).toHaveBeenCalled();
      expect(component.toasts).toEqual(mockToasts);
    });
  });

  describe('Toast Management', () => {
    it('should remove toast when removeToast is called', () => {
      component.removeToast(1);

      expect(mockToastService.remove).toHaveBeenCalledWith(1);
    });

    it('should update toasts when service emits new toasts', () => {
      const newToasts: Toast[] = [
        { id: 4, type: 'info', message: 'New message', duration: 3000 }
      ];
      mockToastService.getToasts.and.returnValue(of(newToasts));

      component.ngOnInit();

      expect(component.toasts).toEqual(newToasts);
    });
  });

  describe('Toast Icons', () => {
    it('should return correct icon for success toasts', () => {
      expect(component.getToastIcon('success')).toBe('✅');
    });

    it('should return correct icon for error toasts', () => {
      expect(component.getToastIcon('error')).toBe('❌');
    });

    it('should return correct icon for warning toasts', () => {
      expect(component.getToastIcon('warning')).toBe('⚠️');
    });

    it('should return correct icon for info toasts', () => {
      expect(component.getToastIcon('info')).toBe('ℹ️');
    });

    it('should return default icon for unknown types', () => {
      expect(component.getToastIcon('unknown')).toBe('💡');
    });
  });

  describe('Template Rendering', () => {
    it('should render all toasts', () => {
      fixture.detectChanges();
      
      const toastElements = fixture.nativeElement.querySelectorAll('.toast');
      expect(toastElements.length).toBe(3);
    });

    it('should render toast messages correctly', () => {
      fixture.detectChanges();
      
      const toastElements = fixture.nativeElement.querySelectorAll('.toast');
      expect(toastElements[0].textContent).toContain('Success message');
      expect(toastElements[1].textContent).toContain('Error message');
      expect(toastElements[2].textContent).toContain('Warning message');
    });

    it('should call removeToast when close button is clicked', () => {
      spyOn(component, 'removeToast');
      fixture.detectChanges();
      
      const closeButton = fixture.nativeElement.querySelector('.toast-close');
      closeButton.click();
      
      expect(component.removeToast).toHaveBeenCalledWith(1);
    });
  });
});