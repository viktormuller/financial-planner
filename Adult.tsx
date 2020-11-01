import Job from "./Job";

export class Adult {
  yearOfJoining: number = -1;
  job: Job = new Job();

  constructor(yearOfJoining?: number) {
    this.yearOfJoining = yearOfJoining ? yearOfJoining : -1;
  }
}
