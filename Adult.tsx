import Job from "./Job";
import { SavingsAccount } from "./SavingsAccount";

export class Adult {
  yearOfJoining: number = -1;
  job: Job = new Job();
  pensionAccount: SavingsAccount = new SavingsAccount();

  constructor(yearOfJoining?: number) {
    this.yearOfJoining = yearOfJoining ? yearOfJoining : -1;
  }
}
