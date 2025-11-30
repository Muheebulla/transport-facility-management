import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input-field',
  template: `
    <div class="form-group">
      <label *ngIf="label" [for]="id" class="form-label">{{ label }}</label>
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        (input)="onInput($event)"
        [required]="required"
        [class.error]="showError"
        class="form-input"
      />
      <div *ngIf="showError" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent {
  @Input() id!: string;
  @Input() label?: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = 'This field is required';
  @Input() showError: boolean = false;
  
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }
}