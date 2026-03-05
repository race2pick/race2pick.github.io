import type { EntityId } from "../entities/entity";
import getEntityList from "../helpers/getEntityList";
import type { World } from "../world";

export default function removeEntity(world: World, entityId: EntityId) {
  const entityList = getEntityList(world);
console.log('*****', 'entityList' , '->', entityList);
  Object.values(entityList).forEach((map) => {
    map.delete(entityId);
  });
}
