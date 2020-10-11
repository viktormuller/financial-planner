import { Household } from './Household'

export default interface HouseholdComponent {
  register(household: Household): Household 
}