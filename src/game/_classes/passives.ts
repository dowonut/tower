import { config } from "../../tower.js";
import { createClassFromType, loadFiles } from "../../functions/core/index.js";

const PassiveBaseClass = createClassFromType<PassiveData>();

export class PassiveClass extends PassiveBaseClass {
  constructor(object: Generic<PassiveData>) {
    super(object);
  }
}

const passives = await loadFiles<PassiveClass>("passives", PassiveClass);

export default passives;

// export default [
//   new PassiveClass({
//     name: "all",
//     type: "DAMAGE",
//   }),
//   new PassiveClass({
//     name: "all",
//     type: "CRIT_DAMAGE",
//   }),
//   new PassiveClass({
//     name: "all",
//     type: "CRIT_DAMAGE",
//   }),
// ];
