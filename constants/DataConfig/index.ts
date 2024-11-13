import { businessInfoConfig } from "./BusinessConfig";
import { Securityall } from "./SecurityConfig";
import { taxConfigall } from "./TaxConfig";
import { PrintersConfig } from "./PrintersConfig";
import { TabletConfig } from "./TabletConfig";
import { paymentMethodsConfig } from "./PaymentmethodsConfig";
import { IntegrationsConfig } from "./IntegrationsConfig";

export const allConfigs = [
  ...businessInfoConfig,
  ...PrintersConfig,
  ...paymentMethodsConfig,
  ...TabletConfig,
  ...IntegrationsConfig,
  ...Object.values(Securityall).flat(),
  ...Object.values(taxConfigall).flat(),
];