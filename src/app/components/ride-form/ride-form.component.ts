import { Component, EventEmitter, Output } from '@angular/core';
import { VehicleType } from '../../models/ride.model';
import { DateUtils } from '../../utils/date.utils';
import { RideService } from '../../services/ride.service';
import { ToastService } from '../../services/toast.service'; // ADD THIS

@Component({
  selector: 'app-ride-form',
  templateUrl: './ride-form.component.html',
  styleUrls: ['./ride-form.component.css']
})
export class RideFormComponent {
  @Output() rideAdded = new EventEmitter<void>();
  constructor(
    private rideService: RideService,
    private toastService: ToastService
  ) {}

  formData = {
    employeeId: '',
    vehicleType: '' as VehicleType | '',
    vehicleNo: '',
    vacantSeats: 1,
    time: DateUtils.getCurrentTime(),
    pickUpPoint: '',
    destination: ''
  };

  vehicleOptions = [
    { value: VehicleType.CAR, label: 'Car' },
    { value: VehicleType.BIKE, label: 'Bike' }
  ];

  minTime = DateUtils.getCurrentTime();
  maxTime = DateUtils.getTimeWithBuffer(60);

  errors = {
    employeeId: false,
    vehicleType: false,
    vehicleNo: false,
    vacantSeats: false,
    time: false,
    pickUpPoint: false,
    destination: false
  };

  onSubmit(): void {
    if (this.validateForm()) {
      const success = this.rideService.addRide({
        employeeId: this.formData.employeeId,
        vehicleType: this.formData.vehicleType as VehicleType,
        vehicleNo: this.formData.vehicleNo,
        vacantSeats: this.formData.vacantSeats,
        time: this.formData.time,
        pickUpPoint: this.formData.pickUpPoint,
        destination: this.formData.destination
      });

      if (success) {
        this.toastService.success('Ride added successfully! Your ride is now available for booking.');
        this.rideAdded.emit();
        this.resetForm();
      } else {
        this.toastService.error('Failed to add ride. Employee ID or Vehicle Number already exists. Please use different details.');
      }
    } else {
      this.toastService.warning('Please fill all required fields correctly.');
    }
  }

  private validateForm(): boolean {
    this.errors = {
      employeeId: !this.formData.employeeId.trim(),
      vehicleType: !this.formData.vehicleType,
      vehicleNo: !this.formData.vehicleNo.trim(),
      vacantSeats: this.formData.vacantSeats < 1,
      time: !this.formData.time,
      pickUpPoint: !this.formData.pickUpPoint.trim(),
      destination: !this.formData.destination.trim()
    };

    return !Object.values(this.errors).some(error => error);
  }

  private resetForm(): void {
    this.formData = {
      employeeId: '',
      vehicleType: '' as VehicleType | '',
      vehicleNo: '',
      vacantSeats: 1,
      time: DateUtils.getCurrentTime(),
      pickUpPoint: '',
      destination: ''
    };
  }
}