import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Ride, VehicleType, RideFilter } from '../../models/ride.model';
import { RideService } from '../../services/ride.service';
import { ToastService } from '../../services/toast.service'; // ADD THIS

@Component({
  selector: 'app-ride-list',
  templateUrl: './ride-list.component.html',
  styleUrls: ['./ride-list.component.css']
})
export class RideListComponent implements OnInit, OnDestroy {
  rides: Ride[] = [];
  filters: RideFilter = {};
  bookingEmployeeId: string = '';
  showBookingForm: boolean = false;
  selectedRideId: string = '';
  private ridesSubscription!: Subscription;

  vehicleTypes = [
    { value: '', label: 'All Vehicles' },
    { value: VehicleType.CAR, label: 'Car' },
    { value: VehicleType.BIKE, label: 'Bike' }
  ];

  constructor(
    private rideService: RideService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.ridesSubscription = this.rideService.getAvailableRides(this.filters)
      .subscribe(rides => {
        this.rides = rides;
      });
  }

  ngOnDestroy(): void {
    if (this.ridesSubscription) {
      this.ridesSubscription.unsubscribe();
    }
  }

  onVehicleTypeChange(vehicleType: string): void {
    this.filters.vehicleType = vehicleType as VehicleType;
    this.refreshRides();
  }

  refreshRides(): void {
    this.rideService.getAvailableRides(this.filters)
      .subscribe(rides => {
        this.rides = rides;
      });
  }

  onBookRide(rideId: string): void {
    this.selectedRideId = rideId;
    this.showBookingForm = true;
  }

  confirmBooking(): void {
    if (this.bookingEmployeeId.trim() && this.selectedRideId) {
      const success = this.rideService.bookRide(this.selectedRideId, this.bookingEmployeeId.trim());
      if (success) {
        this.toastService.success('Ride booked successfully! Your seat has been confirmed.');
        this.resetBookingForm();
        this.refreshRides();
      } else {
        this.toastService.error('Failed to book ride. Please check if the ride is still available or you have already booked it.');
      }
    } else {
      this.toastService.warning('Please enter your Employee ID to book the ride.');
    }
  }

  cancelBooking(): void {
    this.resetBookingForm();
  }

  private resetBookingForm(): void {
    this.showBookingForm = false;
    this.bookingEmployeeId = '';
    this.selectedRideId = '';
  }

  getVehicleIcon(vehicleType: VehicleType): string {
    return vehicleType === VehicleType.CAR ? '🚗' : '🏍️';
  }
}