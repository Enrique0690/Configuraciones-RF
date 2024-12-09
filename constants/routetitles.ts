import { Router } from "expo-router";

type RouteConfig = {
    title: string;
    showAddButton?: boolean; 
    navigate?: (router: Router) => void;
};

export const routeTitles: Record<string, RouteConfig> = {
    //informacion del negocio
    "/settings/organization": {title: "organization.header"},
    "/settings/organization/ecuador/tax-info": {title: "organization.taxinfo.header"},

    "/settings/order-station": {title: "stations.header",
        showAddButton: true},

    //Impresoras
    "/settings/printers": {title: "printers.header", showAddButton: true, navigate: (router: Router) => router.push("/settings/printers/newprinter")},
    "/settings/printers/newprinter": {title: "printers.addPrinter"},
    "/settings/printers/editprinter": {title: "printers.editPrinter"},
    
    "/settings/table-layout": {title: "tablelayout.header"},

    //security
    "/settings/security": {title: "security.header"},
    "/settings/security/users/userlist": {title: "security.users", showAddButton: true, navigate: (router: Router) => router.push("/settings/security/users/newuser")},
    "/settings/security/users/[userId]": {title: "security.user.editUser"},
    "/settings/security/users/newuser": {title: "security.user.Newuser"},
    "/settings/security/rols/rollist": {title: "security.roles", showAddButton: true, navigate: (router: Router) => router.push("/settings/security/rols/newrol")},
    "/settings/security/rols/[rolId]": {title: "security.role.editRole"},
    "/settings/security/rols/newrol": {title: "security.role.addNewRole"},

    "/settings/advanced": {title: "advancedoptions.header"},
    "/searchscreen": {title: "common.searchtitle"}
};