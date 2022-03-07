export class DomainEntity {
  constructor(partial: Partial<DomainEntity>) {
    Object.assign(this, partial);
  }
}
