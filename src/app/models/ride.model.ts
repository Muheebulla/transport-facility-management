 
export enum VehicleType {
    BIKE = 'Bike',
    CAR = 'Car'
  }
  
  export interface Ride {
    id: string;
    employeeId: string;
    vehicleType: VehicleType;
    vehicleNo: string;
    vacantSeats: number;
    time: string;
    pickUpPoint: string;
    destination: string;
    bookedBy: string[];
    createdAt: Date;
    rideDateTime?: Date;
  }
  
  export interface RideBooking {
    rideId: string;
    employeeId: string;
    bookedAt: Date;
  }
  
  export interface RideFilter {
    vehicleType?: VehicleType;
    timeRange?: {
      start: string;
      end: string;
    }; 
  }
  export interface BookingHistory {
    rideId: string;
    employeeId: string;
    bookedAt: Date;
    rideDetails: Ride;
    status: 'completed' | 'cancelled' | 'upcoming';
  }
  
  export interface RideWithStatus extends Ride {
    status: 'available' | 'booked' | 'completed' | 'cancelled';
  }