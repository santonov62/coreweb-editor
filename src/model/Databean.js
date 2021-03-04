export class Databean {
  constructor(data) {
    for (const [key, value] of Object.entries(data)) {
      this[key] = value;
    }
  }
}
