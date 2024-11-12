import { businessInfoConfig } from "./BusinessConfig";
import { Securityall } from "./SecurityConfig";
import { taxConfigall } from "./TaxConfig";
import { PrintersConfig } from "./Printers";

export const allConfigs = [
  ...businessInfoConfig,
  ...PrintersConfig,
  ...Object.values(Securityall).flat(),
  ...Object.values(taxConfigall).flat(),
];