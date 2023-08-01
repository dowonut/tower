import { Prisma } from "@prisma/client";
import * as Prisma2 from "@prisma/client";
declare global {
  export type Party = Prisma.PartyGetPayload<{ include: { players?: true } }>;
}
