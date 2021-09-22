## Welkom :-D 

Ik ga er vanuit dat de startdatum voor deliveryDatums de huidige datum is. Ik tel bij de startdatum 1 of 2 dagen op om de levertijd te bepalen afhankelijk van internationaal of nationale shipping.

Ik heb geen rekening gehouden met:
* Supplier heeft een vakantiedag(of het land waarin de supplier staat) dus die dag wordt niet geproduceerd.


### commands:
Mockdata is aan te passen in de mockdata folder


``
serverless invoke local --function getShippingDates -p ./mock-data/deliverydate.json
``

### output

Er wordt een array gereturned met ShippingPosibility waarin een supplier zit waar weer mogelijke shipments per dag per carrier inzitten. 
