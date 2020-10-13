import { Household } from "./Household";
import { v4 as uuidv4 } from "uuid";

export abstract class HouseholdComponent {
  id: string = uuidv4();
  abstract register(household: Household): Household;
}
