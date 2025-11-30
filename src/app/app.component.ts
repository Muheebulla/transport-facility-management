import { Component } from '@angular/core';
import { RideService } from './services/ride.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Transport Facility Management';
  activeTab: 'add' | 'book' | 'history' = 'add';

  constructor(private rideService: RideService) {}

  setActiveTab(tab: 'add' | 'book' | 'history'): void {
    this.activeTab = tab;
    if (tab === 'book') {
      this.rideService.getAllRides().subscribe(rides => {
      });
    }
  }
}