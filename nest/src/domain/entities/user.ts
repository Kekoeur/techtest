export class User {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getIdUser() {
    return `${this.id}`;
  }
  getFirstName() {
    return `${this.firstName}`;
  }
  getLastName() {
    return `${this.lastName}`;
  }
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
