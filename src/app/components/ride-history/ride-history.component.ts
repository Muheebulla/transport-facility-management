import { Component, OnInit } from '@angular/core';
import { BookingHistory } from '../../models/ride.model';
import { BookingHistoryService } from '../../services/booking-history.service';
import { ToastService } from '../../services/toast.service';
import { VehicleType } from '../../models/ride.model';
import { RideService } from '../../services/ride.service';
@Component({
  selector: 'app-ride-history',
  templateUrl: './ride-history.component.html',
  styleUrls: ['./ride-history.component.css']
})
export class RideHistoryComponent implements OnInit {
  history: BookingHistory[] = [];
  filteredHistory: BookingHistory[] = [];
  filterStatus: 'all' | 'upcoming' | 'completed' | 'cancelled' = 'all';
  searchEmployeeId: string = '';

  constructor(
    private bookingHistoryService: BookingHistoryService,
    private rideService: RideService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.bookingHistoryService.getHistory().subscribe(history => {
      this.history = history;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredHistory = this.history.filter(item => {
      if (this.filterStatus !== 'all' && item.status !== this.filterStatus) {
        return false;
      }
      
      if (this.searchEmployeeId && 
          !item.employeeId.toLowerCase().includes(this.searchEmployeeId.toLowerCase()) &&
          !item.rideDetails.employeeId.toLowerCase().includes(this.searchEmployeeId.toLowerCase())) {
        return false;
      }
      
      return true;
    });

    this.filteredHistory.sort((a, b) => 
      new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
    );
  }

  onStatusFilterChange(status: 'all' | 'upcoming' | 'completed' | 'cancelled'): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  onSearchChange(searchTerm: string): void {
    this.searchEmployeeId = searchTerm;
    this.applyFilters();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'upcoming': return 'status-upcoming';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-unknown';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'upcoming': return '🕒';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  }

  getVehicleIcon(vehicleType: VehicleType): string {
    return vehicleType === VehicleType.CAR ? '🚗' : '🏍️';
  }

  cancelBooking(historyItem: BookingHistory): void {
    const confirmed = confirm(`Are you sure you want to cancel your booking for the ride from ${historyItem.rideDetails.pickUpPoint} to ${historyItem.rideDetails.destination}?`);
    
    if (confirmed) {
      const rideServiceSuccess = this.rideService.cancelBooking(historyItem.rideId, historyItem.employeeId);
      const historyServiceSuccess = this.bookingHistoryService.cancelBooking(historyItem.rideId, historyItem.employeeId);
      
      if (rideServiceSuccess && historyServiceSuccess) {
        this.toastService.success('Booking cancelled successfully! Your seat has been freed up.');
        this.applyFilters();
      } else {
        this.toastService.error('Cannot cancel this booking. It may be completed, already cancelled, or no longer available.');
      }
    }
  }

  shouldShowCancelButton(historyItem: BookingHistory): boolean {
    return historyItem.status === 'upcoming';
  }

}