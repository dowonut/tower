import { game, prisma } from "../../tower.js";
import actions from "../../game/_classes/actions.js";

export default (async function (actionName: string) {
  actionName = actionName.toLowerCase();
  const actionData = await prisma.action.findUnique({
    where: {
      playerId_name: {
        playerId: this.id,
        name: actionName,
      },
    },
  });

  if (!actionData) return;

  const actionClass = actions.find((x) => x.name == actionName);

  if (!actionClass) return;

  const finalAction = game.createClassObject<Action>(actionClass, actionData);
  return finalAction;
} satisfies PlayerFunction);
