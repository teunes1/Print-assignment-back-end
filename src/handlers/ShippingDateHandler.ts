"use strict";

const BeNeLux = ['nl', 'be', 'lu'];
// import json data
import suppliers from '../../data/suppliers.json';
import countries from '../../data/countries.json';
import carriers from '../../data/carriers.json';
// import ts classes
import { ShippingPosibility } from '../classes/ShippingPosibility';
import { Supplier } from '../classes/Supplier';
import { Carrier } from '../classes/Carrier';
import { Shipment } from '../classes/Shipment';
import { Country } from '../classes/Country';



module.exports.getShippingDates = async (event) => {
  
  const toCounry = event.toCountry;
  const shippingPosibilities: Array<ShippingPosibility> = [];
  // For every supplier we have check if they deliver to the 
  suppliers.forEach((supplier: Supplier) => {
    const carriersThatDeliverToCountry: Array<Carrier> = getCarriersThatDeliversToCountryForCarrierIds(toCounry, supplier.carriers);
    // only do what if we have carriers that deliver to that country  
    let shippingPosibility = new ShippingPosibility(supplier);
    if(carriersThatDeliverToCountry.length > 0) {
        const fromCountry: string = supplier.address.country;
        const IsNationalShipping: boolean = (toCounry === fromCountry) || (BeNeLux.includes(toCounry) && BeNeLux.includes(fromCountry));
        // For Every Carrier get the possible delivery date
        carriersThatDeliverToCountry.forEach((carrier: Carrier) => {
          const startDate: Date = new Date(event.startDate);
          const endDate:string = event.endDate;
          // if we have NationalShipping add 1 day otherwise 2
          const shippingStartDate: Date = new Date(startDate.setDate(startDate.getDate() + (IsNationalShipping ? 1: 2)));
          // Only add shippingDates if greater or equal than ending date 
          if(shippingStartDate.toISOString().slice(0,10) <= event.endDate ) {
            let shippingDatesForCarrierSupplier = getDaysArrayFunction(shippingStartDate, new Date(endDate));
            // Now we have all the possible shipping days but we need to remove the holidays ;-)
            let holiDays: Array<string> = supplier.holidays ?? [] ;
            const country = getCountryForId(toCounry);
            if(country !== undefined && country.holidays) {
              holiDays = holiDays.concat(country.holidays);
            }
            // All the available shipping dates after holidays have been removed
            shippingDatesForCarrierSupplier = shippingDatesForCarrierSupplier.filter((shippingDate: string) => !holiDays.includes(shippingDate));
            // add Shipments to shippingPosibility
            shippingDatesForCarrierSupplier.forEach((shippingDate: string) => {
            shippingPosibility.addShipment(new Shipment(shippingDate, carrier));
            });
          }
        })
      }
      // add to the list 
      shippingPosibilities.push(shippingPosibility);
  });
  return {
    statusCode: 200,
    body: shippingPosibilities
  };;
};

/**
 * get Carriers that Delivery to Country that match the country and the ids
 * 
 * @param country 
 * @param carrierIds 
 * @returns Array<Carrier> 
 */
function getCarriersThatDeliversToCountryForCarrierIds(country: string, carrierIds: Array<string>) : Array<Carrier>{
  return carriers.filter((carrier: Carrier) => {
    return carrierIds.includes(carrier.id) && carrier.countries.includes(country) 
  })
}

/**
 * Get country for Id
 * 
 * @param countryId 
 * @returns Country or undefined if no country is found for given id
 */
 function getCountryForId(countryId: string ) : Country|undefined {
  return countries.find((country: Country)=> country.id === countryId);
}

/**
 * Some code i borrowed to generate a day array:
 * https://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates
 * 
 * @param startDate 
 * @param endDate 
 * @returns Array of strings with dates that are available for shipping
 */
function getDaysArrayFunction(startDate:Date, endDate:Date): Array<string>| []{
  for(var arr: Array<Date>=[],dt=new Date(startDate); dt<=endDate; dt.setDate(dt.getDate()+1)){
      arr.push(new Date(dt));
  }
  return arr.map((date: Date) => date.toISOString().slice(0,10));
};