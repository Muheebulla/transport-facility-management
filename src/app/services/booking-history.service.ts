import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookingHistory, Ride } from '../models/ride.model';
import { DateUtils } from '../utils/date.utils';

@Injectable({
  providedIn: 'root'
})
export class BookingHistoryService {
  private history: BookingHistory[] = [];
  private historySubject = new BehaviorSubject<BookingHistory[]>([]);

  constructor() {
    this.loadFromLocalStorage();
    this.addTestUpcomingRide();
  }

  private addTestUpcomingRide(): void {
    const hasUpcoming = this.history.some(item => item.status === 'upcoming');
    
    if (!hasUpcoming) {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 2);
      const timeString = futureTime.toTimeString().slice(0, 5);
      
      const testRide: any = {
        id: 'test-upcoming-ride',
        employeeId: 'TEST001',
        vehicleType: 'Car',
        vehicleNo: 'TEST123',
        vacantSeats: 2,
        time: timeString,
        pickUpPoint: 'Office',
        destination: 'Airport',
        bookedBy: ['TEST002'],
        createdAt: new Date()
      };

      const testHistory: BookingHistory = {
        rideId: 'test-upcoming-ride',
        employeeId: 'TEST002',
        bookedAt: new Date(),
        rideDetails: testRide,
        status: 'upcoming'
      };

      this.history.push(testHistory);
      this.updateStorageAndSubject();
    }
  }
  addToHistory(ride: Ride, bookingEmployeeId: string): void {
    const historyItem: BookingHistory = {
      rideId: ride.id,
      employeeId: bookingEmployeeId,
      bookedAt: new Date(),
      rideDetails: { ...ride },
      status: this.getRideStatus(ride)
    };

    this.history.push(historyItem);
    this.updateStorageAndSubject();
  }

  cancelBooking(rideId: string, employeeId: string): boolean {
    const historyItem = this.history.find(item => 
      item.rideId === rideId && item.employeeId === employeeId
    );

    if (historyItem && historyItem.status === 'upcoming') {
      historyItem.status = 'cancelled';
      this.updateStorageAndSubject();
      return true;
    }

    return false;
  }

  private getRideStatus(ride: Ride): 'completed' | 'upcoming' {
    const [hours, minutes] = ride.time.split(':').map(Number);
    const rideTime = new Date();
    rideTime.setHours(hours, minutes, 0, 0);

    return rideTime.getTime() < new Date().getTime() ? 'completed' : 'upcoming';
  }


  getHistory(): Observable<BookingHistory[]> {
    return this.historySubject.asObservable();
  }

  getHistoryByEmployee(employeeId: string): BookingHistory[] {
    return this.history.filter(item => item.employeeId === employeeId);
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem('booking_history');
    if (stored) {
      this.history = JSON.parse(stored).map((item: any) => ({
        ...item,
        bookedAt: new Date(item.bookedAt),
        rideDetails: {
          ...item.rideDetails,
          createdAt: new Date(item.rideDetails.createdAt)
        }
      }));
    }
    this.historySubject.next([...this.history]);
  }

  private updateStorageAndSubject(): void {
    localStorage.setItem('booking_history', JSON.stringify(this.history));
    this.historySubject.next([...this.history]);
  }
}