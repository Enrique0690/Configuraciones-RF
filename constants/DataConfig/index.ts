import { organizationall} from "./organization";
import { Securityall } from "./SecurityConfig";
import { taxConfigall } from "./TaxConfig";
import { PrintersConfig } from "./PrintersConfig";
import { TableConfig } from "./table-layout";
import { paymentMethodsConfig } from "./PaymentmethodsConfig";
import { IntegrationsConfig } from "./IntegrationsConfig";
import { StationsConfig } from "./StationsConfig";

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