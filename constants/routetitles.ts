import { Router } from "expo-router";

type RouteConfig = {
    title: string;
    showAddButton?: boolean; 
    navigate?: (router: Router) => void; 
    openDialog?: (setDialogVisible: (visible: boolean) => void) => void
};

export const routeTitles: Record<string, RouteConfig> = {
    //informacion del negocio
    "/organization": {title: "organization.header"},
    "/organization/ecuador/tax-info": {title: "organization.taxinfo.header"},

    "/order-station": {title: "stations.header",
        showAddButton: true,
        openDialog: (setDialogVisible: (visible: boolean) => void) => {
            setDialogVisible(true);
        },},

    //Impresoras
    "/printers": {title: "printers.header", showAddButton: true, navigate: (router: Router) => router.push("/printers/newprinter")},
    "/printers/newprinter": {title: "printers.addPrinter"},
    "/printers/editprinter": {title: "printers.editPrinter"},
    
    "/table-layout": {title: "tablelayout.header"},

    //security
    "/security": {title: "security.header"},
    "/security/users/userlist": {title: "security.users", showAddButton: true, navigate: (router: Router) => router.push("/security/users/newuser")},
    "/security/users/[userId]": {title: "security.user.editUser"},
    "/security/users/newuser": {title: "security.user.Newuser"},
    "/security/rols/rollist": {title: "security.roles", showAddButton: true, navigate: (router: Router) => router.push("/security/rols/newrol")},
    "/security/rols/[rolId]": {title: "security.role.editRole"},
    "/security/rols/newrol": {title: "security.role.addNewRole"},

    "/advanced": {title: "advancedoptions.header"},
    "/searchscreen": {title: "common.searchtitle"}
};