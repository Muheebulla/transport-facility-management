import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ride, VehicleType, RideBooking, RideFilter } from '../models/ride.model';
import { DateUtils } from '../utils/date.utils';
import { BookingHistoryService } from './booking-history.service';

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private rides: Ride[] = [];
  private ridesSubject = new BehaviorSubject<Ride[]>([]);
  
  constructor(private bookingHistoryService: BookingHistoryService) {
    this.loadFromLocalStorage();
  }

  getAllRides(): Observable<Ride[]> {
    return this.ridesSubject.asObservable();
  }

  getAvailableRides(filter?: RideFilter): Observable<Ride[]> {
    return this.ridesSubject.pipe(
      map(rides => rides.filter(ride => this.isRideAvailable(ride, filter)))
    );
  }

  addRide(ride: Omit<Ride, 'id' | 'bookedBy' | 'createdAt'>): boolean {
    if (this.isDuplicateRide(ride.employeeId, ride.vehicleNo)) {
      return false;
    }

    const [hours, minutes] = ride.time.split(':').map(Number);
    const rideDateTime = new Date();
    rideDateTime.setHours(hours, minutes, 0, 0);
  
    const newRide: Ride = {
      ...ride,
      id: this.generateId(),
      bookedBy: [],
      createdAt: new Date(),
      rideDateTime: rideDateTime
    };
  
    this.rides.push(newRide);
    this.updateStorageAndSubject();
    return true;
  }

  private isRideAvailable(ride: Ride, filter?: RideFilter): boolean {
    if (!DateUtils.isToday(ride.time)) {
      return false;
    }
    if (!DateUtils.isWithinTimeBuffer(ride.time, 60)) {
      return false;
    }
    if (filter?.vehicleType && ride.vehicleType !== filter.vehicleType) {
      return false;
    }
    if (ride.vacantSeats <= 0) {
      return false;
    }
    return true;
  }

  private isDuplicateRide(employeeId: string, vehicleNo: string): boolean {
    return this.rides.some(ride => 
      ride.employeeId === employeeId || ride.vehicleNo === vehicleNo
    );
  }

  private generateId(): string {
    return `ride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem('transport_rides');
    if (stored) {
      this.rides = JSON.parse(stored).map((ride: any) => ({
        ...ride,
        createdAt: new Date(ride.createdAt)
      }));
    }
    this.ridesSubject.next([...this.rides]);
  }

  private updateStorageAndSubject(): void {
    localStorage.setItem('transport_rides', JSON.stringify(this.rides));
    this.ridesSubject.next([...this.rides]);
  }

  bookRide(rideId: string, employeeId: string): boolean {
    const ride = this.rides.find(r => r.id === rideId);
    
    if (!ride || 
        ride.vacantSeats <= 0 || 
        ride.employeeId === employeeId || 
        ride.bookedBy.includes(employeeId)) {
      return false;
    }

    ride.bookedBy.push(employeeId);
    ride.vacantSeats--;
    this.bookingHistoryService.addToHistory(ride, employeeId);
    this.updateStorageAndSubject();
    return true;
  }

  cancelBooking(rideId: string, employeeId: string): boolean {
    const ride = this.rides.find(r => r.id === rideId);
    
    if (!ride || !ride.bookedBy.includes(employeeId)) {
      return false;
    }
    ride.bookedBy = ride.bookedBy.filter(id => id !== employeeId);
    ride.vacantSeats++;
    this.updateStorageAndSubject();
    return true;
  }
}