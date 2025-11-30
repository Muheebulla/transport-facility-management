import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RideFormComponent } from './components/ride-form/ride-form.component';
import { RideListComponent } from './components/ride-list/ride-list.component';
import { InputFieldComponent } from './shared/input-field/input-field.component';
import { SelectFieldComponent } from './shared/select-field/select-field.component';
import { ToastComponent } from './shared/toast/toast.component';
import { TimePickerComponent } from './shared/time-picker/time-picker.component';
import { RideHistoryComponent } from './components/ride-history/ride-history.component';

@NgModule({
  declarations: [
    AppComponent,
    RideFormComponent,
    RideListComponent,
    InputFieldComponent,
    SelectFieldComponent,
    ToastComponent,
    TimePickerComponent,
    RideHistoryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }