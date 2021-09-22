import { Address } from "./Address";

export class Supplier {
    public id: string;
    public address: Address;
    public carriers: Array<string>;
    public holidays: Array<string>;

    constructor(
        id: string,
        address: Address,
        carriers: Array<string>,
        holidays: Array<string>
    ) {
        this.id = id;
        this.address = address;
        this.carriers = carriers;
        this.holidays = holidays;
    }

}