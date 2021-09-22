import { Carrier } from "./Carrier";
export class Shipment {
    public deliveryDate: string;
    public carrier: Carrier;

  constructor(deliveryDate: string, carrier: Carrier) {
    this.deliveryDate = deliveryDate;
    this.carrier = carrier;
  }
}