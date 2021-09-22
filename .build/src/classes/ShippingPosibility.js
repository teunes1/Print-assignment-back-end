"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingPosibility = void 0;
var ShippingPosibility = /** @class */ (function () {
    function ShippingPosibility(supplier) {
        this.supplier = supplier;
        this.shipments = [];
    }
    ShippingPosibility.prototype.addShipment = function (shipment) {
        this.shipments.push(shipment);
    };
    return ShippingPosibility;
}());
exports.ShippingPosibility = ShippingPosibility;
//# sourceMappingURL=ShippingPosibility.js.map