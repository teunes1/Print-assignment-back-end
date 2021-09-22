
import { Supplier } from "./Supplier";
import { Shipment } from "./Shipment";
export class ShippingPosibility {
    public supplier : Supplier;
    public shipments : Array<Shipment>;


  constructor(supplier: Supplier) {
    this.supplier = supplier;
    this.shipments = [];
  }

   addShipment(shipment :Shipment) {
    this.shipments.push(shipment);
  }
}