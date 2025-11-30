import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.css']
})
export class SelectFieldComponent {
  @Input() id!: string;
  @Input() label?: string;
  @Input() placeholder: string = 'Select an option';
  @Input() value: any = '';
  @Input() options: SelectOption[] = [];
  @Input() required: boolean = false;
  @Input() errorMessage: string = 'This field is required';
  @Input() showError: boolean = false;
  
  @Output() valueChange = new EventEmitter<any>();

  onChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.valueChange.emit(value);
  }
}