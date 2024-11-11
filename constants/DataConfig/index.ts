import { businessInfoConfig } from "./BusinessConfig";
import { Securityall } from "./SecurityConfig";
import { taxConfigall } from "./TaxConfig";

export const allConfigs = [
  ...businessInfoConfig,
  ...Object.values(Securityall).flat(),
  ...Object.values(taxConfigall).flat(),
];