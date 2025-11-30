import { TestBed } from '@angular/core/testing';
import { ToastService, Toast } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('Toast Management', () => {
    it('should show a toast with default type', () => {
      service.show('Test message');

      service.getToasts().subscribe(toasts => {
        expect(toasts.length).toBe(1);
        expect(toasts[0].type).toBe('info');
        expect(toasts[0].message).toBe('Test message');
        expect(toasts[0].duration).toBe(4000);
      });
    });

    it('should show a success toast', () => {
      service.success('Success message');

      service.getToasts().subscribe(toasts => {
        expect(toasts.length).toBe(1);
        expect(toasts[0].type).toBe('success');
        expect(toasts[0].message).toBe('Success message');
      });
    });

    it('should show an error toast', () => {
      service.error('Error message');

      service.getToasts().subscribe(toasts => {
        expect(toasts.length).toBe(1);
        expect(toasts[0].type).toBe('error');
        expect(toasts[0].message).toBe('Error message');
        expect(toasts[0].duration).toBe(5000);
      });
    });

    it('should show a warning toast', () => {
      service.warning('Warning message');

      service.getToasts().subscribe(toasts => {
        expect(toasts.length).toBe(1);
        expect(toasts[0].type).toBe('warning');
        expect(toasts[0].message).toBe('Warning message');
      });
    });

    it('should show an info toast', () => {
      service.info('Info message');

      service.getToasts().subscribe(toasts => {
        expect(toasts.length).toBe(1);
        expect(toasts[0].type).toBe('info');
        expect(toasts[0].message).toBe('Info message');
        expect(toasts[0].duration).toBe(3000);
      });
    });

    it('should clear all toasts', () => {
      service.success('Message 1');
      service.error('Message 2');

      service.clear();

      service.getToasts().subscribe(toasts => {
        expect(toasts.length).toBe(0);
      });
    });

    it('should auto-remove toast after duration', (done) => {
      jasmine.clock().install();
      
      service.show('Auto-remove message', 'info', 1000);

      service.getToasts().subscribe(toasts => {
        if (toasts.length === 0) {
          expect(toasts.length).toBe(0);
          jasmine.clock().uninstall();
          done();
        }
      });

      jasmine.clock().tick(1001);
    });

    it('should generate unique ids for toasts', () => {
      service.success('Message 1');
      service.error('Message 2');

      service.getToasts().subscribe(toasts => {
        expect(toasts[0].id).not.toBe(toasts[1].id);
      });
    });
  });

  describe('Toast Observables', () => {
    it('should provide observable of toasts', (done) => {
      service.getToasts().subscribe(toasts => {
        expect(toasts).toEqual(jasmine.any(Array));
        done();
      });
    });

    it('should update observable when toasts change', (done) => {
      let callCount = 0;
      
      service.getToasts().subscribe(toasts => {
        callCount++;
        
        if (callCount === 1) {
          expect(toasts.length).toBe(0);
        } else if (callCount === 2) {
          expect(toasts.length).toBe(1);
          done();
        }
      });

      service.success('Test message');
    });
  });
});