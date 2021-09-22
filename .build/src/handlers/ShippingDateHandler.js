"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BeNeLux = ['nl', 'be', 'lu'];
// import json data
var suppliers_json_1 = __importDefault(require("../../data/suppliers.json"));
var countries_json_1 = __importDefault(require("../../data/countries.json"));
var carriers_json_1 = __importDefault(require("../../data/carriers.json"));
// import ts classes
var ShippingPosibility_1 = require("../classes/ShippingPosibility");
var Shipment_1 = require("../classes/Shipment");
module.exports.getShippingDates = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var toCounry, shippingPosibilities;
    return __generator(this, function (_a) {
        toCounry = event.toCountry;
        shippingPosibilities = [];
        // For every supplier we have check if they deliver to the 
        suppliers_json_1.default.forEach(function (supplier) {
            var carriersThatDeliverToCountry = getCarriersThatDeliversToCountryForCarrierIds(toCounry, supplier.carriers);
            // only do what if we have carriers that deliver to that country  
            var shippingPosibility = new ShippingPosibility_1.ShippingPosibility(supplier);
            if (carriersThatDeliverToCountry.length > 0) {
                var fromCountry = supplier.address.country;
                var IsNationalShipping_1 = (toCounry === fromCountry) || (BeNeLux.includes(toCounry) && BeNeLux.includes(fromCountry));
                // For Every Carrier get the possible delivery date
                carriersThatDeliverToCountry.forEach(function (carrier) {
                    var _a;
                    var startDate = new Date(event.startDate);
                    var endDate = event.endDate;
                    // if we have NationalShipping add 1 day otherwise 2
                    var shippingStartDate = new Date(startDate.setDate(startDate.getDate() + (IsNationalShipping_1 ? 1 : 2)));
                    // Only add shippingDates if greater or equal than ending date 
                    if (shippingStartDate.toISOString().slice(0, 10) <= event.endDate) {
                        var shippingDatesForCarrierSupplier = getDaysArrayFunction(shippingStartDate, new Date(endDate));
                        // Now we have all the possible shipping days but we need to remove the holidays ;-)
                        var holiDays_1 = (_a = supplier.holidays) !== null && _a !== void 0 ? _a : [];
                        var country = getCountryForId(toCounry);
                        if (country !== undefined && country.holidays) {
                            holiDays_1 = holiDays_1.concat(country.holidays);
                        }
                        // All the available shipping dates after holidays have been removed
                        shippingDatesForCarrierSupplier = shippingDatesForCarrierSupplier.filter(function (shippingDate) { return !holiDays_1.includes(shippingDate); });
                        // add Shipments to shippingPosibility
                        shippingDatesForCarrierSupplier.forEach(function (shippingDate) {
                            shippingPosibility.addShipment(new Shipment_1.Shipment(shippingDate, carrier));
                        });
                    }
                });
            }
            // add to the list 
            shippingPosibilities.push(shippingPosibility);
        });
        return [2 /*return*/, {
                statusCode: 200,
                body: shippingPosibilities
            }];
    });
}); };
/**
 * get Carriers that Delivery to Country that match the country and the ids
 *
 * @param country
 * @param carrierIds
 * @returns Array<Carrier>
 */
function getCarriersThatDeliversToCountryForCarrierIds(country, carrierIds) {
    return carriers_json_1.default.filter(function (carrier) {
        return carrierIds.includes(carrier.id) && carrier.countries.includes(country);
    });
}
/**
 * Get country for Id
 *
 * @param countryId
 * @returns Country or undefined if no country is found for given id
 */
function getCountryForId(countryId) {
    return countries_json_1.default.find(function (country) { return country.id === countryId; });
}
/**
 * Some code i borrowed to generate a day array:
 * https://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates
 *
 * @param startDate
 * @param endDate
 * @returns Array of strings with dates that are available for shipping
 */
function getDaysArrayFunction(startDate, endDate) {
    for (var arr = [], dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt));
    }
    return arr.map(function (date) { return date.toISOString().slice(0, 10); });
}
;
//# sourceMappingURL=ShippingDateHandler.js.map