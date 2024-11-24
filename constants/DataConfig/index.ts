import { organizationall} from "./organization";
import { Securityall } from "./SecurityConfig";
import { PrintersConfig } from "./PrintersConfig";
import { TableConfig } from "./tablelayout";
import { paymentMethodsConfig } from "./PaymentmethodsConfig";
import { IntegrationsConfig } from "./IntegrationsConfig";
import { StationsConfig } from "./StationsConfig";

interface ConfigItem {
  id: string;
  label: string;
  route: string;
}

export const allConfigs = [
  ...Object.values(organizationall).flat(),
  ...StationsConfig,
  ...PrintersConfig,
  //...paymentMethodsConfig,
  ...TableConfig,
  //...IntegrationsConfig,
  ...Object.values(Securityall).flat(),
  //...Object.values(taxConfigall).flat(),
];