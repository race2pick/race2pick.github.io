import type { EntityId } from "../entities/entity";

let nextEntityId = 1;

export function createEntity(): EntityId {
  return nextEntityId++;
}
