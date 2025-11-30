import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
  @Input() label?: string;
  @Input() value: string = '';
  @Input() required: boolean = false;
  @Input() showError: boolean = false;
  @Input() errorMessage: string = 'Time is required';
  
  @Output() valueChange = new EventEmitter<string>();

  timeSlots: string[] = [];

  ngOnInit(): void {
    this.generateTimeSlots();
  }

  private generateTimeSlots(): void {
    const now = new Date();
    const slots: string[] = [];
    for (let i = 0; i < 16; i++) {
      const time = new Date(now.getTime() + i * 15 * 60 * 1000);
      const timeString = time.toTimeString().slice(0, 5);
      slots.push(timeString);
    }
    
    this.timeSlots = slots;
  }

  onTimeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.valueChange.emit(value);
  }

  getDisplayTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
}