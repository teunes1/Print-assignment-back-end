export class Country {
    public id: string;
    public holidays: Array<string>;

  constructor(id: string, holidays: Array<string>) {
    this.id = id;
    this.holidays = holidays;
  }


}