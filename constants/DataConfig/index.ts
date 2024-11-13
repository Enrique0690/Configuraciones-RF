import { businessInfoConfig } from "./BusinessConfig";
import { Securityall } from "./SecurityConfig";
import { taxConfigall } from "./TaxConfig";
import { PrintersConfig } from "./PrintersConfig";
import { TabletConfig } from "./TabletConfig";
import { paymentMethodsConfig } from "./PaymentmethodsConfig";

export const allConfigs = [
  ...businessInfoConfig,
  ...PrintersConfig,
  ...paymentMethodsConfig,
  ...TabletConfig,
  ...Object.values(Securityall).flat(),
  ...Object.values(taxConfigall).flat(),
];