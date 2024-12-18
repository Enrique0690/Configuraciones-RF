import React from 'react';
import DataContext from "./Data/DataContext";
import { Platform } from 'react-native';

console.log(DataContext);
const Index: React.FC = () => {
  if (Platform.OS === "web") {
    // datos necesarios para compatibilidad con RunFood
    localStorage["RunFood"] = "https://ec-s1.runfoodapp.com/apps/demo-digital-mind/api/v1";
    // `download` descarga y guarda en memoria la configuración
    new DataContext("RunFood").Configuracion.download();
  }
  return (
    <></>
  );
};
export default Index;